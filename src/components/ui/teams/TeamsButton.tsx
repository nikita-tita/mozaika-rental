import React from 'react'
import { cn } from '@/lib/utils'

interface TeamsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const TeamsButton: React.FC<TeamsButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md transition-all duration-200',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 shadow-sm hover:shadow-md transition-all duration-200',
    outline: 'border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 focus:ring-primary-500 transition-all duration-200',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-500 transition-all duration-200',
    danger: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 shadow-sm hover:shadow-md transition-all duration-200',
    success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 shadow-sm hover:shadow-md transition-all duration-200',
    warning: 'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500 shadow-sm hover:shadow-md transition-all duration-200',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }
  
  const disabledClasses = 'opacity-50 cursor-not-allowed'
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && disabledClasses,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  )
} 