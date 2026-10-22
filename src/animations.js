/**
 * Animaciones GSAP + ScrollTrigger (chunk diferido).
 * - gsap.matchMedia() gestiona prefers-reduced-motion y el ancho de pantalla, y revierte todo al salir.
 * - Los estados iniciales se crean ANTES de añadir `gsap-ready` (así no hay parpadeo) y las animaciones
 *   limpian sus estilos en línea al terminar.
 * - No se toca el scroll nativo (sin scroll hijacking). Lenis no se usa: el scroll nativo es más accesible y ligero.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;
const mm = gsap.matchMedia();

mm.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 768px)' }, (ctx) => {
  const { wide } = ctx.conditions;
  const once = (trigger, start = 'top 88%') => ({ trigger, start, once: true });

  // 1) Entrada del hero (secuencia única al cargar)
  const heroItems = gsap.utils.toArray('[data-hero]');
  if (heroItems.length) {
    gsap.fromTo(heroItems, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.05, clearProps: 'opacity,transform' });
    const heroImg = document.querySelector('[data-parallax] img');
    if (heroImg) gsap.fromTo(heroImg, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: 'power2.out', clearProps: 'transform' });
  }

  // 2) Revelado de imágenes con máscara (clip-path)
  gsap.utils.toArray('[data-img-reveal]').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.inOut', scrollTrigger: once(el), clearProps: 'clipPath' });
  });

  // 3) Aparición de cabeceras de sección
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', scrollTrigger: once(el, 'top 85%'), clearProps: 'opacity,transform' });
  });

  // 4) Tarjetas y listas escalonadas
  gsap.utils.toArray('[data-stagger]').forEach((box) => {
    gsap.from(box.children, { opacity: 0, y: 36, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: once(box, 'top 85%'), clearProps: 'opacity,transform' });
  });

  // 5) Parallax sutil del fondo del hero (solo pantallas anchas; en móvil se omite para cuidar el rendimiento)
  if (wide) {
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      gsap.to(el, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  // Todo preparado: se desactiva el estado inicial por CSS y el fallback.
  root.classList.add('gsap-ready');
  requestAnimationFrame(() => ScrollTrigger.refresh());
});

window.addEventListener('load', () => ScrollTrigger.refresh());
// Limpieza explícita (bfcache / navegación): revierte tweens y ScrollTriggers.
window.addEventListener('pagehide', () => mm.revert());
