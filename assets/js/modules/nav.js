// nav.js — Floating header behaviour:
//  · compact state after scrolling (.is-scrolled)
//  · hides while scrolling down, comes back on scroll up (.is-hidden)
//  · mobile menu (aria-expanded, Escape, closes on link click)
//  · scroll-spy for in-page links + a sliding "pill" indicator on desktop

import { t } from './i18n.js';

const DESKTOP = window.matchMedia('(min-width: 64em)');

export function initNav() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const toggle = header.querySelector('[data-nav-toggle]');
  const menu = header.querySelector('#nav-menu');

  /* ---------------------------------------------------------------- menu */
  const isOpen = () => toggle?.getAttribute('aria-expanded') === 'true';
  const setOpen = (open) => {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', t(open ? 'Cerrar menú' : 'Abrir menú'));
    menu.classList.toggle('is-open', open);
    header.classList.toggle('is-open', open);
    if (open) header.classList.remove('is-hidden');
  };
  if (toggle && menu) {
    toggle.setAttribute('aria-label', t('Abrir menú')); // i18n may have run before us
    toggle.addEventListener('click', () => setOpen(!isOpen()));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', (e) => { if (isOpen() && !header.contains(e.target)) setOpen(false); });
    DESKTOP.addEventListener?.('change', (e) => { if (e.matches) setOpen(false); });
  }

  /* ------------------------------------------- scrolled / hide-on-scroll */
  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    const goingDown = y > lastY + 6;
    const goingUp = y < lastY - 6;
    if (goingDown && y > 320 && !isOpen() && !header.matches(':focus-within')) header.classList.add('is-hidden');
    else if (goingUp || y < 120) header.classList.remove('is-hidden');
    if (goingDown || goingUp) lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  onScroll();

  /* ---------------------------------------------- sliding pill indicator */
  let indicator = null;
  if (menu) {
    indicator = document.createElement('li');
    indicator.className = 'nav__indicator';
    indicator.setAttribute('aria-hidden', 'true');
    menu.prepend(indicator);
  }
  const links = menu ? [...menu.querySelectorAll('.nav__link')] : [];
  const moveTo = (link) => {
    if (!indicator || !DESKTOP.matches) return;
    if (!link) { indicator.style.setProperty('--ind-o', 0); return; }
    const m = menu.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    indicator.style.setProperty('--ind-x', `${r.left - m.left}px`);
    indicator.style.setProperty('--ind-w', `${r.width}px`);
    indicator.style.setProperty('--ind-o', 1);
  };
  const current = () => links.find((a) => a.hasAttribute('aria-current'));
  links.forEach((a) => {
    a.addEventListener('pointerenter', () => moveTo(a));
    a.addEventListener('focus', () => moveTo(a));
  });
  menu?.addEventListener('pointerleave', () => moveTo(current()));
  menu?.addEventListener('focusout', () => setTimeout(() => { if (!menu.contains(document.activeElement)) moveTo(current()); }));
  // re-measure when layout changes (fonts, compact bar, language switch)
  const remeasure = () => moveTo(current());
  window.addEventListener('resize', remeasure);
  header.querySelector('.site-header__bar')?.addEventListener('transitionend', remeasure);
  document.fonts?.ready.then(remeasure);
  document.addEventListener('langchange', () => {
    if (toggle) toggle.setAttribute('aria-label', t(isOpen() ? 'Cerrar menú' : 'Abrir menú'));
    requestAnimationFrame(remeasure);
  });

  /* ------------------------------------------------------------ scroll-spy */
  const spyLinks = links.filter((a) => a.getAttribute('href')?.startsWith('#'));
  const sections = spyLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) { remeasure(); return; }

  const setActive = (id) => {
    spyLinks.forEach((a) => {
      if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    remeasure();
  };
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }),
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => observer.observe(s));
  // above the first section (hero) nothing is active
  const hero = document.querySelector('.hero');
  if (hero) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio > 0.5) {
        spyLinks.forEach((a) => a.removeAttribute('aria-current'));
        remeasure();
      }
    }, { threshold: [0.5] }).observe(hero);
  }
}
