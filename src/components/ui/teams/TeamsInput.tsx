import React from 'react'
import { cn } from '@/lib/utils'

interface TeamsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const TeamsInput: React.FC<TeamsInputProps> = ({
  className,
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all duration-200',
            'bg-white text-gray-900',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
            'placeholder:text-gray-400',
            'hover:border-gray-400',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            props.disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',
            className
          )}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-error-600 mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  )
} 