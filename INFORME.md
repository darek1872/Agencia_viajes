# Informe de conversión

## Qué se encontró
El zip **no contenía un proyecto React/Vite**: eran 2 archivos `code.html` (escritorio y móvil), capturas de 233×1600 px y un `DESIGN.md`. Por eso no había que "quitar la marca de Vite/React"; en su lugar se creó una base Vite + Tailwind real (HTML estático por plantillas, sin React: la web no necesita estado de cliente y el HTML estático es lo mejor para SEO).

## Errores encontrados y estado
| Problema | Estado |
|---|---|
| Tailwind por CDN (`cdn.tailwindcss.com`, script en runtime, no apto para producción) | ✅ Compilado con PostCSS (CSS final ≈ 7 KB gzip) |
| Iconos Material Symbols y 2 fuentes desde Google (peso alto, privacidad) | ✅ Sprite SVG propio inline; fuentes autoalojadas (`@fontsource`) |
| Imágenes en URLs temporales de Google | ⚠️ Script `npm run images` las localiza y optimiza; **no pude ejecutarlo (sin red)** |
| Todos los `href="#"`, botones, selector idioma/moneda, avatar, tarjetas sin enlace | ✅ Enlaces reales o eliminados (sin función) |
| Formularios y buscador solo visuales | ✅ Envío real vía endpoint configurable, validación, estados cargando/éxito/error, honeypot, consentimiento RGPD. ⚠️ Necesita tu endpoint |
| Tag `viewport` con `user-scalable=no` (móvil) | ✅ Eliminado |
| Scrollbars ocultas globalmente | ✅ Restauradas |
| Contraste: texto blanco sobre coral `#F65430` = 3,37:1 (suspende AA) | ✅ Botones a `#D63A1A` (4,69:1). Único cambio de color; el coral original sigue en acentos |
| Placeholder gris `#74777f` (4,48:1) | ✅ `slate-500` (4,76:1) |
| Sin `title` único, description, canonical, OG, JSON-LD, favicon, 404, sitemap, robots, llms | ✅ Todo implementado y verificado |
| Menú hamburguesa móvil sin función; menú de escritorio oculto bajo 1280 px | ✅ Menú accesible (aria-expanded, Esc, foco) |
| Imágenes de fondo CSS (sin alt, sin lazy, sin dimensiones) | ✅ `<img>` con alt, `srcset`, width/height, lazy; hero con preload y `fetchpriority` |
| `H4` sin `H3` previo; sin jerarquía | ✅ Un H1 por página, H2/H3 correctos |
| Contenido inventado: precios, descuentos, "plazas limitadas", cuentas atrás falsas, valoraciones 4,9, 14.500 viajeros, reseñas, IATA/CEAV/CICMA, aerolíneas "partner", cuentas de Instagram, guía gratuita, "mejor precio garantizado", "24/7", seguro 1.000.000 €, "pago SSL 256 bits" | ✅ Eliminado o sustituido por marcadores `[[…]]` (ver pendientes) |
| Datos de ejemplo prefijados en el buscador (Madrid, 15–25 oct, 2 adultos) y "Temporada 2025" | ✅ Eliminados |
| Secciones sin base real: testimonios, galería de Instagram, blog, banner de oferta | ✅ Retiradas (no se publican reseñas ni posts falsos) |

## Optimizaciones
Tailwind compilado y purgado; sin fuentes/iconos/scripts de terceros (la web no hace ninguna petición a otros dominios salvo el endpoint de formularios); imágenes WebP responsive con hash para caché inmutable; GSAP en chunk propio cargado de forma diferida y **no cargado** con `prefers-reduced-motion`; `sourcemap: false`; cabeceras de seguridad y CSP; `main.css` ≈ 6,9 KB y `ui.js` ≈ 2,3 KB gzip (medido). El peso de GSAP+ScrollTrigger no pude medirlo (ver limitaciones).

## Animaciones (GSAP)
Entrada del hero, zoom suave de la imagen, revelado de imágenes con `clip-path`, aparición de secciones, tarjetas escalonadas, parallax sutil del hero (solo ≥768 px), microinteracciones CSS en botones/tarjetas. `gsap.matchMedia()` gestiona reduced-motion y limpieza (`pagehide`). Sin Lenis: el scroll nativo es más accesible y evita conflictos con ScrollTrigger. Si GSAP no carga, un fallback CSS revela el contenido (verificado).

## Pruebas realizadas (en este entorno)
Con el mismo motor de plantillas, Tailwind 3.4.19 y esbuild, sobre un dist de prueba servido en Chromium 141:
- `verify-dist`: 6 páginas, **0 errores** (title/description únicos, 1 H1, canonical absolutos, OG/Twitter, JSON-LD válido sin marcadores, migas = BreadcrumbList, alt, nombres accesibles, enlaces y anclas internas, sin localhost/HTTP, sitemap = canonicals, robots con sitemap).
- Sin desbordes horizontales a 390, 820 y 1440 px; 0 errores/avisos de consola.
- Menú móvil, Esc, buscador→formulario con prefill, tarjetas→formulario, validación, envío OK y error (mock), 404 con **estado HTTP 404** (servidor de prueba), reduced-motion y fallback sin GSAP.

## Limitaciones reales (no verificado)
Este entorno **no tiene acceso a internet**, así que **no he ejecutado**: `npm install`, `vite build`, `npm run images`, ni nada con GSAP/ScrollTrigger (animaciones sin probar visualmente ni medido su peso). Las capturas usaron imágenes de color de relleno. No hay Lighthouse/PageSpeed: **no te doy puntuaciones**. El `vite.config.js` y `src/animations.js` solo han pasado comprobación de sintaxis. Ejecuta `npm install && npm run images && npm run build` y revisa la salida antes de publicar; si algo falla, es lo primero que habría que corregir. Los textos legales son una base, no asesoramiento jurídico. La marca provisional (favicon, imagen social) es genérica.

## Pendiente antes de publicar (datos que debes darme / completar)
1. Nombre comercial, razón social, CIF, Registro Mercantil, título-licencia de agencia y seguro/garantía (`site.config.js`).
2. Teléfono, WhatsApp (con prefijo), correo, dirección, horario; Instagram/Facebook si existen.
3. Contenido real de "Ofertas destacadas" (4 viajes: nombre, duración, descripción, precio) y de las 5 FAQ (pago, cancelación, visados, seguros, asistencia).
4. Correo para ejercer derechos RGPD, proveedor de formularios, plazos de conservación, jurisdicción; revisión legal de aviso legal/privacidad/cookies.
5. Logo y fotos propias (o confirmar licencia de las de Stitch); regenerar favicon e imagen social (`public/og/og-default.jpg`, 1200×630) con tu marca.
6. Endpoint de formularios real + dominio + DNS + HTTPS (ver README). Si añades analítica o mapas, actualiza cookies y añade banner de consentimiento.
7. Decidir si hay oficina física: si no, deja la dirección con marcadores (el JSON-LD usará `Organization` en vez de `TravelAgency`).
8. Textos de servicio que dejé como propuesta y debes confirmar que son ciertos: asesor personal, apoyo ante imprevisto, presupuestos transparentes, "te respondemos lo antes posible".
9. Si tienes reseñas reales, aval o blog, se pueden reincorporar con el mismo diseño.
10. Páginas por categoría (Paquetes, Circuitos, Cruceros, Escapadas) no existían en el diseño: hoy llevan al formulario con el tipo preseleccionado. Crearlas con contenido real mejoraría el SEO.
