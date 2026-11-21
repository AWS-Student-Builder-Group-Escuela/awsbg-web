// motion.js — Split-text headings, pointer effects (glow, parallax, tilt,
// spotlight, magnetic), scroll progress and network packets.
// Decorative pointer effects only run on fine pointers without reduced motion.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const motionOK = () => !reduceMotion.matches;

/* --------------------------------------------------------------------------
   Split text: wrap each word in a mask so it can rise into place.
   Keeps inline elements (e.g. <em>) intact; screen readers still read words.
   -------------------------------------------------------------------------- */
const splitSources = new WeakMap(); // element -> original (Spanish) markup

export function splitWords(el) {
  if (el.classList.contains('is-split')) return;
  // remember the very first markup only: that is the Spanish source
  if (!splitSources.has(el)) splitSources.set(el, el.innerHTML);
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const mask = document.createElement('span');
          mask.className = 'split-word';
          const inner = document.createElement('span');
          inner.textContent = part;
          inner.style.setProperty('--w', i++);
          mask.append(inner);
          frag.append(mask);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() !== 'svg') {
        walk(child);
      }
    });
  };
  walk(el);
  el.classList.add('is-split');
}

/** Restore the original markup of a split heading (used by i18n). */
export function unsplitWords(el) {
  if (!splitSources.has(el)) return;
  el.innerHTML = splitSources.get(el);
  el.classList.remove('is-split');
}

function initSplitHeadings() {
  // Hero title animates on load
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    splitWords(heroTitle);
    heroTitle.style.setProperty('--split-delay', '180ms');
    requestAnimationFrame(() => requestAnimationFrame(() => heroTitle.classList.add('is-visible')));
  }

  // Section headings animate on scroll (picked up by reveal.js)
  document
    .querySelectorAll('.section-head h2, .split__title h2, .team-intro h2, .join__title h2, .stats__intro h2, .ticket__body h2, .talk h3')
    .forEach((h) => {
      splitWords(h);
      if (!h.hasAttribute('data-reveal')) h.setAttribute('data-reveal', 'split');
      h.style.setProperty('--split-delay', '120ms');
    });

  document.querySelectorAll('.section-head').forEach((s) => {
    if (!s.hasAttribute('data-reveal')) s.setAttribute('data-reveal', '');
  });
}

/* --------------------------------------------------------------------------
   Scroll progress bar in the header
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const header = document.querySelector('.site-header__bar') || document.querySelector('[data-header]');
  if (!header) return;
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  header.append(bar);

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   Hero: cursor glow + diagram parallax
   -------------------------------------------------------------------------- */
function initHeroPointer() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const visual = hero.querySelector('.hero__visual');

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    hero.style.setProperty('--mx', `${x * 100}%`);
    hero.style.setProperty('--my', `${y * 100}%`);
    hero.style.setProperty('--glow', '1');
    if (visual) {
      visual.style.setProperty('--rx', `${(x - 0.5) * 10}deg`);
      visual.style.setProperty('--ry', `${(0.5 - y) * 8}deg`);
      visual.style.setProperty('--tx', `${(x - 0.5) * 18}px`);
      visual.style.setProperty('--ty', `${(y - 0.5) * 14}px`);
    }
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--glow', '0');
    if (visual) ['--rx', '--ry', '--tx', '--ty'].forEach((p) => visual.style.removeProperty(p));
  });
}

/* --------------------------------------------------------------------------
   Data packets travelling along the hero diagram edges (SVG SMIL)
   -------------------------------------------------------------------------- */
function initPackets() {
  const svg = document.querySelector('.network');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  svg.querySelectorAll('.network__flow').forEach((path, i) => {
    setTimeout(() => {
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', '4');
      dot.setAttribute('class', 'network__packet');
      if (path.dataset.tone) dot.dataset.tone = path.dataset.tone;
      const anim = document.createElementNS(NS, 'animateMotion');
      anim.setAttribute('dur', `${2.4 + (i % 2) * 0.6}s`);
      anim.setAttribute('repeatCount', 'indefinite');
      anim.setAttribute('path', path.getAttribute('d'));
      anim.setAttribute('begin', 'indefinite');
      anim.setAttribute('calcMode', 'spline');
      anim.setAttribute('keyTimes', '0;1');
      anim.setAttribute('keySplines', '0.45 0 0.35 1');
      dot.append(anim);
      svg.append(dot);
      try { anim.beginElement(); } catch { dot.remove(); }
    }, 2100 + i * 450);
  });
}

/* --------------------------------------------------------------------------
   Spotlight that follows the cursor inside benefit cells
   -------------------------------------------------------------------------- */
function initSpotlight() {
  document.querySelectorAll('.benefit').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   3D tilt
   -------------------------------------------------------------------------- */
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt) || 6;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--tilt-x', `${x * max}deg`);
      el.style.setProperty('--tilt-y', `${-y * max}deg`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.removeProperty('--tilt-x');
      el.style.removeProperty('--tilt-y');
    });
  });
}

/* --------------------------------------------------------------------------
   Magnetic buttons
   -------------------------------------------------------------------------- */
function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.28;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.setProperty('--mag-x', `${dx * strength}px`);
      el.style.setProperty('--mag-y', `${dy * strength}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.removeProperty('--mag-x');
      el.style.removeProperty('--mag-y');
    });
  });
}

/* -------------------------------------------------------------------------- */
export function initMotion() {
  // Structural (also needed for the final static state)
  initSplitHeadings();

  if (!motionOK()) return;

  initScrollProgress();
  initPackets();

  if (finePointer.matches) {
    initHeroPointer();
    initSpotlight();
    initTilt();
    initMagnetic();
  }
}
