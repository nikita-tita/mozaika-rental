'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TeamsSelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface TeamsSelectProps {
  options: TeamsSelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const TeamsSelect: React.FC<TeamsSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите опцию',
  disabled = false,
  error = false,
  className,
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<TeamsSelectOption | undefined>(
    options.find(option => option.value === value)
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setSelectedOption(options.find(option => option.value === value))
  }, [value, options])

  const handleSelect = (option: TeamsSelectOption) => {
    if (option.disabled) return
    
    setSelectedOption(option)
    onChange?.(option.value)
    setIsOpen(false)
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        type="button"
        className={cn(
          'w-full flex items-center justify-between border rounded-md bg-white transition-colors',
          sizeClasses[size],
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          disabled && 'bg-gray-50 cursor-not-allowed opacity-50',
          !disabled && 'hover:border-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-offset-2'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={cn(
          'truncate',
          !selectedOption && 'text-gray-500'
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={cn(
            'ml-2 h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'w-full px-4 py-2 text-left text-sm transition-colors text-[#323130]',
                option.disabled 
                  ? 'text-[#605e5c] cursor-not-allowed' 
                  : 'hover:bg-[#f3f2f1] cursor-pointer',
                option.value === selectedOption?.value && 'bg-[#deecf9] text-[#0078d4] font-medium'
              )}
              onClick={() => handleSelect(option)}
              disabled={option.disabled}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 