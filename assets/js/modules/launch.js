// launch.js — Event countdown + "add to calendar" menu
// (Google Calendar · Outlook · .ics for Apple Calendar and others).
import { confetti } from './motion.js';
import { t } from './i18n.js';
import { createDialog, dialogSupported } from './dialog.js';

// Single source of truth for the launch event (Bogotá is UTC-5, no DST).
export const EVENT = {
  title: 'Lanzamiento AWS Student Builder Group · ECI',
  start: new Date('2026-11-18T10:00:00-05:00'),
  end: new Date('2026-11-18T11:30:00-05:00'),
  location: 'Salón A-301, Escuela Colombiana de Ingeniería Julio Garavito, Bogotá',
  meetup: 'https://www.meetup.com/aws-sbg-at-colombian-school-of-engineering-julio-garavito/events/316967537/',
  get description() {
    return 'Dos conferencias: "Más allá del servidor" (Santiago Jejen) y "AI-First Business" (John Ávila, AWS). ' +
      'Conoce cómo acceder a vouchers para certificaciones de AWS.\n\n' +
      `Confirma tu asistencia en Meetup: ${this.meetup}`;
  },
};

function initCountdown() {
  const root = document.querySelector('[data-countdown]');
  if (!root) return;

  const cells = {
    d: root.querySelector('[data-unit="d"]'),
    h: root.querySelector('[data-unit="h"]'),
    m: root.querySelector('[data-unit="m"]'),
    s: root.querySelector('[data-unit="s"]'),
  };
  const pad = (n) => String(n).padStart(2, '0');

  let timer;
  const render = () => {
    const diff = EVENT.start.getTime() - Date.now();
    if (diff <= 0) {
      root.hidden = true;
      const done = document.querySelector('[data-countdown-done]');
      if (done) done.hidden = false;
      clearInterval(timer);
      return;
    }
    const s = Math.floor(diff / 1000);
    const next = {
      d: pad(Math.floor(s / 86400)),
      h: pad(Math.floor((s % 86400) / 3600)),
      m: pad(Math.floor((s % 3600) / 60)),
      s: pad(s % 60),
    };
    Object.entries(next).forEach(([unit, value]) => {
      const el = cells[unit];
      if (el.textContent === value) return;
      el.textContent = value;
      // restart the "tick" animation
      el.classList.remove('is-ticking');
      void el.offsetWidth;
      el.classList.add('is-ticking');
    });
  };

  root.hidden = false;
  render();
  timer = setInterval(render, 1000);
}

const toICSDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escapeICS = (s) => s.replace(/\\/g, '\\\\').replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');

function buildICS() {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AWS SBG ECI//Lanzamiento//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:lanzamiento-2026@awssbg-eci`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(EVENT.start)}`,
    `DTEND:${toICSDate(EVENT.end)}`,
    `SUMMARY:${escapeICS(EVENT.title)}`,
    `LOCATION:${escapeICS(EVENT.location)}`,
    `DESCRIPTION:${escapeICS(EVENT.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/* ------------------------------------------------------------------ links */
const enc = encodeURIComponent;
const googleURL = () =>
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${enc(EVENT.title)}&dates=${toICSDate(EVENT.start)}/${toICSDate(EVENT.end)}` +
  `&details=${enc(EVENT.description)}&location=${enc(EVENT.location)}&ctz=America/Bogota`;
const outlookURL = () =>
  'https://outlook.live.com/calendar/0/action/compose?rru=addevent' +
  `&subject=${enc(EVENT.title)}&startdt=${EVENT.start.toISOString()}&enddt=${EVENT.end.toISOString()}` +
  `&body=${enc(EVENT.description)}&location=${enc(EVENT.location)}`;

function downloadICS() {
  const blob = new Blob([buildICS()], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: 'lanzamiento-aws-sbg-eci.ics' });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ------------------------------------------------------------- menu dialog */
let menu = null;
const ARROW = '<svg class="icon" aria-hidden="true"><use href="assets/img/icons/sprite.svg#i-arrow-up-right"/></svg>';
const DOWNLOAD = '<svg class="icon" aria-hidden="true"><use href="assets/img/icons/sprite.svg#i-download"/></svg>';

function renderMenu() {
  menu.body.innerHTML = `
    <p class="dialog__hint">${t('Miércoles 18 de noviembre · 10:00 – 11:30 a. m. · Salón A-301')}</p>
    <ul class="cal-options">
      <li><a class="cal-option" data-tone="blue" href="${googleURL()}" target="_blank" rel="noopener">
        <span class="cal-option__px" aria-hidden="true"></span>
        <span class="cal-option__text"><strong>Google Calendar</strong><small>${t('Se abre en una pestaña nueva')}</small></span>${ARROW}</a></li>
      <li><a class="cal-option" data-tone="purple" href="${outlookURL()}" target="_blank" rel="noopener">
        <span class="cal-option__px" aria-hidden="true"></span>
        <span class="cal-option__text"><strong>Outlook</strong><small>${t('Se abre en una pestaña nueva')}</small></span>${ARROW}</a></li>
      <li><button class="cal-option" data-tone="green" type="button" data-ics>
        <span class="cal-option__px" aria-hidden="true"></span>
        <span class="cal-option__text"><strong>${t('Apple Calendar u otro')}</strong><small>${t('Descarga un archivo .ics')}</small></span>${DOWNLOAD}</button></li>
    </ul>`;
}

function celebrate(el) {
  const r = el.getBoundingClientRect();
  confetti(r.left + r.width / 2, r.top + r.height / 2);
}

function openMenu() {
  if (!menu) {
    menu = createDialog('dialog--calendar');
    menu.body.addEventListener('click', (e) => {
      const option = e.target.closest('.cal-option');
      if (!option) return;
      celebrate(option);
      if (option.hasAttribute('data-ics')) downloadICS();
      setTimeout(menu.close, 350); // links open in a new tab; let the confetti start first
    });
  }
  renderMenu(); // re-render so the labels follow the current language
  menu.open({ eyebrow: t('Calendario'), title: t('Agregar al calendario'), tone: 'pink' });
}

function initCalendar() {
  document.querySelectorAll('[data-add-calendar]').forEach((btn) => {
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.addEventListener('click', () => {
      if (dialogSupported()) openMenu();
      else { celebrate(btn); downloadICS(); } // very old browsers: straight download
    });
  });
}

export function initLaunch() {
  initCountdown();
  initCalendar();
}
