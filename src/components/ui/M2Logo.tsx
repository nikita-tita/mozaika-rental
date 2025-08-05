import React from 'react'
import { cn } from '@/lib/utils'

interface M2LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white' | 'primary'
  className?: string
}

export const M2Logo: React.FC<M2LogoProps> = ({
  size = 'md',
  variant = 'default',
  className
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const variantClasses = {
    default: 'text-primary-600',
    white: 'text-white',
    primary: 'text-primary-500'
  }

  return (
    <div className={cn('flex items-center', className)}>
      {/* Логотип M² */}
      <div className={cn(
        'flex items-center justify-center rounded-lg font-bold',
        sizeClasses[size],
        variantClasses[variant]
      )}>
        <div className="relative">
          <span className="text-2xl font-extrabold tracking-tight">M</span>
          <span className="absolute -top-1 -right-1 text-xs font-bold">²</span>
        </div>
      </div>
      
      {/* Текст логотипа */}
      <div className="ml-2">
        <div className={cn(
          'font-bold tracking-tight',
          variantClasses[variant],
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg',
          size === 'xl' && 'text-xl'
        )}>
          Метр квадратный
        </div>
        <div className={cn(
          'text-xs font-medium opacity-70',
          variant === 'white' ? 'text-white' : 'text-gray-600'
        )}>
          Rental Platform
        </div>
      </div>
    </div>
  )
}

// Компактная версия только с символом
export const M2Icon: React.FC<Omit<M2LogoProps, 'variant'> & { variant?: 'default' | 'white' }> = ({
  size = 'md',
  variant = 'default',
  className
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const variantClasses = {
    default: 'text-primary-600',
    white: 'text-white'
  }

  return (
    <div className={cn(
      'flex items-center justify-center rounded-lg font-bold',
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      <div className="relative">
        <span className="text-2xl font-extrabold tracking-tight">M</span>
        <span className="absolute -top-1 -right-1 text-xs font-bold">²</span>
      </div>
    </div>
  )
} 