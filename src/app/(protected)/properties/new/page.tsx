'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TeamsCard, TeamsButton, TeamsInput, TeamsSelect, TeamsTextarea } from '@/components/ui/teams'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const propertyTypes = [
  { value: 'APARTMENT', label: 'Квартира' },
  { value: 'HOUSE', label: 'Дом' },
  { value: 'COMMERCIAL', label: 'Коммерческое помещение' },
  { value: 'LAND', label: 'Земельный участок' }
]

const cities = [
  { value: 'Москва', label: 'Москва' },
  { value: 'Санкт-Петербург', label: 'Санкт-Петербург' },
  { value: 'Пушкино', label: 'Пушкино' },
  { value: 'Другой', label: 'Другой' }
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    address: '',
    city: '',
    district: '',
    area: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    pricePerMonth: '',
    deposit: '',
    description: '',
    images: [] as File[]
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError('')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          formData.images.forEach((file, index) => {
            formDataToSend.append(`images[${index}]`, file)
          })
        } else if (value !== '') {
          formDataToSend.append(key, value as string)
        }
      })

      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()

      if (response.ok && result.success) {
        router.push('/properties')
      } else {
        const errorMessage = result.error || 'Ошибка при создании объекта'
        setError(errorMessage)
      }
    } catch (error) {
      console.error('Error creating property:', error)
      setError('Ошибка соединения с сервером')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div>
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-4">
            <Link href="/properties" className="mr-4">
              <TeamsButton variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </TeamsButton>
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#323130]">Добавить объект</h1>
          </div>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#605e5c]">
            Заполните информацию о новом объекте недвижимости
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <TeamsCard className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#323130] mb-4 sm:mb-6">
                  Основная информация
                </h2>
                
                {error && (
                  <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                      Название объекта <span className="text-red-500">*</span>
                    </label>
                    <TeamsInput
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Например: 2-к квартира в центре"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                        Тип недвижимости <span className="text-red-500">*</span>
                      </label>
                      <TeamsSelect
                        value={formData.type}
                        onChange={(value) => handleSelectChange(value, 'type')}
                        options={propertyTypes}
                        placeholder="Выберите тип"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                        Город <span className="text-red-500">*</span>
                      </label>
                      <TeamsSelect
                        value={formData.city}
                        onChange={(value) => handleSelectChange(value, 'city')}
                        options={cities}
                        placeholder="Выберите город"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                      Адрес <span className="text-red-500">*</span>
                    </label>
                    <TeamsInput
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Улица, дом, квартира"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                      Район
                    </label>
                    <TeamsInput
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="Название района"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                      Описание
                    </label>
                    <TeamsTextarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Подробное описание объекта, особенности, удобства..."
                      rows={4}
                    />
                  </div>
                </div>
              </TeamsCard>

              <TeamsCard className="p-4 sm:p-6 mt-4 sm:mt-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#323130] mb-4 sm:mb-6">
                  Характеристики
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                      Общая площадь (м²)
                    </label>
                    <TeamsInput
                      name="area"
                      type="number"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                      Количество комнат
                    </label>
                    <TeamsInput
                      name="rooms"
                      type="number"
                      value={formData.rooms}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                      Спальни
                    </label>
                    <TeamsInput
                      name="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                      Ванные комнаты
                    </label>
                    <TeamsInput
                      name="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </TeamsCard>

              <TeamsCard className="p-4 sm:p-6 mt-4 sm:mt-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#323130] mb-4 sm:mb-6">
                  Финансовые условия
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                      Арендная плата (₽/мес) <span className="text-red-500">*</span>
                    </label>
                    <TeamsInput
                      name="pricePerMonth"
                      type="number"
                      value={formData.pricePerMonth}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                      min="0"
                      step="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#323130] mb-1 sm:mb-2">
                      Депозит (₽)
                    </label>
                    <TeamsInput
                      name="deposit"
                      type="number"
                      value={formData.deposit}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </TeamsCard>
            </div>

            <div>
              <TeamsCard className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#323130] mb-4 sm:mb-6">
                  Фотографии
                </h2>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-[#e1dfdd] rounded-lg p-4 sm:p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-[#605e5c]" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <TeamsButton variant="outline" type="button">
                          Загрузить фото
                        </TeamsButton>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-[#605e5c] mt-2">
                      JPG, PNG до 10 МБ
                    </p>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      {formData.images.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-[#faf9f8] rounded">
                          <span className="text-sm truncate text-[#323130]">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TeamsCard>

              <TeamsCard className="p-4 sm:p-6 mt-4 sm:mt-6">
                <div className="space-y-3 sm:space-y-4">
                  <TeamsButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Создание...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Создать объект
                      </>
                    )}
                  </TeamsButton>
                  
                  <Link href="/properties">
                    <TeamsButton variant="outline" className="w-full">
                      Отмена
                    </TeamsButton>
                  </Link>
                </div>
              </TeamsCard>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
} 