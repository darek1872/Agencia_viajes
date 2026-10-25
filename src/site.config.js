/**
 * DATOS DE EMPRESA — único sitio donde se editan.
 *
 * MODO DEMOSTRACIÓN (demo: true): identidad y datos de contacto FICTICIOS para presentar la web a clientes.
 *  - El sitio no se indexa por defecto (noindex + robots Disallow) y el JSON-LD no publica datos de contacto.
 *  - Los datos legales NO se inventan: figuran como "Pendiente de completar" y las páginas legales se muestran como borrador.
 *
 * Para una web real: pon demo: false, sustituye todos los datos por los reales (incluidos los legales) y
 * pon legalReady: true. `npm run check:launch` falla mientras el sitio siga en modo demostración.
 */
const PENDIENTE = 'Pendiente de completar';

export const site = {
  lang: 'es',
  locale: 'es_ES',
  demo: true,
  legalReady: false,

  // Identidad (ficticia)
  name: 'Vientosur Viajes',
  legalName: `${PENDIENTE} (razón social)`,

  // Contacto de ejemplo con aspecto realista. En modo demo los botones de llamada, WhatsApp y correo NO abren nada
  // (muestran una ventana de demostración), así que nadie llama ni escribe a estos datos por error.
  phoneDisplay: '+34 912 345 678',
  phoneTel: '+34912345678',          // formato internacional sin espacios
  whatsapp: '34900000000',           // solo dígitos, con prefijo de país y sin "+"
  email: 'demo@vientosur.example',   // ".example" es un dominio reservado (RFC 2606)

  // Dirección de ejemplo (calle y código postal inexistentes)
  addressStreet: 'Calle de Ejemplo, 1',
  addressLocality: 'Madrid',
  addressRegion: 'Madrid',
  postalCode: '28000',
  country: 'ES',

  // Horario de atención (texto visible) y, opcionalmente, estructurado para JSON-LD.
  hoursText: 'Lun-Vie 9:30 - 19:00',
  // Ejemplo: [{ days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:30', closes: '19:00' }]
  openingHours: [],

  // Redes sociales: deja '' para ocultar el enlace.
  instagram: '',
  facebook: '',

  // Datos legales: NO inventados. Una agencia de viajes en España debe mostrar los reales antes de publicar.
  legal: {
    cif: PENDIENTE,
    registroMercantil: PENDIENTE,
    titulo: PENDIENTE,
    seguro: PENDIENTE,
    dpoEmail: 'demo@vientosur.example'
  },
  formProvider: 'pendiente de configurar (modo demostración: no se envía ningún dato)'
};
