/*!
 * headturn.js - cursor/touch-controlled head renderer (framework independent, zero dependencies).
 *
 *   import { createHeadTurn } from './headturn.js';
 *   const ht = await createHeadTurn(el, { configUrl: '/headturn/config.json' });
 *   ht.destroy();
 *
 * Inputs (see config.json "interaction"). Smile and look-down are SEPARATE inputs that never share a gesture:
 *   pointer X            -> yaw   (left edge = most left-facing frame, centre = centerIdx, right edge = most right-facing frame)
 *   pointer, top region  -> smile (real smile frames from the footage; neutral again when the pointer leaves the region)
 *   pointer, bottom zone -> look down (optional, lookDownZone: 'bottom' | 'none')        keyboard: ArrowDown / ArrowUp
 *   touch drag           -> horizontal = yaw, drag UP = look down; a tap does nothing; release resets
 *   pointer leaves area / touch ends / window blur / Home / Escape -> smooth return to neutral, frontal, no smile
 * The yaw, pitch and smile sequences are separate (the footage has no combined poses), so pitch and smile only fade in while yaw is
 * near centre, and yaw eases back to centre as they engage. All three share the centre frame.
 */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pad4 = (n) => String(n).padStart(4, '0');

const DEFAULTS = {
  configUrl: 'config.json',
  area: 'window',            // 'window' (follows the cursor anywhere) | 'container' (only inside the element). Touch always uses the element.
  fit: 'contain',            // 'contain' | 'cover' (frames are 16:9 on black)
  smoothing: null,           // 0..1 per 60fps frame; null = config.json easing.smoothing
  deadZone: null,            // 0..1 of half-width; null = config.json
  smileStart: 0.30,          // pointer Y (0 = top .. 1 = bottom of the area) where the smile begins
  smileEnd: 0.10,            // pointer Y where the full smile is reached
  lookDownZone: 'bottom',    // 'bottom': pointer in the bottom region looks down | 'none': look down only via keyboard / touch swipe-up
  pitchStart: 0.72,          // pointer Y where looking down begins (lookDownZone: 'bottom')
  pitchEnd: 0.92,            // pointer Y of the full looking-down pose
  gate: 0.10,                // pitch / smile only engage when |smoothed yaw| < gate (those frames only exist at yaw ~ 0)
  touchSlop: 10,             // px a finger must travel before it counts as a drag (a tap never moves the head)
  touchYawRange: 0.40,       // horizontal drag, as a fraction of the element width, for the full turn
  touchPitchRange: 0.35,     // upward drag, as a fraction of the element height, for the full look-down
  touchAction: 'none',       // CSS touch-action on the element: 'none' keeps vertical swipes from scrolling the page while they drive the head
  concurrency: 6,
  tier: null,                // force a tier width (e.g. 1920) for testing
  maxDpr: 2,
  keyboard: true,
  onReady: null, onProgress: null, onTier: null,
};

const active = new WeakMap();                           // container -> { n: live instances, saved: original inline styles/attrs }

