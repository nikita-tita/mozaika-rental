// 🎯 Утилиты для резиновой верстки

import React from 'react'
import { M2DesignSystem } from './design-system'

// Типы для резиновых размеров
export type ResponsiveSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type ResponsiveSpacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Утилиты для получения резиновых размеров
export const getResponsiveSpacing = (size: ResponsiveSpacing) => {
  return M2DesignSystem.responsiveSpacing[size]
}

export const getResponsiveTypography = (type: keyof typeof M2DesignSystem.responsiveTypography) => {
  return M2DesignSystem.responsiveTypography[type]
}

export const getContainerWidth = (size: ResponsiveSize) => {
  return M2DesignSystem.containers[size]
}

// CSS классы для резиновой верстки
export const responsiveClasses = {
  // Контейнеры
  container: {
    xs: 'w-full px-responsive-xs',
    sm: 'w-full px-responsive-sm',
    md: 'w-full px-responsive-md',
    lg: 'max-w-6xl mx-auto px-responsive-lg',
    xl: 'max-w-7xl mx-auto px-responsive-xl',
    '2xl': 'max-w-8xl mx-auto px-responsive-2xl',
    '3xl': 'max-w-9xl mx-auto px-responsive-2xl',
  },
  
  // Сетки
  grid: {
    mobile: 'grid grid-cols-1 gap-responsive-sm',
    tablet: 'grid grid-cols-2 gap-responsive-md',
    desktop: 'grid grid-cols-3 gap-responsive-lg',
    wide: 'grid grid-cols-4 gap-responsive-xl',
  },
  
  // Отступы
  padding: {
    xs: 'p-responsive-xs',
    sm: 'p-responsive-sm',
    md: 'p-responsive-md',
    lg: 'p-responsive-lg',
    xl: 'p-responsive-xl',
  },
  
  // Маржины
  margin: {
    xs: 'm-responsive-xs',
    sm: 'm-responsive-sm',
    md: 'm-responsive-md',
    lg: 'm-responsive-lg',
    xl: 'm-responsive-xl',
  },
  
  // Размеры шрифтов
  text: {
    h1: 'text-responsive-h1',
    h2: 'text-responsive-h2',
    h3: 'text-responsive-h3',
    h4: 'text-responsive-h4',
    body: 'text-base',
    small: 'text-sm',
  }
}

// Хук для определения размера экрана
export const useResponsive = () => {
  const [screenSize, setScreenSize] = React.useState<ResponsiveSize>('lg')
  
  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      
      if (width < 480) setScreenSize('xs')
      else if (width < 768) setScreenSize('sm')
      else if (width < 1024) setScreenSize('md')
      else if (width < 1280) setScreenSize('lg')
      else if (width < 1536) setScreenSize('xl')
      else if (width < 1920) setScreenSize('2xl')
      else setScreenSize('3xl')
    }
    
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])
  
  return screenSize
}

// Утилиты для адаптивных классов
export const getResponsiveClass = (
  baseClass: string,
  variants: Partial<Record<ResponsiveSize, string>>
) => {
  const classes = [baseClass]
  
  Object.entries(variants).forEach(([size, variant]) => {
    if (variant) {
      classes.push(`${size}:${variant}`)
    }
  })
  
  return classes.join(' ')
}

// Утилиты для резиновых размеров компонентов
export const getResponsiveComponentSize = (size: ResponsiveSize) => {
  const sizes = {
    xs: {
      button: 'px-2 py-1 text-xs',
      input: 'px-2 py-1 text-xs',
      card: 'p-2',
      icon: 'w-4 h-4',
    },
    sm: {
      button: 'px-3 py-1.5 text-sm',
      input: 'px-3 py-1.5 text-sm',
      card: 'p-3',
      icon: 'w-5 h-5',
    },
    md: {
      button: 'px-4 py-2 text-sm',
      input: 'px-4 py-2 text-sm',
      card: 'p-4',
      icon: 'w-6 h-6',
    },
    lg: {
      button: 'px-6 py-3 text-base',
      input: 'px-4 py-2.5 text-sm',
      card: 'p-6',
      icon: 'w-8 h-8',
    },
    xl: {
      button: 'px-8 py-4 text-lg',
      input: 'px-4 py-3 text-base',
      card: 'p-8',
      icon: 'w-10 h-10',
    },
    '2xl': {
      button: 'px-10 py-5 text-xl',
      input: 'px-6 py-4 text-lg',
      card: 'p-10',
      icon: 'w-12 h-12',
    },
    '3xl': {
      button: 'px-12 py-6 text-2xl',
      input: 'px-8 py-5 text-xl',
      card: 'p-12',
      icon: 'w-16 h-16',
    },
  }
  
  return sizes[size] || sizes.md
}

// Утилиты для резиновых отступов
export const getResponsiveSpacingClass = (size: ResponsiveSpacing) => {
  const spacingClasses = {
    xs: 'space-y-responsive-xs',
    sm: 'space-y-responsive-sm',
    md: 'space-y-responsive-md',
    lg: 'space-y-responsive-lg',
    xl: 'space-y-responsive-xl',
  }
  
  return spacingClasses[size]
}

// Утилиты для резиновых сеток
export const getResponsiveGridClass = (columns: Record<ResponsiveSize, number>) => {
  const classes = []
  
  Object.entries(columns).forEach(([size, cols]) => {
    classes.push(`${size}:grid-cols-${cols}`)
  })
  
  return `grid gap-responsive-md ${classes.join(' ')}`
}

// Утилиты для резиновых изображений
export const getResponsiveImageClass = (aspectRatio: 'square' | 'video' | 'wide' = 'square') => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]',
  }
  
  return `${aspectClasses[aspectRatio]} w-full h-auto object-cover`
}

// Утилиты для резиновых кнопок
export const getResponsiveButtonClass = (variant: string, size: ResponsiveSize) => {
  const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  const sizeClass = getResponsiveComponentSize(size).button
  
  return `${baseClass} ${sizeClass}`
}

// Утилиты для резиновых карточек
export const getResponsiveCardClass = (size: ResponsiveSize, interactive = false) => {
  const baseClass = 'rounded-lg transition-all duration-200 bg-white border border-gray-200 shadow-sm'
  const sizeClass = getResponsiveComponentSize(size).card
  const interactiveClass = interactive ? 'hover:shadow-lg hover:border-primary-300 cursor-pointer transform hover:-translate-y-1' : ''
  
  return `${baseClass} ${sizeClass} ${interactiveClass}`
} 