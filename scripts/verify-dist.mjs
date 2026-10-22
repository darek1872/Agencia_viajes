/**
 * Verificación de la compilación (sin dependencias): node scripts/verify-dist.mjs dist [--strict]
 * Comprueba SEO técnico, enlaces internos, anclas, JSON-LD, imágenes, contenido mixto, localhost,
 * robots/sitemap/llms y peso del JS. --strict añade: sin marcadores [[...]] y endpoint de formularios definido.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const dist = path.resolve(args.find((a) => !a.startsWith('--')) || 'dist');
const errors = []; const warns = [];
const err = (m) => errors.push(m); const warn = (m) => warns.push(m);
const rd = (p) => fs.readFileSync(p, 'utf8');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
if (!fs.existsSync(dist)) { console.error(`No existe ${dist}. Ejecuta antes: npm run build`); process.exit(1); }

const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
for (const need of ['index.html', '404.html', 'robots.txt', 'sitemap.xml', 'llms.txt', 'favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'site.webmanifest', 'og/og-default.jpg']) {
  if (!fs.existsSync(path.join(dist, need))) err(`Falta ${need}`);
}
const urlToFile = (u) => {
  const clean = decodeURIComponent(u.split('#')[0].split('?')[0]);
  const p = path.join(dist, clean);
  if (clean.endsWith('/')) return path.join(p, 'index.html');
  if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  if (fs.existsSync(path.join(p, 'index.html'))) return path.join(p, 'index.html');
  return p;
};
const attr = (tag, name) => (tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i')) || [])[1];
const ids = {}; const pages = {};
for (const f of htmlFiles) {
  const h = rd(f); const rel = '/' + path.relative(dist, f).split(path.sep).join('/');
  pages[rel] = h; ids[f] = new Set([...h.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
}

const titles = new Map(); const descs = new Map(); const canon = {};
let siteOrigin = '';
for (const [rel, h] of Object.entries(pages)) {
  const tag = (re) => (h.match(re) || [])[0] || '';
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1];
  const metaTag = (n, key = 'name') => tag(new RegExp(`<meta[^>]*\\b${key}="${n}"[^>]*>`));
  const desc = attr(metaTag('description'), 'content');
  const robots = attr(metaTag('robots'), 'content') || '';
  const is404 = rel === '/404.html';
  if (!title) err(`${rel}: sin <title>`); else { if (title.length > 65) warn(`${rel}: título largo (${title.length})`); (titles.get(title) || titles.set(title, []).get(title)).push(rel); }
  if (!desc) err(`${rel}: sin meta description`); else { if (desc.length > 170) warn(`${rel}: description larga (${desc.length})`); (descs.get(desc) || descs.set(desc, []).get(desc)).push(rel); }
  const h1s = (h.match(/<h1[\s>]/g) || []).length; if (h1s !== 1) err(`${rel}: ${h1s} <h1> (debe haber exactamente 1)`);
  const lang = h.match(/<html[^>]*\blang="([^"]+)"/); if (!lang) err(`${rel}: <html> sin lang`);
  const c = attr(tag(/<link[^>]*rel="canonical"[^>]*>/), 'href');
  if (is404) { if (c) err('404.html no debe tener canonical'); if (!/noindex/.test(robots)) err('404.html debe llevar noindex'); }
  else {
    if (!c) err(`${rel}: sin canonical`); else if (!/^https?:\/\//.test(c)) err(`${rel}: canonical no absoluto (${c})`); else {
      canon[rel] = c; siteOrigin ||= new URL(c).origin;
      const expect = rel.replace(/index\.html$/, '');
      if (new URL(c).pathname !== expect) err(`${rel}: canonical apunta a ${new URL(c).pathname}, se esperaba ${expect}`);
    }
    if (/noindex/.test(robots) && !args.includes('--allow-noindex')) warn(`${rel}: lleva noindex (¿VITE_ALLOW_INDEXING=false? válido solo para staging)`);
  }
  for (const [k, key] of [['og:title', 'property'], ['og:description', 'property'], ['og:image', 'property'], ['og:type', 'property'], ['twitter:card', 'name'], ['twitter:image', 'name']]) {
    const m = metaTag(k, key); if (!m) err(`${rel}: falta ${k}`);
    else if (/image$/.test(k) && !/^https?:\/\//.test(attr(m, 'content'))) err(`${rel}: ${k} no es URL absoluta`);
    if ((h.match(new RegExp(`${key}="${k}"`, 'g')) || []).length > 1) err(`${rel}: ${k} duplicado`);
  }
  if (!/<link[^>]*rel="icon"/.test(h)) err(`${rel}: sin favicon`);
  // JSON-LD
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!ld.length) err(`${rel}: sin JSON-LD`);
  for (const m of ld) {
    try {
      const j = JSON.parse(m[1]); const g = j['@graph'] || [j];
      if (!g.every((n) => n['@type'] && n['@id'])) err(`${rel}: nodo JSON-LD sin @type/@id`);
      if (/\[\[/.test(m[1])) err(`${rel}: JSON-LD contiene marcadores`);
      const bc = (h.match(/aria-label="Migas de pan"/) ? 1 : 0); const hasBcLd = g.some((n) => n['@type'] === 'BreadcrumbList');
      if (bc !== (hasBcLd ? 1 : 0)) err(`${rel}: migas visibles y BreadcrumbList no coinciden`);
    } catch (e) { err(`${rel}: JSON-LD inválido (${e.message})`); }
  }
  // Imágenes
  for (const t of h.match(/<img\b[^>]*>/g) || []) {
    if (attr(t, 'alt') === undefined) err(`${rel}: <img> sin alt: ${t.slice(0, 80)}`);
    if (!attr(t, 'width') || !attr(t, 'height')) warn(`${rel}: <img> sin width/height (CLS): ${attr(t, 'src')}`);
  }
  // Botones y enlaces con nombre accesible / destino real
  for (const m of h.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const inner = m[3].replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim();
    if (!inner && !/aria-label=/.test(m[2])) err(`${rel}: <${m[1]}> sin nombre accesible: ${m[2].slice(0, 70)}`);
    if (m[1] === 'a') { const hr = attr(`<a ${m[2]}>`, 'href'); if (!hr || hr === '#') err(`${rel}: enlace sin destino real`); }
  }
  // Enlaces/recursos internos y anclas
  for (const m of h.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(mailto:|tel:|data:|javascript:)/.test(u)) continue;
    if (/^http:\/\//.test(u) && !/^http:\/\/www\.w3\.org/.test(u)) err(`${rel}: recurso HTTP (contenido mixto): ${u}`);
    if (/localhost|127\.0\.0\.1/.test(u)) err(`${rel}: referencia a localhost: ${u}`);
    if (/^https?:\/\//.test(u)) { if (siteOrigin && u.startsWith(siteOrigin) && !/canonical|og:|twitter/.test('')) { /* absoluta propia: válida */ } continue; }
    if (u.startsWith('#')) { if (u.length > 1 && !ids[path.join(dist, rel)]?.has(u.slice(1))) err(`${rel}: ancla rota ${u}`); continue; }
    if (u.startsWith('/')) {
      const target = urlToFile(u);
      if (!fs.existsSync(target)) { err(`${rel}: enlace/recurso roto ${u}`); continue; }
      const hash = u.split('#')[1]; if (hash && target.endsWith('.html') && !ids[target]?.has(hash)) err(`${rel}: ancla rota ${u}`);
    }
  }
  if (/localhost|127\.0\.0\.1/.test(h)) err(`${rel}: referencias a localhost`);
}
for (const [t, r] of titles) if (r.length > 1) err(`Título duplicado en ${r.join(', ')}`);
for (const [t, r] of descs) if (r.length > 1) err(`Description duplicada en ${r.join(', ')}`);

