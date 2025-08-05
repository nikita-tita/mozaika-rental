'use client'

import React, { useState, useEffect } from 'react'
import { TeamsButton, TeamsInput, TeamsCard, TeamsModal, TeamsBadge } from '@/components/ui/teams'
import { Search, Plus, Home, MapPin, Users, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

interface Property {
  id: string
  title: string
  address: string
  type: string
  area: number
  rooms: number
  pricePerMonth: number
  status: string
  images: Array<{ url: string; alt: string }>
  createdAt: string
}

interface PropertySelectorProps {
  selectedProperty?: Property | null
  onPropertySelect: (property: Property) => void
  onPropertyCreate?: () => void
  className?: string
  placeholder?: string
  showCreateButton?: boolean
}

export const PropertySelector: React.FC<PropertySelectorProps> = ({
  selectedProperty,
  onPropertySelect,
  onPropertyCreate,
  className = '',
  placeholder = 'Выберите объект из базы данных',
  showCreateButton = true
}) => {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    selectedProperty?.id || null
  )

  useEffect(() => {
    if (showModal) {
      fetchProperties()
    }
  }, [showModal])

  useEffect(() => {
    if (searchTerm) {
      const filtered = properties.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProperties(filtered)
    } else {
      setFilteredProperties(properties)
    }
  }, [searchTerm, properties])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/properties')
      const data = await response.json()
      
      if (data.success) {
        setProperties(data.data)
        setFilteredProperties(data.data)
      } else {
        console.error('Ошибка загрузки объектов:', data.error)
      }
    } catch (error) {
      console.error('Ошибка загрузки объектов:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePropertySelect = (property: Property) => {
    setSelectedPropertyId(property.id)
    onPropertySelect(property)
    setShowModal(false)
  }

  const handleCreateNew = () => {
    setShowModal(false)
    onPropertyCreate?.()
  }

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'APARTMENT':
        return <Home className="w-4 h-4" />
      case 'HOUSE':
        return <Home className="w-4 h-4" />
      case 'STUDIO':
        return <Home className="w-4 h-4" />
      case 'ROOM':
        return <Home className="w-4 h-4" />
      default:
        return <Home className="w-4 h-4" />
    }
  }

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'APARTMENT':
        return 'Квартира'
      case 'HOUSE':
        return 'Дом'
      case 'STUDIO':
        return 'Студия'
      case 'ROOM':
        return 'Комната'
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <TeamsBadge variant="success">Доступен</TeamsBadge>
      case 'RENTED':
        return <TeamsBadge variant="warning">Арендован</TeamsBadge>
      case 'MAINTENANCE':
        return <TeamsBadge variant="error">На ремонте</TeamsBadge>
      case 'DRAFT':
        return <TeamsBadge variant="info">Черновик</TeamsBadge>
      default:
        return <TeamsBadge variant="default">{status}</TeamsBadge>
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className={className}>
      {/* Триггер кнопка */}
      <div 
        className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => setShowModal(true)}
      >
        {selectedProperty ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                {getPropertyTypeIcon(selectedProperty.type)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{selectedProperty.title}</h4>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {selectedProperty.address}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{formatPrice(selectedProperty.pricePerMonth)}</p>
              {getStatusBadge(selectedProperty.status)}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-500">{placeholder}</p>
                <p className="text-sm text-gray-400">Нажмите для выбора</p>
              </div>
            </div>
            <div className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно выбора */}
      <TeamsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Выбор объекта"
        size="lg"
      >
        <div className="space-y-4">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <TeamsInput
              placeholder="Поиск по названию или адресу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Кнопка создания нового объекта */}
          {showCreateButton && onPropertyCreate && (
            <TeamsButton
              onClick={handleCreateNew}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать новый объект
            </TeamsButton>
          )}

          {/* Список объектов */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Загрузка объектов...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-8">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">
                  {searchTerm ? 'Объекты не найдены' : 'Нет доступных объектов'}
                </p>
                {showCreateButton && onPropertyCreate && (
                  <TeamsButton
                    onClick={handleCreateNew}
                    variant="primary"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Создать первый объект
                  </TeamsButton>
                )}
              </div>
            ) : (
              filteredProperties.map((property) => (
                <TeamsCard
                  key={property.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedPropertyId === property.id ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                  }`}
                  onClick={() => handlePropertySelect(property)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        {getPropertyTypeIcon(property.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{property.title}</h4>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {property.address}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-400">
                            {getPropertyTypeLabel(property.type)} • {property.area} м² • {property.rooms} комн.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(property.pricePerMonth)}</p>
                      {getStatusBadge(property.status)}
                      {selectedPropertyId === property.id && (
                        <CheckCircle className="w-5 h-5 text-primary-600 mt-1" />
                      )}
                    </div>
                  </div>
                </TeamsCard>
              ))
            )}
          </div>
        </div>
      </TeamsModal>
    </div>
  )
} 