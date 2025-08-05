import React from 'react'
import { cn } from '@/lib/utils'

interface TeamsContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  fluid?: boolean
}

export const TeamsContainer: React.FC<TeamsContainerProps> = ({
  children,
  className,
  size = 'lg',
  fluid = false
}) => {
  const containerClasses = {
    xs: 'max-w-xs mx-auto px-responsive-xs',
    sm: 'max-w-sm mx-auto px-responsive-sm',
    md: 'max-w-md mx-auto px-responsive-md',
    lg: 'max-w-6xl mx-auto px-responsive-lg',
    xl: 'max-w-7xl mx-auto px-responsive-xl',
    '2xl': 'max-w-8xl mx-auto px-responsive-2xl',
    '3xl': 'max-w-9xl mx-auto px-responsive-2xl',
  }

  return (
    <div className={cn(
      fluid ? 'w-full px-responsive-sm sm:px-responsive-md lg:px-responsive-lg' : containerClasses[size],
      className
    )}>
      {children}
    </div>
  )
} 