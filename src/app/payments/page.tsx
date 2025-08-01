'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  MapPin,
  DollarSign 
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface Payment {
  id: string
  type: string
  status: string
  amount: number
  currency: string
  description?: string
  dueDate?: string
  paidAt?: string
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  property?: {
    id: string
    title: string
    address: string
    city: string
  }
  booking?: {
    id: string
    startDate: string
    endDate: string
  }
  contract?: {
    id: string
    status: string
  }
}

const statusOptions = [
  { value: 'ALL', label: 'Все статусы' },
  { value: 'PENDING', label: 'Ожидает оплаты' },
  { value: 'PROCESSING', label: 'Обрабатывается' },
  { value: 'COMPLETED', label: 'Завершен' },
  { value: 'FAILED', label: 'Ошибка' },
  { value: 'CANCELLED', label: 'Отменен' },
  { value: 'REFUNDED', label: 'Возврат' }
]

const typeOptions = [
  { value: 'ALL', label: 'Все типы' },
  { value: 'RENT', label: 'Арендная плата' },
  { value: 'DEPOSIT', label: 'Залог' },
  { value: 'COMMISSION', label: 'Комиссия' },
  { value: 'REFUND', label: 'Возврат' }
]

const roleOptions = [
  { value: 'all', label: 'Все платежи' },
  { value: 'tenant', label: 'Мои платежи' },
  { value: 'landlord', label: 'Платежи за мою недвижимость' }
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'ALL',
    type: 'ALL',
    role: 'all'
  })

  useEffect(() => {
    fetchPayments()
  }, [filters])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'ALL') {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/payments?${params}`)
      const data = await response.json()

      if (data.success) {
        setPayments(data.data)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (paymentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        fetchPayments() // Перезагружаем список
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error updating payment:', error)
      alert('Ошибка при обновлении платежа')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'PROCESSING':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-gray-500" />
      case 'REFUNDED':
        return <RefreshCw className="h-4 w-4 text-orange-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Ожидает оплаты'
      case 'PROCESSING':
        return 'Обрабатывается'
      case 'COMPLETED':
        return 'Завершен'
      case 'FAILED':
        return 'Ошибка'
      case 'CANCELLED':
        return 'Отменен'
      case 'REFUNDED':
        return 'Возврат'
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'RENT':
        return 'Арендная плата'
      case 'DEPOSIT':
        return 'Залог'
      case 'COMMISSION':
        return 'Комиссия'
      case 'REFUND':
        return 'Возврат'
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600 mr-8">
                M²
              </Link>
              <nav className="hidden md:flex md:space-x-8">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                  Панель управления
                </Link>
                <Link href="/properties" className="text-gray-500 hover:text-gray-700">
                  Недвижимость
                </Link>
                <Link href="/bookings" className="text-gray-500 hover:text-gray-700">
                  Бронирования
                </Link>
                <Link href="/contracts" className="text-gray-500 hover:text-gray-700">
                  Договоры
                </Link>
                <Link href="/payments" className="text-primary-600 font-medium">
                  Платежи
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select
                label="Тип платежей"
                options={roleOptions}
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>
            <div>
              <Select
                label="Статус"
                options={statusOptions}
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              />
            </div>
            <div>
              <Select
                label="Тип операции"
                options={typeOptions}
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Платежи
          </h1>
          <p className="text-gray-600">
            Всего: {payments.length}
          </p>
        </div>

        {/* Payments List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Платежи не найдены
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              У вас пока нет платежей или они не соответствуют фильтрам
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onStatusChange={handleStatusChange}
                getStatusIcon={getStatusIcon}
                getStatusText={getStatusText}
                getTypeText={getTypeText}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

interface PaymentCardProps {
  payment: Payment
  onStatusChange: (paymentId: string, status: string) => void
  getStatusIcon: (status: string) => React.ReactNode
  getStatusText: (status: string) => string
  getTypeText: (type: string) => string
}

function PaymentCard({ 
  payment, 
  onStatusChange, 
  getStatusIcon, 
  getStatusText,
  getTypeText 
}: PaymentCardProps) {
  const canCancel = ['PENDING', 'FAILED'].includes(payment.status)
  const canRefund = payment.status === 'COMPLETED'
  const isOverdue = payment.dueDate && new Date(payment.dueDate) < new Date() && payment.status === 'PENDING'

  return (
    <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
      isOverdue ? 'border-l-4 border-red-500' : ''
    }`}>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Payment Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getTypeText(payment.type)}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(payment.status)}
                  <span className="text-sm font-medium">
                    {getStatusText(payment.status)}
                  </span>
                </div>
              </div>

              {payment.description && (
                <p className="text-gray-600 mb-2">{payment.description}</p>
              )}

              {payment.property && (
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {payment.property.title} - {payment.property.address}, {payment.property.city}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Сумма</span>
                </div>
                <p className="text-lg font-bold text-primary-600">
                  {formatPrice(payment.amount)}
                </p>
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {payment.dueDate ? 'Срок оплаты' : 'Создан'}
                  </span>
                </div>
                <p className="text-sm font-medium">
                  {payment.dueDate 
                    ? formatDate(new Date(payment.dueDate))
                    : formatDate(new Date(payment.createdAt))
                  }
                </p>
                {isOverdue && (
                  <p className="text-xs text-red-600 mt-1">Просрочен</p>
                )}
              </div>

              {payment.paidAt && (
                <div>
                  <div className="flex items-center mb-1">
                    <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Оплачен</span>
                  </div>
                  <p className="text-sm font-medium">
                    {formatDate(new Date(payment.paidAt))}
                  </p>
                </div>
              )}
            </div>

            {payment.booking && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">Период аренды:</p>
                <p className="text-sm font-medium">
                  {formatDate(new Date(payment.booking.startDate))} — {formatDate(new Date(payment.booking.endDate))}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-4 border-t border-gray-200">
              {payment.status === 'PENDING' && (
                <Button
                  size="sm"
                  onClick={() => onStatusChange(payment.id, 'PROCESSING')}
                >
                  Оплатить
                </Button>
              )}

              {canCancel && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(payment.id, 'CANCELLED')}
                >
                  Отменить
                </Button>
              )}

              {canRefund && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(payment.id, 'REFUNDED')}
                >
                  Вернуть
                </Button>
              )}

              {payment.status === 'FAILED' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(payment.id, 'PENDING')}
                >
                  Повторить
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}