// robots / sitemap / llms
if (fs.existsSync(path.join(dist, 'robots.txt'))) {
  const r = rd(path.join(dist, 'robots.txt'));
  if (/^Disallow:\s*\/\s*$/m.test(r)) warn('robots.txt bloquea todo el sitio (Disallow: /) — solo válido en staging');
  else if (!new RegExp(`^Sitemap:\\s*${siteOrigin}/sitemap.xml`, 'm').test(r)) err('robots.txt no señala el sitemap canónico');
}
if (fs.existsSync(path.join(dist, 'sitemap.xml'))) {
  const locs = [...rd(path.join(dist, 'sitemap.xml')).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const set = new Set(Object.values(canon));
  for (const l of locs) if (!set.has(l)) err(`sitemap: ${l} no coincide con ningún canonical`);
  for (const c of set) if (locs.length && !locs.includes(c)) err(`sitemap: falta ${c}`);
}
// Peso JS/CSS
const assets = files.filter((f) => /\.(js|css)$/.test(f));
console.log('\nPeso de assets (gzip):');
for (const f of assets) { const gz = zlib.gzipSync(fs.readFileSync(f)).length; console.log(`  ${path.relative(dist, f).padEnd(34)} ${(gz / 1024).toFixed(1)} KB`); }
const maps = files.filter((f) => f.endsWith('.map')); if (maps.length) warn(`${maps.length} source maps en dist (no los publiques)`);
if (assets.some((f) => /\.js$/.test(f) && fs.readFileSync(f, 'utf8').includes('sourceMappingURL'))) err('El JS contiene sourceMappingURL (source maps públicos)');

// Estricto
const markers = new Set();
for (const h of Object.values(pages)) for (const m of h.matchAll(/\[\[[^\]]+\]\]/g)) markers.add(m[0]);
if (markers.size) (strict ? err : warn)(`${markers.size} marcadores [[...]] pendientes de sustituir (src/site.config.js y HTML). Ejemplos: ${[...markers].slice(0, 4).join(' | ')}`);
if (strict) {
  const envFile = fs.existsSync('.env') ? rd('.env') : '';
  const ep = process.env.VITE_FORM_ENDPOINT || (envFile.match(/^VITE_FORM_ENDPOINT=(.+)$/m) || [])[1];
  if (!ep) err('Falta VITE_FORM_ENDPOINT: los formularios no enviarían nada');
}

console.log(`\nPáginas: ${Object.keys(pages).length} · Errores: ${errors.length} · Avisos: ${warns.length}`);
warns.forEach((w) => console.log('  ⚠', w));
errors.forEach((e) => console.log('  ✖', e));
process.exit(errors.length ? 1 : 0);
