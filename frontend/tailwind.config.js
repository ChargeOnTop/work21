/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Основная палитра WORK21 (тёмная тема по умолчанию)
        'work21': {
          'dark': 'var(--color-bg)',
          'darker': 'var(--color-bg-secondary)',
          'card': 'var(--color-card)',
          'border': 'var(--color-border)',
          'muted': 'var(--color-text-muted)',
        },
        'accent': {
          'green': 'var(--color-accent-green)',
          'green-dark': '#059669',
          'blue': 'var(--color-accent-blue)',
          'blue-dark': '#2563eb',
          'violet': 'var(--color-accent-violet)',
          'violet-dark': '#7c3aed',
          'amber': '#f59e0b',
        },
        // Адаптивные цвета
        'themed': {
          'bg': 'var(--color-bg)',
          'card': 'var(--color-card)',
          'border': 'var(--color-border)',
          'text': 'var(--color-text)',
          'text-secondary': 'var(--color-text-secondary)',
          'text-muted': 'var(--color-text-muted)',
        }
      },
      fontFamily: {
        'display': ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, #1e1e2a 1px, transparent 1px), linear-gradient(to bottom, #1e1e2a 1px, transparent 1px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}


