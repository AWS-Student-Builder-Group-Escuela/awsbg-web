# AWS Student Builder Group · ECI — Sitio web

Sitio estático del AWS Student Builder Group de la Escuela Colombiana de Ingeniería Julio Garavito.
Está construido con HTML, CSS y JavaScript nativos, sin frameworks, dependencias de runtime ni proceso de build. Se verifica y publica en GitHub Pages con un pipeline de GitHub Actions.

[![CI/CD · GitHub Pages](https://github.com/AWS-Student-Builder-Group-Escuela/awsbg-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/AWS-Student-Builder-Group-Escuela/awsbg-web/actions/workflows/deploy.yml)

**Producción:** https://aws-student-builder-group-escuela.github.io/awsbg-web/

---

## Contenido

- [Stack](#stack)
- [Requisitos](#requisitos)
- [Ejecución local](#ejecución-local)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
  - [CSS](#css)
  - [JavaScript](#javascript)
  - [Internacionalización (ES/EN)](#internacionalización-esen)
  - [Temas y paleta](#temas-y-paleta)
  - [API de atributos `data-*`](#api-de-atributos-data-)
  - [Persistencia en el navegador](#persistencia-en-el-navegador)
- [Desarrollo](#desarrollo)
- [CI/CD](#cicd)
- [Accesibilidad y rendimiento](#accesibilidad-y-rendimiento)
- [Compatibilidad](#compatibilidad)
- [Despliegue](#despliegue)
- [Convenciones](#convenciones)

---

## Stack

| Capa | Tecnología |
|---|---|
| Marcado | HTML5 semántico |
| Estilos | CSS3 modular (custom properties, `@import`, `clamp()`, `color-mix()`, `:has()`) |
| Lógica | JavaScript ES2020+ como **ES modules nativos** (sin bundler) |
| Tipografías | Space Grotesk + Inter (Google Fonts) |
| Hosting | GitHub Pages, desplegado con GitHub Actions |
| Calidad (solo dev/CI) | html-validate, axe-core, puppeteer-core |

El `package.json` solo declara **herramientas de desarrollo y CI** (validación y auditoría). El sitio publicado no carga ninguna dependencia.

---

## Requisitos

- Un navegador moderno (ver [Compatibilidad](#compatibilidad)).
- **Node.js 20+** para el servidor local y las verificaciones. Como alternativa, cualquier servidor estático (Python 3, *Live Server*…).
- **Google Chrome** instalado, solo para `npm run test:a11y`. Usa `CHROME_PATH` si no está en la ruta por defecto.

> El sitio usa ES modules, que el navegador bloquea en `file://`. Abrir `index.html` con doble clic **no** carga el JavaScript, así que siempre hay que servirlo por HTTP.

---

## Ejecución local

```bash
git clone https://github.com/AWS-Student-Builder-Group-Escuela/awsbg-web.git
cd awsbg-web
npm ci                 # instala las herramientas de verificación

npm start              # http://localhost:3000  (scripts/serve.mjs, sin dependencias)
# alternativa sin Node: python -m http.server 3000
```

| Script | Qué hace |
|---|---|
| `npm start` | Servidor estático local que imita a GitHub Pages (`/` → `index.html`, rutas desconocidas → `404.html`). Puerto configurable con `PORT`. |
| `npm run test:html` | Valida el HTML con html-validate (`.htmlvalidate.json`). |
| `npm run test:links` | Verifica offline que no haya referencias internas rotas. |
| `npm run test:a11y` | Auditoría axe-core (WCAG 2 A/AA) y errores de runtime en Chrome. |
| `npm test` | Las tres verificaciones, en ese orden. |

| Ruta | Página |
|---|---|
| `/` | Landing (`index.html`) |
| `/lanzamiento.html` | Evento de lanzamiento |
| `/404.html` | Página de error (GitHub Pages la sirve automáticamente) |

**Animaciones en local:** si el sistema operativo tiene activado *reducir movimiento*, el sitio se muestra estático a propósito (`prefers-reduced-motion`). En Windows se controla en *Configuración → Accesibilidad → Efectos visuales → Efectos de animación*.

---

## Estructura del proyecto

```
.
├── index.html                 # Landing
├── lanzamiento.html           # Página del evento
├── 404.html                   # Error 404 (sin JS)
├── .github/workflows/
│   └── deploy.yml             # Pipeline CI/CD (verificar → desplegar)
├── scripts/                   # Herramientas de dev/CI (Node, sin dependencias de runtime)
│   ├── serve.mjs              # Servidor estático local
│   ├── check-links.mjs        # Verificación offline de referencias
│   └── a11y.mjs               # Auditoría axe-core en Chrome
├── package.json               # Scripts y devDependencies de verificación
├── .htmlvalidate.json         # Reglas de html-validate
├── .nojekyll                  # Desactiva Jekyll si se publica desde una rama
├── .editorconfig              # UTF-8, LF, 2 espacios
└── assets/
    ├── css/
    │   ├── main.css           # Entry point: @import en orden de cascada
    │   ├── settings/          # tokens.css — custom properties (diseño, tema claro/oscuro)
    │   ├── base/              # base.css (reset, tipografía, foco) · layout.css
    │   ├── components/        # Un archivo por componente de UI
    │   ├── pages/             # Estilos exclusivos de una página (launch.css, 404.css)
    │   ├── themes/            # themes.css — temas por sección, paleta, mosaicos
    │   └── motion/            # motion.css — animaciones (último en la cascada)
    ├── js/
    │   ├── main.js            # Entry point: importa e inicializa módulos
    │   ├── modules/           # Un módulo por responsabilidad (ver Arquitectura)
    │   ├── data/              # mosaics.js — sprites de píxeles
    │   └── i18n/              # en.js — diccionario de inglés
    └── img/
        ├── brand/             # Logo, favicon, apple-touch-icon, og-image (1200×630)
        ├── icons/sprite.svg   # Sprite SVG de íconos (<symbol id="i-*">)
        ├── qr/                # Códigos QR
        ├── team/              # Fotos del equipo (WebP 480×600)
        └── speakers/          # Fotos de conferencistas (WebP 240×240)
```

Todas las rutas son **relativas** (`assets/...`), así que el sitio funciona igual en `localhost`, en la subruta `/awsbg-web/` de GitHub Pages o con un dominio propio.

---

## Arquitectura

### CSS

`assets/css/main.css` es la única hoja enlazada desde el HTML. Importa los parciales en este orden, y el orden define la cascada:

```
settings → base → components → pages → themes → motion
```

| Capa | Responsabilidad |
|---|---|
| `settings/tokens.css` | Solo `:root`: color semántico (`--c-*`), escala tipográfica fluida (`--fs-*`, ratio 1.25 con `clamp()`), espaciado (`--sp-*`), radios, *easing* y duraciones. Define el modo oscuro con `prefers-color-scheme` y `[data-theme]`. |
| `base/` | Reset, tipografía base, `:focus-visible`, `.visually-hidden`, `.skip-link`, contenedor y ritmo de secciones. |
| `components/` | Un archivo por bloque (header, hero, team, ticket, dialog…), con convención BEM (`.bloque__elemento--modificador`) y escrito *mobile-first*. |
| `pages/` | Reglas que solo aplican a una página. |
| `themes/` | Paleta AWS, temas de sección, `data-tone`, patrones y mosaicos. |
| `motion/` | Keyframes y transiciones. Solo anima `transform`, `opacity` y `clip-path`, y todo tiene su alternativa bajo `prefers-reduced-motion`. |

Para agregar un componente, crea `components/<nombre>.css` y añade su `@import` en `main.css`.

### JavaScript

`assets/js/main.js` se carga con `<script type="module">`. Cada módulo exporta una función `initX()` sin efectos al importarse, y el orden de inicialización importa:

| # | Módulo | Responsabilidad |
|---|---|---|
| 1 | `pixels.js` | Renderiza mosaicos SVG desde `data/mosaics.js` y el campo de píxeles del hero. |
| 2 | `motion.js` | Divide títulos en palabras (`splitWords`/`unsplitWords`), efectos de puntero, barra de progreso y `confetti()`. |
| 3 | `i18n.js` | Traduce el DOM. Debe ir **después** de `motion`, porque vuelve a dividir los títulos ya divididos. |
| 4 | `theme.js` | Alterna modo claro/oscuro. |
| 5 | `nav.js` | Header (compacto, oculto al bajar), menú móvil, *scroll-spy* e indicador del enlace activo. |
| 6 | `reveal.js` | `IntersectionObserver` sobre `[data-reveal]` y contadores `[data-count]`. Va **después** de `pixels`, `motion` e `i18n`, que crean nuevos `[data-reveal]`. |
| 7 | `launch.js` | Cuenta regresiva y menú "Agregar al calendario" (Google Calendar, Outlook, `.ics`). El objeto `EVENT` es la única fuente de los datos del evento. |
| 8 | `snake.js` | Serpiente en `<canvas>` fijo que recorre los márgenes laterales. |
| 9 | `qr-zoom.js` | Abre los QR en grande. |
| — | `dialog.js` | Utilidad compartida (no se inicializa): `createDialog()` sobre `<dialog>` nativo, con foco atrapado, Esc, clic en el fondo y cierre animado. |

Los módulos se comunican con el evento global `langchange` (`document.dispatchEvent`), que se emite al cambiar de idioma.

### Internacionalización (ES/EN)

- **Fuente:** el español está escrito en el HTML. Es el idioma por defecto, sirve para SEO y funciona sin JS.
- **Traducción:** `assets/js/i18n/en.js` exporta un objeto `{ 'texto en español': 'English text' }`.
- **Mecanismo:**
  - Un `TreeWalker` recorre los nodos de texto del `<body>` y busca cada texto (normalizado) en el diccionario.
  - También traduce `aria-label`, `alt`, `title`, `document.title` y los meta `description`/`og:*`.
  - Guarda el original de cada nodo en un `WeakMap`, así que volver a español restaura el contenido exacto.
- **Textos generados por JS:** usan `t('texto en español')`. Los elementos marcados con `data-i18n-dynamic` no se traducen automáticamente porque sus etiquetas las maneja su propio módulo.
- **Sin parpadeo:** un script inline en `<head>` aplica la clase `i18n-pending` antes de pintar si el idioma no es español. `i18n.js` la retira al terminar, y si el JS falla, una animación de respaldo la retira a los 1.2 s.
- **Idioma inicial:** el valor guardado en `localStorage`; si no hay, el idioma del navegador (`es*` → español, cualquier otro → inglés).

Si cambias un texto en el HTML, actualiza su clave en `en.js`. Si no la encuentra, ese texto se queda en español.

### Temas y paleta

Paleta de la comunidad AWS, definida en `themes/themes.css`:

| Token | Valor | Variante de texto (AA sobre claro) |
|---|---|---|
| `--aws-ink` | `#161D26` | — |
| `--px-orange` | `#FF9900` | `--px-orange-ink` `#A85600` |
| `--px-purple` | `#AD5CFF` | `--px-purple-ink` `#7B35D9` |
| `--px-pink` | `#FF57E9` | `--px-pink-ink` `#B5179E` |
| `--px-green` | `#00E582` | `--px-green-ink` `#007A45` |
| `--px-blue` | `#42B4FF` | `--px-blue-ink` `#0A6CC2` |

Las clases de tema (`theme-ink`, `theme-navy`, `theme-green`, `theme-pink`, `theme-orange`) **redefinen los tokens semánticos** (`--c-bg`, `--c-text`, `--c-line`…) dentro de la sección. Por eso los componentes no necesitan variantes por fondo.

### API de atributos `data-*`

| Atributo | Elemento | Efecto |
|---|---|---|
| `data-reveal` · `="left\|right\|scale"` | cualquiera | Aparece al entrar en pantalla |
| `data-reveal-group` | contenedor | Escalona (*stagger*) a sus hijos `[data-reveal]` |
| `data-count="N"` | texto | Contador animado hasta N |
| `data-hero` + `style="--d:ms"` | hero | Entrada al cargar con retraso `--d` |
| `data-tone="orange\|purple\|pink\|green\|blue"` | ítem | Define `--tone` / `--tone-ink` |
| `data-tilt="N"` | tarjeta | Inclinación 3D de N grados con el puntero |
| `data-magnetic` | botón | Efecto magnético |
| `data-mosaic="nombre"` (`data-color`) | `div.mosaic` | Sprite de `data/mosaics.js` (`x` = color de acento) |
| `data-pixel-field` | sección | Píxeles que titilan sobre la cuadrícula |
| `data-add-calendar` | botón | Abre el menú de calendario |
| `data-qr-zoom` | botón con `<img>` | Abre el QR ampliado |
| `data-countdown` | contenedor | Cuenta regresiva (`[data-unit="d\|h\|m\|s"]`) |

Clases de mosaico: posición `mosaic--tr|tl|br|bl`, tamaño `mosaic--sm` y animación `mosaic--float`.

### Persistencia en el navegador

Todo acceso a `localStorage` está protegido con `try/catch`, así que el sitio funciona aunque el almacenamiento esté bloqueado.

| Clave | Valores |
|---|---|
| `awssbg-theme` | `light` \| `dark` |
| `awssbg-lang` | `es` \| `en` |
| `awssbg-snake` | `on` \| `off` |

---

## Desarrollo

**Nueva página**
1. Crea `nombre.html` en la raíz, con el mismo `<head>` (script inline de tema e idioma, `main.css`, `main.js`), header y footer.
2. Si necesita estilos propios, crea `assets/css/pages/nombre.css` e impórtalo en `main.css`.
3. Agrega el enlace al `<nav>` de todas las páginas y sus textos a `en.js`.

**Nuevo módulo JS**
1. Crea `assets/js/modules/nombre.js` y exporta `initNombre()`.
2. Impórtalo en `main.js` y llámalo respetando las dependencias de la tabla de arriba.
3. Los textos visibles generados por el módulo deben pasar por `t()`.

**Imágenes**
- Formato WebP; las fotos del equipo en 4:5 (480×600) y las de conferencistas en 1:1 (240×240).
- Usa `width`/`height` explícitos y `loading="lazy"`.
- Las fotos originales sin optimizar (`*.png`/`*.jpg` en `team/` y `speakers/`) están en `.gitignore`.

**Íconos**
- Añade un `<symbol id="i-nombre" viewBox="0 0 24 24">` a `img/icons/sprite.svg`.
- Úsalo con `<svg class="icon" aria-hidden="true"><use href="assets/img/icons/sprite.svg#i-nombre"/></svg>`.

**Antes de un push**
- Ejecuta `npm test`; es lo mismo que corre el pipeline.
- Revisa visualmente en 375, 768 y 1440 px, en claro y oscuro, y en ES y EN.

---

## CI/CD

Pipeline en [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

```
push / pull_request ─▶ verify ──(solo main, si pasa)──▶ deploy ─▶ GitHub Pages
```

| Job | Cuándo | Pasos |
|---|---|---|
| **verify** | Push a `main`, PR hacia `main` y ejecución manual | `npm ci` → `test:html` → `test:links` → `test:a11y` (Chrome del runner) |
| **deploy** | Solo push a `main`, y solo si `verify` pasó | Arma `_site/` con `index.html`, `lanzamiento.html`, `404.html` y `assets/` → `upload-pages-artifact` → `deploy-pages` |

- **Qué verifica:**
  - **HTML:** html-validate con las reglas *recommended*. Se permiten solo los estilos en línea `--d` e `--i`, que usa el sistema de animación.
  - **Enlaces:** archivos locales, anclas (también entre páginas), íconos del sprite (incluidos los generados desde JS), cadena de `@import` CSS, grafo de `import` JS y nombres de `data-mosaic`.
  - **Accesibilidad y runtime:** 2 páginas × ES/EN × claro/oscuro, más el menú de calendario abierto. Falla si hay violaciones WCAG 2 A/AA, errores de JS o de consola, o respuestas 4xx/5xx.
- **Qué se publica:** solo el sitio. README, scripts, `package.json` y la configuración del repo no llegan a producción.
- **Concurrencia:** un PR nuevo cancela su ejecución anterior; los despliegues de `main` nunca se cancelan a medias.
- **Permisos:** mínimos (`contents: read`). Solo el job de despliegue recibe `pages: write` e `id-token: write`.

---

## Accesibilidad y rendimiento

- HTML semántico, enlace "Saltar al contenido" y navegación completa por teclado con `:focus-visible` de 3 px.
- Contraste WCAG 2 AA verificado con axe-core en claro/oscuro y ES/EN.
- Las ventanas modales usan `<dialog>` nativo: foco atrapado, Esc y devolución del foco al botón que la abrió.
- Contenido decorativo (serpiente, píxeles, cinta, mosaicos) con `aria-hidden`. La serpiente se puede pausar.
- Con `prefers-reduced-motion` se desactivan las animaciones, la serpiente y el campo de píxeles.
- Los efectos de puntero solo se activan con `(hover: hover) and (pointer: fine)`.
- Sin JS de terceros. Imágenes en WebP con `lazy` y dimensiones explícitas.
- La serpiente y el campo de píxeles se pausan con la pestaña oculta o cuando salen de pantalla.

---

## Compatibilidad

Navegadores *evergreen* recientes (Chrome/Edge, Firefox, Safari). Funciones que requieren:

| Función | Requisito | Si no está disponible |
|---|---|---|
| Interacciones | JavaScript habilitado (ES modules) | Sin JS: todo el contenido visible y estático |
| Ventanas modales | `<dialog>` | El calendario descarga el `.ics` directamente |
| Transición entre páginas | View Transitions (`@view-transition`) | Navegación normal |
| Logo del header | `:has()` | Sin fondo de respaldo |
| Foco de luz por tono | `color-mix()` | Sin foco de color |

---

## Despliegue

Configuración única del repositorio:

1. *Settings → Pages → Build and deployment → Source:* **GitHub Actions**

A partir de ahí, cada push a `main` corre el pipeline y, si pasa, publica en 1–2 minutos. El estado se ve en la pestaña *Actions* y en el entorno `github-pages`.

Para volver a desplegar sin cambios: *Actions → CI/CD · GitHub Pages → Run workflow*.

La imagen para redes (`og:image`) usa una URL absoluta al dominio de producción. Si cambia el dominio, actualiza ese meta en `index.html` y `lanzamiento.html`.

---

## Convenciones

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) en español (`feat(css): …`, `fix(i18n): …`, `docs: …`).
- **CSS:** BEM, *mobile-first* con `@media (min-width: …)`, unidades fluidas (`rem`, `%`, `clamp()`) y sin anchos fijos.
- **JS:** módulos ES con un `initX()` por responsabilidad, sin estado global salvo el evento `langchange`.
- **Formato:** definido en `.editorconfig`.
- **Ramas:** trabaja en una rama y abre un PR hacia `main`; el pipeline la verifica antes de mezclar.

---

<sub>Sitio de una comunidad estudiantil. AWS es una marca de Amazon.com, Inc. o sus afiliadas.</sub>
