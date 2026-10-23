/**
 * Procesa las imágenes del sitio -> WebP responsive en public/img y escribe src/images.built.json
 * (lo que lee la plantilla en `vite build`).
 *
 *   npm run images                 regenera todo (descarga/lee las fuentes y vuelve a procesar)
 *   node scripts/images.mjs --if-missing
 *                                  solo procesa si falta algo; es lo que ejecuta `npm run build`,
 *                                  así el despliegue (Vercel, Netlify...) funciona sin pasos manuales.
 *
 * Origen de cada imagen (por orden de prioridad):
 *   1) Tu archivo en design/images/<nombre>.jpg|jpeg|png|webp|avif  (no distingue mayúsculas: Hero.JPG vale)
 *   2) La URL de Stitch indicada en src/images.manifest.json (enlaces temporales de Google: pueden caducar)
 * Recomendado: ejecutarlo en local, comprobar el resultado y subir a GitHub public/img y src/images.built.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = process.cwd();
const ifMissing = process.argv.includes('--if-missing');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/images.manifest.json'), 'utf8'));
const publicDir = path.join(root, 'public');
const outDir = path.join(publicDir, 'img');
const localDir = path.join(root, 'design', 'images');
const builtPath = path.join(root, 'src/images.built.json');

function alreadyBuilt() {
  if (!fs.existsSync(builtPath)) return false;
  try {
    const built = JSON.parse(fs.readFileSync(builtPath, 'utf8'));
    return manifest.every((m) => {
      const e = built.find((b) => b.name === m.name);
      return e && e.files.length === m.widths.length && e.files.every((f) => fs.existsSync(path.join(publicDir, f.url)));
    });
  } catch { return false; }
}

if (ifMissing && alreadyBuilt()) {
  console.log('Imágenes ya procesadas: se omite (usa "npm run images" para regenerarlas).');
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (f.endsWith('.webp')) fs.unlinkSync(path.join(outDir, f));

const EXTS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
function findLocal(name) {
  if (!fs.existsSync(localDir)) return null;
  for (const f of fs.readdirSync(localDir)) {
    const m = f.match(/^(.+)\.([A-Za-z0-9]+)$/);
    if (m && m[1].toLowerCase() === name.toLowerCase() && EXTS.includes(m[2].toLowerCase())) return path.join(localDir, f);
  }
  return null;
}

async function download(url) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; image-build)' }, redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get('content-type') || '';
      if (!type.startsWith('image/')) throw new Error(`la respuesta no es una imagen (${type || 'sin tipo'})`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) throw new Error('imagen vacía o demasiado pequeña');
      return buf;
    } catch (e) { lastErr = e; if (attempt < 3) await new Promise((r) => setTimeout(r, 800 * attempt)); }
  }
  throw lastErr;
}

async function source(item) {
  const local = findLocal(item.name);
  if (local) return { buf: fs.readFileSync(local), from: `archivo ${path.relative(root, local)}` };
  return { buf: await download(item.url), from: 'URL de Stitch' };
}

const built = []; const failed = [];
for (const item of manifest) {
  try {
    const { buf, from } = await source(item);
    const files = [];
    for (const w of item.widths) {
      const h = Math.round((w * item.ratioH) / item.ratioW);
      const out = await sharp(buf).rotate().resize(w, h, { fit: 'cover', position: 'attention' }).webp({ quality: item.name === 'hero' ? 74 : 76, effort: 5 }).toBuffer();
      const hash = crypto.createHash('sha1').update(out).digest('hex').slice(0, 8);
      const file = `${item.name}-${w}.${hash}.webp`;
      fs.writeFileSync(path.join(outDir, file), out);
      files.push({ w, url: `/img/${file}`, bytes: out.length });
    }
    const max = item.widths.at(-1);
    built.push({ name: item.name, width: max, height: Math.round((max * item.ratioH) / item.ratioW), files });
    console.log(`✔ ${item.name} (${from}): ${files.map((f) => `${f.w}w ${(f.bytes / 1024).toFixed(0)}KB`).join(', ')}`);
  } catch (e) {
    failed.push(item.name);
    console.error(`✖ ${item.name}: ${e.message}`);
  }
}

if (failed.length) {
  console.error(`\nNo se pudieron procesar ${failed.length} imagen(es): ${failed.join(', ')}`);
  console.error('Los enlaces de Stitch son temporales y pueden haber caducado. Solución:');
  console.error('  1) Guarda tus fotos en la carpeta design/images/ con estos nombres: ' + failed.map((n) => `${n}.jpg`).join(', '));
  console.error('  2) Ejecuta en local: npm run images');
  console.error('  3) Sube a GitHub: design/images, public/img y src/images.built.json');
  // No se escribe un images.built.json incompleto: así un fallo nunca se confunde con un éxito.
  if (fs.existsSync(builtPath)) fs.unlinkSync(builtPath);
  process.exit(1);
}
fs.writeFileSync(builtPath, JSON.stringify(built, null, 2));
console.log(`\nListo: ${built.length} imágenes procesadas en public/img`);
