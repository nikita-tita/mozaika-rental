// 🎨 Дизайн-система M² (Метр квадратный)

export const M2DesignSystem = {
  // Цветовая палитра M²
  colors: {
    // Основные цвета бренда
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
    
    // Нейтральные цвета
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
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
    
    // Специальные цвета M²
    accent: {
      blue: '#0078d4', // Microsoft Blue
      purple: '#5b2bd9',
      teal: '#00b294',
      orange: '#ff8c00',
    }
  },
  
  // Типографика
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    }
  },
  
  // Размеры и отступы
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },
  
  // Радиусы скругления
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },
  
  // Тени
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  
  // Анимации
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },
  
  // Breakpoints для резиновой верстки
  breakpoints: {
    xs: '320px',    // Малые телефоны
    sm: '480px',    // Большие телефоны
    md: '768px',    // Планшеты
    lg: '1024px',   // Малые ноутбуки
    xl: '1280px',   // Большие ноутбуки
    '2xl': '1536px', // Десктопы
    '3xl': '1920px', // Большие экраны
  },
  
  // Резиновые размеры контейнеров
  containers: {
    xs: '100%',
    sm: '100%',
    md: '100%',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
  },
  
  // Резиновые отступы
  responsiveSpacing: {
    xs: 'clamp(1rem, 4vw, 1.5rem)',
    sm: 'clamp(1.5rem, 5vw, 2rem)',
    md: 'clamp(2rem, 6vw, 3rem)',
    lg: 'clamp(3rem, 8vw, 4rem)',
    xl: 'clamp(4rem, 10vw, 6rem)',
  },
  
  // Резиновые размеры шрифтов
  responsiveTypography: {
    h1: 'clamp(2rem, 8vw, 4rem)',
    h2: 'clamp(1.5rem, 6vw, 3rem)',
    h3: 'clamp(1.25rem, 5vw, 2rem)',
    h4: 'clamp(1.125rem, 4vw, 1.5rem)',
    body: 'clamp(0.875rem, 2vw, 1rem)',
    small: 'clamp(0.75rem, 1.5vw, 0.875rem)',
  }
}

// Утилиты для работы с дизайн-системой
export const getColor = (color: string, shade: string = '500') => {
  const colorPath = color.split('.')
  let current = M2DesignSystem.colors
  
  for (const part of colorPath) {
    if (current[part]) {
      current = current[part]
    } else {
      return M2DesignSystem.colors.gray[500] // fallback
    }
  }
  
  return current[shade] || current
}

export const getSpacing = (size: string) => {
  return M2DesignSystem.spacing[size] || M2DesignSystem.spacing.md
}

export const getBorderRadius = (size: string) => {
  return M2DesignSystem.borderRadius[size] || M2DesignSystem.borderRadius.md
}

// CSS переменные для использования в Tailwind
export const cssVariables = {
  '--color-primary-50': M2DesignSystem.colors.primary[50],
  '--color-primary-100': M2DesignSystem.colors.primary[100],
  '--color-primary-200': M2DesignSystem.colors.primary[200],
  '--color-primary-300': M2DesignSystem.colors.primary[300],
  '--color-primary-400': M2DesignSystem.colors.primary[400],
  '--color-primary-500': M2DesignSystem.colors.primary[500],
  '--color-primary-600': M2DesignSystem.colors.primary[600],
  '--color-primary-700': M2DesignSystem.colors.primary[700],
  '--color-primary-800': M2DesignSystem.colors.primary[800],
  '--color-primary-900': M2DesignSystem.colors.primary[900],
  
  '--color-success-500': M2DesignSystem.colors.success[500],
  '--color-warning-500': M2DesignSystem.colors.warning[500],
  '--color-error-500': M2DesignSystem.colors.error[500],
  
  '--font-family-sans': M2DesignSystem.typography.fontFamily.sans.join(', '),
  '--font-family-mono': M2DesignSystem.typography.fontFamily.mono.join(', '),
  
  '--shadow-sm': M2DesignSystem.shadows.sm,
  '--shadow-md': M2DesignSystem.shadows.md,
  '--shadow-lg': M2DesignSystem.shadows.lg,
  '--shadow-xl': M2DesignSystem.shadows.xl,
  '--shadow-2xl': M2DesignSystem.shadows['2xl'],
  
  '--animation-duration-fast': M2DesignSystem.animations.duration.fast,
  '--animation-duration-normal': M2DesignSystem.animations.duration.normal,
  '--animation-duration-slow': M2DesignSystem.animations.duration.slow,
} 