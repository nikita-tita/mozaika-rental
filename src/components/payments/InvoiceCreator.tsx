'use client'

import { useState } from 'react'
import { TeamsModal, TeamsButton, TeamsInput, TeamsSelect, TeamsCard } from '@/components/ui/teams'
import { FileText, Download, Send, AlertCircle, CheckCircle } from 'lucide-react'

interface InvoiceCreatorProps {
  isOpen: boolean
  onClose: () => void
  payment: any
  onSuccess?: (invoiceData: any) => void
}

interface InvoiceFormData {
  invoiceNumber: string
  dueDate: string
  notes: string
  includeBreakdown: boolean
}

export default function InvoiceCreator({
  isOpen,
  onClose,
  payment,
  onSuccess
}: InvoiceCreatorProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: '',
    dueDate: '',
    notes: '',
    includeBreakdown: true
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [generatedInvoice, setGeneratedInvoice] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payments/generate-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId: payment.id,
          ...formData
        })
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedInvoice(data.data)
        setSuccess(true)
        
        if (onSuccess) {
          onSuccess(data.data)
        }

        // Автоматически закрываем модальное окно через 2 секунды
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setGeneratedInvoice(null)
        }, 2000)
      } else {
        setError(data.error || 'Ошибка при создании счета')
      }
    } catch (error) {
      console.error('Error creating invoice:', error)
      setError('Ошибка при создании счета')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (generatedInvoice?.pdfUrl) {
      // В реальном проекте здесь будет скачивание PDF
      window.open(generatedInvoice.pdfUrl, '_blank')
    }
  }

  const handleSend = async () => {
    if (!generatedInvoice) return

    try {
      const response = await fetch('/api/payments/send-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId: payment.id,
          reminderType: 'EMAIL',
          includeInvoice: true
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Счет отправлен арендатору')
      } else {
        alert('Ошибка при отправке счета: ' + data.error)
      }
    } catch (error) {
      console.error('Error sending invoice:', error)
      alert('Ошибка при отправке счета')
    }
  }

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'RENT':
        return 'Арендная плата'
      case 'UTILITIES':
        return 'Коммунальные услуги'
      case 'DEPOSIT':
        return 'Депозит'
      case 'MAINTENANCE':
        return 'Обслуживание'
      default:
        return 'Платеж'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Оплачен'
      case 'PENDING':
        return 'Ожидает оплаты'
      case 'OVERDUE':
        return 'Просрочен'
      default:
        return 'Неизвестно'
    }
  }

  return (
    <TeamsModal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Создать счет
          </h2>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Информация о платеже */}
            <TeamsCard className="p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">Информация о платеже</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Тип:</span>
                  <p className="font-medium">{getPaymentTypeLabel(payment?.type)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Сумма:</span>
                  <p className="font-medium">{payment?.amount?.toLocaleString()} ₽</p>
                </div>
                <div>
                  <span className="text-gray-600">Статус:</span>
                  <p className="font-medium">{getStatusLabel(payment?.status)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Срок:</span>
                  <p className="font-medium">
                    {payment?.dueDate ? new Date(payment.dueDate).toLocaleDateString('ru-RU') : 'Не указан'}
                  </p>
                </div>
              </div>
            </TeamsCard>

            {/* Форма счета */}
            <div className="space-y-4">
              <TeamsInput
                label="Номер счета"
                placeholder="Автоматически генерируется"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                disabled
              />

              <TeamsInput
                label="Срок оплаты"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дополнительные примечания
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Дополнительная информация для счета..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeBreakdown"
                  checked={formData.includeBreakdown}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeBreakdown: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="includeBreakdown" className="text-sm text-gray-700">
                  Включить детализацию платежей
                </label>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <TeamsButton
                type="submit"
                loading={loading}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Создать счет
              </TeamsButton>
              <TeamsButton
                type="button"
                onClick={onClose}
                variant="outline"
              >
                Отмена
              </TeamsButton>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Счет успешно создан!
            </h3>
            <p className="text-gray-600 mb-6">
              Номер счета: {generatedInvoice?.invoiceData?.invoiceNumber}
            </p>
            
            <div className="flex gap-3 justify-center">
              <TeamsButton onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Скачать PDF
              </TeamsButton>
              <TeamsButton onClick={handleSend} variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Отправить
              </TeamsButton>
            </div>
          </div>
        )}
      </div>
    </TeamsModal>
  )
} 