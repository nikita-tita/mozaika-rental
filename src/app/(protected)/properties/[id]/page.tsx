'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TeamsButton, TeamsCard, TeamsBadge, TeamsModal, TeamsTabs, TeamsAlert } from '@/components/ui/teams'
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
  Banknote,
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
  AlertCircle,
  RefreshCw
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
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    if (propertyId) {
      fetchProperty()
      fetchRelatedData()
    }
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const response = await fetch(`/api/properties/${propertyId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при загрузке объекта')
      }

      if (data.success) {
        setProperty(data.data)
      } else {
        throw new Error(data.error || 'Ошибка при загрузке объекта')
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      setError(error instanceof Error ? error.message : 'Ошибка при загрузке объекта')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedData = async () => {
    try {
      // Загружаем связанные сделки
      const dealsResponse = await fetch(`/api/deals?propertyId=${propertyId}`)
      if (dealsResponse.ok) {
        const dealsData = await dealsResponse.json()
        setRelatedDeals(dealsData.data || [])
      }

      // Загружаем связанные договоры
      const contractsResponse = await fetch(`/api/contracts?propertyId=${propertyId}`)
      if (contractsResponse.ok) {
        const contractsData = await contractsResponse.json()
        setRelatedContracts(contractsData.data || [])
      }

      // Загружаем связанные платежи
      const paymentsResponse = await fetch(`/api/payments?propertyId=${propertyId}`)
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json()
        setRelatedPayments(paymentsData.data || [])
      }
    } catch (error) {
      console.error('Error fetching related data:', error)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/properties')
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка при удалении')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      setError(error instanceof Error ? error.message : 'Ошибка при удалении')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleArchive = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...property,
          status: 'MAINTENANCE'
        })
      })

      if (response.ok) {
        await fetchProperty()
        setShowArchiveModal(false)
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка при архивировании')
      }
    } catch (error) {
      console.error('Error archiving property:', error)
      setError(error instanceof Error ? error.message : 'Ошибка при архивировании')
    }
  }

  const handleClone = () => {
    // Логика клонирования объекта
    console.log('Clone property:', propertyId)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'AVAILABLE': { label: 'Доступен', variant: 'success' as const },
      'RENTED': { label: 'Сдан', variant: 'primary' as const },
      'MAINTENANCE': { label: 'На обслуживании', variant: 'warning' as const },
      'DRAFT': { label: 'Черновик', variant: 'default' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    
    return <TeamsBadge variant={config.variant}>{config.label}</TeamsBadge>
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { label: 'Ожидает', variant: 'warning' as const },
      'PAID': { label: 'Оплачен', variant: 'success' as const },
      'OVERDUE': { label: 'Просрочен', variant: 'error' as const },
      'CANCELLED': { label: 'Отменен', variant: 'default' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    
    return <TeamsBadge variant={config.variant}>{config.label}</TeamsBadge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка объекта...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <TeamsButton onClick={fetchProperty}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Попробовать снова
            </TeamsButton>
            <TeamsButton variant="outline" onClick={() => router.push('/properties')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку
            </TeamsButton>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Объект не найден</h2>
          <p className="text-gray-600 mb-6">Запрашиваемый объект не существует или был удален</p>
          <TeamsButton onClick={() => router.push('/properties')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к списку
          </TeamsButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/properties">
                <TeamsButton variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </TeamsButton>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                <p className="text-gray-600">{property.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(property.status)}
              <TeamsButton
                variant="outline"
                onClick={() => router.push(`/properties/${propertyId}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </TeamsButton>
              <TeamsButton
                variant="outline"
                onClick={() => setShowArchiveModal(true)}
              >
                <Archive className="h-4 w-4 mr-2" />
                Архивировать
              </TeamsButton>
              <TeamsButton
                variant="outline"
                onClick={handleClone}
              >
                <Copy className="h-4 w-4 mr-2" />
                Клонировать
              </TeamsButton>
              <TeamsButton
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </TeamsButton>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - изображения и основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Изображения */}
            {property.images && property.images.length > 0 ? (
              <TeamsCard className="p-0 overflow-hidden">
                <div className="relative">
                  <img
                    src={property.images[currentImageIndex]?.url}
                    alt={property.title}
                    className="w-full h-96 object-cover"
                  />
                  {property.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TeamsCard>
            ) : (
              <TeamsCard className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Home className="h-16 w-16 mx-auto mb-4" />
                  <p>Изображения не загружены</p>
                </div>
              </TeamsCard>
            )}

            {/* Основная информация */}
            <TeamsCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Основная информация</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{property.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Banknote className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{formatPrice(property.pricePerMonth)}/мес</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{formatArea(property.area)} м²</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{property.bedrooms || 0} спален</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{property.bathrooms || 0} ванных</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Добавлен {formatDate(property.createdAt)}</span>
                  </div>
                </div>
              </div>
            </TeamsCard>

            {/* Описание */}
            {property.description && (
              <TeamsCard>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Описание</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{property.description}</p>
              </TeamsCard>
            )}

            {/* Удобства */}
            {property.amenities && property.amenities.length > 0 && (
              <TeamsCard>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Удобства</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span>{amenityIcons[amenity] || '✅'}</span>
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </TeamsCard>
            )}
          </div>

          {/* Правая колонка - действия и связанные данные */}
          <div className="space-y-6">
            {/* Быстрые действия */}
            <TeamsCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
              <div className="space-y-3">
                <TeamsButton
                  onClick={() => setShowCreateDealModal(true)}
                  className="w-full justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Создать сделку
                </TeamsButton>
                
                <TeamsButton
                  variant="outline"
                  onClick={() => router.push(`/contracts/new?propertyId=${propertyId}`)}
                  className="w-full justify-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Создать договор
                </TeamsButton>
                
                <TeamsButton
                  variant="outline"
                  onClick={() => setShowGeneratePaymentsModal(true)}
                  className="w-full justify-center"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Платежный план
                </TeamsButton>
                
                <TeamsButton
                  variant="outline"
                  onClick={() => router.push(`/scoring?propertyId=${propertyId}`)}
                  className="w-full justify-center"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Скоринг
                </TeamsButton>
              </div>
            </TeamsCard>

            {/* Владелец */}
            {property.owner && (
              <TeamsCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Владелец</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">
                      {property.owner.firstName} {property.owner.lastName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{property.owner.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{property.owner.email}</span>
                  </div>
                </div>
              </TeamsCard>
            )}

            {/* Статистика */}
            <TeamsCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Сделок:</span>
                  <span className="font-semibold">{relatedDeals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Договоров:</span>
                  <span className="font-semibold">{relatedContracts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Платежей:</span>
                  <span className="font-semibold">{relatedPayments.length}</span>
                </div>
              </div>
            </TeamsCard>
          </div>
        </div>

        {/* Модальные окна */}
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

        {showDeleteModal && (
          <TeamsModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Удалить объект"
            size="md"
            footer={
              <div className="flex justify-end space-x-3">
                <TeamsButton
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Отмена
                </TeamsButton>
                <TeamsButton
                  variant="danger"
                  onClick={handleDelete}
                  loading={deleting}
                >
                  Удалить
                </TeamsButton>
              </div>
            }
          >
            <p>Вы уверены, что хотите удалить объект "{property.title}"? Это действие нельзя отменить.</p>
          </TeamsModal>
        )}

        {showArchiveModal && (
          <TeamsModal
            isOpen={showArchiveModal}
            onClose={() => setShowArchiveModal(false)}
            title="Архивировать объект"
            size="md"
            footer={
              <div className="flex justify-end space-x-3">
                <TeamsButton
                  variant="outline"
                  onClick={() => setShowArchiveModal(false)}
                >
                  Отмена
                </TeamsButton>
                                 <TeamsButton
                   variant="outline"
                   onClick={handleArchive}
                 >
                   Архивировать
                 </TeamsButton>
              </div>
            }
          >
            <p>Объект "{property.title}" будет перемещен в архив. Вы сможете восстановить его позже.</p>
          </TeamsModal>
        )}
      </div>
    </div>
  )
}