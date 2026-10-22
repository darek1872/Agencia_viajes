import { defineConfig, loadEnv } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { site } from './src/site.config.js';
import { pages } from './src/pages.config.js';
import { createRenderer } from './scripts/templating.mjs';
import { buildSitemap, buildRobots, buildLlms, buildManifest } from './scripts/seo.mjs';

export default defineConfig(({ command, mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root, '');
  let siteUrl = (env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');

  if (command === 'build') {
    if (!siteUrl) throw new Error('Falta VITE_SITE_URL (URL pública definitiva, p. ej. https://www.tudominio.com). Define la variable en .env o en tu proveedor de hosting.');
    if (/localhost|127\.0\.0\.1|\.local\b/.test(siteUrl)) throw new Error(`VITE_SITE_URL apunta a un entorno de desarrollo (${siteUrl}). Usa la URL pública definitiva.`);
    if (!/^https:\/\//.test(siteUrl)) console.warn('⚠ VITE_SITE_URL no usa https://. En producción debe ser HTTPS.');
  }
  if (!siteUrl) siteUrl = 'http://localhost:5173';
  const indexing = env.VITE_ALLOW_INDEXING !== 'false';

  const builtImages = path.join(root, 'src/images.built.json');
  const images = fs.existsSync(builtImages) ? JSON.parse(fs.readFileSync(builtImages, 'utf8')) : null;
  const imagesFallback = JSON.parse(fs.readFileSync(path.join(root, 'src/images.manifest.json'), 'utf8'));
  const renderer = createRenderer({ root, site, pages, siteUrl, indexing, images, imagesFallback });

  const htmlTemplates = {
    name: 'html-templates',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const rel = path.relative(root, ctx.filename).split(path.sep).join('/');
        return renderer.render(html, rel);
      }
    },
    configureServer(server) {
      server.watcher.add([path.join(root, 'src/partials'), path.join(root, 'src/site.config.js'), path.join(root, 'src/pages.config.js')]);
      server.watcher.on('change', (f) => {
        if (/src[\\/](partials|site\.config|pages\.config)/.test(f)) server.ws.send({ type: 'full-reload' });
      });
    }
  };

  const seoFiles = {
    name: 'seo-files',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap({ pages, siteUrl, indexing }) });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots({ siteUrl, indexing }) });
      this.emitFile({ type: 'asset', fileName: 'site.webmanifest', source: buildManifest({ site }) });
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: buildLlms({ site, pages, siteUrl }) });
    }
  };

  const input = Object.fromEntries(
    pages.map((p) => [p.file.replace(/(^|\/)index\.html$|\.html$/, '') || 'main', path.resolve(root, p.file)])
  );

  return {
    appType: 'mpa',
    plugins: [htmlTemplates, seoFiles],
    build: {
      target: 'es2020',
      // Sin source maps públicos. BUILD_SOURCEMAP=true genera mapas "hidden" (sin referencia en el JS) para depuración privada.
      sourcemap: env.BUILD_SOURCEMAP === 'true' ? 'hidden' : false,
      cssCodeSplit: true,
      rollupOptions: {
        input,
        output: {
          // GSAP en su propio chunk: solo se descarga al cargar animations.js (carga diferida).
          manualChunks(id) { if (id.includes('node_modules/gsap')) return 'gsap'; }
        }
      }
    }
  };
});
