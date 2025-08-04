'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TeamsButton, TeamsInput, TeamsSelect, TeamsCard } from '@/components/ui/teams'
import { Search, MapPin, Filter, Heart, Star, Calendar, Users, Home } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const propertyTypeOptions = [
  { value: '', label: 'Все типы' },
  { value: 'APARTMENT', label: 'Квартира' },
  { value: 'HOUSE', label: 'Дом' },
  { value: 'ROOM', label: 'Комната' },
  { value: 'STUDIO', label: 'Студия' }
]

const priceRanges = [
  { value: '', label: 'Любая цена' },
  { value: '0-20000', label: 'До 20,000 ₽' },
  { value: '20000-40000', label: '20,000 - 40,000 ₽' },
  { value: '40000-60000', label: '40,000 - 60,000 ₽' },
  { value: '60000-100000', label: '60,000 - 100,000 ₽' },
  { value: '100000+', label: 'От 100,000 ₽' }
]

const cities = [
  { value: '', label: 'Все города' },
  { value: 'Москва', label: 'Москва' },
  { value: 'Санкт-Петербург', label: 'Санкт-Петербург' },
  { value: 'Пушкино', label: 'Пушкино' }
]

interface Property {
  id: string
  title: string
  description: string
  type: string
  address: string
  city: string
  district: string
  area: number
  rooms: number
  bedrooms: number
  bathrooms: number
  pricePerMonth: number
  deposit: number
  images: Array<{ url: string; alt: string }>
  createdAt: string
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    city: '',
    priceRange: '',
    minPrice: '',
    maxPrice: '',
    rooms: '',
    area: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [properties, filters])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      const data = await response.json()
      
      if (data.success) {
        setProperties(data.data)
      } else {
        console.error('Error fetching properties:', data.error)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...properties]

    // Поиск по названию и описанию
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchLower) ||
        property.description.toLowerCase().includes(searchLower) ||
        property.address.toLowerCase().includes(searchLower)
      )
    }

    // Фильтр по типу
    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type)
    }

    // Фильтр по городу
    if (filters.city) {
      filtered = filtered.filter(property => property.city === filters.city)
    }

    // Фильтр по цене
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(property => {
        if (filters.priceRange === '100000+') {
          return property.pricePerMonth >= 100000
        }
        return property.pricePerMonth >= min && property.pricePerMonth <= max
      })
    } else if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(property => {
        const price = property.pricePerMonth
        const min = filters.minPrice ? Number(filters.minPrice) : 0
        const max = filters.maxPrice ? Number(filters.maxPrice) : Infinity
        return price >= min && price <= max
      })
    }

    // Фильтр по количеству комнат
    if (filters.rooms) {
      filtered = filtered.filter(property => property.rooms === Number(filters.rooms))
    }

    // Фильтр по площади
    if (filters.area) {
      filtered = filtered.filter(property => property.area >= Number(filters.area))
    }

    setFilteredProperties(filtered)
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      city: '',
      priceRange: '',
      minPrice: '',
      maxPrice: '',
      rooms: '',
      area: ''
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'APARTMENT':
        return <Home className="h-4 w-4" />
      case 'HOUSE':
        return <Home className="h-4 w-4" />
      case 'STUDIO':
        return <Home className="h-4 w-4" />
      case 'ROOM':
        return <Users className="h-4 w-4" />
      default:
        return <Home className="h-4 w-4" />
    }
  }

  const getPropertyTypeLabel = (type: string) => {
    const option = propertyTypeOptions.find(opt => opt.value === type)
    return option ? option.label : type
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-6">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Заголовок и поиск */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Недвижимость</h1>
                <p className="text-gray-600 mt-2">
                  Найдено {filteredProperties.length} объявлений
                </p>
              </div>
              <Link href="/properties/new">
                <TeamsButton className="mt-4 md:mt-0">
                  Добавить объект
                </TeamsButton>
              </Link>
            </div>

            {/* Поисковая строка */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <TeamsInput
                      placeholder="Поиск по адресу, району или описанию..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <TeamsButton
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Фильтры
                  </TeamsButton>
                  {Object.values(filters).some(value => value) && (
                    <TeamsButton
                      variant="outline"
                      onClick={clearFilters}
                    >
                      Очистить
                    </TeamsButton>
                  )}
                </div>
              </div>

              {/* Расширенные фильтры */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Тип недвижимости
                      </label>
                      <TeamsSelect
                        value={filters.type}
                        onChange={(value) => handleFilterChange('type', value)}
                        options={propertyTypeOptions}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Город
                      </label>
                      <TeamsSelect
                        value={filters.city}
                        onChange={(value) => handleFilterChange('city', value)}
                        options={cities}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ценовой диапазон
                      </label>
                      <TeamsSelect
                        value={filters.priceRange}
                        onChange={(value) => handleFilterChange('priceRange', value)}
                        options={priceRanges}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Комнат
                      </label>
                      <TeamsSelect
                        value={filters.rooms}
                        onChange={(value) => handleFilterChange('rooms', value)}
                        options={[
                          { value: '', label: 'Любое' },
                          { value: '1', label: '1' },
                          { value: '2', label: '2' },
                          { value: '3', label: '3' },
                          { value: '4+', label: '4+' }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Результаты поиска */}
          {filteredProperties.length === 0 ? (
            <TeamsCard className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Объявления не найдены
              </h3>
              <p className="text-gray-600 mb-4">
                Попробуйте изменить параметры поиска или добавьте новое объявление
              </p>
              <Link href="/properties/new">
                <TeamsButton>Добавить объявление</TeamsButton>
              </Link>
            </TeamsCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <TeamsCard key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/properties/${property.id}`}>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0].url}
                          alt={property.images[0].alt}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <Home className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center text-sm text-gray-500">
                          {getPropertyTypeIcon(property.type)}
                          <span className="ml-1">{getPropertyTypeLabel(property.type)}</span>
                        </div>
                        <button className="text-gray-400 hover:text-red-500">
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">{property.address}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-4">
                          <span>{property.area} м²</span>
                          <span>{property.rooms} комн.</span>
                          <span>{property.bedrooms} спальн.</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {formatPrice(property.pricePerMonth)} ₽/мес
                          </div>
                          {property.deposit > 0 && (
                            <div className="text-sm text-gray-500">
                              Залог: {formatPrice(property.deposit)} ₽
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(property.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  </Link>
                </TeamsCard>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}