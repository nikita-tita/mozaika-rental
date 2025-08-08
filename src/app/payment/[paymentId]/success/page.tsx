'use client'

import { useState, useEffect } from 'react'
import { TeamsCard, TeamsButton } from '@/components/ui/teams'
import { CheckCircle, Download, Mail, Home } from 'lucide-react'

interface PaymentSuccessPageProps {
  params: {
    paymentId: string
  }
}

interface PaymentData {
  id: string
  amount: number
  paidAt: string
  property?: {
    title: string
  }
}

export default function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayment()
  }, [params.paymentId])

  const loadPayment = async () => {
    try {
      const response = await fetch(`/api/payments/${params.paymentId}/public`)
      const data = await response.json()

      if (data.success) {
        setPayment(data.data)
      }
    } catch (error) {
      console.error('Error loading payment:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadReceipt = () => {
    // В реальном проекте здесь была бы генерация PDF чека
    alert('Функция скачивания чека будет доступна в ближайшее время')
  }

  const sendReceiptByEmail = () => {
    // В реальном проекте здесь была бы отправка чека по email
    alert('Функция отправки чека по email будет доступна в ближайшее время')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeamsCard className="p-8 text-center">
          {/* Иконка успеха */}
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
          </div>

          {/* Заголовок */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Оплата прошла успешно!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Спасибо за оплату. Ваш платеж был обработан и подтвержден.
          </p>

          {/* Информация о платеже */}
          {payment && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-gray-600">Номер платежа:</span>
                  <div className="font-medium text-gray-900">{payment.id}</div>
                </div>
                <div>
                  <span className="text-gray-600">Сумма:</span>
                  <div className="font-medium text-gray-900">{payment.amount.toLocaleString()} ₽</div>
                </div>
                <div>
                  <span className="text-gray-600">Объект:</span>
                  <div className="font-medium text-gray-900">{payment.property?.title || 'Не указан'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Дата оплаты:</span>
                  <div className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Действия */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <TeamsButton onClick={downloadReceipt} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Скачать чек
              </TeamsButton>
              <TeamsButton onClick={sendReceiptByEmail} variant="outline" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Отправить чек по email
              </TeamsButton>
            </div>

            <TeamsButton onClick={() => window.close()} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Закрыть
            </TeamsButton>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Чек будет отправлен на ваш email в течение 5 минут. 
              Если у вас есть вопросы, обратитесь к вашему агенту по недвижимости.
            </p>
          </div>
        </TeamsCard>
      </div>
    </div>
  )
} 