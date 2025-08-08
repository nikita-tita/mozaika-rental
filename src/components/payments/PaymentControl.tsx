'use client'

import { useState, useEffect } from 'react'
import { TeamsCard, TeamsButton, TeamsInput, TeamsSelect, TeamsModal, TeamsBadge } from '@/components/ui/teams'
import { Bell, CreditCard, QrCode, Link, Settings, Calendar, DollarSign, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface PaymentReminder {
  id: string
  paymentId: string
  type: 'EMAIL' | 'SMS' | 'WHATSAPP'
  message: string
  scheduledAt: Date
  sentAt?: Date
  status: 'SCHEDULED' | 'SENT' | 'FAILED'
}

interface PaymentControlProps {
  paymentId: string
  amount: number
  dueDate: Date
  tenantEmail?: string
  tenantPhone?: string
  propertyTitle?: string
  onReminderSent?: (reminder: PaymentReminder) => void
}

export default function PaymentControl({
  paymentId,
  amount,
  dueDate,
  tenantEmail,
  tenantPhone,
  propertyTitle,
  onReminderSent
}: PaymentControlProps) {
  const [reminders, setReminders] = useState<PaymentReminder[]>([])
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showPaymentLinkModal, setShowPaymentLinkModal] = useState(false)
  const [reminderForm, setReminderForm] = useState({
    type: 'EMAIL' as 'EMAIL' | 'SMS' | 'WHATSAPP',
    message: '',
    scheduledAt: new Date().toISOString().slice(0, 16),
    customMessage: ''
  })
  const [paymentLink, setPaymentLink] = useState('')
  const [qrCode, setQrCode] = useState('')

  // Загрузка напоминаний
  const loadReminders = async () => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/reminders`)
      const data = await response.json()
      if (data.success) {
        setReminders(data.data)
      }
    } catch (error) {
      console.error('Error loading reminders:', error)
    }
  }

  useEffect(() => {
    loadReminders()
  }, [paymentId])

  // Создание напоминания
  const createReminder = async () => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: reminderForm.type,
          message: reminderForm.customMessage || getDefaultMessage(),
          scheduledAt: reminderForm.scheduledAt
        })
      })

      const data = await response.json()
      if (data.success) {
        setShowReminderModal(false)
        loadReminders()
        if (onReminderSent) {
          onReminderSent(data.data)
        }
      }
    } catch (error) {
      console.error('Error creating reminder:', error)
    }
  }

  // Генерация ссылки для оплаты
  const generatePaymentLink = async () => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/payment-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          description: `Оплата аренды: ${propertyTitle}`
        })
      })

      const data = await response.json()
      if (data.success) {
        setPaymentLink(data.data.paymentLink)
        setQrCode(data.data.qrCode)
        setShowPaymentLinkModal(true)
      }
    } catch (error) {
      console.error('Error generating payment link:', error)
    }
  }

  // Получение стандартного сообщения
  const getDefaultMessage = () => {
    const daysUntilDue = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilDue > 0) {
      return `Добрый день! Напоминаем, что ${daysUntilDue} ${daysUntilDue === 1 ? 'день' : 'дней'} до оплаты аренды ${propertyTitle}. Сумма к оплате: ${amount.toLocaleString()} ₽. Хорошего дня!`
    } else if (daysUntilDue === 0) {
      return `Добрый день! Сегодня последний день для оплаты аренды ${propertyTitle}. Сумма к оплате: ${amount.toLocaleString()} ₽. Спасибо!`
    } else {
      return `Добрый день! Платеж по аренде ${propertyTitle} просрочен на ${Math.abs(daysUntilDue)} ${Math.abs(daysUntilDue) === 1 ? 'день' : 'дней'}. Сумма к оплате: ${amount.toLocaleString()} ₽. Просим произвести оплату в ближайшее время.`
    }
  }

  // Автоматическое заполнение сообщения при изменении типа
  useEffect(() => {
    if (!reminderForm.customMessage) {
      setReminderForm(prev => ({
        ...prev,
        message: getDefaultMessage()
      }))
    }
  }, [reminderForm.type, dueDate])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'SCHEDULED':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'FAILED':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return <TeamsBadge variant="success">Отправлено</TeamsBadge>
      case 'SCHEDULED':
        return <TeamsBadge variant="info">Запланировано</TeamsBadge>
      case 'FAILED':
        return <TeamsBadge variant="error">Ошибка</TeamsBadge>
      default:
        return <TeamsBadge variant="neutral">Неизвестно</TeamsBadge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Основная информация о платеже */}
      <TeamsCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Контроль оплаты
          </h3>
          <TeamsBadge variant={new Date(dueDate) < new Date() ? 'error' : 'info'}>
            {new Date(dueDate) < new Date() ? 'Просрочен' : 'Активен'}
          </TeamsBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{amount.toLocaleString()} ₽</div>
            <div className="text-sm text-gray-600">Сумма к оплате</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {new Date(dueDate).toLocaleDateString('ru-RU')}
            </div>
            <div className="text-sm text-gray-600">Дата оплаты</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">{reminders.length}</div>
            <div className="text-sm text-gray-600">Напоминаний</div>
          </div>
        </div>

        <div className="flex gap-3">
          <TeamsButton onClick={() => setShowReminderModal(true)} className="flex-1">
            <Bell className="w-4 h-4 mr-2" />
            Настроить напоминание
          </TeamsButton>
          <TeamsButton onClick={generatePaymentLink} variant="outline" className="flex-1">
            <Link className="w-4 h-4 mr-2" />
            Создать ссылку для оплаты
          </TeamsButton>
        </div>
      </TeamsCard>

      {/* История напоминаний */}
      <TeamsCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          История напоминаний
        </h3>

        {reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Напоминания не настроены</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(reminder.status)}
                  <div>
                    <div className="font-medium text-gray-900">
                      {reminder.type === 'EMAIL' ? 'Email' : reminder.type === 'SMS' ? 'SMS' : 'WhatsApp'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {reminder.scheduledAt ? new Date(reminder.scheduledAt).toLocaleString('ru-RU') : 'Не запланировано'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(reminder.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </TeamsCard>

      {/* Модальное окно создания напоминания */}
      <TeamsModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        title="Настройка автоматического напоминания"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип уведомления
            </label>
            <TeamsSelect
              options={[
                { value: 'EMAIL', label: 'Email' },
                { value: 'SMS', label: 'SMS' },
                { value: 'WHATSAPP', label: 'WhatsApp' }
              ]}
              value={reminderForm.type}
              onChange={(value) => setReminderForm(prev => ({ ...prev, type: value as any }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата и время отправки
            </label>
            <TeamsInput
              type="datetime-local"
              value={reminderForm.scheduledAt}
              onChange={(e) => setReminderForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сообщение
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={reminderForm.customMessage || getDefaultMessage()}
              onChange={(e) => setReminderForm(prev => ({ ...prev, customMessage: e.target.value }))}
              placeholder="Введите текст сообщения..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <TeamsButton onClick={createReminder} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Создать напоминание
            </TeamsButton>
            <TeamsButton onClick={() => setShowReminderModal(false)} variant="outline">
              Отмена
            </TeamsButton>
          </div>
        </div>
      </TeamsModal>

      {/* Модальное окно ссылки для оплаты */}
      <TeamsModal
        isOpen={showPaymentLinkModal}
        onClose={() => setShowPaymentLinkModal(false)}
        title="Ссылка для оплаты"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mb-4">
              <QrCode className="w-32 h-32 mx-auto text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Отсканируйте QR-код или перейдите по ссылке для оплаты
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ссылка для оплаты
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={paymentLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <TeamsButton
                onClick={() => navigator.clipboard.writeText(paymentLink)}
                variant="outline"
                size="sm"
              >
                Копировать
              </TeamsButton>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <TeamsButton
              onClick={() => window.open(paymentLink, '_blank')}
              className="flex-1"
            >
              <Link className="w-4 h-4 mr-2" />
              Перейти к оплате
            </TeamsButton>
            <TeamsButton onClick={() => setShowPaymentLinkModal(false)} variant="outline">
              Закрыть
            </TeamsButton>
          </div>
        </div>
      </TeamsModal>
    </div>
  )
} 