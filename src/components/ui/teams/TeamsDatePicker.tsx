'use client'

import { useState, useEffect, useRef } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { TeamsButton, TeamsInput } from './index'

interface DateRange {
  start: Date | null
  end: Date | null
}

interface TeamsDatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showRange?: boolean
  onRangeChange?: (range: DateRange) => void
  minDate?: Date
  maxDate?: Date
  autoFillRange?: boolean // Автоматически заполнять диапазон (например, 11 месяцев)
}

export function TeamsDatePicker({
  value,
  onChange,
  placeholder = "Выберите дату",
  className = "",
  showRange = false,
  onRangeChange,
  minDate,
  maxDate,
  autoFillRange = false
}: TeamsDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Инициализация значений
  useEffect(() => {
    if (value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setSelectedDate(date)
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
      }
    }
  }, [value])

  // Автоматическое заполнение диапазона
  useEffect(() => {
    if (autoFillRange && dateRange.start && !dateRange.end) {
      const endDate = new Date(dateRange.start)
      endDate.setMonth(endDate.getMonth() + 11) // +11 месяцев
      setDateRange({ start: dateRange.start, end: endDate })
      if (onRangeChange) {
        onRangeChange({ start: dateRange.start, end: endDate })
      }
    }
  }, [dateRange.start, autoFillRange, onRangeChange])

  // Закрытие календаря при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const firstDayOfWeek = firstDay.getDay()

    const days = []
    
    // Добавляем пустые ячейки для выравнивания
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Добавляем дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isDateInRange = (date: Date) => {
    if (!dateRange.start || !dateRange.end) return false
    return date >= dateRange.start && date <= dateRange.end
  }

  const isDateRangeStart = (date: Date) => {
    return dateRange.start && formatDate(date) === formatDate(dateRange.start)
  }

  const isDateRangeEnd = (date: Date) => {
    return dateRange.end && formatDate(date) === formatDate(dateRange.end)
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return

    if (showRange) {
      if (!dateRange.start || (dateRange.start && dateRange.end)) {
        // Начинаем новый диапазон
        setDateRange({ start: date, end: null })
      } else {
        // Завершаем диапазон
        const start = dateRange.start!
        const end = date > start ? date : start
        const newStart = date > start ? start : date
        setDateRange({ start: newStart, end })
        
        if (onRangeChange) {
          onRangeChange({ start: newStart, end })
        }
      }
    } else {
      setSelectedDate(date)
      onChange(formatDate(date))
      setIsOpen(false)
    }
  }

  const handleQuickSelect = (months: number) => {
    const today = new Date()
    const endDate = new Date(today)
    endDate.setMonth(endDate.getMonth() + months)
    
    setDateRange({ start: today, end: endDate })
    if (onRangeChange) {
      onRangeChange({ start: today, end: endDate })
    }
  }

  const clearSelection = () => {
    setSelectedDate(null)
    setDateRange({ start: null, end: null })
    onChange('')
    if (onRangeChange) {
      onRangeChange({ start: null, end: null })
    }
  }

  const days = getDaysInMonth(currentMonth)
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]

  const displayValue = showRange 
    ? dateRange.start && dateRange.end
      ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`
      : dateRange.start
      ? `${formatDate(dateRange.start)} - ...`
      : placeholder
    : selectedDate 
      ? formatDate(selectedDate)
      : placeholder

  return (
    <div className={`relative ${className}`} ref={calendarRef}>
      <div className="relative">
        <TeamsInput
          value={displayValue}
          onChange={() => {}} // Read-only
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer"
          readOnly
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {selectedDate || dateRange.start || dateRange.end ? (
          <button
            onClick={clearSelection}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[320px]">
          {/* Заголовок календаря */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-medium">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Быстрый выбор для диапазонов */}
          {showRange && (
            <div className="p-3 border-b border-gray-200">
              <div className="flex gap-2 flex-wrap">
                <TeamsButton
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickSelect(1)}
                >
                  1 месяц
                </TeamsButton>
                <TeamsButton
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickSelect(3)}
                >
                  3 месяца
                </TeamsButton>
                <TeamsButton
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickSelect(6)}
                >
                  6 месяцев
                </TeamsButton>
                <TeamsButton
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickSelect(11)}
                >
                  11 месяцев
                </TeamsButton>
              </div>
            </div>
          )}

          {/* Дни недели */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
              <div key={day} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Дни месяца */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {days.map((date, index) => (
              <div
                key={index}
                className={`bg-white p-2 text-center text-sm cursor-pointer hover:bg-blue-50 transition-colors ${
                  !date
                    ? 'text-gray-300 cursor-default'
                    : isDateDisabled(date!)
                    ? 'text-gray-300 cursor-not-allowed'
                    : isDateRangeStart(date!)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : isDateRangeEnd(date!)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : isDateInRange(date!)
                    ? 'bg-blue-100 text-blue-900'
                    : selectedDate && formatDate(date!) === formatDate(selectedDate)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : hoveredDate && formatDate(date!) === formatDate(hoveredDate)
                    ? 'bg-blue-50'
                    : 'text-gray-900'
                }`}
                onClick={() => date && handleDateClick(date)}
                onMouseEnter={() => date && setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {date ? date.getDate() : ''}
              </div>
            ))}
          </div>

          {/* Кнопки действий */}
          <div className="p-3 border-t border-gray-200 flex justify-between">
            <TeamsButton
              size="sm"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Отмена
            </TeamsButton>
            {showRange && dateRange.start && dateRange.end && (
              <TeamsButton
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Применить
              </TeamsButton>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 