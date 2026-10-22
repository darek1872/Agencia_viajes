/**
 * DATOS DE EMPRESA — único sitio donde se editan.
 * Todo valor con [[corchetes dobles]] es un MARCADOR pendiente de rellenar.
 * `npm run check:launch` falla mientras quede alguno (y también si falta algún dato obligatorio).
 * Los marcadores nunca se escriben en JSON-LD (se omiten las propiedades sin dato real).
 */
export const site = {
  lang: 'es',
  locale: 'es_ES',

  // Identidad
  name: '[[Nombre comercial]]',
  legalName: '[[Razón social]]',

  // Contacto (se muestra en cabecera, pie, página de contacto y barra móvil)
  phoneDisplay: '[[Teléfono, p. ej. 900 000 000]]',
  phoneTel: '[[+34900000000]]',          // formato internacional sin espacios: +34XXXXXXXXX
  whatsapp: '[[34600000000]]',           // solo dígitos, con prefijo de país y sin "+"
  email: '[[correo@tudominio.com]]',

  // Dirección física (déjala con marcadores si NO atiendes en oficina: se omite en JSON-LD)
  addressStreet: '[[Calle y número]]',
  addressLocality: '[[Localidad]]',
  addressRegion: '[[Provincia]]',
  postalCode: '[[Código postal]]',
  country: 'ES',

  // Horario de atención (texto visible) y, opcionalmente, estructurado para JSON-LD.
  hoursText: '[[Horario de atención, p. ej. Lun-Vie 9:30-19:00]]',
  // Ejemplo: [{ days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:30', closes: '19:00' }]
  openingHours: [],

  // Redes sociales: deja '' para ocultar el enlace.
  instagram: '',
  facebook: '',

  // Datos legales (aviso legal y pie). Una agencia de viajes en España debe mostrarlos.
  legal: {
    cif: '[[CIF/NIF]]',
    registroMercantil: '[[Datos de inscripción en el Registro Mercantil]]',
    titulo: '[[Título-licencia de agencia de viajes y organismo que lo emitió]]',
    seguro: '[[Aseguradora y nº de póliza de responsabilidad civil / garantía]]',
    dpoEmail: '[[Correo para ejercer derechos RGPD]]'
  },
  formProvider: '[[Proveedor que recibe los formularios, p. ej. Formspree]]'
};
