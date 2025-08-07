'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { TeamsInput } from './index'

interface TeamsPasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  className?: string
  error?: string
  helperText?: string
  disabled?: boolean
  name?: string
  autoComplete?: string
}

export function TeamsPasswordInput({
  value,
  onChange,
  placeholder = "Введите пароль",
  label,
  required = false,
  className = "",
  error,
  helperText,
  disabled = false,
  name,
  autoComplete = "current-password"
}: TeamsPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[#323130] mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <TeamsInput
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          name={name}
          autoComplete={autoComplete}
          className={error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
        />
        
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-[#605e5c]">{helperText}</p>
      )}
    </div>
  )
} 