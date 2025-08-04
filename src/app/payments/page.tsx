'use client'

import { useState } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsInput, TeamsSelect, TeamsModal } from '@/components/ui/teams'
import { CreditCard, TrendingUp, Calendar, Calculator, DollarSign, AlertCircle } from 'lucide-react'

export default function PaymentsPage() {
  const [calculatorData, setCalculatorData] = useState({
    rent: '',
    utilities: '',
    deposit: ''
  })
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [payments, setPayments] = useState([
    {
      id: '1',
      property: '2-к квартира, ул. Ленина, 1',
      tenant: 'Иванов И.И.',
      amount: 45000,
      date: '2024-01-01',
      status: 'PAID',
      type: 'RENT'
    },
    {
      id: '2',
      property: 'Офис, ул. Пушкина, 10',
      tenant: 'ООО "Рога и копыта"',
      amount: 120000,
      date: '2024-02-01',
      status: 'PENDING',
      type: 'UTILITIES'
    }
  ])

  const paymentTypes = [
    { value: 'RENT', label: 'Арендная плата' },
    { value: 'UTILITIES', label: 'Коммунальные услуги' },
    { value: 'DEPOSIT', label: 'Депозит' },
    { value: 'PENALTY', label: 'Штраф' }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <TeamsBadge variant="success">Оплачен</TeamsBadge>
      case 'PENDING':
        return <TeamsBadge variant="warning">Ожидает оплаты</TeamsBadge>
      case 'OVERDUE':
        return <TeamsBadge variant="error">Просрочен</TeamsBadge>
      default:
        return <TeamsBadge variant="default">Неизвестно</TeamsBadge>
    }
  }

  const totalIncome = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0)
  const pendingPayments = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0)
  const overduePayments = payments.filter(p => p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0)

  // Расчет итоговой суммы
  const calculateTotal = () => {
    const rent = parseFloat(calculatorData.rent) || 0
    const utilities = parseFloat(calculatorData.utilities) || 0
    const deposit = parseFloat(calculatorData.deposit) || 0
    return rent + utilities + deposit
  }

  const handleReminder = (payment: any) => {
    // Имитация отправки напоминания
    alert(`Напоминание отправлено арендатору: ${payment.tenant}\nСумма: ${payment.amount.toLocaleString()} ₽\nДата: ${payment.date}`)
  }

  const handleCreateInvoice = (payment: any) => {
    setSelectedPayment(payment)
    setShowInvoiceModal(true)
  }

  const handleGenerateReport = (payment: any) => {
    setSelectedPayment(payment)
    setShowReportModal(true)
  }

  const handleDownloadInvoice = () => {
    if (!selectedPayment) return

    const invoiceText = `
СЧЕТ НА ОПЛАТУ

Номер счета: INV-${selectedPayment.id}
Дата: ${new Date().toLocaleDateString('ru-RU')}

Арендодатель: Управляющая компания
Арендатор: ${selectedPayment.tenant}
Объект: ${selectedPayment.property}

Детали платежа:
- Тип: ${paymentTypes.find(t => t.value === selectedPayment.type)?.label}
- Сумма: ${selectedPayment.amount.toLocaleString()} ₽
- Дата оплаты: ${selectedPayment.date}

Итого к оплате: ${selectedPayment.amount.toLocaleString()} ₽

Реквизиты для оплаты:
Банк: Сбербанк
Счет: 40702810123456789012
ИНН: 1234567890
КПП: 123456789

Спасибо за своевременную оплату!
    `

    const blob = new Blob([invoiceText], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${selectedPayment.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleDownloadReport = () => {
    if (!selectedPayment) return

    const reportText = `
ОТЧЕТ ПО ПЛАТЕЖУ

Номер платежа: ${selectedPayment.id}
Дата отчета: ${new Date().toLocaleDateString('ru-RU')}

Детали платежа:
- Объект: ${selectedPayment.property}
- Арендатор: ${selectedPayment.tenant}
- Тип: ${paymentTypes.find(t => t.value === selectedPayment.type)?.label}
- Сумма: ${selectedPayment.amount.toLocaleString()} ₽
- Дата: ${selectedPayment.date}
- Статус: ${selectedPayment.status}

Аналитика:
- Средняя сумма платежей: ${(payments.reduce((sum, p) => sum + p.amount, 0) / payments.length).toLocaleString()} ₽
- Всего платежей: ${payments.length}
- Оплаченных: ${payments.filter(p => p.status === 'PAID').length}
- Ожидающих: ${payments.filter(p => p.status === 'PENDING').length}
- Просроченных: ${payments.filter(p => p.status === 'OVERDUE').length}

Рекомендации:
- Следите за своевременностью оплат
- Отправляйте напоминания за 3 дня до срока
- Анализируйте статистику ежемесячно
    `

    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${selectedPayment.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
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
              {totalIncome.toLocaleString()} ₽
            </div>
            <div className="text-gray-600">Общий доход</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {pendingPayments.toLocaleString()} ₽
            </div>
            <div className="text-gray-600">Ожидает оплаты</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {overduePayments.toLocaleString()} ₽
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

        {/* Калькулятор */}
        <TeamsCard className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Калькулятор платежей
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TeamsInput
              label="Арендная плата (₽/мес)"
              placeholder="45000"
              value={calculatorData.rent}
              onChange={(e) => setCalculatorData(prev => ({ ...prev, rent: e.target.value }))}
            />
            <TeamsInput
              label="Коммунальные услуги (₽/мес)"
              placeholder="5000"
              value={calculatorData.utilities}
              onChange={(e) => setCalculatorData(prev => ({ ...prev, utilities: e.target.value }))}
            />
            <TeamsInput
              label="Депозит (₽)"
              placeholder="45000"
              value={calculatorData.deposit}
              onChange={(e) => setCalculatorData(prev => ({ ...prev, deposit: e.target.value }))}
            />
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              Итого к оплате: {calculateTotal().toLocaleString()} ₽
            </div>
            <div className="text-sm text-gray-600">
              Аренда: {(parseFloat(calculatorData.rent) || 0).toLocaleString()} ₽ + 
              Коммунальные: {(parseFloat(calculatorData.utilities) || 0).toLocaleString()} ₽ + 
              Депозит: {(parseFloat(calculatorData.deposit) || 0).toLocaleString()} ₽
            </div>
          </div>
        </TeamsCard>

        {/* Список платежей */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">История платежей</h2>
          
          {payments.map((payment) => (
            <TeamsCard key={payment.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{payment.property}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Арендатор: {payment.tenant}</div>
                    <div>Тип: {paymentTypes.find(t => t.value === payment.type)?.label}</div>
                    <div>Дата: {payment.date}</div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {payment.amount.toLocaleString()} ₽
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
              </div>
              
              <div className="flex gap-2">
                <TeamsButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleReminder(payment)}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Напомнить
                </TeamsButton>
                <TeamsButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCreateInvoice(payment)}
                >
                  <DollarSign className="w-4 h-4 mr-1" />
                  Создать счет
                </TeamsButton>
                <TeamsButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerateReport(payment)}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Отчет
                </TeamsButton>
              </div>
            </TeamsCard>
          ))}
        </div>

        {/* Автоматизация */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TeamsCard className="p-6 text-center">
            <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Автоматические расчеты</h3>
            <p className="text-gray-600">
              Система автоматически рассчитывает арендную плату и коммунальные услуги
            </p>
          </TeamsCard>
          
          <TeamsCard className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Напоминания</h3>
            <p className="text-gray-600">
              Автоматические уведомления о предстоящих платежах и просрочках
            </p>
          </TeamsCard>
          
          <TeamsCard className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Аналитика</h3>
            <p className="text-gray-600">
              Детальная аналитика доходов и расходов по каждому объекту
            </p>
          </TeamsCard>
        </div>
      </div>

      {/* Модальное окно создания счета */}
      <TeamsModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Создание счета"
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Детали счета</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Объект:</strong> {selectedPayment.property}</div>
                <div><strong>Арендатор:</strong> {selectedPayment.tenant}</div>
                <div><strong>Тип платежа:</strong> {paymentTypes.find(t => t.value === selectedPayment.type)?.label}</div>
                <div><strong>Сумма:</strong> {selectedPayment.amount.toLocaleString()} ₽</div>
                <div><strong>Дата:</strong> {selectedPayment.date}</div>
              </div>
            </div>
            
            <div className="bg-white border p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Предварительный просмотр счета:</h4>
              <div className="text-sm space-y-2">
                <p><strong>СЧЕТ НА ОПЛАТУ</strong></p>
                <p><strong>Номер:</strong> INV-{selectedPayment.id}</p>
                <p><strong>Дата:</strong> {new Date().toLocaleDateString('ru-RU')}</p>
                <p><strong>Арендатор:</strong> {selectedPayment.tenant}</p>
                <p><strong>Объект:</strong> {selectedPayment.property}</p>
                <p><strong>Сумма к оплате:</strong> {selectedPayment.amount.toLocaleString()} ₽</p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <TeamsButton
                onClick={handleDownloadInvoice}
                className="flex-1"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Скачать счет
              </TeamsButton>
              <TeamsButton
                variant="outline"
                onClick={() => setShowInvoiceModal(false)}
                className="flex-1"
              >
                Отмена
              </TeamsButton>
            </div>
          </div>
        )}
      </TeamsModal>

      {/* Модальное окно отчета */}
      <TeamsModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Генерация отчета"
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Детали платежа</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Объект:</strong> {selectedPayment.property}</div>
                <div><strong>Арендатор:</strong> {selectedPayment.tenant}</div>
                <div><strong>Тип:</strong> {paymentTypes.find(t => t.value === selectedPayment.type)?.label}</div>
                <div><strong>Сумма:</strong> {selectedPayment.amount.toLocaleString()} ₽</div>
                <div><strong>Статус:</strong> {getStatusBadge(selectedPayment.status)}</div>
              </div>
            </div>
            
            <div className="bg-white border p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Статистика:</h4>
              <div className="text-sm space-y-2">
                <div><strong>Средняя сумма платежей:</strong> {(payments.reduce((sum, p) => sum + p.amount, 0) / payments.length).toLocaleString()} ₽</div>
                <div><strong>Всего платежей:</strong> {payments.length}</div>
                <div><strong>Оплаченных:</strong> {payments.filter(p => p.status === 'PAID').length}</div>
                <div><strong>Ожидающих:</strong> {payments.filter(p => p.status === 'PENDING').length}</div>
                <div><strong>Просроченных:</strong> {payments.filter(p => p.status === 'OVERDUE').length}</div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <TeamsButton
                onClick={handleDownloadReport}
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Скачать отчет
              </TeamsButton>
              <TeamsButton
                variant="outline"
                onClick={() => setShowReportModal(false)}
                className="flex-1"
              >
                Отмена
              </TeamsButton>
            </div>
          </div>
        )}
      </TeamsModal>
    </div>
  )
}