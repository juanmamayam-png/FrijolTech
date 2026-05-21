/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Paleta terrosa editorial (FrijolTech) ──
        // primary = vino fríjol cargamanto
        primary: {
          DEFAULT: '#7D2B3A',
          50:  '#fbf2f3',
          100: '#f5dee1',
          200: '#e9bcc3',
          300: '#d98f9b',
          400: '#bd5c6c',
          500: '#7D2B3A',
          600: '#6c2532',
          700: '#5e1f2b',
          800: '#491820',
          900: '#331016',
        },
        // secondary = verde follaje
        secondary: {
          DEFAULT: '#4A6B35',
          50:  '#f2f6ee',
          100: '#dfe9d4',
          200: '#c2d4ad',
          300: '#9cbb7e',
          400: '#6f9550',
          500: '#4A6B35',
          600: '#3d5a2c',
          700: '#314824',
          800: '#26371c',
          900: '#1a2613',
        },
        // accent = se mantiene como alerta/rojo terracota
        accent: {
          DEFAULT: '#B3422F',
          50:  '#fcf0ee',
          100: '#f8ddd8',
          200: '#f0bbb1',
          300: '#e59384',
          400: '#cf6450',
          500: '#B3422F',
          600: '#973626',
          700: '#79291d',
          800: '#5b1f16',
          900: '#3d140e',
        },
        soil:   '#8A6D3B',  // ocre tierra
        light:  '#F4EFE6',  // papel cálido (fondo app)
        surface:'#FBF8F1',  // superficie de tarjetas
        dark:   '#2A2417',  // texto principal
        muted:  '#6B6151',  // texto secundario
        faint:  '#9C917E',  // texto tenue
        line:   '#E2D9C7',  // bordes
        // semánticos de estado climático / severidad
        warn:   '#C98A1E',
        danger: '#B3422F',
        ok:     '#4A6B35',
      },
      fontFamily: {
        // Fraunces para titulares (serif con carácter); Familjen Grotesk para cuerpo
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans:  ['"Familjen Grotesk"', 'system-ui', 'sans-serif'],
        mono:  ['"Spline Sans Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl:  '0.75rem',   // 12px
        '2xl': '0.875rem',// 14px (tarjetas)
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
