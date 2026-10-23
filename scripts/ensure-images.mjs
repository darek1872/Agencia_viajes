/**
 * Garantiza que existan las imágenes procesadas ANTES de que Vite lea src/images.built.json.
 * Lo llama vite.config.js al compilar, así `vite build` funciona aunque el comando de build
 * de Vercel (o de otro hosting) no ejecute `npm run images`. Si ya están generadas, no hace nada.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';

export function ensureImages(root) {
  const r = spawnSync(process.execPath, [path.join(root, 'scripts/images.mjs'), '--if-missing'], { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) {
    throw new Error(
      'No se pudieron preparar las imágenes (mira los mensajes "✖" de arriba). ' +
      'Guarda tus fotos en design/images/ (hero.jpg, viaje-1.jpg...), ejecuta "npm run images" en local ' +
      'y sube a GitHub design/images, public/img y src/images.built.json.'
    );
  }
}
