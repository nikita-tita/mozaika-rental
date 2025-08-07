'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AutocompleteOption {
  value: string
  label: string
  description?: string
}

interface TeamsAutocompleteProps {
  options: AutocompleteOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  allowCustom?: boolean
  maxResults?: number
  onSearch?: (query: string) => void
}

export const TeamsAutocomplete: React.FC<TeamsAutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите опцию',
  disabled = false,
  error = false,
  className,
  size = 'md',
  allowCustom = false,
  maxResults = 10,
  onSearch
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | undefined>(
    options.find(option => option.value === value)
  )
  const [customValue, setCustomValue] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label)
      setCustomValue('')
    }
  }, [selectedOption])

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ).slice(0, maxResults)

  const handleSelect = (option: AutocompleteOption) => {
    setSelectedOption(option)
    setSearchTerm(option.label)
    setCustomValue('')
    onChange?.(option.value)
    setIsOpen(false)
  }

  const handleCustomValue = () => {
    if (allowCustom && customValue.trim()) {
      onChange?.(customValue.trim())
      setSearchTerm(customValue.trim())
      setSelectedOption(undefined)
      setIsOpen(false)
    }
  }

  const handleClear = () => {
    setSelectedOption(undefined)
    setSearchTerm('')
    setCustomValue('')
    onChange?.('')
    inputRef.current?.focus()
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            const newValue = e.target.value
            setSearchTerm(newValue)
            setCustomValue(newValue)
            if (!isOpen) setIsOpen(true)
            onSearch?.(newValue)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between border rounded-md bg-white transition-colors',
            sizeClasses[size],
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            disabled && 'bg-gray-50 cursor-not-allowed opacity-50',
            !disabled && 'hover:border-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'pr-10'
          )}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown className={cn(
            'h-4 w-4 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            <>
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'w-full px-4 py-2 text-left transition-colors',
                    'text-gray-900 hover:bg-gray-100 cursor-pointer',
                    option.value === selectedOption?.value && 'bg-blue-50 text-blue-700 font-medium'
                  )}
                  onClick={() => handleSelect(option)}
                >
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-500">{option.description}</div>
                  )}
                </button>
              ))}
              
              {allowCustom && customValue.trim() && !filteredOptions.find(opt => 
                opt.label.toLowerCase() === customValue.toLowerCase()
              ) && (
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 cursor-pointer border-t border-gray-200"
                  onClick={handleCustomValue}
                >
                  <div className="font-medium">Использовать: "{customValue}"</div>
                  <div className="text-sm text-gray-500">Добавить как пользовательское значение</div>
                </button>
              )}
            </>
          ) : (
            <div className="px-4 py-2 text-gray-500 text-center">
              Ничего не найдено
            </div>
          )}
        </div>
      )}
    </div>
  )
} 