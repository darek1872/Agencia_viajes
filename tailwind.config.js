/** Tokens portados 1:1 del diseño de Google Stitch (design/stitch-original).
 *  Único cambio: `cta` / `cta-hover` (coral con contraste AA para texto blanco, 4.69:1). */
export default {
  content: ['./*.html', './src/**/*.{html,js}', './{contacto,aviso-legal,privacidad,cookies}/**/*.html'],
  theme: {
    extend: {
      colors: {
        surface: '#f7f9fb', 'surface-dim': '#d8dadc', secondary: '#006876',
        'on-primary-container': '#778db2', 'error-container': '#ffdad6', 'tertiary-fixed': '#ffdad2',
        'on-primary-fixed': '#001c3b', 'primary-fixed-dim': '#b1c7f0', 'on-tertiary-fixed': '#3d0600',
        'on-primary': '#ffffff', 'on-secondary-fixed': '#001f24', 'inverse-surface': '#2d3133',
        error: '#ba1a1a', 'on-background': '#191c1e', 'on-secondary': '#ffffff', 'on-error-container': '#93000a',
        'secondary-fixed-dim': '#77d4e5', 'on-primary-fixed-variant': '#314769', 'secondary-container': '#92edff',
        tertiary: '#270300', 'on-tertiary': '#ffffff', background: '#f7f9fb', 'tertiary-fixed-dim': '#ffb4a3',
        'inverse-primary': '#b1c7f0', 'tertiary-container': '#4e0900', 'surface-container-highest': '#e0e3e5',
        'surface-bright': '#f7f9fb', 'surface-variant': '#e0e3e5', 'surface-tint': '#495f82',
        'outline-variant': '#c4c6cf', 'primary-container': '#0b2545', 'inverse-on-surface': '#eff1f3',
        'on-error': '#ffffff', 'surface-container-lowest': '#ffffff', 'on-tertiary-fixed-variant': '#8c1900',
        'on-surface': '#191c1e', 'on-surface-variant': '#44474e', 'secondary-fixed': '#9eefff', outline: '#74777f',
        'on-secondary-container': '#006d7b', 'on-secondary-fixed-variant': '#004e59', primary: '#001026',
        'primary-fixed': '#d5e3ff', 'surface-container-low': '#f2f4f6', 'surface-container-high': '#e6e8ea',
        'on-tertiary-container': '#f65430', 'surface-container': '#eceef0',
        cta: '#d63a1a', 'cta-hover': '#b32d12'
      },
      borderRadius: { DEFAULT: '0.25rem', lg: '0.5rem', xl: '0.75rem', full: '9999px' },
      spacing: {
        'space-xl': '2.5rem', 'space-lg': '1.5rem', gutter: '1.5rem', 'space-xs': '0.25rem',
        'space-sm': '0.5rem', 'space-md': '1rem', 'margin-mobile': '1rem', margin: '2rem', 'gutter-mobile': '1rem'
      },
      fontFamily: (() => {
        const jk = ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'];
        const it = ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'];
        return {
          'headline-md': jk, 'headline-sm': jk, 'headline-lg': jk, 'label-lg': jk, 'label-sm': jk, 'label-md': jk,
          display: jk, 'display-mobile': jk, 'headline-lg-mobile': jk,
          'body-sm': it, 'body-lg': it, 'body-md': it
        };
      })(),
      fontSize: {
        'headline-md': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'label-lg': ['16px', { lineHeight: '24px', letterSpacing: '0.01em', fontWeight: '600' }],
        'headline-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.04em', fontWeight: '700' }],
        display: ['56px', { lineHeight: '64px', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-mobile': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
        'headline-lg-mobile': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }]
      }
    }
  },
  plugins: []
};
