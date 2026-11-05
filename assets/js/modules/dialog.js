// dialog.js — Shared modal built on the native <dialog>:
// focus trap + Esc for free, closes on backdrop click, animated close,
// focus returns to the element that opened it. Used by qr-zoom and launch.

import { t } from './i18n.js';

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * @param {string} modifier  extra class, e.g. 'dialog--qr'
 * @returns {{ el: HTMLDialogElement, body: HTMLElement, open(opts?): void, close(): void }}
 */
export function createDialog(modifier = '') {
  const el = document.createElement('dialog');
  el.className = `dialog ${modifier}`.trim();
  el.setAttribute('aria-labelledby', `${modifier || 'dialog'}-title`);
  el.innerHTML = `
    <div class="dialog__panel">
      <button class="dialog__close" type="button">
        <svg class="icon" aria-hidden="true"><use href="assets/img/icons/sprite.svg#i-close"/></svg>
        <span class="visually-hidden"></span>
      </button>
      <p class="dialog__eyebrow" aria-hidden="true"></p>
      <h2 class="dialog__title" id="${modifier || 'dialog'}-title"></h2>
      <div class="dialog__body"></div>
    </div>`;
  document.body.append(el);

  const api = {
    el,
    body: el.querySelector('.dialog__body'),
    open({ eyebrow = '', title = '', tone = 'orange' } = {}) {
      el.querySelector('.dialog__eyebrow').textContent = eyebrow;
      el.querySelector('.dialog__title').textContent = title;
      el.querySelector('.dialog__close .visually-hidden').textContent = t('Cerrar');
      el.dataset.tone = tone;
      el.showModal();
    },
    close() {
      if (!el.open || el.classList.contains('is-closing')) return;
      el.classList.add('is-closing');
      const done = () => { el.classList.remove('is-closing'); el.close(); };
      if (reduce()) done(); else setTimeout(done, 220);
    },
  };

  el.querySelector('.dialog__close').addEventListener('click', api.close);
  el.addEventListener('click', (e) => { if (e.target === el) api.close(); });   // backdrop
  el.addEventListener('cancel', (e) => { e.preventDefault(); api.close(); });  // Esc, animated
  return api;
}

export const dialogSupported = () => typeof HTMLDialogElement !== 'undefined';
