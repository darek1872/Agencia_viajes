import './styles.css';
import { initUI } from './ui.js';

initUI();

// GSAP se descarga en un chunk aparte y solo si el usuario no pide movimiento reducido.
// Si falla la carga, el CSS revela el contenido por sí solo (ver styles.css).
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  import('./animations.js').catch((err) => console.warn('Animaciones no disponibles:', err));
}
