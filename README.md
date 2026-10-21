# Portfolio — Francisco (@wbtt2)

Portafolio personal publicado con **GitHub Pages** en → **https://wbtt2.github.io**

Sitio estático (HTML + CSS + JS puro, sin dependencias ni build step).

## Stack del sitio

| Capa | Tecnología |
| :--- | :--- |
| Estructura | HTML5 semántico |
| Estilos | CSS3 (custom properties, grid, flexbox) |
| Interactividad | Vanilla JS (sin frameworks) |
| Hosting | GitHub Pages (`main` → `/`) |
| Deploy | Automático en cada push a `main` (build de rama) |

## Estructura

```
.
├── index.html                     # página única (todas las secciones)
├── .nojekyll                      # desactiva Jekyll en Pages
├── .gitignore
└── assets/
    ├── css/style.css              # tema dark tipo terminal
    ├── js/main.js                 # nav, scroll-spy, lightbox, filtros, tabs
    └── img/                       # capturas de proyectos y galería
```

## Secciones

1. **Hero** — presentación + terminal animada
2. **Perfil** — quién soy, stack y servicios
3. **Experiencia** — timeline de roles y proyectos
4. **Stack** — lenguajes, bases de datos y nubes
5. **Proyectos** — tarjetas filtrables (plugins, librerías, seguridad, cores)
6. **Galería** — lightbox con capturas
7. **Código** — snippets reales (Java, Kotlin, Python, SQL)
8. **Contacto** — GitHub, Discord, email

## Editar contenido

Todo el contenido editable está en `index.html`:

- **Nombre / título** → `<title>` y el bloque `<h1>` del hero.
- **Foto de perfil** → `assets/img/` (la web usa el avatar de GitHub por defecto;
  para usar una imagen local, cambia la `src` del `<img>` del hero).
- **Proyectos** → tarjetas `.proj` dentro de `.projects-grid`
  (`data-cat` controla el filtro: `plugin`, `library`, `security`, `core`).
- **Capturas** → `assets/img/`. Las imágenes de proyecto usan
  `object-position: top left` para no recortar la interfaz.
- **Datos de contacto** → los atributos `data-copy` de las tarjetas de contacto.

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
