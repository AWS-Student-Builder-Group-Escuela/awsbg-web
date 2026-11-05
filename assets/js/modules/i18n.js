// i18n.js — ES ⇄ EN without touching the HTML structure.
// Spanish lives in the HTML (default, SEO, no-JS). English comes from a
// dictionary keyed by the Spanish text (assets/js/i18n/en.js). Originals are
// remembered per node, so switching back restores the exact Spanish markup.

import EN from '../i18n/en.js';
import { splitWords, unsplitWords } from './motion.js';

const KEY = 'awssbg-lang';
const DICTS = { en: EN };
const ATTRS = ['aria-label', 'alt', 'title'];
const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT']);

let lang = 'es';
const textSource = new WeakMap();   // Text node -> Spanish value
const attrSource = new WeakMap();   // Element   -> { attr: Spanish value }

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const lookup = (es) => (lang === 'es' ? es : DICTS[lang]?.[norm(es)]);

/** Translate a Spanish string for code-generated labels. */
export function t(es) {
  return lookup(es) ?? es;
}
export const getLang = () => lang;

const store = {
  get() { try { return localStorage.getItem(KEY); } catch { return null; } },
  set(v) { try { localStorage.setItem(KEY, v); } catch { /* ignore */ } },
};

function translateTextNode(node) {
  if (!textSource.has(node)) textSource.set(node, node.nodeValue);
  const src = textSource.get(node);
  const core = src.trim();
  if (!core) return;
  const out = lookup(core);
  node.nodeValue = out == null ? src : src.replace(core, out);
}

function translateAttrs(el) {
  if (el.hasAttribute('data-i18n-dynamic')) return; // labels managed by JS via t()
  let saved = attrSource.get(el);
  for (const a of ATTRS) {
    if (!el.hasAttribute(a)) continue;
    if (!saved) { saved = {}; attrSource.set(el, saved); }
    if (!(a in saved)) saved[a] = el.getAttribute(a);
    const out = lookup(saved[a]);
    el.setAttribute(a, out ?? saved[a]);
  }
}

function translateMeta() {
  const head = document.head;
  if (!head.dataset.titleEs) head.dataset.titleEs = document.title;
  document.title = lookup(head.dataset.titleEs) ?? head.dataset.titleEs;
  head.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]').forEach((m) => {
    if (!m.dataset.es) m.dataset.es = m.getAttribute('content');
    m.setAttribute('content', lookup(m.dataset.es) ?? m.dataset.es);
  });
  const locale = head.querySelector('meta[property="og:locale"]');
  if (locale) locale.setAttribute('content', lang === 'en' ? 'en_US' : 'es_CO');
}

function translateTree(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (SKIP.has(n.parentNode?.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) translateTextNode(n);
  root.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(',')).forEach(translateAttrs);
}

function syncToggles() {
  document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
    // Label is always in the *target* language so it reads naturally.
    const toEn = lang === 'es';
    btn.setAttribute('aria-label', toEn ? 'Switch to English' : 'Cambiar a español');
    btn.setAttribute('lang', toEn ? 'en' : 'es');
  });
}

export function setLang(next, { animate = false } = {}) {
  if (!DICTS[next] && next !== 'es') return;
  lang = next;
  const root = document.documentElement;
  root.lang = lang;

  // 1. split headings → restore their original Spanish markup first
  const split = [...document.querySelectorAll('.is-split')];
  const wasVisible = split.map((el) => el.classList.contains('is-visible'));
  split.forEach(unsplitWords);

  // 2. translate everything
  translateTree(document.body);
  translateMeta();

  // 3. re-split and (optionally) replay the word-rise animation
  split.forEach((el, i) => {
    splitWords(el);
    if (animate && wasVisible[i]) {
      el.classList.remove('is-visible');
      void el.offsetWidth;
      requestAnimationFrame(() => el.classList.add('is-visible'));
    }
  });

  syncToggles();
  root.classList.remove('i18n-pending');
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

export function initI18n() {
  const stored = store.get();
  const browser = (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en';
  const initial = stored || browser;

  document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = lang === 'es' ? 'en' : 'es';
      store.set(next);
      btn.classList.remove('is-flipping');
      void btn.offsetWidth;
      btn.classList.add('is-flipping');
      setLang(next, { animate: true });
    });
  });

  if (initial !== 'es') setLang(initial);
  else { syncToggles(); document.documentElement.classList.remove('i18n-pending'); }
}
