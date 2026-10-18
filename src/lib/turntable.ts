// Turntable: a decorative 3D object from a horizontal sprite strip (N frames, square, frame 0 = front).
// Shows `still` until the strip decodes, spins once, follows horizontal drags with inertia, hops on tap.
// Framework-agnostic. Give it an EMPTY element the framework does not render children into:
//   const stop = mountTurntable(el, { sprite, still });   // call stop() on unmount
// Ported from economy-piggy src/components/Card3d.tsx TurntableChest (2026-10-18).

type Options = { sprite: string; still: string; frames?: number; frameSize?: number; spinOnMount?: boolean };
const DEG_PER_PX = 2.5;
const STYLE_ID = 'turntable-style';
const CSS = `
.tt-host { position: relative; display: block; aspect-ratio: 1; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; cursor: grab; }
.tt-art, .tt-still, .tt-sprite { position: absolute; inset: 0; width: 100%; height: 100%; display: block; pointer-events: none; }
.tt-still { object-fit: contain; }
.tt-sprite { visibility: hidden; background-repeat: no-repeat; background-position: 0 0; }
.tt-host[data-ready] .tt-still { visibility: hidden; }
.tt-host[data-ready] .tt-sprite { visibility: visible; }
@media (prefers-reduced-motion: reduce) { .tt-art { transform: none !important; } }
`;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function mountTurntable(host: HTMLElement, { sprite, still, frames = 36, frameSize = 256, spinOnMount = true }: Options): () => void {
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style'); s.id = STYLE_ID; s.textContent = CSS; document.head.appendChild(s);
  }
  host.classList.add('tt-host'); host.setAttribute('aria-hidden', 'true'); host.setAttribute('data-no-tilt', '');
  const art = document.createElement('span'); art.className = 'tt-art';
  const img = document.createElement('img'); img.className = 'tt-still'; img.src = still; img.alt = ''; img.draggable = false;
  const sheet = document.createElement('span'); sheet.className = 'tt-sprite';
  sheet.style.backgroundImage = `url(${sprite})`; sheet.style.backgroundSize = `${frames * 100}% 100%`;
  art.append(img, sheet); host.replaceChildren(art);

  const motion = (() => { try { return window.matchMedia('(prefers-reduced-motion: reduce)'); } catch { return null; } })();
  const reduced = () => motion?.matches ?? false;
  let ready = false, disposed = false, suppressClick = false, angle = 0, lift = 0, raf = 0;
  let g: { id: number; x: number; y: number; angle: number; axis: 'x' | 'y' | null; s: { x: number; t: number }[] } | null = null;

  const paint = (deg: number, h = 0) => {
    angle = ((deg % 360) + 360) % 360; lift = h;
    const i = Math.floor(angle / (360 / frames)) % frames;
    sheet.style.backgroundPosition = `${(i * 100) / (frames - 1)}% 0`;
    art.style.transform = h ? `translateY(${-h}px)` : '';
  };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const spin = (hop: boolean) => {
    stop(); if (!ready || reduced()) { paint(0); return; }
    const from = angle, fromLift = lift, t0 = performance.now();
    const tick = (now: number) => {
      const t = clamp((now - t0) / 1200, 0, 1);
      const hopH = hop && t < 0.42 ? 12 * Math.sin((Math.PI * t) / 0.42) : 0;
      paint(from + 360 * (1 - (1 - t) ** 3), fromLift * (1 - t) + hopH);
      raf = t < 1 ? requestAnimationFrame(tick) : 0;
    };
    raf = requestAnimationFrame(tick);
  };
  const coast = (v: number) => {
    stop(); if (reduced()) { paint(0); return; }
    const from = angle, fromLift = lift, t0 = performance.now();
    const tick = (now: number) => {
      const e = now - t0, d = Math.exp(-e / 180);
      paint(from + v * 180 * (1 - d), fromLift * Math.exp(-e / 70));
      raf = e < 800 && (Math.abs(v * d) > 0.015 || lift > 0.1) ? requestAnimationFrame(tick) : 0;
    };
    raf = requestAnimationFrame(tick);
  };
  const release = () => { const id = g?.id; g = null; if (id !== undefined && host.hasPointerCapture(id)) host.releasePointerCapture(id); };
  const down = (e: PointerEvent) => {
    if (!e.isPrimary || e.button !== 0 || !ready || reduced()) return;
    stop(); suppressClick = false;
    g = { id: e.pointerId, x: e.clientX, y: e.clientY, angle, axis: null, s: [{ x: e.clientX, t: e.timeStamp }] };
  };
  const move = (e: PointerEvent) => {
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.axis && Math.max(Math.abs(dx), Math.abs(dy)) >= 7) {
      g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; suppressClick = true;
      if (g.axis === 'x') host.setPointerCapture(e.pointerId);
    }
    if (g.axis !== 'x') return;
    g.s.push({ x: e.clientX, t: e.timeStamp }); g.s = g.s.filter(p => p.t >= e.timeStamp - 90);
    paint(g.angle + dx * DEG_PER_PX, lift * 0.5);
  };
  const up = (e: PointerEvent) => {
    if (!g || g.id !== e.pointerId) return;
    const cur = g;
    if (cur.axis === 'x') {
      paint(cur.angle + (e.clientX - cur.x) * DEG_PER_PX, lift);
      const s = [...cur.s, { x: e.clientX, t: e.timeStamp }].filter(p => p.t >= e.timeStamp - 90);
      const a = s[0], b = s[s.length - 1];
      const v = b.t > a.t ? clamp(((b.x - a.x) / (b.t - a.t)) * DEG_PER_PX, -1.2, 1.2) : 0;
      release(); coast(v);
    } else { release(); if (lift) coast(0); }
  };
  const cancel = (e: PointerEvent) => { if (g?.id !== e.pointerId) return; suppressClick = true; release(); stop(); paint(reduced() ? 0 : angle); };
  const click = (e: MouseEvent) => {
    // The object is decoration: its taps never reach the card underneath.
    e.stopPropagation();
    if (suppressClick) { suppressClick = false; e.preventDefault(); return; }
    spin(true);
  };
  const pause = () => { release(); stop(); paint(reduced() ? 0 : angle); };
  const hidden = () => { if (document.hidden) pause(); };

  const probe = new Image();
  probe.onload = () => {
    const decoded = typeof probe.decode === 'function' ? probe.decode() : Promise.resolve();
    decoded.then(() => {
      if (disposed || probe.naturalWidth !== frames * frameSize || probe.naturalHeight !== frameSize) return;
      ready = true; host.dataset.ready = ''; paint(0);
      if (spinOnMount && !reduced() && !document.hidden) spin(false);
    }, () => { /* keep the still */ });
  };
  probe.src = sprite;

  host.addEventListener('pointerdown', down, { passive: true });
  host.addEventListener('pointermove', move, { passive: true });
  host.addEventListener('lostpointercapture', cancel);
  host.addEventListener('click', click);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', cancel);
  window.addEventListener('blur', pause);
  document.addEventListener('visibilitychange', hidden);
  return () => {
    disposed = true; probe.onload = null; pause();
    host.removeEventListener('pointerdown', down);
    host.removeEventListener('pointermove', move);
    host.removeEventListener('lostpointercapture', cancel);
    host.removeEventListener('click', click);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', cancel);
    window.removeEventListener('blur', pause);
    document.removeEventListener('visibilitychange', hidden);
  };
}
