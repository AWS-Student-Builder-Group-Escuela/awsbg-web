// theme.js — Light/dark toggle. Persists choice; falls back to system preference.
import { t } from './i18n.js';

const KEY = 'awssbg-theme';

const store = {
  get() { try { return localStorage.getItem(KEY); } catch { return null; } },
  set(v) { try { localStorage.setItem(KEY, v); } catch { /* storage blocked: ignore */ } },
};

export function initTheme() {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;

  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const current = () => root.dataset.theme || store.get() || (media.matches ? 'dark' : 'light');

  const sync = () => {
    const isDark = current() === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', t(isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'));
  };

  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set(next);
    sync();
  });

  media.addEventListener?.('change', sync);
  document.addEventListener('langchange', sync);
  sync();
}
