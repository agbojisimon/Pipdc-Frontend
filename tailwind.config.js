/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#E8F3EE',
          100: '#C9E2D2',
          200: '#93C5A8',
          300: '#5DA37E',
          400: '#2E8554',
          500: '#0B6B3A',
          600: '#095A31',
          700: '#074827',
          800: '#05371D',
          900: '#032514',
        },
        gold: {
          50: '#FBF6E6',
          100: '#F5E9C2',
          200: '#EBD485',
          300: '#E0BE4E',
          400: '#D4AF37',
          500: '#B8962E',
          600: '#997A24',
          700: '#735C1B',
          800: '#4D3D11',
          900: '#261F09',
        },
        ink: {
          50: '#F7F7F7',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D1D1D1',
          400: '#9CA3AF',
          500: '#4B5563',
          600: '#374151',
          700: '#1F2937',
          800: '#111827',
          900: '#111111',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      spacing: {
        13: '3.25rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(17, 17, 17, 0.06)',
        card: '0 8px 30px -6px rgba(17, 17, 17, 0.08)',
        lift: '0 20px 50px -12px rgba(11, 107, 58, 0.18)',
        gold: '0 8px 24px -6px rgba(212, 175, 55, 0.35)',
      },
      backgroundImage: {
        'forest-gradient': 'linear-gradient(135deg, #0B6B3A 0%, #074827 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
        'hero-overlay': 'linear-gradient(180deg, rgba(17,17,17,0.55) 0%, rgba(11,107,58,0.45) 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
