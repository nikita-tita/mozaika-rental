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
          className="block text-sm font-medium text-[#323130]"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-[#605e5c]">{icon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'block w-full rounded-md border border-[#605e5c] px-3 py-2 text-sm transition-colors',
            'bg-white text-gray-900',
            'focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] focus:outline-none',
            'placeholder:text-[#605e5c]',
            error && 'border-[#d13438] focus:border-[#d13438] focus:ring-[#d13438]',
            props.disabled && 'bg-[#f3f2f1] cursor-not-allowed',
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',
            className
          )}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[#605e5c]">{icon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-[#d13438]">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-[#605e5c]">{helperText}</p>
      )}
    </div>
  )
} 