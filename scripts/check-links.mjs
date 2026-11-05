// check-links.mjs — Offline integrity check for the static site (no deps).
// Fails (exit 1) if any internal reference is broken:
//   · href/src to local files            · #anchors (same page and page.html#id)
//   · sprite icons (<use href="…#i-x">)   · icons referenced from JS modules
//   · CSS @import chain from main.css    · JS import graph from main.js
//   · data-mosaic names exist in assets/js/data/mosaics.js
//
//   node scripts/check-links.mjs

import { readFile, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PAGES = ['index.html', 'lanzamiento.html', '404.html'];
const SPRITE = 'assets/img/icons/sprite.svg';

const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const exists = (p) => access(join(ROOT, p)).then(() => true, () => false);
const read = (p) => readFile(join(ROOT, p), 'utf8');
const isExternal = (u) => /^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(u);

const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const spriteIds = new Set([...(await read(SPRITE)).matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]));

/* ------------------------------------------------------------- HTML pages */
const pageIds = {};
for (const page of PAGES) pageIds[page] = ids(await read(page));

for (const page of PAGES) {
  const html = (await read(page)).replace(/<!--[\s\S]*?-->/g, ''); // ignore comments
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

  for (const ref of refs) {
    if (isExternal(ref)) continue;
    const [path, hash] = ref.split('#');

    if (!path) { // same-page anchor
      if (hash && !pageIds[page].has(hash)) fail(page, `ancla inexistente "#${hash}"`);
      continue;
    }
    if (!(await exists(path))) { fail(page, `archivo inexistente "${path}"`); continue; }

    if (hash) {
      if (path === SPRITE) {
        if (!spriteIds.has(hash)) fail(page, `ícono inexistente en el sprite "#${hash}"`);
      } else if (pageIds[path] && !pageIds[path].has(hash)) {
        fail(page, `ancla inexistente "${path}#${hash}"`);
      }
    }
  }

  // data-mosaic names
  const { default: mosaics } = await import(pathToFileURL(join(ROOT, 'assets/js/data/mosaics.js')));
  for (const [, name] of html.matchAll(/data-mosaic="([^"]+)"/g)) {
    if (!mosaics[name]) fail(page, `mosaico inexistente "${name}"`);
  }
}

/* ------------------------------------------------------ CSS @import chain */
async function walkCss(file, seen = new Set()) {
  if (seen.has(file)) return;
  seen.add(file);
  if (!(await exists(file))) return fail('css', `archivo inexistente "${file}"`);
  const css = await read(file);
  for (const [, url] of css.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/g)) {
    await walkCss(join(dirname(file), url).replaceAll('\\', '/'), seen);
  }
}
await walkCss('assets/css/main.css');

/* --------------------------------------------------------- JS import graph */
async function walkJs(file, seen = new Set()) {
  if (seen.has(file)) return;
  seen.add(file);
  if (!(await exists(file))) return fail('js', `módulo inexistente "${file}"`);
  const js = await read(file);
  for (const [, spec] of js.matchAll(/^\s*import\s[^'"]*['"](\.[^'"]+)['"]/gm)) {
    await walkJs(join(dirname(file), spec).replaceAll('\\', '/'), seen);
  }
  for (const [, icon] of js.matchAll(/sprite\.svg#([\w-]+)/g)) {
    if (!spriteIds.has(icon)) fail(file, `ícono inexistente en el sprite "#${icon}"`);
  }
}
await walkJs('assets/js/main.js');

/* ----------------------------------------------------------------- report */
if (errors.length) {
  console.error(`✖ ${errors.length} referencia(s) rota(s):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log('✔ Enlaces, anclas, íconos, imports y mosaicos OK');
