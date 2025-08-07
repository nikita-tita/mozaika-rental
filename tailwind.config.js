/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Основные цвета M²
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Основной синий M²
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        // Семантические цвета
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // Акцентные цвета M²
        accent: {
          blue: '#0078d4',
          purple: '#5b2bd9',
          teal: '#00b294',
          orange: '#ff8c00',
        },
        
        // Устаревшие цвета (для совместимости)
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Резиновые размеры шрифтов
        'xs': ['clamp(0.75rem, 1.5vw, 0.875rem)', { lineHeight: '1.4' }],
        'sm': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.5' }],
        'base': ['clamp(1rem, 2.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'lg': ['clamp(1.125rem, 3vw, 1.25rem)', { lineHeight: '1.5' }],
        'xl': ['clamp(1.25rem, 3.5vw, 1.5rem)', { lineHeight: '1.4' }],
        '2xl': ['clamp(1.5rem, 4vw, 1.875rem)', { lineHeight: '1.3' }],
        '3xl': ['clamp(1.875rem, 5vw, 2.25rem)', { lineHeight: '1.2' }],
        '4xl': ['clamp(2.25rem, 6vw, 3rem)', { lineHeight: '1.1' }],
        '5xl': ['clamp(3rem, 7vw, 3.75rem)', { lineHeight: '1' }],
        '6xl': ['clamp(3.75rem, 8vw, 4.5rem)', { lineHeight: '1' }],
        '7xl': ['clamp(4.5rem, 9vw, 6rem)', { lineHeight: '1' }],
        '8xl': ['clamp(6rem, 10vw, 8rem)', { lineHeight: '1' }],
        '9xl': ['clamp(8rem, 12vw, 12rem)', { lineHeight: '1' }],
        
        // Специальные резиновые размеры для заголовков
        'responsive-h1': ['clamp(2rem, 8vw, 4rem)', { lineHeight: '1.1' }],
        'responsive-h2': ['clamp(1.5rem, 6vw, 3rem)', { lineHeight: '1.2' }],
        'responsive-h3': ['clamp(1.25rem, 5vw, 2rem)', { lineHeight: '1.3' }],
        'responsive-h4': ['clamp(1.125rem, 4vw, 1.5rem)', { lineHeight: '1.4' }],
      },
      spacing: {
        // Резиновые отступы
        'responsive-xs': 'clamp(0.5rem, 2vw, 1rem)',
        'responsive-sm': 'clamp(1rem, 3vw, 1.5rem)',
        'responsive-md': 'clamp(1.5rem, 4vw, 2rem)',
        'responsive-lg': 'clamp(2rem, 5vw, 3rem)',
        'responsive-xl': 'clamp(3rem, 6vw, 4rem)',
        'responsive-2xl': 'clamp(4rem, 8vw, 6rem)',
        
        // Старые размеры для совместимости
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      screens: {
        // Резиновые breakpoints
        'xs': '320px',    // Малые телефоны
        'sm': '480px',    // Большие телефоны
        'md': '768px',    // Планшеты
        'lg': '1024px',   // Малые ноутбуки
        'xl': '1280px',   // Большие ноутбуки
        '2xl': '1536px',  // Десктопы
        '3xl': '1920px',  // Большие экраны
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}