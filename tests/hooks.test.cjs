const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function harness(file, mocks, globals = {}) {
  let cursor = 0, slots = [], effects = [], first = true;
  const react = {
    useState(initial) { const i=cursor++; if (!(i in slots)) slots[i]=typeof initial==='function'?initial():initial; return [slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}]; },
    useRef(initial) { const i=cursor++; return slots[i] ??= { current: initial }; },
    useCallback(fn) { return fn; },
    useEffect(fn) { if (first) effects.push(fn); },
  };
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,
    { exports, require: n=>n==='react'?react:mocks[n], console, Date, ...globals });
  return { render(name,arg) { cursor=0; const value=exports[name](arg); first=false; return value; }, effects };
}
let loadOptions, loads=0, cleaned=0;
const load = options => { loads++; loadOptions=options; return ()=>cleaned++; };
load.isSupported=()=>true;
const h=harness('src/hooks/useRewardedAd.ts',{'@apps-in-toss/web-framework':{loadFullScreenAd:load,showFullScreenAd:()=>{}}});
let ad=h.render('useRewardedAd',()=>{}); const unmount=h.effects[0]();
loadOptions.onError(new Error('offline'));
ad=h.render('useRewardedAd',()=>{});
assert.equal(ad.loadError,true); assert.equal(ad.isLoading,false);
ad.retryAd(); assert.equal(loads,2); assert.equal(cleaned,1);
loadOptions.onEvent({type:'loaded'}); ad=h.render('useRewardedAd',()=>{});
assert.equal(ad.isAdLoaded,true); assert.equal(ad.loadError,false);
unmount(); assert.equal(cleaned,2);
const history=[{game:'roulette',label:'test',ts:Date.now()}]; let fail=true, written;
const storage={getItem:()=>JSON.stringify({date:'2026-09-29',spinsUsed:{roulette:1,gacha:0,sikpan:0},history}),setItem:(_,v)=>{if(fail)throw Error('quota');written=v;}};
const s=harness('src/hooks/useSpinState.ts',{'@/lib/dateKey':{dateKey:()=> '2026-09-29'}},{window:{},localStorage:storage});
s.render('useSpinState','roulette'); assert.doesNotThrow(()=>s.effects[0]());
let spin=s.render('useSpinState','roulette'); assert.equal(spin.storageError,true); assert.equal(spin.history[0].label,'test');
fail=false;s.effects[0]();spin=s.render('useSpinState','roulette');assert.equal(spin.storageError,false);assert.equal(JSON.parse(written).history.length,1);
console.log('ad load failure/retry/cleanup and storage failure/recovery: passed');
