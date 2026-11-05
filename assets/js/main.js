// main.js — Entry point (native ES modules, no bundler).
// Init order matters:
//   pixels  → renders mosaics (they get [data-reveal])
//   motion  → splits headings into words (they get [data-reveal])
//   i18n    → translates (un-splits / re-splits headings) before anything is revealed
//   reveal  → observes every [data-reveal] created above
import { initTheme } from './modules/theme.js';
import { initNav } from './modules/nav.js';
import { initPixels } from './modules/pixels.js';
import { initMotion } from './modules/motion.js';
import { initI18n } from './modules/i18n.js';
import { initReveal } from './modules/reveal.js';
import { initLaunch } from './modules/launch.js';
import { initSnake } from './modules/snake.js';
import { initQrZoom } from './modules/qr-zoom.js';

initPixels();
initMotion();
initI18n();
initTheme();
initNav();
initReveal();
initLaunch();
initSnake();
initQrZoom();

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
