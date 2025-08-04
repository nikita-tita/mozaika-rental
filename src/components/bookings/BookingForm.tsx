'use client'

import { useState } from 'react'
import { TeamsButton } from '@/components/ui/teams'
import { TeamsInput } from '@/components/ui/teams'
import { Calendar, Clock } from 'lucide-react'
import { formatPrice, calculateDaysBetween } from '@/lib/utils'

interface BookingFormProps {
  propertyId: string
  pricePerMonth: number
  onBookingSuccess?: () => void
}

export default function BookingForm({ propertyId, pricePerMonth, onBookingSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate) return 0
    
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    
    if (start >= end) return 0
    
    const days = calculateDaysBetween(start, end)
    return (pricePerMonth * days) / 30 // Примерная стоимость
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Валидация на фронтенде
    const newErrors: Record<string, string> = {}

    if (!formData.startDate) {
      newErrors.startDate = 'Дата заезда обязательна'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Дата выезда обязательна'
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      
      if (start < new Date()) {
        newErrors.startDate = 'Дата заезда не может быть в прошлом'
      }
      
      if (start >= end) {
        newErrors.endDate = 'Дата выезда должна быть позже даты заезда'
      }
      
      const days = calculateDaysBetween(start, end)
      if (days < 1) {
        newErrors.endDate = 'Минимальный период аренды - 1 день'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          message: formData.message
        })
      })

      const data = await response.json()

      if (data.success) {
        // Очищаем форму
        setFormData({
          startDate: '',
          endDate: '',
          message: ''
        })
        
        alert('Заявка на бронирование отправлена! Ожидайте подтверждения от арендодателя.')
        
        if (onBookingSuccess) {
          onBookingSuccess()
        }
      } else {
        setErrors({ general: data.error })
      }
    } catch (error) {
      setErrors({ general: 'Ошибка при отправке заявки' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const totalPrice = calculateTotal()

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(pricePerMonth)}
          </span>
          <span className="text-gray-600">в месяц</span>
        </div>
        <p className="text-sm text-gray-500">
          Цена может изменяться в зависимости от длительности аренды
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{errors.general}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <TeamsInput
              label="Дата заезда"
              name="startDate"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
            />
          </div>
          <div>
            <TeamsInput
              label="Дата выезда"
              name="endDate"
              type="date"
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
            />
          </div>
        </div>

        {totalPrice > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Количество дней:</span>
              <span>
                {calculateDaysBetween(new Date(formData.startDate), new Date(formData.endDate))}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Итого:</span>
              <span className="text-primary-600">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Сообщение арендодателю
          </label>
          <textarea
            name="message"
            rows={3}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
            placeholder="Расскажите о себе, укажите цель аренды..."
            value={formData.message}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500 mt-1">Необязательно</p>
        </div>

        <TeamsButton
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={!formData.startDate || !formData.endDate || totalPrice <= 0}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Забронировать
        </TeamsButton>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Бронирование бесплатно. Вы не будете списаны до подтверждения.
          </p>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Обычно арендодатели отвечают в течение 24 часов</span>
        </div>
      </div>
    </div>
  )
}