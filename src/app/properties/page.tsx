'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Search, Filter, MapPin, Home, Plus } from 'lucide-react'
import { PropertyWithImages } from '@/types'
import { formatPrice, formatArea } from '@/lib/utils'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const propertyTypeOptions = [
  { value: 'ALL', label: 'Все типы' },
  { value: 'APARTMENT', label: 'Квартира' },
  { value: 'HOUSE', label: 'Дом' },
  { value: 'STUDIO', label: 'Студия' },
  { value: 'COMMERCIAL', label: 'Коммерческая' },
  { value: 'ROOM', label: 'Комната' }
]

const sortOptions = [
  { value: 'createdAt', label: 'По дате добавления' },
  { value: 'pricePerMonth', label: 'По цене' },
  { value: 'area', label: 'По площади' }
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    type: 'ALL',
    city: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    rooms: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'ALL') {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/properties?${params}`)
      const data = await response.json()

      if (data.success) {
        setProperties(data.data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    fetchProperties()
    setShowFilters(false)
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'ALL',
      city: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      rooms: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
        </div>
      </div>

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
                <Link href="/properties" className="text-primary-600 font-medium">
                  Недвижимость
                </Link>
              </nav>
            </div>
            <Link href="/properties/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить недвижимость
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск по названию, адресу..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Quick filters */}
            <div className="flex gap-2">
              <Select
                options={propertyTypeOptions}
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Фильтры
              </Button>
              <Button onClick={applyFilters}>
                Поиск
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="Город"
                  placeholder="Москва, СПб..."
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Цена от"
                    type="number"
                    placeholder="от"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <Input
                    label="до"
                    type="number"
                    placeholder="до"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="mt-6"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Площадь от"
                    type="number"
                    placeholder="от"
                    value={filters.minArea}
                    onChange={(e) => handleFilterChange('minArea', e.target.value)}
                  />
                  <Input
                    label="до"
                    type="number"
                    placeholder="до"
                    value={filters.maxArea}
                    onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                    className="mt-6"
                  />
                </div>

                <Input
                  label="Комнат"
                  type="number"
                  placeholder="Количество комнат"
                  value={filters.rooms}
                  onChange={(e) => handleFilterChange('rooms', e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <Select
                  label="Сортировка"
                  options={sortOptions}
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetFilters}>
                    Сбросить
                  </Button>
                  <Button onClick={applyFilters}>
                    Применить фильтры
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Недвижимость
          </h1>
          <p className="text-gray-600">
            Найдено: {properties.length} объектов
          </p>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Недвижимость не найдена
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

interface PropertyCardProps {
  property: PropertyWithImages
}

function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images[0]?.url || '/placeholder-property.jpg'

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48 rounded-t-lg overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
            {property.type === 'APARTMENT' && 'Квартира'}
            {property.type === 'HOUSE' && 'Дом'}
            {property.type === 'STUDIO' && 'Студия'}
            {property.type === 'COMMERCIAL' && 'Коммерческая'}
            {property.type === 'ROOM' && 'Комната'}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {property.address}, {property.city}
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
            <span>{formatArea(property.area)}</span>
            {property.rooms && <span>{property.rooms} комн.</span>}
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-bold text-primary-600">
                {formatPrice(Number(property.pricePerMonth))}
              </p>
              <p className="text-xs text-gray-500">в месяц</p>
            </div>
            
            {property.averageRating && property.averageRating > 0 && (
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 text-sm font-medium">
                  {property.averageRating}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}