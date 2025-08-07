'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, FileText, UserCheck, Home, Plus, Edit, Eye } from 'lucide-react'
import { BookingWithDetails } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  TeamsButton,
  TeamsSelect,
  TeamsCard,
  TeamsBadge,
  TeamsTable,
  TeamsTableHeader,
  TeamsTableBody,
  TeamsTableRow,
  TeamsTableCell,
  TeamsTableHeaderCell,
  TeamsAlert,
  TeamsLoadingOverlay,
  TeamsSkeleton,
  TeamsNavigation,
  TeamsModal
} from '@/components/ui/teams'
import CreateDealForm from '@/components/deals/CreateDealForm'

const statusOptions = [
  { value: 'ALL', label: 'Все статусы' },
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'NEW', label: 'Новая' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'COMPLETED', label: 'Завершена' },
  { value: 'CANCELLED', label: 'Отменена' }
]

const roleOptions = [
  { value: 'landlord', label: 'Мои объекты в аренде' },
  { value: 'tenant', label: 'Мои арендованные объекты' }
]

// Определяем этапы сделки и доступные действия
const dealStages = {
  DRAFT: {
    label: 'Черновик',
    description: 'Сделка создана, но не подтверждена',
    color: 'default',
    actions: ['edit', 'delete', 'activate'],
    nextStage: 'NEW'
  },
  NEW: {
    label: 'Новая',
    description: 'Сделка подтверждена, ожидает начала работы',
    color: 'info',
    actions: ['view', 'edit', 'start', 'cancel'],
    nextStage: 'IN_PROGRESS'
  },
  IN_PROGRESS: {
    label: 'В работе',
    description: 'Сделка активна, договор подписан',
    color: 'warning',
    actions: ['view', 'complete', 'cancel'],
    nextStage: 'COMPLETED'
  },
  COMPLETED: {
    label: 'Завершена',
    description: 'Сделка успешно завершена',
    color: 'success',
    actions: ['view'],
    nextStage: null
  },
  CANCELLED: {
    label: 'Отменена',
    description: 'Сделка отменена',
    color: 'error',
    actions: ['view'],
    nextStage: null
  }
}

