'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface Option {
  value: string
  label: string
  disabled?: boolean
}

interface TeamsMultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options: Option[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function TeamsMultiSelect({
  value = [],
  onChange,
  options,
  placeholder = "Выберите опции",
  className = "",
  disabled = false
}: TeamsMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filteredOptions = options.filter(option =>
    !option.disabled && 
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !value.includes(option.value)
  )

  const selectedOptions = options.filter(option => value.includes(option.value))

  const handleToggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  const handleRemoveOption = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue))
  }

  const getDisplayText = () => {
    if (value.length === 0) return placeholder
    if (value.length === 1) {
      const option = options.find(opt => opt.value === value[0])
      return option?.label || value[0]
    }
    return `${value.length} выбрано`
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`
          relative w-full px-3 py-2 text-left bg-white border border-[#e1dfdd] rounded-md shadow-sm cursor-pointer
          hover:border-[#0078d4] focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-[#0078d4]
          ${disabled ? 'bg-[#f3f2f1] cursor-not-allowed' : ''}
          ${isOpen ? 'border-[#0078d4] ring-2 ring-[#0078d4]' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1 min-h-6">
            {selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <span
                  key={option.value}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#deecf9] text-[#0078d4]"
                >
                  {option.label}
                  <button
                    type="button"
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#0078d4] hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveOption(option.value)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-[#605e5c]">{placeholder}</span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-[#605e5c] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#e1dfdd] rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#e1dfdd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-[#0078d4]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="max-h-48 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-[#605e5c]">
                {searchTerm ? 'Ничего не найдено' : 'Нет доступных опций'}
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-[#f3f2f1] flex items-center"
                  onClick={() => handleToggleOption(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => handleToggleOption(option.value)}
                    className="mr-2"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
} 