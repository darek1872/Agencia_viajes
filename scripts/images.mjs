/**
 * Descarga las imágenes del diseño de Stitch (URLs temporales de Google), las recorta y las exporta a WebP
 * responsive en public/img, y escribe src/images.built.json (lo que lee la plantilla).
 *
 * Uso:  npm run images
 * Para usar TUS fotos: guarda design/images/<nombre>.jpg|png|webp (p. ej. design/images/hero.jpg) y vuelve a ejecutarlo.
 * Las fotos de Stitch son de ejemplo: comprueba que tienes derechos de uso o sustitúyelas antes de publicar.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/images.manifest.json'), 'utf8'));
const outDir = path.join(root, 'public/img');
const localDir = path.join(root, 'design/images');
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (f.endsWith('.webp')) fs.unlinkSync(path.join(outDir, f));

async function source(item) {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const p = path.join(localDir, `${item.name}.${ext}`);
    if (fs.existsSync(p)) return fs.readFileSync(p);
  }
  const res = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const built = []; const failed = [];
for (const item of manifest) {
  try {
    const buf = await source(item);
    const files = [];
    for (const w of item.widths) {
      const h = Math.round((w * item.ratioH) / item.ratioW);
      const out = await sharp(buf).resize(w, h, { fit: 'cover', position: 'attention' }).webp({ quality: item.name === 'hero' ? 74 : 76, effort: 5 }).toBuffer();
      const hash = crypto.createHash('sha1').update(out).digest('hex').slice(0, 8);
      const file = `${item.name}-${w}.${hash}.webp`;
      fs.writeFileSync(path.join(outDir, file), out);
      files.push({ w, url: `/img/${file}`, bytes: out.length });
    }
    const max = item.widths.at(-1);
    built.push({ name: item.name, width: max, height: Math.round((max * item.ratioH) / item.ratioW), files });
    console.log(`✔ ${item.name}: ${files.map((f) => `${f.w}w ${(f.bytes / 1024).toFixed(0)}KB`).join(', ')}`);
  } catch (e) {
    failed.push(item.name);
    console.error(`✖ ${item.name}: ${e.message}. Guarda tu imagen en design/images/${item.name}.jpg y repite.`);
  }
}
fs.writeFileSync(path.join(root, 'src/images.built.json'), JSON.stringify(built, null, 2));
if (failed.length) { console.error(`\n${failed.length} imagen(es) sin procesar: ${failed.join(', ')}`); process.exit(1); }
console.log(`\nListo: ${built.length} imágenes en public/img`);
