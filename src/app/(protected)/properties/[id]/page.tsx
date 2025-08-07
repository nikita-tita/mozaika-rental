'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TeamsButton, TeamsCard, TeamsBadge, TeamsModal, TeamsTabs, TeamsAlert, useApiError, TeamsLoadingError } from '@/components/ui/teams'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  Users, 
  Home,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  FileText,
  DollarSign,
  TrendingUp,
  History,
  Copy,
  Archive,
  Plus,
  Eye,
  Download,
  Share2,
  BarChart3,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { PropertyWithImages } from '@/types'
import { formatPrice, formatArea, formatDate } from '@/lib/utils'
import CreateDealForm from '@/components/deals/CreateDealForm'
import GeneratePaymentsForm from '@/components/payments/GeneratePaymentsForm'

const amenityIcons: Record<string, any> = {
  'Wi-Fi': '📶',
  'Телевизор': '📺',
  'Кофеварка': '☕',
  'Кондиционер': '❄️',
  'Парковка': '🚗',
  'Балкон': '🏠',
  'Лифт': '🛗',
  'Охрана': '👮',
  'Спортзал': '💪',
  'Бассейн': '🏊',
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<PropertyWithImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showCreateDealModal, setShowCreateDealModal] = useState(false)
  const [showGeneratePaymentsModal, setShowGeneratePaymentsModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [relatedDeals, setRelatedDeals] = useState<any[]>([])
  const [relatedContracts, setRelatedContracts] = useState<any[]>([])
  const [relatedPayments, setRelatedPayments] = useState<any[]>([])
  
  const { error, handleApiError, clearError } = useApiError()

  useEffect(() => {
    if (propertyId) {
      fetchProperty()
      fetchRelatedData()
    }
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      clearError()
      const response = await fetch(`/api/properties/${propertyId}`)
      const data = await response.json()

      if (handleApiError(response, data)) {
        return
      }

      if (data.success) {
        setProperty(data.data)
      } else {
        console.error('Error fetching property:', data.error)
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedData = async () => {
    try {
      // Получаем связанные сделки
      const dealsResponse = await fetch(`/api/deals?propertyId=${propertyId}`)
      const dealsData = await dealsResponse.json()
      if (dealsData.success) {
        setRelatedDeals(dealsData.data)
      }

      // Получаем связанные договоры
      const contractsResponse = await fetch(`/api/contracts?propertyId=${propertyId}`)
      const contractsData = await contractsResponse.json()
      if (contractsData.success) {
        setRelatedContracts(contractsData.data)
      }

      // Получаем связанные платежи
      const paymentsResponse = await fetch(`/api/payments?propertyId=${propertyId}`)
      const paymentsData = await paymentsResponse.json()
      if (paymentsData.success) {
        setRelatedPayments(paymentsData.data)
      }
    } catch (error) {
      console.error('Error fetching related data:', error)
    }
  }

  const handleDelete = async () => {
    if (!property) return
    
    setDeleting(true)
    try {
      const response = await fetch('/api/cascade-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entityType: 'property',
          entityId: propertyId,
          action: 'delete'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        router.push('/properties')
      } else {
        alert('Ошибка при удалении: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('Ошибка при удалении объекта')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleArchive = async () => {
    if (!property) return
    
    setDeleting(true)
    try {
      const response = await fetch('/api/cascade-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entityType: 'property',
          entityId: propertyId,
          action: 'archive'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        router.push('/properties')
      } else {
        alert('Ошибка при архивировании: ' + data.error)
      }
    } catch (error) {
      console.error('Error archiving property:', error)
      alert('Ошибка при архивировании объекта')
    } finally {
      setDeleting(false)
      setShowArchiveModal(false)
    }
  }

  const handleClone = () => {
    // Логика клонирования объекта
    router.push(`/properties/new?clone=${propertyId}`)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'AVAILABLE': { label: 'Доступен', color: 'success' },
      'RENTED': { label: 'Сдан', color: 'warning' },
      'SOLD': { label: 'Продан', color: 'error' },
      'MAINTENANCE': { label: 'На обслуживании', color: 'info' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'default' }
    
    return (
      <TeamsBadge variant={config.color as any}>
        {config.label}
      </TeamsBadge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { label: 'Ожидает', color: 'warning' },
      'PAID': { label: 'Оплачен', color: 'success' },
      'OVERDUE': { label: 'Просрочен', color: 'error' },
      'CANCELLED': { label: 'Отменен', color: 'default' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'default' }
    
    return (
      <TeamsBadge variant={config.color as any}>
        {config.label}
      </TeamsBadge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <TeamsLoadingError
          error={error}
          onRetry={fetchProperty}
          loading={false}
        />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Объект не найден
          </h2>
          <Link href="/properties">
            <TeamsButton>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к списку
            </TeamsButton>
          </Link>
        </div>
      </div>
    )
  }

  const mainImages = property.images.length > 0 ? property.images : [{ url: '/placeholder-property.jpg', alt: property.title }]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/properties"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку
            </Link>
            
            <div className="flex items-center space-x-2">
              <TeamsButton
                variant="outline"
                size="sm"
                onClick={handleClone}
              >
                <Copy className="h-4 w-4 mr-1" />
                Клонировать
              </TeamsButton>
              
              <Link href={`/properties/${propertyId}/edit`}>
                <TeamsButton variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Редактировать
                </TeamsButton>
              </Link>
              
              <TeamsButton 
                variant="outline" 
                size="sm"
                onClick={() => setShowArchiveModal(true)}
                className="text-orange-600 hover:text-orange-700"
              >
                <Archive className="h-4 w-4 mr-1" />
                Архивировать
              </TeamsButton>
              
              <TeamsButton 
                variant="outline" 
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Удалить
              </TeamsButton>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Property Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {property.title}
                </h1>
                {getStatusBadge(property.status)}
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="font-medium">{property.address}</span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  {formatArea(property.area)}
                </div>
                
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms} спален
                  </div>
                )}

                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms} санузлов
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(property.pricePerMonth)} ₽/мес
              </div>
              <div className="text-sm text-gray-600">
                + залог 1 месяц
              </div>
            </div>
          </div>

          {/* Agent Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
            <TeamsButton
              onClick={() => setShowCreateDealModal(true)}
              className="flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Создать сделку
            </TeamsButton>
            
            <TeamsButton
              variant="outline"
              onClick={() => router.push(`/contracts/new?propertyId=${propertyId}`)}
              className="flex items-center justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Создать договор
            </TeamsButton>
            
            <TeamsButton
              variant="outline"
              onClick={() => setShowGeneratePaymentsModal(true)}
              className="flex items-center justify-center"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Платежный план
            </TeamsButton>
            
            <TeamsButton
              variant="outline"
              onClick={() => router.push(`/scoring?propertyId=${propertyId}`)}
              className="flex items-center justify-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Скоринг
            </TeamsButton>
          </div>
        </div>

        {/* Owner Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Арендодатель
          </h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {property.owner?.firstName?.charAt(0) || 'U'}{property.owner?.lastName?.charAt(0) || 'S'}
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {property.owner?.firstName} {property.owner?.lastName}
              </p>
              <p className="text-sm text-gray-600">
                На платформе с {formatDate(property.createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {property.owner?.phone && (
                <TeamsButton variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  {property.owner.phone}
                </TeamsButton>
              )}
              {property.owner?.email && (
                <TeamsButton variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  {property.owner.email}
                </TeamsButton>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1 mb-6">
          {[
            { value: 'overview', label: 'Обзор', icon: Eye },
            { value: 'deals', label: 'Сделки', icon: TrendingUp },
            { value: 'contracts', label: 'Договоры', icon: FileText },
            { value: 'payments', label: 'Платежи', icon: CreditCard },
            { value: 'history', label: 'История', icon: History }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Images Gallery */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Фотографии</h3>
                  <div className="relative h-80 rounded-lg overflow-hidden">
                    <img
                      src={mainImages[currentImageIndex]?.url}
                      alt={mainImages[currentImageIndex]?.alt || property.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {mainImages.length > 1 && (
                      <>
                        <button
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
                          onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : mainImages.length - 1)}
                        >
                          ←
                        </button>
                        <button
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
                          onClick={() => setCurrentImageIndex(currentImageIndex < mainImages.length - 1 ? currentImageIndex + 1 : 0)}
                        >
                          →
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {mainImages.length}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Описание</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Удобства</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-lg">{amenityIcons[amenity] || '🏠'}</span>
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Статистика</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Сделок создано:</span>
                      <span className="font-medium">{relatedDeals.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Договоров:</span>
                      <span className="font-medium">{relatedContracts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Платежей:</span>
                      <span className="font-medium">{relatedPayments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Добавлен:</span>
                      <span className="font-medium">{formatDate(property.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Детали объекта</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Тип:</span>
                      <span className="font-medium">
                        {property.type === 'APARTMENT' && 'Квартира'}
                        {property.type === 'HOUSE' && 'Дом'}
                        {property.type === 'COMMERCIAL' && 'Коммерческая'}
                        {property.type === 'STUDIO' && 'Студия'}
                        {property.type === 'ROOM' && 'Комната'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Статус:</span>
                      <span className="font-medium">
                        {property.status === 'AVAILABLE' && 'Доступен'}
                        {property.status === 'RENTED' && 'Сдан'}
                        {property.status === 'MAINTENANCE' && 'На обслуживании'}
                        {property.status === 'DRAFT' && 'Черновик'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Площадь:</span>
                      <span className="font-medium">{formatArea(property.area)}</span>
                    </div>
                    {property.bedrooms && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Спальни:</span>
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Санузлы:</span>
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Связанные сделки</h3>
                  <TeamsButton onClick={() => setShowCreateDealModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Создать сделку
                  </TeamsButton>
                </div>
              </div>
              
              <div className="p-6">
                {relatedDeals.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Сделки по этому объекту не найдены</p>
                    <TeamsButton 
                      onClick={() => setShowCreateDealModal(true)}
                      className="mt-4"
                    >
                      Создать первую сделку
                    </TeamsButton>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {relatedDeals.map((deal) => (
                      <div key={deal.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{deal.title}</h4>
                          <TeamsBadge variant={deal.status === 'COMPLETED' ? 'success' : 'warning'}>
                            {deal.status === 'DRAFT' && 'Черновик'}
                            {deal.status === 'NEW' && 'Новая'}
                            {deal.status === 'IN_PROGRESS' && 'В работе'}
                            {deal.status === 'COMPLETED' && 'Завершена'}
                            {deal.status === 'CANCELLED' && 'Отменена'}
                          </TeamsBadge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Арендатор:</span>
                            <p>{deal.tenant?.firstName} {deal.tenant?.lastName}</p>
                          </div>
                          <div>
                            <span className="font-medium">Сумма:</span>
                            <p>{formatPrice(deal.monthlyRent)} ₽/мес</p>
                          </div>
                          <div>
                            <span className="font-medium">Дата начала:</span>
                            <p>{formatDate(deal.startDate)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Создана:</span>
                            <p>{formatDate(deal.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Связанные договоры</h3>
                  <TeamsButton onClick={() => router.push(`/contracts/new?propertyId=${propertyId}`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Создать договор
                  </TeamsButton>
                </div>
              </div>
              
              <div className="p-6">
                {relatedContracts.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Договоры по этому объекту не найдены</p>
                    <TeamsButton 
                      onClick={() => router.push(`/contracts/new?propertyId=${propertyId}`)}
                      className="mt-4"
                    >
                      Создать первый договор
                    </TeamsButton>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {relatedContracts.map((contract) => (
                      <div key={contract.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{contract.title}</h4>
                          <TeamsBadge variant={contract.status === 'SIGNED' ? 'success' : 'warning'}>
                            {contract.status === 'DRAFT' && 'Черновик'}
                            {contract.status === 'SIGNED' && 'Подписан'}
                            {contract.status === 'EXPIRED' && 'Истек'}
                            {contract.status === 'TERMINATED' && 'Расторгнут'}
                          </TeamsBadge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Сделка:</span>
                            <p>{contract.deal?.title || 'Не указана'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Статус:</span>
                            <p>{contract.status}</p>
                          </div>
                          <div>
                            <span className="font-medium">Создан:</span>
                            <p>{formatDate(contract.createdAt)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TeamsButton variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Просмотр
                            </TeamsButton>
                            <TeamsButton variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Скачать
                            </TeamsButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Связанные платежи</h3>
                  <TeamsButton onClick={() => setShowGeneratePaymentsModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Создать платежи
                  </TeamsButton>
                </div>
              </div>
              
              <div className="p-6">
                {relatedPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Платежи по этому объекту не найдены</p>
                    <TeamsButton 
                      onClick={() => setShowGeneratePaymentsModal(true)}
                      className="mt-4"
                    >
                      Создать платежный план
                    </TeamsButton>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {relatedPayments.map((payment) => (
                      <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">
                            {payment.type === 'RENT' && 'Арендная плата'}
                            {payment.type === 'DEPOSIT' && 'Залог'}
                            {payment.type === 'UTILITIES' && 'Коммунальные услуги'}
                            {payment.type === 'MAINTENANCE' && 'Обслуживание'}
                          </h4>
                          {getPaymentStatusBadge(payment.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Сумма:</span>
                            <p>{formatPrice(payment.amount)} ₽</p>
                          </div>
                          <div>
                            <span className="font-medium">Срок:</span>
                            <p>{formatDate(payment.dueDate)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Сделка:</span>
                            <p>{payment.deal?.title || 'Не указана'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Создан:</span>
                            <p>{formatDate(payment.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">История объекта</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Объект добавлен</p>
                    <p className="text-sm text-gray-600">{formatDate(property.createdAt)}</p>
                  </div>
                </div>
                
                {property.updatedAt !== property.createdAt && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Edit className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Объект обновлен</p>
                      <p className="text-sm text-gray-600">{formatDate(property.updatedAt)}</p>
                    </div>
                  </div>
                )}

                {relatedDeals.length > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Создана первая сделка</p>
                      <p className="text-sm text-gray-600">{formatDate(relatedDeals[0]?.createdAt)}</p>
                    </div>
                  </div>
                )}

                {relatedContracts.length > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Создан первый договор</p>
                      <p className="text-sm text-gray-600">{formatDate(relatedContracts[0]?.createdAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <CreateDealForm
          isOpen={showCreateDealModal}
          onClose={() => setShowCreateDealModal(false)}
          onSuccess={() => {
            setShowCreateDealModal(false)
            fetchRelatedData()
          }}
        />

        <GeneratePaymentsForm
          isOpen={showGeneratePaymentsModal}
          onClose={() => setShowGeneratePaymentsModal(false)}
          onSuccess={() => {
            setShowGeneratePaymentsModal(false)
            fetchRelatedData()
          }}
          deals={relatedDeals}
          contracts={relatedContracts}
        />

        {/* Delete Confirmation Modal */}
        <TeamsModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Удаление объекта"
        >
          <div className="p-6">
            <TeamsAlert variant="error" title="Внимание!">
              Удаление объекта приведет к удалению всех связанных сделок, договоров и платежей.
            </TeamsAlert>
            <p className="text-gray-700 my-4">
              Вы уверены, что хотите удалить объект "{property?.title}"? Это действие нельзя отменить.
            </p>
            <div className="flex justify-end space-x-3">
              <TeamsButton
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Отмена
              </TeamsButton>
              <TeamsButton
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Удаление...' : 'Удалить'}
              </TeamsButton>
            </div>
          </div>
        </TeamsModal>

        {/* Archive Confirmation Modal */}
        <TeamsModal
          isOpen={showArchiveModal}
          onClose={() => setShowArchiveModal(false)}
          title="Архивирование объекта"
        >
          <div className="p-6">
            <TeamsAlert variant="warning" title="Информация">
              При архивировании объект будет помечен как "На обслуживании", а связанные сделки и договоры будут отменены.
            </TeamsAlert>
            <p className="text-gray-700 my-4">
              Вы уверены, что хотите архивировать объект "{property?.title}"?
            </p>
            <div className="flex justify-end space-x-3">
              <TeamsButton
                variant="outline"
                onClick={() => setShowArchiveModal(false)}
                disabled={deleting}
              >
                Отмена
              </TeamsButton>
                             <TeamsButton
                 variant="outline"
                 onClick={handleArchive}
                 disabled={deleting}
                 className="text-orange-600 hover:text-orange-700"
               >
                 {deleting ? 'Архивирование...' : 'Архивировать'}
               </TeamsButton>
            </div>
          </div>
        </TeamsModal>
      </main>
    </div>
  )
}