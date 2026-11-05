<div align="center">

🟧🟪🟥🟩🟦⬛🟧🟪🟥🟩🟦

# AWS Student Builder Group · ECI

**Construyendo comunidad, talento y proyectos en la nube.**

Sitio web oficial del AWS Student Builder Group de la
**Escuela Colombiana de Ingeniería Julio Garavito**.

[![Sitio en vivo](https://img.shields.io/badge/sitio-en%20vivo-FF9900?style=for-the-badge&logo=github&logoColor=white&labelColor=161D26)](https://aws-student-builder-group-escuela.github.io/awsbg-web/)
![HTML5](https://img.shields.io/badge/HTML5-semántico-E34F26?style=for-the-badge&logo=html5&logoColor=white&labelColor=161D26)
![CSS3](https://img.shields.io/badge/CSS-modular-AD5CFF?style=for-the-badge&logo=css3&logoColor=white&labelColor=161D26)
![JavaScript](https://img.shields.io/badge/JS-vanilla-00E582?style=for-the-badge&logo=javascript&logoColor=white&labelColor=161D26)
![Sin frameworks](https://img.shields.io/badge/frameworks-0-42B4FF?style=for-the-badge&labelColor=161D26)

🟦🟩🟥🟪🟧⬛🟦🟩🟥🟪🟧

</div>

---

## 📌 Tabla de contenido

- [¿Qué es esto?](#-qué-es-esto)
- [¿Qué encuentras en la página?](#-qué-encuentras-en-la-página)
- [Sistema de diseño](#-sistema-de-diseño)
- [Scaffolding (estructura del proyecto)](#️-scaffolding-estructura-del-proyecto)
- [Correr el proyecto en local](#-correr-el-proyecto-en-local)
- [Guías rápidas de mantenimiento](#️-guías-rápidas-de-mantenimiento)
- [Accesibilidad y rendimiento](#-accesibilidad-y-rendimiento)
- [Despliegue](#-despliegue)
- [Pendientes de contenido](#-pendientes-de-contenido)

---

## 🚀 ¿Qué es esto?

Un **AWS Student Builder Group** es una comunidad universitaria respaldada por AWS para
**aprender, construir y conectar** alrededor de la nube. Este repositorio contiene el sitio
estático de la comunidad de la ECI: quiénes somos, cómo funciona, qué beneficios hay y
todo sobre el **lanzamiento del 18 de noviembre de 2026**.

Es un sitio **100 % estático**: HTML, CSS y JavaScript sin frameworks ni proceso de build.
Se publica directamente con **GitHub Pages**.

---

## 🧭 ¿Qué encuentras en la página?

### `index.html` — La comunidad

| Sección | Qué cuenta | Fondo |
|---|---|---|
| **Hero** | Mensaje principal, CTA y diagrama de la comunidad con paquetes de datos animados | ⬛ Squid ink + píxeles que titilan |
| **Cinta** | Tecnologías: Cloud, IA, DevOps, Serverless… | 🟧 Naranja |
| **¿Qué es?** | Aprender · Construir · Conectar | ⬜ Claro + cuadrícula |
| **¿Cómo funciona?** | Los 5 componentes: Comunidad, Eventos, Aprendizaje, Proyectos, Liderazgo | 🟦 Azul oscuro |
| **Colombia en cifras** | 14 Student Builder Groups · 16 User Groups | 🟩 Verde |
| **¿Quién puede participar?** | Requisitos para unirse | ⬜ Claro |
| **Beneficios** | Créditos, vouchers de certificación, contacto con AWS… | ⬛ Squid ink |
| **Quiénes somos** | Líder y Core Team (5 personas) | ⬜ Claro + cuadrícula |
| **Lanzamiento** | Ticket del evento con "Agregar al calendario" | 🟥 Rosado |
| **Únete** | Builder ID + grupo de Meetup (con QR) | ⬜ Claro |

### `lanzamiento.html` — El evento

Cuenta regresiva en vivo, datos del evento, las dos charlas, la agenda y el registro.

### `404.html` — Página no encontrada

"Este recurso no está en nuestra región." 🌎

### ✨ Detalles que hacen la diferencia

- 🌐 **Español ⇄ Inglés.** Botón en el header que recuerda tu elección y detecta el idioma del navegador.
- 🌗 **Modo claro / oscuro** con preferencia guardada.
- 🐍 **Serpiente pixelada.** Recorre los márgenes laterales comiendo píxeles de colores. Nunca tapa el texto y se pausa con un botón.
- 🧩 **Sprites de píxeles en cada sección**: corazón, cohete, trofeo, bombillo, carita, chat, micrófono, reloj… con colores pensados para cada fondo.
- 🎞️ **Animaciones.** Títulos que suben palabra por palabra, contadores, inclinación 3D, botones magnéticos, confeti al agregar al calendario y transición entre páginas.
- 🧭 **Header flotante.** Se compacta al hacer scroll, se esconde al bajar, vuelve al subir, y una píldora se desliza al enlace activo.
- 📅 **Agregar al calendario**: Google Calendar, Outlook o archivo `.ics` (Apple Calendar y otros).

---

## 🎨 Sistema de diseño

Paleta tomada de las presentaciones de la comunidad AWS:

| Token | Color | Uso |
|---|---|---|
| `--aws-ink` | ![#161D26](https://img.shields.io/badge/-%23161D26-161D26?style=flat-square) | Fondos oscuros, header, footer |
| `--px-orange` | ![#FF9900](https://img.shields.io/badge/-%23FF9900-FF9900?style=flat-square) | Acento principal y CTAs |
| `--px-purple` | ![#AD5CFF](https://img.shields.io/badge/-%23AD5CFF-AD5CFF?style=flat-square) | Píxeles y tonos |
| `--px-pink` | ![#FF57E9](https://img.shields.io/badge/-%23FF57E9-FF57E9?style=flat-square) | Sección de lanzamiento, píxeles |
| `--px-green` | ![#00E582](https://img.shields.io/badge/-%2300E582-00E582?style=flat-square) | Cifras, registro, píxeles |
| `--px-blue` | ![#42B4FF](https://img.shields.io/badge/-%2342B4FF-42B4FF?style=flat-square) | Píxeles y tonos |
| `--navy-900` | ![#0B1B33](https://img.shields.io/badge/-%230B1B33-0B1B33?style=flat-square) | Sección "Cómo funciona", agenda |

- **Tipografías:** *Space Grotesk* (títulos) + *Inter* (texto), cargadas desde Google Fonts.
- **Escala tipográfica:** modular 1.25 y fluida con `clamp()`.
- **Espaciado:** ritmo de 4/8 px expresado en `rem`.
- **Radios con propósito:** 2 px en etiquetas, 6 px en botones y avatares, 12 px en tarjetas y header.
- **Contraste:** los colores neón se usan como relleno o sobre fondos oscuros. Sobre fondos claros hay versiones `*-ink` más oscuras que cumplen WCAG AA.

---

## 🗂️ Scaffolding (estructura del proyecto)

```
awsbg-web/
├── index.html                  # Landing (página principal)
├── lanzamiento.html            # Página del evento
├── 404.html                    # GitHub Pages la usa automáticamente
├── .nojekyll                   # GitHub Pages sirve los archivos tal cual
├── .editorconfig               # Formato consistente en cualquier editor
│
└── assets/
    ├── css/
    │   ├── main.css            # ⭐ ÚNICO punto de entrada: importa todo en orden
    │   ├── settings/
    │   │   └── tokens.css      # Variables: colores, tipografía, espaciado, tiempos
    │   ├── base/
    │   │   ├── base.css        # Reset, tipografía base, foco accesible
    │   │   └── layout.css      # Contenedor, secciones, encabezados de sección
    │   ├── components/         # Un archivo por bloque de UI
    │   │   ├── header.css      buttons.css   hero.css     pillars.css
    │   │   ├── process.css     stats.css     checklist.css benefits.css
    │   │   ├── team.css        ticket.css    join.css     footer.css
    │   │   └── lang-toggle.css snake.css  dialog.css
    │   ├── pages/
    │   │   ├── launch.css      # Exclusivo de lanzamiento.html
    │   │   └── 404.css
    │   ├── themes/
    │   │   └── themes.css      # Temas por sección, paleta AWS, patrones, mosaicos
    │   └── motion/
    │       └── motion.css      # Animaciones (siempre al final de la cascada)
    │
    ├── js/
    │   ├── main.js             # ⭐ Punto de entrada: inicializa los módulos en orden
    │   ├── modules/            # Un módulo = una responsabilidad
    │   │   ├── nav.js          # Header flotante, menú móvil, scroll-spy, píldora
    │   │   ├── theme.js        # Modo claro/oscuro
    │   │   ├── i18n.js         # Traducción ES ⇄ EN
    │   │   ├── motion.js       # Títulos por palabras, efectos de puntero, confeti
    │   │   ├── reveal.js       # Aparición al hacer scroll + contadores
    │   │   ├── pixels.js       # Mosaicos de píxeles + píxeles del hero
    │   │   ├── snake.js        # La serpiente 🐍
    │   │   ├── dialog.js       # Ventana modal compartida (<dialog>)
    │   │   ├── qr-zoom.js      # Ampliar los códigos QR
    │   │   └── launch.js       # Cuenta regresiva + menú de calendario (Google, Outlook, .ics)
    │   ├── data/
    │   │   └── mosaics.js      # Dibujos de píxeles (sprites)
    │   └── i18n/
    │       └── en.js           # Diccionario de inglés
    │
    └── img/
        ├── brand/              # Logo oficial, favicon, apple-touch-icon, og-image
        ├── icons/sprite.svg    # Todos los íconos en un sprite SVG
        ├── qr/                 # Códigos QR (Builder ID, Meetup)
        ├── team/               # Fotos del equipo optimizadas (4:5, .webp)
        └── speakers/           # Fotos de conferencistas
```

**Reglas del juego**

1. **Cada página HTML vive en la raíz** (`/nueva-pagina.html`), y todos los recursos van en `assets/`.
2. **Rutas siempre relativas** (`assets/...`), para que funcionen igual en local y en GitHub Pages.
3. **CSS:** el orden de la cascada lo define `main.css`. Nunca enlaces otro CSS desde el HTML.
4. **JS:** los módulos solo exportan una función `initX()` y `main.js` decide el orden.
5. **Datos fuera del código:** los sprites están en `data/` y las traducciones en `i18n/`.
6. **Mobile-first:** estilos base para móvil y `@media (min-width: …)` para crecer.

---

## 💻 Correr el proyecto en local

> Los ES modules requieren un servidor. Abrir el HTML con doble clic (`file://`) no carga el JavaScript.

```bash
npx serve .
```

Abre **http://localhost:3000**. También sirve la extensión *Live Server* de VS Code, o
`python -m http.server 3000`.

> 💡 **¿No ves las animaciones?** Revisa si tu sistema tiene "reducir movimiento" activado. En Windows:
> *Configuración → Accesibilidad → Efectos visuales → Efectos de animación*.
> El sitio respeta esa preferencia a propósito y se muestra estático.

---

## 🛠️ Guías rápidas de mantenimiento

<details>
<summary><b>👥 Poner los datos y fotos del equipo</b></summary>

1. Guarda la foto en `assets/img/team/rol.webp`, en proporción 4:5 y unos 480×600 px. Optimízala: las actuales pesan ~20 KB en WebP frente a ~600 KB en PNG.
2. En `index.html#equipo`, cambia `<span class="avatar__initials">01</span>` por:
   ```html
   <img src="assets/img/team/nombre-apellido.webp" alt="" width="400" height="500" loading="lazy">
   ```
3. Reemplaza "Nombre Apellido", el programa académico y los enlaces de LinkedIn/GitHub.
4. Si quieres que se vea en inglés, agrega el texto nuevo a `assets/js/i18n/en.js`.
</details>

<details>
<summary><b>🌐 Agregar o cambiar un texto traducido</b></summary>

El español vive en el HTML. El inglés vive en `assets/js/i18n/en.js` como
`'texto en español': 'English text'`.

- Si **cambias un texto en el HTML**, cambia también la clave en `en.js`. Si no, ese texto quedará en español al pasar a inglés.
- Los textos sin traducción (como los nombres propios) simplemente se quedan igual.
</details>

<details>
<summary><b>🎨 Cambiar el fondo o el color de una sección</b></summary>

- **Fondo de la sección:** agrega una clase a la `<section>`: `theme-ink`, `theme-navy`, `theme-green`, `theme-pink` o `theme-orange`. Sin clase, el fondo es claro.
- **Cuadrícula estilo AWS:** agrega `pattern-grid`.
- **Color de un elemento** (pilar, paso, beneficio, miembro, charla…): usa `data-tone="orange|purple|pink|green|blue"`.

Los botones, líneas y tarjetas se adaptan solos al tema.
</details>

<details>
<summary><b>🧩 Agregar un sprite de píxeles</b></summary>

1. Dibuja el sprite en `assets/js/data/mosaics.js` con letras: `o` naranja, `p` morado, `k` rosado, `g` verde, `b` azul, `i` tinta, `w` blanco y `.` vacío.
2. Colócalo en el HTML:
   ```html
   <div class="mosaic mosaic--tr" data-mosaic="heart" aria-hidden="true"></div>
   ```
   - Posiciones: `tr`, `tl`, `br`, `bl`.
   - Tamaño pequeño: `mosaic--sm`. Que flote: `mosaic--float`.
   - Color de acento para sprites con `x`: `data-color="g"`.
</details>

<details>
<summary><b>📄 Crear una página nueva</b></summary>

1. Copia `lanzamiento.html` como base, con el mismo `<head>`, header y footer.
2. Si necesita estilos propios, crea `assets/css/pages/mi-pagina.css` e impórtalo en `main.css`.
3. Agrega el enlace en el `<nav>` de **todas** las páginas.
</details>

<details>
<summary><b>📅 Cambiar los datos del evento</b></summary>

- Los textos visibles están en `index.html` (ticket) y en `lanzamiento.html`.
- La fecha, el lugar y la descripción del calendario `.ics` y de la cuenta regresiva están en `assets/js/modules/launch.js`, dentro del objeto `EVENT`.
</details>

---

## ♿ Accesibilidad y rendimiento

- HTML semántico (`header`, `nav`, `main`, `section`, `footer`) y enlace "Saltar al contenido".
- Navegación completa con teclado, con foco visible de 3 px.
- Contraste **WCAG AA** verificado con *axe-core* en modo claro y oscuro, en español y en inglés.
- `prefers-reduced-motion`: todo queda estático y legible, sin serpiente ni píxeles animados.
- La serpiente, los píxeles y la cinta animada son decorativos (`aria-hidden`), y la serpiente se puede pausar.
- Animaciones solo con `transform` y `opacity`. Los efectos que siguen el mouse solo se activan en dispositivos con mouse.
- Cero dependencias de JavaScript; las imágenes llevan `loading="lazy"`.

---

## 🌍 Despliegue

El sitio se publica con **GitHub Pages** desde la rama `main`:

1. *Settings → Pages → Source: Deploy from a branch*
2. Rama `main`, carpeta `/ (root)`
3. Cada push a `main` actualiza el sitio en unos minutos.

🔗 **https://aws-student-builder-group-escuela.github.io/awsbg-web/**

> Las presentaciones (`*.pptx`), `CLAUDE.md` y `.claude/` están en `.gitignore` y no se publican.

---

## 📝 Pendientes de contenido

Busca `TODO` en el HTML.

- [x] Fotos, nombres, roles y programas del equipo (AWS SBG Leader + 5 leads)
- [ ] Enlaces de **LinkedIn/GitHub** del equipo (opcional, en `.member__links`)
- [x] Fotos de los conferencistas
- [x] Link del evento en **Meetup**
- [x] Salón confirmado: **A-301**

---

<div align="center">

Hecho con 🩷 por estudiantes de la **Escuela Colombiana de Ingeniería Julio Garavito**

<sub>AWS es una marca de Amazon.com, Inc. o sus afiliadas. Este es un sitio de una comunidad estudiantil.</sub>

🟧🟪🟥🟩🟦

</div>
