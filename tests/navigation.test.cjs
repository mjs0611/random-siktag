const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

const flushImports = () => new Promise((resolve) => setImmediate(resolve));

function loadModule(file, mocks, globals = {}) {
  const exports = {};
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      assert.ok(name in mocks, `Unexpected import ${name} in ${file}`);
      return mocks[name];
    },
    console,
    ...globals,
  }, { filename: file });
  return exports;
}

function nativeBackHarness({ sdkPromise, server = false, rejectClose = false } = {}) {
  const listeners = new Set();
  const calls = { added: 0, removed: 0, closed: 0 };
  const sdk = {
    graniteEvent: {
      addEventListener(event, options) {
        assert.equal(event, 'backEvent');
        calls.added++;
        listeners.add(options.onEvent);
        return () => {
          calls.removed++;
          listeners.delete(options.onEvent);
        };
      },
    },
    closeView() {
      calls.closed++;
      return rejectClose ? Promise.reject(new Error('outside Toss')) : Promise.resolve();
    },
  };
  const navigation = loadModule('src/lib/historyBack.ts', {
    '@apps-in-toss/web-framework': sdkPromise ?? sdk,
  }, server ? {} : { window: {} });
  return {
    ...navigation,
    calls,
    sdk,
    emit() {
      assert.equal(listeners.size, 1, 'exactly one native listener should be active');
      for (const listener of [...listeners]) listener();
    },
  };
}

function componentHarness(file, mocks, globals = {}) {
  let cursor = 0;
  const slots = [];
  let pending = [];
  const react = {
    useRef(initial) {
      const index = cursor++;
      return slots[index] ??= { current: initial };
    },
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], (value) => {
        slots[index] = typeof value === 'function' ? value(slots[index]) : value;
      }];
    },
    useEffect(setup, dependencies) {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || dependencies.some((dependency, i) => !Object.is(dependency, previous.dependencies[i]))) {
        pending.push(() => {
          previous?.cleanup?.();
          slots[index] = { setup, dependencies, cleanup: setup() };
        });
      }
    },
  };
  const jsx = (type, props) => ({ type, props });
  const module = loadModule(file, {
    react,
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'Fragment' },
    ...mocks,
  }, globals);
  return {
    render(props = {}) {
      cursor = 0;
      const result = module.default(props);
      const effects = pending;
      pending = [];
      effects.forEach((commit) => commit());
      return result;
    },
    replayEffects() {
      const effects = slots.filter((slot) => slot?.setup);
      effects.forEach((effect) => effect.cleanup?.());
      effects.forEach((effect) => { effect.cleanup = effect.setup(); });
    },
    unmount() {
      slots.filter((slot) => slot?.setup).forEach((effect) => effect.cleanup?.());
    },
  };
}

function nextRouteHarness(initialPath) {
  const back = nativeBackHarness();
  const entries = [];
  let position = -1;
  let pathname = initialPath;
  const routerCalls = [];
  const nextState = (path) => ({ __NA: true, __PRIVATE_NEXTJS_INTERNALS_TREE: ['root', path] });
  const window = {
    history: {
      get state() { return structuredClone(entries[position].state); },
      replaceState(state) { entries[position].state = structuredClone(state); },
    },
  };
  const push = (path) => {
    pathname = path;
    entries.splice(position + 1, Infinity, { path, state: nextState(path) });
    position++;
  };
  const router = {
    back() {
      routerCalls.push('back');
      assert.ok(position > 0, 'native back must not leave the first app history entry');
      pathname = entries[--position].path;
    },
    replace(path) {
      routerCalls.push(`replace:${path}`);
      pathname = path;
      entries[position] = { path, state: nextState(path) };
    },
  };
  push(initialPath);
  const provider = componentHarness('src/components/TDSProvider.tsx', {
    '@toss/tds-mobile-ait': { TDSMobileAITProvider: 'TDSMobileAITProvider' },
    'next/navigation': { usePathname: () => pathname, useRouter: () => router },
    '@/lib/historyBack': { installHistoryBack: back.installHistoryBack },
  }, { window });
  return {
    back,
    provider,
    routerCalls,
    entries,
    push,
    currentPath: () => pathname,
    state: () => window.history.state,
    async render() { provider.render(); await flushImports(); },
    async goBack() { back.emit(); await this.render(); },
  };
}

function findNode(tree, type) {
  if (!tree || typeof tree !== 'object') return undefined;
  if (tree.type === type) return tree;
  const children = tree.props?.children;
  for (const child of Array.isArray(children) ? children.flat(Infinity) : [children]) {
    const found = findNode(child, type);
    if (found) return found;
  }
  return undefined;
}

test('one native subscription handles latest screen before route fallback and only closes when unhandled', async () => {
  const back = nativeBackHarness({ rejectClose: true });
  const sequence = [];
  let screenHandles = true;
  let routeHandles = true;
  const cleanups = [
    back.installHistoryBack(() => { sequence.push('older-screen'); return false; }),
    back.installHistoryBack(() => { sequence.push('screen'); return screenHandles; }),
    back.installHistoryBack(() => { sequence.push('route'); return routeHandles; }, { route: true }),
  ];
  await flushImports();
  assert.equal(back.calls.added, 1);
  back.emit();
  assert.deepEqual(sequence.splice(0), ['screen']);
  assert.equal(back.calls.closed, 0);
  screenHandles = false;
  back.emit();
  assert.deepEqual(sequence.splice(0), ['screen', 'older-screen', 'route']);
  assert.equal(back.calls.closed, 0);
  routeHandles = false;
  back.emit();
  await flushImports();
  assert.deepEqual(sequence, ['screen', 'older-screen', 'route']);
  assert.equal(back.calls.closed, 1);
  cleanups[1]();
  cleanups[1]();
  assert.equal(back.calls.removed, 0, 'remaining handlers keep the shared subscription');
  cleanups[0]();
  cleanups[2]();
  assert.equal(back.calls.removed, 1);
});

