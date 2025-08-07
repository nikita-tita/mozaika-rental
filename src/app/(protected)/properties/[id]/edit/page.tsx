'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TeamsButton, TeamsInput, TeamsSelect, TeamsCard, TeamsTextarea } from '@/components/ui/teams'
import { ArrowLeft, Save, X } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const propertyTypeOptions = [
  { value: 'APARTMENT', label: 'Квартира' },
  { value: 'HOUSE', label: 'Дом' },
  { value: 'STUDIO', label: 'Студия' },
  { value: 'COMMERCIAL', label: 'Коммерческая' },
  { value: 'ROOM', label: 'Комната' }
]

interface Property {
  id: string
  title: string
  description: string
  type: string
  address: string
  area: number
  bedrooms: number
  bathrooms: number
  price: number
  features: string[]
}

export default function EditPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'APARTMENT',
    address: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    pricePerMonth: '',
    features: [] as string[]
  })

  useEffect(() => {
    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`)
      const data = await response.json()

      if (data.success) {
        const prop = data.data
        setProperty(prop)
        setFormData({
          title: prop.title || '',
          description: prop.description || '',
          type: prop.type || 'APARTMENT',
          address: prop.address || '',
          area: prop.area?.toString() || '',
          bedrooms: prop.bedrooms?.toString() || '',
          bathrooms: prop.bathrooms?.toString() || '',
          pricePerMonth: prop.pricePerMonth?.toString() || '',
          features: prop.features || []
        })
      } else {
        console.error('Error fetching property:', data.error)
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          address: formData.address,
          area: parseFloat(formData.area) || 0,
          bedrooms: parseInt(formData.bedrooms) || null,
          bathrooms: parseInt(formData.bathrooms) || null,
          pricePerMonth: parseFloat(formData.pricePerMonth) || 0,
          features: formData.features
        })
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/properties/${propertyId}`)
      } else {
        alert('Ошибка при сохранении: ' + data.error)
      }
    } catch (error) {
      console.error('Error updating property:', error)
      alert('Ошибка при сохранении объекта')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!property) {
    return (
      <ProtectedRoute>
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
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href={`/properties/${propertyId}`}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к объекту
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">
                Редактирование объекта
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <TeamsCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Основная информация */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Основная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название объекта *
                    </label>
                    <TeamsInput
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Введите название объекта"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Тип недвижимости *
                    </label>
                    <TeamsSelect
                      value={formData.type}
                      onChange={(value) => handleInputChange('type', value)}
                      options={propertyTypeOptions}
                    />
                  </div>
                </div>
              </div>

              {/* Адрес */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес *
                </label>
                <TeamsInput
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Введите полный адрес"
                  required
                />
              </div>

              {/* Описание */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <TeamsTextarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Опишите особенности объекта"
                  rows={4}
                />
              </div>

              {/* Характеристики */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Характеристики
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Площадь (м²)
                    </label>
                    <TeamsInput
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Спальни
                    </label>
                    <TeamsInput
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ванные
                    </label>
                    <TeamsInput
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Цена за месяц (₽) *
                    </label>
                    <TeamsInput
                      type="number"
                      value={formData.pricePerMonth}
                      onChange={(e) => handleInputChange('pricePerMonth', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link href={`/properties/${propertyId}`}>
                  <TeamsButton variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Отмена
                  </TeamsButton>
                </Link>
                <TeamsButton type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </TeamsButton>
              </div>
            </form>
          </TeamsCard>
        </main>
      </div>
    </ProtectedRoute>
  )
} 