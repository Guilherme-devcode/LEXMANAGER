import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy primary kept for compatibility — maps to gold
        primary: {
          50:  '#fdf9ee',
          100: '#f9f0d0',
          200: '#f3de9d',
          300: '#ecc660',
          400: '#e8b83a',
          500: '#c9a84c',
          600: '#a8893c',
          700: '#8a6f2e',
          800: '#6b5422',
          900: '#4d3c18',
          950: '#2e2209',
        },
        // New semantic surface system
        surface: {
          base:    '#07070f',
          DEFAULT: '#0d0d1a',
          raised:  '#131322',
          overlay: '#1a1a2e',
          border:  '#1e1e38',
        },
        gold: {
          300: '#f5dfa0',
          400: '#e8c64a',
          500: '#c9a84c',
          600: '#a8893c',
          700: '#8a6f2e',
        },
        ink: {
          50:  '#f0eff8',
          100: '#d8d7f0',
          200: '#b4b3d8',
          300: '#8e8db8',
          400: '#6b6b9a',
          500: '#4e4e7a',
          600: '#38385e',
          700: '#252540',
          800: '#161628',
          900: '#0a0a16',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up':       'fadeUp 0.5s ease-out both',
        'fade-in':       'fadeIn 0.4s ease-out both',
        'scale-in':      'scaleIn 0.3s ease-out both',
        'spin-slow':     'spin 20s linear infinite',
        'spin-reverse':  'spinReverse 15s linear infinite',
        'spin-medium':   'spin 10s linear infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
        'shimmer':       'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        spinReverse: {
          from: { transform: 'rotate(360deg)' },
          to:   { transform: 'rotate(0deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.7', filter: 'brightness(1)' },
          '50%':      { opacity: '1',   filter: 'brightness(1.3)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'gold-sm':  '0 0 12px rgba(201, 168, 76, 0.15)',
        'gold':     '0 0 24px rgba(201, 168, 76, 0.2)',
        'gold-lg':  '0 0 48px rgba(201, 168, 76, 0.25)',
        'card':     '0 4px 24px rgba(0, 0, 0, 0.4)',
        'elevated': '0 8px 40px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
