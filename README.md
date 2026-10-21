# Portfolio — Francisco (@wbtt2)

Portafolio personal publicado con **GitHub Pages** en → **https://wbtt2.github.io**

Sitio estático: HTML + CSS + JS puro, sin dependencias y sin build step.

## Estilo

Terminal plano, paleta **Tokyo Night**. Sin sombras, sin glows, sin gradientes:
bordes de 1px, monoespaciada y tipografía orientada a contenido técnico.

| Capa | Tecnología |
| :--- | :--- |
| Estructura | HTML5 semántico, una sola página |
| Estilos | CSS3 con custom properties, sin framework |
| Interactividad | Vanilla JS |
| Resaltado | Highlighter propio en `main.js` (sin librerías) |
| Hosting | GitHub Pages (`main` → `/`) |
| Deploy | Automático en cada push a `main` |

## Estructura

```
.
├── index.html                     # página única (todas las secciones)
├── .nojekyll                      # desactiva Jekyll en Pages
├── .gitignore
└── assets/
    ├── css/style.css              # tema terminal plano
    ├── js/main.js                 # nav, scroll-spy, filtros, lightbox, resaltado
    └── img/                       # capturas de proyectos y galería
```

## Secciones

| # | Sección | Notas |
| :-- | :--- | :--- |
| 01 | `perfil` | Bio, datos y servicios |
| 02 | `experiencia` | Timeline en formato *git log* |
| 03 | `stack` | Tablas de lenguajes, datos y nubes |
| 04 | `proyectos` | Lista de repos con filtros y miniaturas |
| 05 | `galería` | Capturas con lightbox |
| 06 | `código` | Fragmentos reales de HubCore, Lumen, Morgan, Nobody y Pipeline |
| 07 | `contacto` | GitHub, Discord y email |

## Código mostrado

Los fragmentos de la sección `código` son **literales** de los repositorios de
`Centry-Org` (privados). Para actualizar un fragmento hay que copiar el archivo
real desde el repo y pegarlo entre `<code class="lang-kotlin">` / `<code class="lang-java">`.

| Pestaña | Archivo de origen |
| :--- | :--- |
| HubCore | `hub/scoreboard/HubScoreboard.kt`, `hub/nametag/HubNameTagProvider.kt` |
| Lumen | `lumen/command/CommandManager.kt` |
| Morgan | `morgan/cache/RedisCache.kt` |
| Nobody | `nobody/compat/menu/Menu.java` |
| Pipeline | `pipeline/limiter/PacketLimiter.java` |

## Editar contenido

Todo el contenido editable está en `index.html`:

- **Nombre y título** → `<title>` y el `<h1>` del hero.
- **Foto de perfil** → `assets/img/avatar.png` (por defecto es el avatar de GitHub).
- **Proyectos** → filas `.repo` dentro de `#repos`.
  `data-c` controla el filtro: `plugin`, `lib`, `sec`, `core`.
  `data-lb` + `data-cap` controlan la miniatura y el pie de la galería.
- **Capturas** → `assets/img/`. Los recortes usan `object-position: top left`
  para no perder la parte superior de la interfaz.
- **Contacto** → atributo `data-copy` de cada botón en `#contacto`.

## Publicar cambios

```bash
git add -A
git commit -m "docs: actualiza el portafolio"
git push origin main
```

GitHub Pages reconstruye y publica el sitio automáticamente en cada push a `main`.

## Activar Pages (si es la primera vez)

`Settings` → `Pages` → `Build and deployment` → **Source: Deploy from a branch**,
**Branch: `main` / `/ (root)`**.
