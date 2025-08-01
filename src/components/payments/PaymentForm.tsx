'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { CreditCard, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface PaymentFormProps {
  amount: number
  description: string
  type: string
  contractId?: string
  bookingId?: string
  propertyId?: string
  onSuccess?: (payment: any) => void
  onCancel?: () => void
}

const paymentMethodOptions = [
  { value: 'card', label: 'Банковская карта' },
  { value: 'yoomoney', label: 'ЮMoney' },
  { value: 'qiwi', label: 'QIWI Кошелек' },
  { value: 'sbp', label: 'Система быстрых платежей' }
]

export function PaymentForm({
  amount,
  description,
  type,
  contractId,
  bookingId,
  propertyId,
  onSuccess,
  onCancel
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Создаем платеж
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          amount,
          description,
          contractId,
          bookingId,
          propertyId,
          provider: 'mock', // В реальном проекте здесь будет выбранный провайдер
          metadata: {
            paymentMethod,
            ...(paymentMethod === 'card' && { cardData })
          }
        })
      })

      const paymentData = await paymentResponse.json()

      if (!paymentData.success) {
        setErrors({ general: paymentData.error })
        return
      }

      // Имитируем процесс оплаты
      setTimeout(async () => {
        try {
          // Обновляем статус платежа на "завершен"
          const updateResponse = await fetch(`/api/payments/${paymentData.data.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              status: 'COMPLETED',
              paidAt: new Date().toISOString()
            })
          })

          const updateData = await updateResponse.json()

          if (updateData.success) {
            if (onSuccess) {
              onSuccess(updateData.data)
            }
          } else {
            setErrors({ general: 'Ошибка при подтверждении платежа' })
          }
        } catch (error) {
          setErrors({ general: 'Ошибка при обработке платежа' })
        } finally {
          setIsLoading(false)
        }
      }, 2000) // Имитируем задержку обработки

    } catch (error) {
      setErrors({ general: 'Ошибка при создании платежа' })
      setIsLoading(false)
    }
  }

  const handleCardDataChange = (field: string, value: string) => {
    // Форматирование данных карты
    if (field === 'number') {
      value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim()
      if (value.length > 19) value = value.slice(0, 19)
    } else if (field === 'expiry') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
      if (value.length > 5) value = value.slice(0, 5)
    } else if (field === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 3)
    }

    setCardData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <CreditCard className="h-6 w-6 text-primary-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Оплата</h2>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">{description}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">К оплате:</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(amount)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div className="text-sm text-red-700">{errors.general}</div>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <Select
          label="Способ оплаты"
          options={paymentMethodOptions}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />

        {/* Card Details */}
        {paymentMethod === 'card' && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-900">Данные карты</h3>
            
            <Input
              label="Номер карты"
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChange={(e) => handleCardDataChange('number', e.target.value)}
              error={errors.number}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Срок действия"
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={(e) => handleCardDataChange('expiry', e.target.value)}
                error={errors.expiry}
                required
              />

              <Input
                label="CVC"
                placeholder="123"
                value={cardData.cvc}
                onChange={(e) => handleCardDataChange('cvc', e.target.value)}
                error={errors.cvc}
                required
              />
            </div>

            <Input
              label="Имя владельца карты"
              placeholder="IVAN PETROV"
              value={cardData.name}
              onChange={(e) => handleCardDataChange('name', e.target.value.toUpperCase())}
              error={errors.name}
              required
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-6 border-t border-gray-200">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Отмена
            </Button>
          )}
          <Button 
            type="submit" 
            loading={isLoading} 
            className="flex-1"
            disabled={paymentMethod === 'card' && (!cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name)}
          >
            {isLoading ? 'Обработка...' : `Оплатить ${formatPrice(amount)}`}
          </Button>
        </div>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center pt-4">
          <p>🔒 Ваши данные защищены SSL-шифрованием</p>
          <p>Платежи обрабатываются через безопасные каналы</p>
        </div>
      </form>
    </div>
  )
}