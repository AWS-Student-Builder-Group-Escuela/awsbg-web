// a11y.mjs — Browser audit with axe-core (WCAG 2 A/AA) + runtime health.
// For each page × language (es/en) × colour scheme (light/dark):
//   · no axe violations (content forced to its final, revealed state)
//   · no JS errors, no console errors, no failed requests (4xx/5xx)
// Plus: the "add to calendar" dialog is audited while open.
//
//   node scripts/a11y.mjs
//   CHROME_PATH=/path/to/chrome node scripts/a11y.mjs
//
// Uses an installed Chrome (puppeteer-core does not download one).

import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';
import { startServer } from './serve.mjs';

const require = createRequire(import.meta.url);
const AXE = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');

const CHROME = process.env.CHROME_PATH || {
  win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  linux: '/usr/bin/google-chrome',
}[process.platform];

const PAGES = ['/', '/lanzamiento.html'];
const LANGS = ['es', 'en'];
const SCHEMES = ['light', 'dark'];

const server = await startServer(0);
const BASE = `http://localhost:${server.address().port}`;
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : [],
});

const problems = [];
const runAxe = (page) =>
  page.evaluate(async () => {
    // preload: false → axe does not re-fetch stylesheets (avoids false 404s)
    const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'], preload: false });
    return r.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(' ')}`);
  });

async function audit(path, lang, scheme, { openCalendar = false } = {}) {
  const label = `${path} [${lang}/${scheme}${openCalendar ? '/calendario' : ''}]`;
  const page = await browser.newPage();
  const issues = [];
  page.on('pageerror', (e) => issues.push(`JS: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && issues.push(`console: ${m.text()}`));
  page.on('response', (r) => r.status() >= 400 && issues.push(`HTTP ${r.status()}: ${r.url()}`));

  await page.evaluateOnNewDocument((l) => { try { localStorage.setItem('awssbg-lang', l); } catch {} }, lang);
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: scheme },
    { name: 'prefers-reduced-motion', value: 'reduce' }, // final states, no mid-animation contrast
  ]);
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE + path, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible')));

  if (openCalendar) {
    await page.evaluate(() => document.querySelector('[data-add-calendar]')?.click());
    await page.waitForSelector('.dialog--calendar[open]', { timeout: 3000 }).catch(() => issues.push('el menú de calendario no abrió'));
  }

  await page.evaluate(AXE);
  for (const v of await runAxe(page)) issues.push(`axe: ${v}`);

  // the page must actually be in the requested language
  const htmlLang = await page.evaluate(() => document.documentElement.lang);
  if (htmlLang !== lang) issues.push(`idioma esperado "${lang}", obtenido "${htmlLang}"`);

  await page.close();
  if (issues.length) problems.push({ label, issues });
  console.log(`${issues.length ? '✖' : '✔'} ${label}`);
}

try {
  for (const path of PAGES) for (const lang of LANGS) for (const scheme of SCHEMES) await audit(path, lang, scheme);
  await audit('/lanzamiento.html', 'es', 'light', { openCalendar: true });
  await audit('/lanzamiento.html', 'en', 'dark', { openCalendar: true });
} finally {
  await browser.close();
  server.close();
}

if (problems.length) {
  console.error('\nProblemas encontrados:');
  for (const { label, issues } of problems) {
    console.error(`\n${label}`);
    issues.forEach((i) => console.error(`  - ${i}`));
  }
  process.exit(1);
}
console.log('\n✔ Accesibilidad (WCAG 2 AA) y salud de runtime OK');
