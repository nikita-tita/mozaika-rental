'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Building, Home } from 'lucide-react'
import { TeamsAutocomplete } from './TeamsAutocomplete'
import { TeamsInput } from './TeamsInput'
import { searchCities, City } from '@/lib/data/russian-cities'
import { searchStreets, Street } from '@/lib/data/moscow-streets'

interface TeamsAddressInputProps {
  value?: {
    city?: string
    street?: string
    house?: string
    apartment?: string
    fullAddress?: string
  }
  onChange?: (address: {
    city?: string
    street?: string
    house?: string
    apartment?: string
    fullAddress?: string
  }) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showFullAddress?: boolean
}

export const TeamsAddressInput: React.FC<TeamsAddressInputProps> = ({
  value = {},
  onChange,
  placeholder = 'Введите адрес',
  disabled = false,
  error = false,
  className,
  size = 'md',
  showFullAddress = true
}) => {
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string; description?: string }[]>([])
  const [streetOptions, setStreetOptions] = useState<{ value: string; label: string; description?: string }[]>([])
  const [selectedCity, setSelectedCity] = useState(value.city || '')
  const [selectedStreet, setSelectedStreet] = useState(value.street || '')
  const [house, setHouse] = useState(value.house || '')
  const [apartment, setApartment] = useState(value.apartment || '')

  // Поиск городов при вводе
  const handleCitySearch = (query: string) => {
    if (query.length >= 2) {
      const cities = searchCities(query)
      const options = cities.map(city => ({
        value: city.value,
        label: city.label,
        description: `${city.region} • ${city.population?.toLocaleString()} чел.`
      }))
      setCityOptions(options)
    } else {
      setCityOptions([])
    }
  }

  // Поиск улиц при вводе (только для Москвы)
  const handleStreetSearch = (query: string) => {
    if (query.length >= 2 && selectedCity.toLowerCase().includes('москва')) {
      const streets = searchStreets(query)
      const options = streets.map(street => ({
        value: street.value,
        label: street.label,
        description: `${street.district} • ${street.type}`
      }))
      setStreetOptions(options)
    } else {
      setStreetOptions([])
    }
  }

  // Обновление полного адреса
  useEffect(() => {
    const fullAddress = [selectedCity, selectedStreet, house, apartment]
      .filter(Boolean)
      .join(', ')
    
    onChange?.({
      city: selectedCity,
      street: selectedStreet,
      house,
      apartment,
      fullAddress: fullAddress || undefined
    })
  }, [selectedCity, selectedStreet, house, apartment, onChange])

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Город */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Город
        </label>
                  <TeamsAutocomplete
            options={cityOptions}
            value={selectedCity}
            onChange={(city) => {
              setSelectedCity(city)
              // Очищаем улицу при смене города
              if (!city.toLowerCase().includes('москва')) {
                setSelectedStreet('')
              }
            }}
            placeholder="Начните вводить название города..."
            disabled={disabled}
            error={!!error}
            size={size}
            allowCustom={true}
            maxResults={15}
            onSearch={handleCitySearch}
          />
      </div>

      {/* Улица */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Улица
        </label>
        <TeamsAutocomplete
          options={streetOptions}
          value={selectedStreet}
          onChange={setSelectedStreet}
          placeholder={selectedCity.toLowerCase().includes('москва') 
            ? "Начните вводить название улицы..." 
            : "Введите название улицы"
          }
          disabled={disabled || !selectedCity}
          error={!!error}
          size={size}
          allowCustom={true}
          maxResults={15}
          onSearch={handleStreetSearch}
        />
      </div>

      {/* Дом и квартира */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дом
          </label>
          <TeamsInput
            value={house}
            onChange={(e) => setHouse(e.target.value)}
            placeholder="№ дома"
            disabled={disabled}
            error={!!error}
            size={size}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Квартира
          </label>
          <TeamsInput
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            placeholder="№ квартиры"
            disabled={disabled}
            error={!!error}
            size={size}
          />
        </div>
      </div>

      {/* Полный адрес (опционально) */}
      {showFullAddress && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Полный адрес
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <TeamsInput
              value={[selectedCity, selectedStreet, house, apartment].filter(Boolean).join(', ')}
              placeholder="Полный адрес будет сформирован автоматически"
              disabled={true}
              size={size}
              className="pl-10 bg-gray-50"
            />
          </div>
        </div>
      )}
    </div>
  )
} 