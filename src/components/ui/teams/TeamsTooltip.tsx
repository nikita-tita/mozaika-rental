'use client'

import { useState, useRef, useEffect } from 'react'
import { HelpCircle, Info } from 'lucide-react'

interface TeamsTooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click'
  className?: string
  icon?: 'help' | 'info'
  maxWidth?: number
}

export function TeamsTooltip({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  className = "",
  icon = 'help',
  maxWidth = 250
}: TeamsTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (trigger === 'click' && 
          tooltipRef.current && 
          triggerRef.current &&
          !tooltipRef.current.contains(event.target as Node) &&
          !triggerRef.current.contains(event.target as Node)) {
        setIsVisible(false)
      }
    }

    if (trigger === 'click' && isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, trigger])

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsVisible(true)
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsVisible(false)
    }
  }

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible)
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    }
  }

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800'
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800'
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800'
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800'
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800'
    }
  }

  const IconComponent = icon === 'help' ? HelpCircle : Info

  return (
    <div 
      className={`relative inline-block ${className}`}
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1">
        {children}
        <IconComponent 
          className="h-4 w-4 text-[#605e5c] hover:text-[#323130] cursor-help transition-colors" 
        />
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${getPositionClasses()}`}
          style={{ maxWidth: `${maxWidth}px` }}
        >
          <div className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="relative">
              {content}
              {/* Стрелка */}
              <div className={`absolute w-0 h-0 border-4 border-transparent ${getArrowClasses()}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Компонент для полей с подсказками
interface TeamsInputWithTooltipProps {
  label: string
  tooltipContent: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function TeamsInputWithTooltip({
  label,
  tooltipContent,
  required = false,
  children,
  className = ""
}: TeamsInputWithTooltipProps) {
  return (
    <div className={className}>
      <TeamsTooltip content={tooltipContent}>
        <label className="block text-sm font-medium text-[#323130] mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </TeamsTooltip>
      {children}
    </div>
  )
} 