test('late SDK import cannot register an unmounted or StrictMode-disposed listener', async () => {
  let resolveSdk;
  const sdkPromise = new Promise((resolve) => { resolveSdk = resolve; });
  const back = nativeBackHarness({ sdkPromise });
  const disposed = back.installHistoryBack(() => { assert.fail('disposed handler ran'); });
  disposed();
  const active = back.installHistoryBack(() => true);
  resolveSdk(back.sdk);
  await flushImports();
  assert.equal(back.calls.added, 1);
  back.emit();
  assert.equal(back.calls.closed, 0);
  active();
  assert.equal(back.calls.removed, 1);
  const finalCleanup = back.installHistoryBack(() => false);
  await flushImports();
  back.emit();
  assert.equal(back.calls.closed, 1);
  finalCleanup();
  assert.equal(back.calls.removed, 2);
});

test('server rendering installs no native listener', async () => {
  const back = nativeBackHarness({ server: true });
  const cleanup = back.installHistoryBack(() => { assert.fail('server handler ran'); });
  cleanup();
  await flushImports();
  assert.equal(back.calls.added, 0);
});

test('Next legal routes return through real cloned history entries without changing Next state', async () => {
  const app = nextRouteHarness('/history');
  await app.render();
  const firstState = app.state();
  const marker = firstState.__randomSiktagRouteEntry;
  assert.equal(typeof marker, 'string');
  assert.equal(firstState.__NA, true);
  assert.deepEqual(firstState.__PRIVATE_NEXTJS_INTERNALS_TREE, ['root', '/history']);
  app.push('/terms');
  await app.render();
  app.push('/privacy');
  await app.render();
  assert.equal(app.entries.length, 3, 'back setup must not add sentinel history entries');
  assert.equal(new Set(app.entries.map((entry) => entry.state.__randomSiktagRouteEntry)).size, 3);
  await app.goBack();
  assert.equal(app.currentPath(), '/terms');
  await app.goBack();
  assert.equal(app.currentPath(), '/history');
  assert.equal(app.state().__randomSiktagRouteEntry, marker);
  assert.deepEqual(app.routerCalls, ['back', 'back']);
  assert.equal(app.back.calls.closed, 0);
  await app.goBack();
  assert.deepEqual(app.routerCalls, ['back', 'back']);
  assert.equal(app.back.calls.closed, 1);
  app.provider.unmount();
});

for (const path of ['/terms', '/privacy']) {
  test(`direct ${path} entry replaces with home and next back closes`, async () => {
    const app = nextRouteHarness(path);
    await app.render();
    await app.goBack();
    assert.equal(app.currentPath(), '/');
    assert.deepEqual(app.routerCalls, ['replace:/']);
    assert.equal(app.entries.length, 1);
    assert.equal(app.back.calls.closed, 0);
    await app.goBack();
    assert.deepEqual(app.routerCalls, ['replace:/']);
    assert.equal(app.back.calls.closed, 1);
    app.provider.unmount();
  });
}

test('provider StrictMode effect replay recognizes the same primitive history marker', async () => {
  const app = nextRouteHarness('/');
  await app.render();
  const marker = app.state().__randomSiktagRouteEntry;
  app.provider.replayEffects();
  await flushImports();
  assert.equal(app.state().__randomSiktagRouteEntry, marker);
  assert.equal(app.entries.length, 1);
  await app.goBack();
  assert.equal(app.back.calls.closed, 1);
  assert.deepEqual(app.routerCalls, []);
  app.provider.unmount();
  assert.equal(app.back.calls.added, app.back.calls.removed);
});

test('history returns to the selected game, then roulette, then native close', async () => {
  const back = nativeBackHarness();
  function SegmentedControl() {}
  SegmentedControl.Item = 'SegmentedControl.Item';
  const home = componentHarness('src/components/HomeLayout.tsx', {
    '@toss/tds-mobile': { SegmentedControl },
    '@/components/RouletteGame': { default: 'RouletteGame' },
    '@/components/GachaGame': { default: 'GachaGame' },
    '@/components/SikpanGame': { default: 'SikpanGame' },
    '@/components/MyPage': { default: 'MyPage' },
    '@/components/BottomTabBar': { default: 'BottomTabBar' },
    '@/lib/historyBack': { installHistoryBack: back.installHistoryBack },
  });
  let tree = home.render({ initialGameTab: 'gacha' });
  await flushImports();
  assert.ok(findNode(tree, 'GachaGame'));
  findNode(tree, 'BottomTabBar').props.onChange('history');
  tree = home.render();
  assert.ok(findNode(tree, 'MyPage'));
  back.emit();
  tree = home.render();
  assert.ok(findNode(tree, 'GachaGame'), 'returning from history preserves the selected game');
  assert.equal(back.calls.closed, 0);
  back.emit();
  tree = home.render();
  assert.ok(findNode(tree, 'RouletteGame'));
  assert.equal(back.calls.closed, 0);
  findNode(tree, SegmentedControl).props.onChange('sikpan');
  tree = home.render();
  assert.ok(findNode(tree, 'SikpanGame'));
  back.emit();
  tree = home.render();
  assert.ok(findNode(tree, 'RouletteGame'));
  back.emit();
  await flushImports();
  assert.equal(back.calls.closed, 1);
  home.unmount();
});
