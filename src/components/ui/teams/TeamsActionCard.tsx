'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react'
import { TeamsButton, TeamsCard } from './index'

interface Action {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger' | 'outline'
  disabled?: boolean
}

interface TeamsActionCardProps {
  children: React.ReactNode
  actions: Action[]
  className?: string
  hoverEffect?: boolean
  showActionsOnHover?: boolean
  compact?: boolean
}

export function TeamsActionCard({
  children,
  actions,
  className = "",
  hoverEffect = true,
  showActionsOnHover = true,
  compact = false
}: TeamsActionCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (showActionsOnHover) {
      setShowActions(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (showActionsOnHover) {
      setShowActions(false)
    }
  }

  const handleActionClick = (action: Action) => {
    if (!action.disabled) {
      action.onClick()
    }
  }

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TeamsCard
        className={`transition-all duration-200 ${
          hoverEffect && isHovered
            ? 'shadow-lg transform -translate-y-1 border-blue-200'
            : ''
        }`}
      >
        {children}
      </TeamsCard>

      {/* Быстрые действия */}
      {showActions && (
        <div className={`absolute top-2 right-2 flex gap-1 ${
          compact ? 'flex-col' : 'flex-row'
        }`}>
          {actions.map((action, index) => (
            <TeamsButton
              key={index}
              size="sm"
              variant={action.variant === 'default' ? 'outline' : action.variant || 'outline'}
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
              className={`${
                compact ? 'w-8 h-8 p-0' : 'px-2 py-1'
              } bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-sm transition-all duration-200 ${
                action.variant === 'danger' 
                  ? 'hover:bg-red-50 hover:border-red-300 hover:text-red-700' 
                  : 'hover:bg-blue-50 hover:border-blue-300'
              }`}
              title={action.label}
            >
              {action.icon}
              {!compact && (
                <span className="ml-1 text-xs">{action.label}</span>
              )}
            </TeamsButton>
          ))}
        </div>
      )}

      {/* Оверлей при наведении */}
      {hoverEffect && isHovered && (
        <div className="absolute inset-0 bg-blue-50/30 rounded-lg pointer-events-none transition-opacity duration-200" />
      )}
    </div>
  )
}

// Специализированные карточки для разных типов данных
interface PropertyCardProps {
  property: {
    id: string
    title: string
    address: string
    price: number
    type: string
    image?: string
  }
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
  className?: string
}

export function PropertyCard({ property, onEdit, onDelete, onView, className }: PropertyCardProps) {
  const actions: Action[] = [
    {
      label: 'Просмотр',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => onView(property.id),
      variant: 'outline'
    },
    {
      label: 'Редактировать',
      icon: <Edit className="h-4 w-4" />,
      onClick: () => onEdit(property.id),
      variant: 'outline'
    },
    {
      label: 'Удалить',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onDelete(property.id),
      variant: 'danger'
    }
  ]

  return (
    <TeamsActionCard actions={actions} className={className}>
      <div className="space-y-3">
        {property.image && (
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div>
          <h3 className="font-medium text-[#323130] line-clamp-1">
            {property.title}
          </h3>
          <p className="text-sm text-[#605e5c] line-clamp-1">
            {property.address}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-semibold text-[#0078d4]">
              {new Intl.NumberFormat('ru-RU').format(property.price)} ₽
            </span>
            <span className="text-xs text-[#605e5c] bg-gray-100 px-2 py-1 rounded">
              {property.type}
            </span>
          </div>
        </div>
      </div>
    </TeamsActionCard>
  )
}

interface ClientCardProps {
  client: {
    id: string
    firstName: string
    lastName: string
    phone: string
    email?: string
    type: string
  }
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
  className?: string
}

export function ClientCard({ client, onEdit, onDelete, onView, className }: ClientCardProps) {
  const actions: Action[] = [
    {
      label: 'Просмотр',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => onView(client.id),
      variant: 'outline'
    },
    {
      label: 'Редактировать',
      icon: <Edit className="h-4 w-4" />,
      onClick: () => onEdit(client.id),
      variant: 'outline'
    },
    {
      label: 'Удалить',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onDelete(client.id),
      variant: 'danger'
    }
  ]

  return (
    <TeamsActionCard actions={actions} className={className}>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#deecf9] rounded-full flex items-center justify-center">
            <span className="text-[#0078d4] font-semibold text-lg">
              {client.firstName[0]}{client.lastName[0]}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-[#323130] line-clamp-1">
              {client.firstName} {client.lastName}
            </h3>
            <p className="text-sm text-[#605e5c] line-clamp-1">
              {client.phone}
            </p>
            {client.email && (
              <p className="text-sm text-[#605e5c] line-clamp-1">
                {client.email}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#605e5c] bg-gray-100 px-2 py-1 rounded">
            {client.type}
          </span>
        </div>
      </div>
    </TeamsActionCard>
  )
}

interface DealCardProps {
  deal: {
    id: string
    title: string
    amount: number
    status: string
    startDate: string
    property: {
      title: string
      address: string
    }
  }
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
  className?: string
}

export function DealCard({ deal, onEdit, onDelete, onView, className }: DealCardProps) {
  const actions: Action[] = [
    {
      label: 'Просмотр',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => onView(deal.id),
      variant: 'outline'
    },
    {
      label: 'Редактировать',
      icon: <Edit className="h-4 w-4" />,
      onClick: () => onEdit(deal.id),
      variant: 'outline'
    },
    {
      label: 'Удалить',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onDelete(deal.id),
      variant: 'danger'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'активна':
        return 'bg-green-100 text-green-800'
      case 'pending':
      case 'ожидает':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
      case 'завершена':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <TeamsActionCard actions={actions} className={className}>
      <div className="space-y-3">
        <div>
          <h3 className="font-medium text-[#323130] line-clamp-1">
            {deal.title}
          </h3>
          <p className="text-sm text-[#605e5c] line-clamp-1">
            {deal.property.title} • {deal.property.address}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-[#0078d4]">
            {new Intl.NumberFormat('ru-RU').format(deal.amount)} ₽
          </span>
          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(deal.status)}`}>
            {deal.status}
          </span>
        </div>
        
        <div className="text-xs text-[#605e5c]">
          Начало: {new Date(deal.startDate).toLocaleDateString('ru-RU')}
        </div>
      </div>
    </TeamsActionCard>
  )
} 