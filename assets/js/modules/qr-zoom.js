// qr-zoom.js — Tap a QR code to see it big (easy to scan from another phone).

import { t } from './i18n.js';
import { createDialog, dialogSupported } from './dialog.js';

let dialog = null;

function open(btn) {
  if (!dialog) {
    dialog = createDialog('dialog--qr');
    dialog.body.innerHTML = `
      <div class="dialog__qr-frame"><img class="dialog__qr-img" alt=""></div>
      <p class="dialog__hint"></p>
      <a class="btn btn--primary dialog__action" target="_blank" rel="noopener"></a>`;
  }
  const step = btn.closest('.join-step');
  const img = btn.querySelector('img');
  const link = step?.querySelector('a.btn');

  const big = dialog.body.querySelector('.dialog__qr-img');
  big.src = img.currentSrc || img.src;
  big.alt = img.alt;
  dialog.body.querySelector('.dialog__hint').textContent = t('Escanéalo con la cámara de tu celular.');

  const a = dialog.body.querySelector('.dialog__action');
  a.hidden = !link;
  if (link) {
    a.href = link.href;
    a.innerHTML = `${t('Abrir enlace')} <svg class="icon" aria-hidden="true"><use href="assets/img/icons/sprite.svg#i-arrow-up-right"/></svg>`;
  }

  dialog.open({
    eyebrow: 'QR',
    title: step?.querySelector('h3')?.textContent.trim() || img.alt,
    tone: step?.dataset.tone || 'orange',
  });
}

export function initQrZoom() {
  if (!dialogSupported()) return;
  document.querySelectorAll('[data-qr-zoom]').forEach((btn) => btn.addEventListener('click', () => open(btn)));
}
