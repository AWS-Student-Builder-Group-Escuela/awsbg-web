// snake.js — A small pixel snake that roams the page's side margins (outside
// the content column), classic-Snake style: grid steps, eats coloured pixels,
// grows, wraps from bottom to top and sometimes switches side.
// Canvas overlay, pointer-events: none, never covers text.
// Off on narrow screens, with reduced motion, or when the user pauses it.

import { t } from './i18n.js';

const CELL = 14;           // px per grid cell
const TICK = 150;          // ms per step
const MIN_LEN = 4;
const MAX_LEN = 14;
const MIN_LANE_COLS = 3;   // lane must be at least this wide to run
const KEY = 'awssbg-snake';

const PALETTE = ['#ff57e9', '#ad5cff', '#42b4ff', '#00e582'];
const FOOD = ['#ff9900', '#ff57e9', '#ad5cff', '#42b4ff', '#00e582'];
const HEAD = '#ff9900';
const EYE = '#161d26';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };
const rand = (n) => Math.floor(Math.random() * n);

export function initSnake() {
  if (reduceMotion.matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'snake-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'snake-toggle';
  btn.setAttribute('data-i18n-dynamic', '');
  btn.innerHTML = `<svg class="icon icon--pause" aria-hidden="true"><use href="assets/img/icons/sprite.svg#i-pause"/></svg>
    <svg class="icon icon--play" aria-hidden="true"><use href="assets/img/icons/sprite.svg#i-play"/></svg>
    <span class="snake-toggle__px" aria-hidden="true"></span>`;
  document.body.append(btn);

  let lanes = [];       // [{x0, cols}] in px / cells
  let rows = 0;
  let snake = [];       // [{x, y}] cells, head first; x is the lane-local column
  let lane = 0;
  let dir = 'down';
  let food = null;
  let grow = 0;
  let timer = null;
  let paused = (() => { try { return localStorage.getItem(KEY) === 'off'; } catch { return false; } })();

  /* ---------------------------------------------------------- geometry */
  function measure() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // content column = first .container on the page
    const box = document.querySelector('main .container')?.getBoundingClientRect();
    const pad = 12;
    const leftEdge = box ? box.left + parseFloat(getComputedStyle(document.querySelector('main .container')).paddingLeft) : w;
    const rightEdge = box ? box.right - parseFloat(getComputedStyle(document.querySelector('main .container')).paddingRight) : 0;
    const leftCols = Math.floor((leftEdge - pad * 2) / CELL);
    const rightCols = Math.floor((w - rightEdge - pad * 2) / CELL);
    lanes = [];
    if (leftCols >= MIN_LANE_COLS) lanes.push({ x0: pad, cols: Math.min(leftCols, 8) });
    if (rightCols >= MIN_LANE_COLS) lanes.push({ x0: w - pad - Math.min(rightCols, 8) * CELL, cols: Math.min(rightCols, 8) });
    rows = Math.floor(h / CELL);
  }

  const available = () => lanes.length > 0 && rows > 10;

  /* -------------------------------------------------------------- state */
  function reset() {
    lane = rand(lanes.length);
    const x = rand(lanes[lane].cols);
    const y = rand(Math.max(1, rows - MIN_LEN));
    snake = Array.from({ length: MIN_LEN }, (_, i) => ({ x, y: y - i }));
    dir = 'down';
    grow = 0;
    placeFood();
  }

  function placeFood() {
    const L = lanes[lane];
    for (let tries = 0; tries < 30; tries++) {
      const f = { x: rand(L.cols), y: rand(rows), color: FOOD[rand(FOOD.length)] };
      if (!snake.some((s) => s.x === f.x && s.y === f.y)) { food = f; return; }
    }
    food = null;
  }

  const hitsSelf = (x, y) => snake.some((s, i) => i < snake.length - 1 && s.x === x && s.y === y);

  function chooseDir() {
    const head = snake[0];
    const cols = lanes[lane].cols;
    const options = Object.keys(DIRS).filter((d) => {
      if (d === OPPOSITE[dir]) return false;
      const nx = head.x + DIRS[d][0];
      const ny = (head.y + DIRS[d][1] + rows) % rows;
      return nx >= 0 && nx < cols && !hitsSelf(nx, ny);
    });
    if (!options.length) return null;

    // Prefer moving toward food, otherwise mostly keep going straight
    if (food && Math.random() < 0.7) {
      const toward = options.filter((d) => {
        const [dx, dy] = DIRS[d];
        return (dx && Math.sign(food.x - head.x) === dx) || (dy && Math.sign(food.y - head.y) === dy);
      });
      if (toward.length) return toward[rand(toward.length)];
    }
    if (options.includes(dir) && Math.random() < 0.75) return dir;
    return options[rand(options.length)];
  }

  function step() {
    const next = chooseDir();
    if (!next) { reset(); return; }
    dir = next;
    const head = snake[0];
    let nx = head.x + DIRS[dir][0];
    let ny = head.y + DIRS[dir][1];

    // wrap vertically; sometimes hop to the other margin
    if (ny >= rows || ny < 0) {
      ny = (ny + rows) % rows;
      if (lanes.length > 1 && Math.random() < 0.5) {
        lane = 1 - lane;
        nx = Math.min(nx, lanes[lane].cols - 1);
        snake = snake.map((s) => ({ x: Math.min(s.x, lanes[lane].cols - 1), y: s.y }));
        placeFood();
      }
    }

    snake.unshift({ x: nx, y: ny });
    if (food && food.x === nx && food.y === ny) {
      grow += 1;
      placeFood();
    }
    if (grow > 0 && snake.length <= MAX_LEN) grow -= 1;
    else snake.pop();
    if (snake.length >= MAX_LEN) { snake.length = MIN_LEN + 2; } // shed and keep going
  }

  /* -------------------------------------------------------------- draw */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const L = lanes[lane];
    const px = (x) => L.x0 + x * CELL;
    const s = CELL - 2;

    if (food) {
      ctx.fillStyle = food.color;
      ctx.fillRect(px(food.x) + 3, food.y * CELL + 3, s - 4, s - 4);
    }
    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i];
      ctx.globalAlpha = i === 0 ? 1 : Math.max(0.45, 1 - i * 0.04);
      ctx.fillStyle = i === 0 ? HEAD : PALETTE[i % PALETTE.length];
      ctx.fillRect(px(seg.x) + 1, seg.y * CELL + 1, s, s);
    }
    ctx.globalAlpha = 1;
    // eye, looking where it goes
    const h = snake[0];
    const [dx, dy] = DIRS[dir];
    ctx.fillStyle = EYE;
    ctx.fillRect(px(h.x) + 5 + dx * 3, h.y * CELL + 5 + dy * 3, 4, 4);
  }

  /* --------------------------------------------------------- lifecycle */
  const start = () => {
    if (timer || paused || !available()) return;
    timer = setInterval(() => { step(); draw(); }, TICK);
  };
  const stop = () => { clearInterval(timer); timer = null; };

  function syncUI() {
    const on = available();
    canvas.hidden = !on || paused;
    btn.hidden = !on;
    btn.classList.toggle('is-paused', paused);
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', t(paused ? 'Reanudar la serpiente' : 'Pausar la serpiente'));
    btn.title = btn.getAttribute('aria-label');
  }

  btn.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem(KEY, paused ? 'off' : 'on'); } catch { /* ignore */ }
    if (paused) stop(); else start();
    syncUI();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      stop();
      measure();
      if (available()) { reset(); draw(); start(); }
      syncUI();
    }, 200);
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  document.addEventListener('langchange', syncUI);

  measure();
  if (available()) { reset(); draw(); }
  syncUI();
  start();
}
