'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { ArrowLeft } from 'lucide-react'

const propertyTypeOptions = [
  { value: 'APARTMENT', label: 'Квартира' },
  { value: 'HOUSE', label: 'Дом' },
  { value: 'STUDIO', label: 'Студия' },
  { value: 'COMMERCIAL', label: 'Коммерческая недвижимость' },
  { value: 'ROOM', label: 'Комната' }
]

const amenitiesOptions = [
  'Wi-Fi',
  'Кондиционер',
  'Стиральная машина',
  'Холодильник',
  'Телевизор',
  'Парковка',
  'Лифт',
  'Балкон',
  'Терраса',
  'Сад',
  'Бассейн',
  'Спортзал',
  'Консьерж',
  'Охрана'
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'APARTMENT',
    address: '',
    city: '',
    district: '',
    area: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    totalFloors: '',
    pricePerMonth: '',
    deposit: '',
    utilities: false,
    amenities: [] as string[]
  })
  const [images, setImages] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Создаем недвижимость
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        const propertyId = data.data.id

        // Если есть изображения, сохраняем их в базе данных
        if (images.length > 0) {
          await fetch(`/api/properties/${propertyId}/images`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ images })
          })
        }

        router.push(`/properties/${propertyId}?created=true`)
      } else {
        setErrors({ general: data.error })
      }
    } catch (error) {
      setErrors({ general: 'Произошла ошибка при создании недвижимости' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/properties"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Добавить новую недвижимость
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Заполните информацию о вашей недвижимости
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.general && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{errors.general}</div>
              </div>
            )}

            {/* Основная информация */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Основная информация
              </h3>

              <Input
                label="Название объявления"
                name="title"
                required
                placeholder="Уютная 2-комнатная квартира в центре"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                  placeholder="Подробное описание недвижимости..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <Select
                label="Тип недвижимости"
                name="type"
                options={propertyTypeOptions}
                value={formData.type}
                onChange={handleChange}
                error={errors.type}
              />
            </div>

            {/* Адрес */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Местоположение
              </h3>

              <Input
                label="Адрес"
                name="address"
                required
                placeholder="ул. Ленина, 15"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Город"
                  name="city"
                  required
                  placeholder="Москва"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                />

                <Input
                  label="Район"
                  name="district"
                  placeholder="Центральный"
                  value={formData.district}
                  onChange={handleChange}
                  error={errors.district}
                />
              </div>
            </div>

            {/* Характеристики */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Характеристики
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  label="Площадь (м²)"
                  name="area"
                  type="number"
                  required
                  placeholder="50"
                  value={formData.area}
                  onChange={handleChange}
                  error={errors.area}
                />

                <Input
                  label="Комнат"
                  name="rooms"
                  type="number"
                  placeholder="2"
                  value={formData.rooms}
                  onChange={handleChange}
                  error={errors.rooms}
                />

                <Input
                  label="Спален"
                  name="bedrooms"
                  type="number"
                  placeholder="1"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  error={errors.bedrooms}
                />

                <Input
                  label="Ванных"
                  name="bathrooms"
                  type="number"
                  placeholder="1"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  error={errors.bathrooms}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Этаж"
                  name="floor"
                  type="number"
                  placeholder="5"
                  value={formData.floor}
                  onChange={handleChange}
                  error={errors.floor}
                />

                <Input
                  label="Всего этажей"
                  name="totalFloors"
                  type="number"
                  placeholder="10"
                  value={formData.totalFloors}
                  onChange={handleChange}
                  error={errors.totalFloors}
                />
              </div>
            </div>

            {/* Цена */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Стоимость
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Цена за месяц (₽)"
                  name="pricePerMonth"
                  type="number"
                  required
                  placeholder="50000"
                  value={formData.pricePerMonth}
                  onChange={handleChange}
                  error={errors.pricePerMonth}
                />

                <Input
                  label="Залог (₽)"
                  name="deposit"
                  type="number"
                  placeholder="50000"
                  value={formData.deposit}
                  onChange={handleChange}
                  error={errors.deposit}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="utilities"
                  name="utilities"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formData.utilities}
                  onChange={handleChange}
                />
                <label htmlFor="utilities" className="ml-2 block text-sm text-gray-900">
                  Коммунальные услуги включены в стоимость
                </label>
              </div>
            </div>

            {/* Удобства */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Удобства
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {amenitiesOptions.map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                    />
                    <span className="ml-2 text-sm text-gray-900">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Фотографии */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Фотографии
              </h3>
              
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={10}
                maxSize={10}
              />
            </div>

            {/* Кнопки */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link href="/properties">
                <Button type="button" variant="outline">
                  Отмена
                </Button>
              </Link>
              <Button type="submit" loading={isLoading}>
                Создать объявление
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}