export async function createHeadTurn(container, userOpts = {}) {
  const o = { ...DEFAULTS, ...userOpts };
  const cfgUrl = new URL(o.configUrl, document.baseURI);
  const cfgRes = await fetch(cfgUrl);
  if (!cfgRes.ok) {
    throw new Error(`Failed to load headturn config from ${cfgUrl}: HTTP ${cfgRes.status} ${cfgRes.statusText}`);
  }
  const cfg = await cfgRes.json();
  const base = new URL('.', cfgUrl);
  const N = cfg.yawCount, NP = cfg.pitchCount, NS = cfg.smileCount || 0, C = cfg.centerIdx - 1;      // C = 0-based centre index
  const smoothing = o.smoothing ?? cfg.easing.smoothing, dz = o.deadZone ?? cfg.deadZone;
  const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  let reduced = !!mq?.matches;
  const tiers = cfg.tiers.map((t) => t.width).sort((a, b) => a - b);
  const ac = new AbortController(); const sig = { signal: ac.signal };

  // ---- DOM (inline styles/attributes restored on destroy once the LAST instance on this element is gone) -------------------
  let rec = active.get(container);
  if (!rec) { rec = { n: 0, saved: { style: container.getAttribute('style'), tabindex: container.getAttribute('tabindex'), role: container.getAttribute('role'), aria: container.getAttribute('aria-label') } }; active.set(container, rec); }
  rec.n++;
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  Object.assign(container.style, { background: '#000', overflow: 'hidden', touchAction: o.touchAction, userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', webkitTapHighlightColor: 'transparent' });
  container.dataset.state = 'placeholder';
  if (o.keyboard && !container.hasAttribute('tabindex')) container.tabIndex = 0;
  container.setAttribute('role', 'img');
  if (!container.getAttribute('aria-label')) container.setAttribute('aria-label', cfg.alt || 'Portrait that follows your cursor');
  const ph = new Image(); ph.alt = ''; ph.decoding = 'async'; ph.src = new URL(cfg.paths.placeholder, base);
  Object.assign(ph.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: o.fit, filter: 'blur(10px)', transition: 'opacity .5s ease', pointerEvents: 'none' });
  const cv = document.createElement('canvas');
  Object.assign(cv.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, transition: 'opacity .5s ease', display: 'block' });
  cv.setAttribute('aria-hidden', 'true');
  container.prepend(cv); container.prepend(ph);
  const ctx = cv.getContext('2d', { alpha: false });

  // ---- tier selection (container width x DPR; never downloads other tiers unless the box grows) --------------------
  const dpr = () => Math.min(window.devicePixelRatio || 1, o.maxDpr);
  const pickTier = () => {
    if (o.tier) return o.tier;
    let need = container.clientWidth * dpr();
    if (navigator.connection?.saveData) need *= 0.6;
    return tiers.find((w) => w >= need * 0.92) ?? tiers[tiers.length - 1];
  };
  let tier = pickTier();

  // ---- image store ----------------------------------------------------------
  let fmt = 'avif';
  const store = {};                                   // store[tier] = { yaw: [], pitch: [], smile: [] }
  const LEN = { yaw: N, pitch: NP, smile: NS };
  const slot = (t) => (store[t] ??= { yaw: new Array(N), pitch: new Array(NP), smile: new Array(NS) });
  const url = (t, seq, i) => new URL(cfg.paths[fmt].replace('{tier}', t).replace('{seq}', seq).replace('{n}', pad4(i + 1)), base);
  async function load(t, seq, i) {
    const s = slot(t)[seq];
    if (s[i]) return s[i];
    if (seq !== 'yaw' && i === 0) { s[0] = await load(t, 'yaw', C); return s[0]; }   // pitch[0] / smile[0] === centre frame
    for (let attempt = 0; attempt < 2; attempt++) {
      const im = new Image(); im.decoding = 'async'; im.src = url(t, seq, i);
      try { await im.decode(); s[i] = im; return im; }
      catch { if (attempt === 0 && fmt === 'avif') fmt = 'webp'; else return null; }   // AVIF unsupported -> WebP for good
    }
    return null;
  }
  let loadedCount = 0, destroyed = false; const total = N + NP - 1 + Math.max(0, NS - 1);
  function order() {                                   // centre outwards: nearest yaw frames first, pitch and smile interleaved
    const l = []; for (let d = 1; d < Math.max(C + 1, N - C, NP, NS); d++) {
      if (C - d >= 0) l.push(['yaw', C - d]); if (C + d < N) l.push(['yaw', C + d]); if (d < NP) l.push(['pitch', d]); if (d < NS) l.push(['smile', d]);
    } return l;
  }
  async function loadAll(t) {
    const q = order(); let k = 0;
    const worker = async () => { while (k < q.length && !destroyed && t === tier) { const [sq, i] = q[k++]; if (await load(t, sq, i)) { loadedCount++; o.onProgress?.(loadedCount / total); needDraw = true; kick(); } } };
    await Promise.all(Array.from({ length: o.concurrency }, worker));
    if (!destroyed && t === tier) container.dataset.state = 'loaded';
  }
  const bestImage = (seq, i) => {                      // nearest loaded frame in current tier, else any other tier
    const ts = [tier, ...Object.keys(store).map(Number).filter((x) => x !== tier).sort((a, b) => Math.abs(a - tier) - Math.abs(b - tier))];
    for (const t of ts) { const arr = store[t]?.[seq]; if (!arr) continue;
      if (arr[i]) return arr[i];
      for (let d = 1; d < arr.length; d++) { if (arr[i - d]) return arr[i - d]; if (arr[i + d]) return arr[i + d]; } }
    return null;
  };

  // ---- state & input ----------------------------------------------------------
  // targets: u = yaw -1..1, v = look down 0..1, s = smile 0..1.   smoothed: sy, sp, sm.
  let u = 0, v = 0, s = 0, sy = 0, sp = 0, sm = 0, needDraw = true, raf = 0, last = 0, visible = true;
  const reset = () => { u = 0; v = 0; s = 0; };
  const rel = (e) => { if (o.area === 'window') return [e.clientX / innerWidth, e.clientY / innerHeight]; const r = container.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  const onMove = (e) => {
    if (e.pointerType === 'touch' || reduced) return;                          // touch is handled by the drag gesture below
    const [px, py] = rel(e); const x = (px - 0.5) * 2;
    u = clamp(Math.sign(x) * (Math.max(0, Math.abs(x) - dz) / (1 - dz)), -1, 1);
    s = NS > 1 ? clamp((o.smileStart - py) / (o.smileStart - o.smileEnd)) : 0;
    if (o.lookDownZone === 'bottom') v = clamp((py - o.pitchStart) / (o.pitchEnd - o.pitchStart));
    kick();
  };
  const onLeave = () => { reset(); kick(); };
  const target = o.area === 'window' ? window : container;
  target.addEventListener('pointermove', onMove, { passive: true, ...sig });
  if (o.area === 'container') container.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') onLeave(); }, sig);
  document.addEventListener('mouseout', (e) => { if (!e.relatedTarget && o.area === 'window') onLeave(); }, sig);
  document.addEventListener('visibilitychange', () => { if (document.hidden) onLeave(); }, sig);
  window.addEventListener('blur', onLeave, sig);

  // touch: a drag. Horizontal travel -> yaw, UPWARD travel -> look down. Relative to where the finger went down, so a tap never moves the head.
  let drag = null;
  container.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch' || reduced || !e.isPrimary) return;
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, on: false };
    try { container.setPointerCapture(e.pointerId); } catch { /* not capturable: events still arrive while the finger stays inside */ }
  }, sig);
  container.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.on) { if (Math.hypot(dx, dy) < o.touchSlop) return; drag.on = true; }
    const r = container.getBoundingClientRect();
    u = clamp(dx / (r.width * o.touchYawRange), -1, 1);
    v = clamp(-dy / (r.height * o.touchPitchRange));                          // finger moving UP (dy < 0) = look down; moving down does nothing
    s = 0; kick();
  }, sig);
  const endDrag = (e) => { if (drag && e.pointerId === drag.id) { drag = null; onLeave(); } };
  container.addEventListener('pointerup', endDrag, sig); container.addEventListener('pointercancel', endDrag, sig); container.addEventListener('lostpointercapture', endDrag, sig);

  // keyboard (element must be focused): arrows turn / look down, S toggles the smile, Home / Escape reset
  if (o.keyboard) container.addEventListener('keydown', (e) => {
    const step = 0.25; let used = true;
    if (e.key === 'ArrowLeft') u = clamp(u - step, -1, 1); else if (e.key === 'ArrowRight') u = clamp(u + step, -1, 1);
    else if (e.key === 'ArrowDown') v = clamp(v + step); else if (e.key === 'ArrowUp') v = clamp(v - step);
    else if ((e.key === 's' || e.key === 'S') && NS > 1 && !e.ctrlKey && !e.metaKey && !e.altKey) s = s > 0.5 ? 0 : 1;
    else if (e.key === 'Home' || e.key === 'Escape') reset(); else used = false;
    if (used) { e.preventDefault(); kick(); }
  }, sig);
  mq?.addEventListener?.('change', (e) => { reduced = e.matches; if (reduced) { reset(); } kick(); }, sig);

  // ---- render -------------------------------------------------------------
  function resize() {
    const d = dpr(), w = Math.max(1, Math.round(container.clientWidth * d)), h = Math.max(1, Math.round(container.clientHeight * d));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; needDraw = true; kick(); }
    const nt = pickTier();
    if (nt > tier && !o.tier) { tier = nt; o.onTier?.(tier); container.dataset.tier = tier; loadAll(tier); }   // upgrade only, never downgrade
  }
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null; ro?.observe(container);
  const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; if (visible) { needDraw = true; kick(); } }) : null; io?.observe(container);
  const rect = (iw, ih) => { const cw = cv.width, ch = cv.height, k = o.fit === 'cover' ? Math.max(cw / iw, ch / ih) : Math.min(cw / iw, ch / ih); const w = iw * k, h = ih * k; return [(cw - w) / 2, (ch - h) / 2, w, h]; };
  function drawSeq(seq, f, alpha) {
    const n = LEN[seq], fi = clamp(f, 0, n - 1), i0 = Math.floor(fi), fr = fi - i0;
    const a = bestImage(seq, i0); if (!a) return;
    const [x, y, w, h] = rect(a.naturalWidth, a.naturalHeight);
    ctx.globalAlpha = alpha; ctx.drawImage(a, x, y, w, h);
    if (fr > 0.02 && i0 + 1 < n) { const b = bestImage(seq, i0 + 1); if (b && b !== a) { ctx.globalAlpha = alpha * fr; ctx.drawImage(b, x, y, w, h); } }
    ctx.globalAlpha = 1;
  }
  const yawIndex = (k) => (k < 0 ? C + k * C : C + k * (N - 1 - C));
  function draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height);
    drawSeq('yaw', yawIndex(sy), 1);
    if (sp > 0.001) drawSeq('pitch', sp * (NP - 1), clamp(sp / 0.12));
    if (sm > 0.001 && NS > 1) drawSeq('smile', sm * (NS - 1), clamp(sm / 0.12));
    container.dataset.frame = `${yawIndex(sy).toFixed(2)}|${(sp * (NP - 1)).toFixed(2)}|${(sm * Math.max(0, NS - 1)).toFixed(2)}`;
  }
  function tick(ts) {
    raf = 0; if (destroyed) return;
    if (!visible) { last = 0; return; }                                         // off-screen: no decoding/drawing until it is visible again
    const dt = Math.min(0.1, (ts - (last || ts)) / 1000); last = ts;
    const k = reduced ? 1 : 1 - Math.exp(Math.log(1 - clamp(smoothing, 0.001, 0.999)) * 60 * dt);
    const sT = s * (1 - v);                                                    // an explicit look-down wins over a smile; they never blend
    const yT = u * (1 - clamp(v + sT)), gate = clamp(1 - Math.abs(sy) / o.gate), pT = v * gate, mT = sT * gate;
    const py_ = sy, pp = sp, pm = sm; sy += (yT - sy) * k; sp += (pT - sp) * k; sm += (mT - sm) * k;
    if (Math.abs(sy - yT) < 5e-4) sy = yT; if (Math.abs(sp - pT) < 5e-4) sp = pT; if (Math.abs(sm - mT) < 5e-4) sm = mT;
    const moving = sy !== yT || sp !== pT || sm !== mT || py_ !== sy || pp !== sp || pm !== sm;
    if (moving || needDraw) { draw(); needDraw = false; }
    if (moving) raf = requestAnimationFrame(tick); else last = 0;
  }
  function kick() { if (!raf && !destroyed) raf = requestAnimationFrame(tick); }

  // ---- boot: centre frame first, then progressive -------------------------------
  resize(); container.dataset.tier = tier;
  const first = await load(tier, 'yaw', C);
  if (first && !destroyed) { loadedCount++; draw(); cv.style.opacity = 1; setTimeout(() => { ph.style.opacity = 0; }, 450); container.dataset.state = 'ready'; }
  loadAll(tier);

  const api = {
    getState: () => ({ u, v, s, sy, sp, sm, tier, fmt, yawFrame: yawIndex(sy), pitchFrame: sp * (NP - 1), smileFrame: sm * Math.max(0, NS - 1), loaded: loadedCount, total, state: container.dataset.state, reducedMotion: reduced, config: cfg }),
    setPose(nu, nv = 0, ns = 0) { u = clamp(nu, -1, 1); v = clamp(nv); s = clamp(ns); kick(); },   // programmatic: yaw, look-down, smile
    reset() { reset(); kick(); },
    destroy() {
      if (destroyed) return; destroyed = true; cancelAnimationFrame(raf); ac.abort(); ro?.disconnect(); io?.disconnect(); cv.remove(); ph.remove();
      if (--rec.n <= 0) {                                                       // last instance on this element: put the element back as we found it
        const sv = rec.saved; active.delete(container);
        sv.style == null ? container.removeAttribute('style') : container.setAttribute('style', sv.style);
        sv.tabindex == null ? container.removeAttribute('tabindex') : container.setAttribute('tabindex', sv.tabindex);
        sv.role == null ? container.removeAttribute('role') : container.setAttribute('role', sv.role);
        sv.aria == null ? container.removeAttribute('aria-label') : container.setAttribute('aria-label', sv.aria);
        delete container.dataset.state; delete container.dataset.frame; delete container.dataset.tier;
      }
    },
  };
  o.onReady?.(api);
  return api;
}
export default createHeadTurn;
