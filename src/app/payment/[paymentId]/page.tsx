'use client'

import { useState, useEffect } from 'react'
import { TeamsCard, TeamsButton, TeamsInput, TeamsBadge } from '@/components/ui/teams'
import { CreditCard, QrCode, CheckCircle, AlertCircle, Home, Calendar, Banknote } from 'lucide-react'

interface PaymentPageProps {
  params: {
    paymentId: string
  }
}

interface PaymentData {
  id: string
  amount: number
  description: string
  dueDate: string
  status: string
  property?: {
    title: string
    address: string
  }
  deal?: {
    tenant: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card')
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holder: ''
  })
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadPayment()
  }, [params.paymentId])

  const loadPayment = async () => {
    try {
      const response = await fetch(`/api/payments/${params.paymentId}/public`)
      const data = await response.json()

      if (data.success) {
        setPayment(data.data)
      } else {
        setError(data.error || 'Платеж не найден')
      }
    } catch (error) {
      setError('Ошибка загрузки платежа')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!payment) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/payments/${params.paymentId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          method: paymentMethod,
          cardData: paymentMethod === 'card' ? cardData : undefined
        })
      })

      const data = await response.json()

      if (data.success) {
        // Показываем успешное сообщение
        alert('Оплата прошла успешно!')
        // Перенаправляем на страницу успеха
        window.location.href = `/payment/${params.paymentId}/success`
      } else {
        setError(data.error || 'Ошибка при обработке платежа')
      }
    } catch (error) {
      setError('Ошибка при обработке платежа')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка платежа...</p>
        </div>
      </div>
    )
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <TeamsCard className="p-8 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ошибка</h2>
            <p className="text-gray-600 mb-4">{error || 'Платеж не найден'}</p>
            <TeamsButton onClick={() => window.history.back()}>
              Вернуться назад
            </TeamsButton>
          </div>
        </TeamsCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <CreditCard className="w-8 h-8 mr-3 text-blue-600" />
            Оплата аренды
          </h1>
          <p className="text-lg text-gray-600">
            Безопасная оплата через защищенное соединение
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Информация о платеже */}
          <TeamsCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Детали платежа
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Объект недвижимости:</span>
                <span className="font-medium text-gray-900">{payment.property?.title || 'Не указан'}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Адрес:</span>
                <span className="font-medium text-gray-900">{payment.property?.address || 'Не указан'}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Арендатор:</span>
                <span className="font-medium text-gray-900">
                  {payment.deal?.tenant ? 
                    `${payment.deal.tenant.firstName} ${payment.deal.tenant.lastName}` : 
                    'Не указан'
                  }
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Дата оплаты:</span>
                <span className="font-medium text-gray-900">
                  {new Date(payment.dueDate).toLocaleDateString('ru-RU')}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-600">Сумма к оплате:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {payment.amount.toLocaleString()} ₽
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Статус:</span>
                <TeamsBadge 
                  variant={payment.status === 'PAID' ? 'success' : payment.status === 'OVERDUE' ? 'error' : 'info'}
                >
                  {payment.status === 'PAID' ? 'Оплачен' : 
                   payment.status === 'OVERDUE' ? 'Просрочен' : 'Ожидает оплаты'}
                </TeamsBadge>
              </div>
            </div>
          </TeamsCard>

          {/* Форма оплаты */}
          <TeamsCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Способ оплаты
            </h2>

            <div className="space-y-6">
              {/* Выбор способа оплаты */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Выберите способ оплаты
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Банковская карта</div>
                      <div className="text-sm text-gray-600">Visa, MasterCard, МИР</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'bank')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Банковский перевод</div>
                      <div className="text-sm text-gray-600">СБП, банковский перевод</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Форма для карты */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Номер карты
                    </label>
                    <TeamsInput
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Срок действия
                      </label>
                      <TeamsInput
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <TeamsInput
                        type="text"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Владелец карты
                    </label>
                    <TeamsInput
                      type="text"
                      placeholder="IVAN IVANOV"
                      value={cardData.holder}
                      onChange={(e) => setCardData(prev => ({ ...prev, holder: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* Информация о банковском переводе */}
              {paymentMethod === 'bank' && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Реквизиты для оплаты:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Банк:</span>
                      <span className="font-medium">Тинькофф Банк</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Счет:</span>
                      <span className="font-medium">40702810123456789012</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">БИК:</span>
                      <span className="font-medium">044525974</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Получатель:</span>
                      <span className="font-medium">ООО "Риэлтор"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Назначение:</span>
                      <span className="font-medium">Оплата аренды {payment.property?.title}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Кнопка оплаты */}
              <TeamsButton
                onClick={handlePayment}
                disabled={processing || payment.status === 'PAID'}
                className="w-full"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Обработка...
                  </>
                ) : (
                  <>
                    <Banknote className="w-4 h-4 mr-2" />
                    {payment.status === 'PAID' ? 'Уже оплачен' : `Оплатить ${payment.amount.toLocaleString()} ₽`}
                  </>
                )}
              </TeamsButton>

              {/* Безопасность */}
              <div className="text-center text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Оплата защищена SSL-шифрованием
              </div>
            </div>
          </TeamsCard>
        </div>
      </div>
    </div>
  )
} 