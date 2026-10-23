# Web de la agencia de viajes

Diseño de Google Stitch convertido en un sitio estático (Vite + Tailwind + GSAP). El diseño original se conserva intacto en `design/stitch-original/`.

> **Estado:** el código está terminado, pero **no se puede publicar todavía**: faltan datos reales de la empresa, imágenes propias/procesadas, endpoint de formularios y dominio. Ver `INFORME.md` (sección "Pendiente antes de publicar").

## 1. Ejecutar en local

Requisitos: Node.js ≥ 18.18.

```bash
npm install
npm run images        # descarga y optimiza las imágenes (WebP responsive) -> public/img + src/images.built.json
cp .env.example .env  # y edita los valores
npm run dev           # http://localhost:5173
```

- Si una URL de imagen de Stitch ha caducado, guarda tu foto como `design/images/<nombre>.jpg` (nombres en `src/images.manifest.json`; las mayúsculas no importan) y repite `npm run images`.
- **Recomendado:** ejecuta `npm run images` en local, comprueba el resultado y sube a GitHub `design/images/`, `public/img/` y `src/images.built.json`. Así el despliegue no depende de enlaces externos que puedan caducar.
- `npm run build` ya ejecuta `node scripts/images.mjs --if-missing`: si las imágenes procesadas existen las reutiliza; si faltan intenta generarlas; si no puede, **falla con un mensaje claro** (nunca publica sin imágenes).
- Los datos de empresa se editan en **`src/site.config.js`**. Los textos `[[entre dobles corchetes]]` son marcadores a sustituir (también en `index.html`).

## 2. Compilar y comprobar

```bash
VITE_SITE_URL=https://www.tudominio.com npm run build   # genera dist/ y ejecuta la verificación automática
npm run check:launch                                      # modo estricto: falla si quedan marcadores o falta el endpoint de formularios
npm run preview
```

`npm run build` falla si falta `VITE_SITE_URL` o apunta a localhost. Genera además `sitemap.xml`, `robots.txt`, `llms.txt` y `site.webmanifest` con esa URL.

## 3. Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_SITE_URL` | URL pública sin barra final (canonical, sitemap, Open Graph, JSON-LD). **Obligatoria** al compilar. |
| `VITE_FORM_ENDPOINT` | Endpoint real de formularios (Formspree, Web3Forms, Getform…). Sin él los formularios muestran un aviso y ofrecen WhatsApp/correo; **no simulan el envío**. |
| `VITE_FORM_ACCESS_KEY` | Solo Web3Forms. |
| `VITE_ALLOW_INDEXING` | `false` en staging: `noindex` + `robots.txt` con `Disallow: /`. |
| `BUILD_SOURCEMAP` | `true` genera source maps "hidden" para depuración privada (no los subas). |

Si usas un servicio de formularios distinto de Formspree/Web3Forms, añade su dominio a `connect-src` de la CSP (`public/_headers`, `vercel.json`).

## 4. Desplegar con dominio propio

Es un sitio estático: publica la carpeta `dist/`. Define `VITE_SITE_URL` y `VITE_FORM_ENDPOINT` **en el panel del proveedor** (build command: `npm run build`, que ya genera las imágenes si faltan; output: `dist`).

**Netlify / Cloudflare Pages:** conecta el repositorio; `public/_headers` aplica cabeceras y caché. Sirven `404.html` con estado 404 automáticamente (no actives el "SPA fallback").
**Vercel:** framework "Vite"; `vercel.json` incluye cabeceras y `trailingSlash`. `404.html` se sirve con 404.
**Apache/cPanel:** sube el contenido de `dist/`; `public/.htaccess` (copiado a `dist/`) fuerza HTTPS, un único host y `ErrorDocument 404`. Edita el dominio dentro del archivo.

**DNS (según proveedor; verifica siempre los valores en su panel):**
- Dominio raíz (`tudominio.com`): registros `A`/`ALIAS`/`ANAME` que indique el proveedor (Netlify: `A 75.2.60.5` o su balanceador actual; Vercel: `A 76.76.21.21`; Cloudflare Pages: `CNAME` a `<proyecto>.pages.dev` con el proxy de Cloudflare).
- `www`: `CNAME` a `<sitio>.netlify.app` / `cname.vercel-dns.com` / `<proyecto>.pages.dev`.
- Elige **una** versión canónica (con o sin `www`) y redirige la otra con 301 desde el proveedor; `VITE_SITE_URL` debe coincidir con la elegida.
- HTTPS: el proveedor emite el certificado (Let's Encrypt) cuando el DNS propaga (minutos a 48 h). Activa "Forzar HTTPS".
- Correo: si usas correo del dominio, conserva los registros `MX`, `SPF` (TXT) y `DKIM` existentes.

Después de publicar: envía el sitemap en Google Search Console y Bing Webmaster Tools, y prueba un formulario real.

## 5. Estructura

```
index.html, contacto/, aviso-legal/, privacidad/, cookies/, 404.html   páginas
src/partials/        cabecera, pie, formularios (plantillas reutilizables)
src/site.config.js   datos de empresa (marcadores)
src/pages.config.js  title, description, canonical, breadcrumb por página
src/ui.js            menú, buscador, formularios
src/animations.js    GSAP + ScrollTrigger (chunk diferido)
scripts/             plantillas, SEO, imágenes, verificación
public/              favicon, og, headers, .htaccess
design/              original de Stitch (referencia)
```
