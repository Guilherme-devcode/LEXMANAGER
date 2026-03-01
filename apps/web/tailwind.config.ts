import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          50:  '#f3f0ff',
          100: '#e5ddff',
          200: '#cdbeff',
          300: '#b09aff',
          400: '#9275fd',
          500: '#7C5CFC',
          600: '#6B47FA',
          700: '#5a35e8',
        },
        // Keep primary as alias for compatibility with other pages
        primary: {
          50:  '#f3f0ff',
          100: '#e5ddff',
          200: '#cdbeff',
          300: '#b09aff',
          400: '#9275fd',
          500: '#7C5CFC',
          600: '#6B47FA',
          700: '#5a35e8',
          800: '#4a28ce',
          900: '#3b1fb0',
          950: '#2a1490',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':          '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-hover':    '0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)',
        'dropdown':      '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
        'dropdown-dark': '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        'button':        '0 2px 8px rgba(124,92,252,0.35)',
      },
      animation: {
        'fade-up':  'fadeUp 0.4s ease-out both',
        'fade-in':  'fadeIn 0.3s ease-out both',
        'scale-in': 'scaleIn 0.2s ease-out both',
        'slide-in': 'slideIn 0.25s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
