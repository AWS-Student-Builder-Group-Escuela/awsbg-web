// pixels.js — AWS-community pixel art: static mosaics + a twinkling pixel
// field aligned to the hero grid. Pure DOM/SVG, no dependencies.
import MOSAICS from '../data/mosaics.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const NS = 'http://www.w3.org/2000/svg';

function renderMosaic(host) {
  const map = MOSAICS[host.dataset.mosaic];
  if (!map) return;
  const rows = map.length;
  const cols = map[0].length;
  host.style.setProperty('--mosaic-cols', cols);

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${cols} ${rows}`);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  let i = 0;
  map.forEach((row, y) => {
    [...row].forEach((c, x) => {
      let ch = c;
      if (ch === '.') return;
      if (ch === 'x') ch = host.dataset.color || 'o'; // accent pixel
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', x + 0.04);
      r.setAttribute('y', y + 0.04);
      r.setAttribute('width', 0.92);
      r.setAttribute('height', 0.92);
      r.setAttribute('class', `mosaic__px--${ch}`);
      // stagger from the centre outwards
      const d = Math.abs(x - (cols - 1) / 2) + Math.abs(y - (rows - 1) / 2);
      r.style.setProperty('--i', d.toFixed(1));
      if (i++ % 5 === 2) r.classList.add('is-blink');
      svg.append(r);
    });
  });
  host.append(svg);
  if (!host.hasAttribute('data-reveal')) host.setAttribute('data-reveal', 'mosaic');
}

/* --------------------------------------------------------------------------
   Pixel field: random grid cells light up in the palette and fade out.
   -------------------------------------------------------------------------- */
const COLORS = ['var(--px-orange)', 'var(--px-purple)', 'var(--px-pink)', 'var(--px-green)', 'var(--px-blue)'];

function initPixelField(host) {
  const field = document.createElement('div');
  field.className = 'pixel-field';
  field.setAttribute('aria-hidden', 'true');
  host.prepend(field);

  const cellSize = () => parseFloat(getComputedStyle(host).getPropertyValue('--grid')) || 64;

  const place = (el) => {
    const size = cellSize();
    const cols = Math.max(1, Math.floor(host.clientWidth / size));
    const rows = Math.max(1, Math.floor(host.clientHeight / size));
    // keep the rows under the fixed header free so nav text stays legible
    const header = document.querySelector('[data-header]');
    const minRow = Math.min(rows - 1, Math.ceil((header ? header.offsetHeight : 0) / size));
    const col = Math.floor(Math.random() * cols);
    const row = minRow + Math.floor(Math.random() * (rows - minRow));
    el.style.left = `${col * size}px`;
    el.style.top = `${row * size}px`;
    el.style.setProperty('--px', COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  // Reduced motion: a calm, static constellation
  if (reduceMotion.matches) {
    for (let n = 0; n < 9; n++) {
      const px = document.createElement('span');
      px.className = 'pixel is-static';
      place(px);
      field.append(px);
    }
    return;
  }

  let timer = null;
  const wide = window.matchMedia('(min-width: 60em)');
  const spawn = () => {
    if (!wide.matches || field.childElementCount > 16) return; // hidden on narrow screens: don't spend work
    const px = document.createElement('span');
    px.className = 'pixel is-twinkle';
    px.style.animationDuration = `${2.6 + Math.random() * 2.4}s`;
    place(px);
    px.addEventListener('animationend', () => px.remove(), { once: true });
    field.append(px);
  };
  const start = () => { if (!timer) timer = setInterval(spawn, 260); };
  const stop = () => { clearInterval(timer); timer = null; };

  // Seed a few immediately so the hero never looks empty
  for (let n = 0; n < 6; n++) setTimeout(spawn, 300 + n * 120);

  // Only run while the hero is on screen and the tab is visible
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
  io.observe(host);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}

export function initPixels() {
  document.querySelectorAll('[data-mosaic]').forEach(renderMosaic);
  document.querySelectorAll('[data-pixel-field]').forEach(initPixelField);
}