export default function DealsPage() {
  const [deals, setDeals] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filters, setFilters] = useState({
    status: 'ALL',
    role: 'landlord'
  })
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchDeals()
  }, [filters])

  const fetchDeals = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'ALL') {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/deals?${params}`)
      const data = await response.json()

      if (data.success) {
        setDeals(data.data)
      } else {
        console.error('Error fetching deals:', data.error)
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (dealId: string, newStatus: string) => {
    setStatusUpdateLoading(dealId)
    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        // Обновляем сделку в списке
        setDeals(prev => prev.map(deal => 
          deal.id === dealId ? { ...deal, status: newStatus } : deal
        ))
        
        // Показываем уведомление об успехе
        alert(data.message || 'Статус сделки обновлен')
      } else {
        alert(data.error || 'Ошибка при обновлении статуса')
      }
    } catch (error) {
      console.error('Error updating deal:', error)
      alert('Ошибка при обновлении сделки')
    } finally {
      setStatusUpdateLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const stage = dealStages[status as keyof typeof dealStages]
    if (!stage) return <TeamsBadge variant="default">Неизвестно</TeamsBadge>
    
    return <TeamsBadge variant={stage.color as any}>{stage.label}</TeamsBadge>
  }

  const getStatusColor = (status: string) => {
    const stage = dealStages[status as keyof typeof dealStages]
    if (!stage) return 'text-gray-600 bg-gray-50'
    
    switch (stage.color) {
      case 'default':
        return 'text-gray-600 bg-gray-50'
      case 'info':
        return 'text-blue-600 bg-blue-50'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50'
      case 'success':
        return 'text-green-600 bg-green-50'
      case 'error':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const canUpdateStatus = (deal: BookingWithDetails) => {
    const stage = dealStages[deal.status as keyof typeof dealStages]
    return stage?.nextStage !== null
  }

  const getNextStatus = (currentStatus: string) => {
    const stage = dealStages[currentStatus as keyof typeof dealStages]
    return stage?.nextStage || null
  }

  const getStatusDescription = (status: string) => {
    const stage = dealStages[status as keyof typeof dealStages]
    return stage?.description || 'Описание недоступно'
  }

  const getActionButtonText = (status: string) => {
    const nextStage = getNextStatus(status)
    if (!nextStage) return null
    
    switch (nextStage) {
      case 'NEW':
        return 'Активировать'
      case 'IN_PROGRESS':
        return 'Начать работу'
      case 'COMPLETED':
        return 'Завершить'
      default:
        return 'Следующий этап'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TeamsLoadingOverlay isLoading={true} />
          <div className="space-y-6">
            <TeamsSkeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <TeamsSkeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Управление сделками
          </h1>
          <p className="text-lg text-gray-600">
            Отслеживание и управление сделками по долгосрочной аренде недвижимости
          </p>
        </div>

        {/* Кнопка создания */}
        <div className="mb-6 flex justify-end">
          <TeamsButton
            onClick={() => setShowCreateForm(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Создать сделку
          </TeamsButton>
        </div>

        {/* Фильтры */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <TeamsSelect
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            options={statusOptions}
            placeholder="Выберите статус"
            className="w-full sm:w-48"
          />
          <TeamsSelect
            value={filters.role}
            onChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
            options={roleOptions}
            placeholder="Выберите роль"
            className="w-full sm:w-64"
          />
          <div className="flex gap-2">
            <TeamsButton
              variant={viewMode === 'cards' ? 'primary' : 'outline'}
              onClick={() => setViewMode('cards')}
              size="sm"
            >
              Карточки
            </TeamsButton>
            <TeamsButton
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              onClick={() => setViewMode('table')}
              size="sm"
            >
              Таблица
            </TeamsButton>
          </div>
        </div>

        {/* Сделки */}
        {deals.length === 0 ? (
          <TeamsCard className="p-8 text-center">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Нет активных сделок
            </h3>
            <p className="text-gray-600 mb-4">
              {filters.role === 'landlord' 
                ? 'У вас пока нет объектов в аренде. Создайте новую сделку, чтобы начать.'
                : 'У вас пока нет арендованных объектов.'
              }
            </p>
            <TeamsButton
              onClick={() => setShowCreateForm(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Создать сделку
            </TeamsButton>
          </TeamsCard>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                userRole={filters.role}
                onStatusChange={handleStatusChange}
                canUpdate={canUpdateStatus(deal)}
                getStatusBadge={getStatusBadge}
                getNextStatus={getNextStatus}
                getStatusDescription={getStatusDescription}
                getActionButtonText={getActionButtonText}
                statusUpdateLoading={statusUpdateLoading}
              />
            ))}
          </div>
        ) : (
          <TeamsTable>
            <TeamsTableHeader>
              <TeamsTableHeaderCell>Объект</TeamsTableHeaderCell>
              <TeamsTableHeaderCell>Арендатор</TeamsTableHeaderCell>
              <TeamsTableHeaderCell>Статус</TeamsTableHeaderCell>
              <TeamsTableHeaderCell>Дата начала</TeamsTableHeaderCell>
              <TeamsTableHeaderCell>Сумма</TeamsTableHeaderCell>
              <TeamsTableHeaderCell>Действия</TeamsTableHeaderCell>
            </TeamsTableHeader>
            <TeamsTableBody>
              {deals.map((deal) => (
                <DealTableRow
                  key={deal.id}
                  deal={deal}
                  userRole={filters.role}
                  onStatusChange={handleStatusChange}
                  canUpdate={canUpdateStatus(deal)}
                  getStatusBadge={getStatusBadge}
                  getNextStatus={getNextStatus}
                  getActionButtonText={getActionButtonText}
                  statusUpdateLoading={statusUpdateLoading}
                />
              ))}
            </TeamsTableBody>
          </TeamsTable>
        )}

        {/* Форма создания сделки */}
        <CreateDealForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSuccess={fetchDeals}
        />
      </div>
    </div>
  )
}

interface DealCardProps {
  deal: BookingWithDetails
  userRole: string
  onStatusChange: (dealId: string, status: string) => void
  canUpdate: boolean
  getStatusBadge: (status: string) => React.ReactNode
  getNextStatus: (status: string) => string | null
  getStatusDescription: (status: string) => string
  getActionButtonText: (status: string) => string | null
  statusUpdateLoading: string | null
}

function DealCard({ 
  deal, 
  userRole, 
  onStatusChange, 
  canUpdate, 
  getStatusBadge,
  getNextStatus,
  getStatusDescription,
  getActionButtonText,
  statusUpdateLoading
}: DealCardProps) {
  const nextStatus = getNextStatus(deal.status)
  const actionText = getActionButtonText(deal.status)
  const isLoading = statusUpdateLoading === deal.id

  return (
    <TeamsCard className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {deal.title || deal.property?.title || 'Объект недвижимости'}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {deal.property?.address || 'Адрес не указан'}
          </p>
        </div>
        {getStatusBadge(deal.status)}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <UserCheck className="w-4 h-4 mr-2" />
          <span>
            {userRole === 'landlord' 
              ? `Арендатор: ${deal.tenant?.firstName} ${deal.tenant?.lastName}`
              : `Арендодатель: ${deal.landlord?.firstName} ${deal.landlord?.lastName}`
            }
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Начало: {formatDate(deal.startDate)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Окончание: {formatDate(deal.endDate)}</span>
        </div>
        
        <div className="flex items-center text-sm font-semibold text-gray-900">
          <span>{formatPrice(deal.monthlyRent || deal.totalAmount)} / месяц</span>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          {getStatusDescription(deal.status)}
        </div>
      </div>

      {canUpdate && nextStatus && actionText && (
        <TeamsButton
          variant="outline"
          onClick={() => onStatusChange(deal.id, nextStatus)}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Обновление...' : actionText}
        </TeamsButton>
      )}
    </TeamsCard>
  )
}

interface DealTableRowProps {
  deal: BookingWithDetails
  userRole: string
  onStatusChange: (dealId: string, status: string) => void
  canUpdate: boolean
  getStatusBadge: (status: string) => React.ReactNode
  getNextStatus: (status: string) => string | null
  getActionButtonText: (status: string) => string | null
  statusUpdateLoading: string | null
}

function DealTableRow({
  deal,
  userRole,
  onStatusChange,
  canUpdate,
  getStatusBadge,
  getNextStatus,
  getActionButtonText,
  statusUpdateLoading
}: DealTableRowProps) {
  const nextStatus = getNextStatus(deal.status)
  const actionText = getActionButtonText(deal.status)
  const isLoading = statusUpdateLoading === deal.id

  return (
    <TeamsTableRow>
      <TeamsTableCell>
        <div>
          <div className="font-medium text-gray-900">
            {deal.title || deal.property?.title || 'Объект недвижимости'}
          </div>
          <div className="text-sm text-gray-500">
            {deal.property?.address || 'Адрес не указан'}
          </div>
        </div>
      </TeamsTableCell>
      <TeamsTableCell>
        <div className="text-sm text-gray-900">
          {userRole === 'landlord' 
            ? `${deal.tenant?.firstName} ${deal.tenant?.lastName}`
            : `${deal.landlord?.firstName} ${deal.landlord?.lastName}`
          }
        </div>
        <div className="text-sm text-gray-500">
          {userRole === 'landlord' 
            ? deal.tenant?.email
            : deal.landlord?.email
          }
        </div>
      </TeamsTableCell>
      <TeamsTableCell>
        {getStatusBadge(deal.status)}
      </TeamsTableCell>
      <TeamsTableCell>
        <div className="text-sm text-gray-900">
          {formatDate(deal.startDate)}
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(deal.endDate)}
        </div>
      </TeamsTableCell>
      <TeamsTableCell>
        <div className="text-sm font-medium text-gray-900">
          {formatPrice(deal.monthlyRent || deal.totalAmount)}
        </div>
        <div className="text-sm text-gray-500">в месяц</div>
      </TeamsTableCell>
      <TeamsTableCell>
        {canUpdate && nextStatus && actionText && (
          <TeamsButton
            variant="outline"
            size="sm"
            onClick={() => onStatusChange(deal.id, nextStatus)}
            disabled={isLoading}
          >
            {isLoading ? '...' : actionText}
          </TeamsButton>
        )}
      </TeamsTableCell>
    </TeamsTableRow>
  )
}