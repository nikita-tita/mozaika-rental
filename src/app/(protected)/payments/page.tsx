'use client'

import { useState, useEffect } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsInput, TeamsSelect, TeamsModal } from '@/components/ui/teams'
import { CreditCard, TrendingUp, Calendar, Calculator, Banknote, AlertCircle, FileText, Send, Plus, RefreshCw, Bell } from 'lucide-react'
import PaymentControl from '@/components/payments/PaymentControl'
import InvoiceCreator from '@/components/payments/InvoiceCreator'
import GeneratePaymentsForm from '@/components/payments/GeneratePaymentsForm'
import ReminderStatus from '@/components/payments/ReminderStatus'
import { formatPriceWithSymbol } from '@/lib/utils'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showGeneratePaymentsModal, setShowGeneratePaymentsModal] = useState(false)
  const [selectedPaymentForControl, setSelectedPaymentForControl] = useState<any>(null)
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    dateFrom: '',
    dateTo: ''
  })

  // Загрузка платежей
  const loadPayments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.type) params.append('type', filters.type)
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)

      const response = await fetch(`/api/payments?${params}`)
      const data = await response.json()

      if (data.success) {
        setPayments(data.data)
      }
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [filters])

  const paymentTypes = [
    { value: 'RENT', label: 'Арендная плата' },
    { value: 'UTILITIES', label: 'Коммунальные услуги' },
    { value: 'DEPOSIT', label: 'Депозит' },
    { value: 'MAINTENANCE', label: 'Обслуживание' }
  ]

  const paymentStatuses = [
    { value: 'PENDING', label: 'Ожидает оплаты' },
    { value: 'PAID', label: 'Оплачен' },
    { value: 'OVERDUE', label: 'Просрочен' },
    { value: 'CANCELLED', label: 'Отменен' }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <TeamsBadge variant="success">Оплачен</TeamsBadge>
      case 'PENDING':
        return <TeamsBadge variant="warning">Ожидает оплаты</TeamsBadge>
      case 'OVERDUE':
        return <TeamsBadge variant="error">Просрочен</TeamsBadge>
      case 'CANCELLED':
        return <TeamsBadge variant="default">Отменен</TeamsBadge>
      default:
        return <TeamsBadge variant="default">Неизвестно</TeamsBadge>
    }
  }

  const getPaymentTypeLabel = (type: string) => {
    return paymentTypes.find(t => t.value === type)?.label || type
  }

  const totalIncome = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0)
  const pendingPayments = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0)
  const overduePayments = payments.filter(p => p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0)

  const handleReminder = async (paymentId: string, type: 'EMAIL' | 'SMS') => {
    try {
      const response = await fetch('/api/payments/send-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId,
          reminderType: type
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`Напоминание отправлено арендатору: ${data.data.recipient.name}`)
        loadPayments() // Обновляем список для отображения статуса
      } else {
        alert('Ошибка при отправке напоминания: ' + data.error)
      }
    } catch (error) {
      console.error('Error sending reminder:', error)
      alert('Ошибка при отправке напоминания')
    }
  }

  const handleCreateInvoice = (payment: any) => {
    setSelectedPayment(payment)
    setShowInvoiceModal(true)
  }

  const handleInvoiceSuccess = () => {
    loadPayments() // Обновляем список после создания счета
  }

  const handleGeneratePaymentsSuccess = () => {
    loadPayments() // Обновляем список после генерации платежей
  }

  const handlePaymentControl = (payment: any) => {
    setSelectedPaymentForControl(payment)
  }

  const handleReminderSent = (reminder: any) => {
    alert('Напоминание успешно создано')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-8 h-8 mr-3 text-blue-600" />
            Платежи и расчеты
          </h1>
          <p className="text-lg text-gray-600">
            Автоматизация расчетов арендной платы, коммунальных услуг и депозитов
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatPriceWithSymbol(totalIncome)}
            </div>
            <div className="text-gray-600">Общий доход</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {formatPriceWithSymbol(pendingPayments)}
            </div>
            <div className="text-gray-600">Ожидает оплаты</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {formatPriceWithSymbol(overduePayments)}
            </div>
            <div className="text-gray-600">Просроченные платежи</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {payments.length}
            </div>
            <div className="text-gray-600">Всего операций</div>
          </TeamsCard>
        </div>

        {/* Контроль оплат */}
        {selectedPaymentForControl && (
          <div className="mb-8">
            <PaymentControl
              paymentId={selectedPaymentForControl.id}
              amount={selectedPaymentForControl.amount}
              dueDate={new Date(selectedPaymentForControl.dueDate)}
              tenantEmail={selectedPaymentForControl.deal?.tenant?.email}
              tenantPhone={selectedPaymentForControl.deal?.tenant?.phone}
              propertyTitle={selectedPaymentForControl.property?.title}
              onReminderSent={handleReminderSent}
            />
          </div>
        )}

        {/* Фильтры */}
        <TeamsCard className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Фильтры</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-2">
                Статус
              </label>
              <TeamsSelect
                options={paymentStatuses}
                value={filters.status}
                onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                placeholder="Все статусы"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-2">
                Тип платежа
              </label>
              <TeamsSelect
                options={paymentTypes}
                value={filters.type}
                onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                placeholder="Все типы"
              />
            </div>
            <TeamsInput
              label="Дата с"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            />
            <TeamsInput
              label="Дата по"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            />
          </div>
        </TeamsCard>

        {/* Список платежей */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">История платежей</h2>
            <div className="flex gap-2">
              <TeamsButton onClick={loadPayments} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Обновить
              </TeamsButton>
              <TeamsButton onClick={() => setShowGeneratePaymentsModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Создать платежи
              </TeamsButton>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Загрузка платежей...</p>
            </div>
          ) : payments.length === 0 ? (
            <TeamsCard className="p-8 text-center">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Платежи не найдены</p>
              <TeamsButton onClick={() => setShowGeneratePaymentsModal(true)}>
                Создать первый платеж
              </TeamsButton>
            </TeamsCard>
          ) : (
            payments.map((payment) => (
              <TeamsCard key={payment.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {payment.deal?.property?.title || payment.property?.title || 'Объект не указан'}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Арендатор: {(payment.deal?.tenant?.firstName && payment.deal?.tenant?.lastName) ? `${payment.deal.tenant.firstName} ${payment.deal.tenant.lastName}` : (payment.deal?.client?.firstName && payment.deal?.client?.lastName) ? `${payment.deal.client.firstName} ${payment.deal.client.lastName}` : 'Не указан'}</div>
                      <div>Тип: {getPaymentTypeLabel(payment.type)}</div>
                      <div>Дата: {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('ru-RU') : 'Не указана'}</div>
                      {payment.invoiceNumber && (
                        <div>Счет: {payment.invoiceNumber}</div>
                      )}
                      {payment.reminderSentAt && (
                        <div className="text-yellow-600">
                          Напоминание отправлено: {new Date(payment.reminderSentAt).toLocaleDateString('ru-RU')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {formatPriceWithSymbol(payment.amount)}
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
                
                                 <div className="flex gap-2">
                   <TeamsButton
                     onClick={() => handleCreateInvoice(payment)}
                     variant="outline"
                     size="sm"
                   >
                     <FileText className="w-4 h-4 mr-2" />
                     Создать счет
                   </TeamsButton>
                   <TeamsButton
                     onClick={() => handlePaymentControl(payment)}
                     variant="outline"
                     size="sm"
                   >
                     <Bell className="w-4 h-4 mr-2" />
                     Контроль оплаты
                   </TeamsButton>
                 </div>
                 
                 {/* Статус уведомлений */}
                 <div className="mt-4 pt-4 border-t border-gray-200">
                   <ReminderStatus
                     payment={payment}
                     onSendReminder={handleReminder}
                   />
                 </div>
              </TeamsCard>
            ))
          )}
        </div>

        {/* Информационные карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TeamsCard className="p-6 text-center">
            <Bell className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Автоматические напоминания</h3>
            <p className="text-gray-600">
              Настройте автоматическую отправку напоминаний с персональными сообщениями
            </p>
          </TeamsCard>
          
          <TeamsCard className="p-6 text-center">
            <CreditCard className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Оплата по ссылке</h3>
            <p className="text-gray-600">
              Создавайте ссылки и QR-коды для быстрой оплаты арендаторами
            </p>
          </TeamsCard>
          
          <TeamsCard className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Контроль платежей</h3>
            <p className="text-gray-600">
              Отслеживайте статус платежей и управляйте процессом оплаты
            </p>
          </TeamsCard>
        </div>
      </div>

      {/* Модальное окно создания счета */}
      {selectedPayment && (
        <InvoiceCreator
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false)
            setSelectedPayment(null)
          }}
          payment={selectedPayment}
          onSuccess={handleInvoiceSuccess}
        />
      )}

      {/* Модальное окно генерации платежей */}
      <GeneratePaymentsForm
        isOpen={showGeneratePaymentsModal}
        onClose={() => setShowGeneratePaymentsModal(false)}
        onSuccess={handleGeneratePaymentsSuccess}
        deals={[]} // Здесь должны быть загружены сделки
        contracts={[]} // Здесь должны быть загружены договоры
      />
    </div>
  )
}