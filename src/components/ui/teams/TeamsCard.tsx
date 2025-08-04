import React from 'react'
import { cn } from '@/lib/utils'

interface TeamsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'sm' | 'md' | 'lg'
  interactive?: boolean
}

export const TeamsCard: React.FC<TeamsCardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  interactive = false,
  ...props
}) => {
  const baseClasses = 'rounded-lg transition-all duration-200'
  
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-md border border-gray-200',
    outlined: 'bg-transparent border border-gray-300',
  }
  
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }
  
  const interactiveClasses = interactive ? 'hover:shadow-lg hover:border-blue-300 cursor-pointer' : ''
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        interactiveClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 