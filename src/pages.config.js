/** Metadatos SEO por página. Cada página tiene título, description y H1 propios (el H1 vive en su HTML). */
export const pages = [
  {
    file: 'index.html', path: '/', schema: 'WebPage', priority: '1.0', changefreq: 'weekly',
    title: 'Agencia de viajes a medida | {{site.name}}',
    description: 'Organizamos viajes a medida: paquetes, circuitos, cruceros y escapadas con asesor personal. Pide tu presupuesto gratis y sin compromiso.',
    ogImage: '/og/og-default.jpg', ogImageAlt: 'Viajes a medida con asesor personal', preloadHero: true
  },
  {
    file: 'contacto/index.html', path: '/contacto/', schema: 'ContactPage', priority: '0.8', changefreq: 'yearly',
    title: 'Contacto y presupuesto de viaje | {{site.name}}',
    description: 'Habla con un asesor por teléfono, WhatsApp o correo, o solicita tu presupuesto de viaje sin compromiso. Te ayudamos a planificar tu viaje.',
    ogImage: '/og/og-default.jpg', ogImageAlt: 'Contacto con nuestro equipo de viajes', navContacto: true,
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Contacto', path: '/contacto/' }]
  },
  {
    file: 'aviso-legal/index.html', path: '/aviso-legal/', schema: 'WebPage', priority: '0.3', changefreq: 'yearly',
    title: 'Aviso legal | {{site.name}}',
    description: 'Información legal del titular de este sitio web, condiciones de uso y datos de la agencia de viajes.',
    ogImage: '/og/og-default.jpg', ogImageAlt: 'Aviso legal',
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Aviso legal', path: '/aviso-legal/' }]
  },
  {
    file: 'privacidad/index.html', path: '/privacidad/', schema: 'WebPage', priority: '0.3', changefreq: 'yearly',
    title: 'Política de privacidad | {{site.name}}',
    description: 'Cómo tratamos tus datos personales cuando solicitas un presupuesto, nos escribes o te suscribes a nuestras novedades.',
    ogImage: '/og/og-default.jpg', ogImageAlt: 'Política de privacidad',
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Política de privacidad', path: '/privacidad/' }]
  },
  {
    file: 'cookies/index.html', path: '/cookies/', schema: 'WebPage', priority: '0.3', changefreq: 'yearly',
    title: 'Política de cookies | {{site.name}}',
    description: 'Información sobre las cookies y tecnologías de almacenamiento que utiliza este sitio web.',
    ogImage: '/og/og-default.jpg', ogImageAlt: 'Política de cookies',
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Política de cookies', path: '/cookies/' }]
  },
  {
    file: '404.html', path: '/404.html', schema: 'WebPage', sitemap: false, robots: 'noindex, follow',
    title: 'Página no encontrada | {{site.name}}',
    description: 'La página que buscas no existe o ha cambiado de dirección. Vuelve al inicio o pide tu presupuesto de viaje.',
    ogImage: '/og/og-default.jpg', ogImageAlt: 'Página no encontrada', canonical: false
  }
];
