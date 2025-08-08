'use client'

import { useState } from 'react'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Calendar,
  Send,
  CheckCircle
} from 'lucide-react'
import { 
  TeamsCard, 
  TeamsButton, 
  TeamsInput, 
  TeamsSelect,
  TeamsAlert
} from '@/components/ui/teams'

interface OwnerContactFormProps {
  onSuccess?: () => void
}

interface FormData {
  ownerName: string
  phone: string
  email: string
  address: string
  rentAmount: string
  rentPeriod: string
  comment: string
}

export default function OwnerContactForm({ onSuccess }: OwnerContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    rentAmount: '',
    rentPeriod: '11',
    comment: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateCommission = () => {
    const amount = parseFloat(formData.rentAmount) || 0
    return Math.round(amount * 0.725)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/yandex-rental/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          rentAmount: parseFloat(formData.rentAmount) || 0,
          rentPeriod: parseInt(formData.rentPeriod),
          commission: calculateCommission()
        })
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          onSuccess?.()
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Ошибка при отправке контакта')
      }
    } catch (error) {
      setError('Ошибка сети. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <TeamsCard className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Контакт успешно передан!
          </h3>
          <p className="text-gray-600">
            Менеджеры Яндекс.Аренда свяжутся с собственником в течение часа
          </p>
        </div>
      </TeamsCard>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <TeamsAlert variant="error" title="Ошибка">
          {error}
        </TeamsAlert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ФИО собственника */}
        <div>
          <TeamsInput
            label="ФИО собственника"
            placeholder="Иванов Иван Иванович"
            value={formData.ownerName}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />
        </div>

        {/* Телефон */}
        <div>
          <TeamsInput
            label="Телефон"
            placeholder="+7 (999) 123-45-67"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            icon={<Phone className="w-4 h-4" />}
            required
          />
        </div>

        {/* Email */}
        <div>
          <TeamsInput
            label="Email (необязательно)"
            type="email"
            placeholder="owner@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />
        </div>

        {/* Адрес объекта */}
        <div>
          <TeamsInput
            label="Адрес объекта"
            placeholder="г. Москва, ул. Тверская, д. 1, кв. 1"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            icon={<MapPin className="w-4 h-4" />}
            required
          />
        </div>

        {/* Стоимость аренды */}
        <div>
          <TeamsInput
            label="Стоимость аренды (₽/мес)"
            type="number"
            placeholder="50000"
            value={formData.rentAmount}
            onChange={(e) => handleChange('rentAmount', e.target.value)}
            icon={<DollarSign className="w-4 h-4" />}
            required
          />
        </div>

        {/* Срок аренды */}
        <div>
          <TeamsSelect
            label="Срок аренды"
            value={formData.rentPeriod}
            onChange={(e) => handleChange('rentPeriod', e.target.value)}
            options={[
              { value: '11', label: '11 месяцев' },
              { value: '12', label: '12 месяцев' },
              { value: '6', label: '6 месяцев' },
              { value: '3', label: '3 месяца' }
            ]}
          />
        </div>
      </div>

      {/* Комментарий */}
      <div>
        <TeamsInput
          label="Комментарий (необязательно)"
          placeholder="Дополнительная информация о собственнике или объекте"
          value={formData.comment}
          onChange={(e) => handleChange('comment', e.target.value)}
          as="textarea"
          rows={3}
        />
      </div>

      {/* Расчет комиссии */}
      {formData.rentAmount && (
        <TeamsCard className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ваша комиссия составит:</p>
              <p className="text-2xl font-bold text-blue-600">
                {calculateCommission().toLocaleString('ru-RU')} ₽
              </p>
              <p className="text-xs text-gray-500">
                (72.5% от первого арендного платежа)
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Стоимость аренды:</p>
              <p className="text-lg font-semibold text-gray-900">
                {parseInt(formData.rentAmount).toLocaleString('ru-RU')} ₽/мес
              </p>
            </div>
          </div>
        </TeamsCard>
      )}

      {/* Кнопки */}
      <div className="flex justify-end space-x-4 pt-4">
        <TeamsButton
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !formData.ownerName || !formData.phone || !formData.address || !formData.rentAmount}
          className="px-8"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Отправка...' : 'Передать контакт'}
        </TeamsButton>
      </div>
    </form>
  )
} 