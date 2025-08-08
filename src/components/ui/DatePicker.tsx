'use client'

import { useState, useEffect } from 'react'
import { TeamsInput, TeamsSelect } from './teams'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({ value, onChange, placeholder = "Дата рождения", className = "", disabled = false }: DatePickerProps) {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [manualInput, setManualInput] = useState('')
  const [useManualInput, setUseManualInput] = useState(false)

  // Генерируем массивы для дней, месяцев и лет
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = [
    { value: '01', label: 'Январь' },
    { value: '02', label: 'Февраль' },
    { value: '03', label: 'Март' },
    { value: '04', label: 'Апрель' },
    { value: '05', label: 'Май' },
    { value: '06', label: 'Июнь' },
    { value: '07', label: 'Июль' },
    { value: '08', label: 'Август' },
    { value: '09', label: 'Сентябрь' },
    { value: '10', label: 'Октябрь' },
    { value: '11', label: 'Ноябрь' },
    { value: '12', label: 'Декабрь' }
  ]
  
  // Генерируем годы от 1950 до текущего года с группировкой по десятилетиям
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i)

  // Группируем годы по десятилетиям для быстрой навигации
  const yearGroups = []
  for (let i = 1950; i <= currentYear; i += 10) {
    const decadeEnd = Math.min(i + 9, currentYear)
    yearGroups.push({
      label: `${i}-${decadeEnd}`,
      years: Array.from({ length: decadeEnd - i + 1 }, (_, j) => i + j)
    })
  }

  // Парсим значение при инициализации
  useEffect(() => {
    if (value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setDay(date.getDate().toString().padStart(2, '0'))
        setMonth((date.getMonth() + 1).toString().padStart(2, '0'))
        setYear(date.getFullYear().toString())
        setManualInput(value)
      }
    }
  }, [value])

  // Обновляем значение при изменении компонентов даты
  useEffect(() => {
    if (!useManualInput && day && month && year) {
      const dateString = `${year}-${month}-${day.padStart(2, '0')}`
      onChange(dateString)
      setManualInput(dateString)
    } else if (!useManualInput && !day && !month && !year) {
      onChange('')
      setManualInput('')
    }
  }, [day, month, year, onChange, useManualInput])

  // Обработка ручного ввода
  const handleManualInputChange = (input: string) => {
    setManualInput(input)
    if (input.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(input)
      if (!isNaN(date.getTime())) {
        setDay(date.getDate().toString().padStart(2, '0'))
        setMonth((date.getMonth() + 1).toString().padStart(2, '0'))
        setYear(date.getFullYear().toString())
        onChange(input)
        setUseManualInput(false)
      }
    }
  }

  const handleManualInputBlur = () => {
    if (manualInput && manualInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(manualInput)
      if (!isNaN(date.getTime())) {
        setDay(date.getDate().toString().padStart(2, '0'))
        setMonth((date.getMonth() + 1).toString().padStart(2, '0'))
        setYear(date.getFullYear().toString())
        onChange(manualInput)
        setUseManualInput(false)
      }
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Переключатель режима ввода */}
      {!disabled && (
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={!useManualInput}
              onChange={() => setUseManualInput(false)}
              className="mr-2"
              disabled={disabled}
            />
            <span className="text-sm text-[#323130]">Выбор из списка</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={useManualInput}
              onChange={() => setUseManualInput(true)}
              className="mr-2"
              disabled={disabled}
            />
            <span className="text-sm text-[#323130]">Ручной ввод</span>
          </label>
        </div>
      )}

      {useManualInput ? (
        <div>
          <label className="block text-sm font-medium text-[#323130] mb-1">
            Дата (ГГГГ-ММ-ДД)
          </label>
          <TeamsInput
            value={manualInput}
            onChange={(e) => handleManualInputChange(e.target.value)}
            onBlur={handleManualInputBlur}
            placeholder="2020-01-15"
            disabled={disabled}
          />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-[#323130] mb-1">
              День
            </label>
            <TeamsSelect
              value={day}
              onChange={(value) => setDay(value)}
              placeholder="День"
              disabled={disabled}
              options={[
                { value: '', label: 'День' },
                ...days.map(d => ({ value: d.toString(), label: d.toString() }))
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#323130] mb-1">
              Месяц
            </label>
            <TeamsSelect
              value={month}
              onChange={(value) => setMonth(value)}
              placeholder="Месяц"
              disabled={disabled}
              options={[
                { value: '', label: 'Месяц' },
                ...months
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#323130] mb-1">
              Год
            </label>
            <TeamsSelect
              value={year}
              onChange={(value) => setYear(value)}
              placeholder="Год"
              disabled={disabled}
              options={[
                { value: '', label: 'Год' },
                // Добавляем быстрые переходы к десятилетиям
                ...yearGroups.map(group => ({
                  value: '',
                  label: `--- ${group.label} ---`,
                  disabled: true
                })),
                ...years.map(y => ({ value: y.toString(), label: y.toString() }))
              ]}
            />
          </div>
        </div>
      )}
    </div>
  )
} 