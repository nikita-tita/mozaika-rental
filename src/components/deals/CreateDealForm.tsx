'use client'

import { useState, useEffect } from 'react'
import { 
  TeamsButton, 
  TeamsInput, 
  TeamsSelect, 
  TeamsCard, 
  TeamsTextarea,
  TeamsModal,
  TeamsAlert
} from '@/components/ui/teams'
import { DatePicker } from '@/components/ui/DatePicker'
import { Plus, Building, Users, Calendar, Banknote, Clock, Lock } from 'lucide-react'

interface Property {
  id: string
  title: string
  address: string
  price: number
}

interface Client {
  id: string
  firstName: string
  lastName: string
  type: 'TENANT' | 'LANDLORD' | 'BOTH'
  phone: string
  email?: string
}

interface CreateDealFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (dealId?: string) => void
}

export default function CreateDealForm({ isOpen, onClose, onSuccess }: CreateDealFormProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState('')
  const [isCustomDuration, setIsCustomDuration] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyId: '',
    tenantId: '',
    landlordId: '',
    monthlyRent: '',
    deposit: '',
    startDate: '',
    endDate: '',
    commission: '',
    duration: '11' // По умолчанию 11 месяцев
  })

  useEffect(() => {
    if (isOpen) {
      fetchProperties()
      fetchClients()
    }
  }, [isOpen])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      const data = await response.json()
      
      if (data.success) {
        setProperties(data.data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      
      if (data.success) {
        setClients(data.data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    setSuccessMessage('')

    try {
      const requestData = {
        ...formData,
        monthlyRent: parseFloat(formData.monthlyRent) || 0,
        deposit: formData.deposit ? parseFloat(formData.deposit) : undefined,
        commission: formData.commission ? parseFloat(formData.commission) : undefined
      }
      
      console.log('Sending deal data:', requestData)
      
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()
      
      console.log('Response from server:', data)

      if (data.success) {
        setSuccessMessage(data.message || 'Сделка успешно создана')
        setFormData({
          title: '',
          description: '',
          propertyId: '',
          tenantId: '',
          landlordId: '',
          monthlyRent: '',
          deposit: '',
          startDate: '',
          endDate: '',
          commission: '',
          duration: '11'
        })
        setIsCustomDuration(false)
        
        // Скрываем сообщение об успехе через 2 секунды и закрываем форму
        setTimeout(() => {
          setSuccessMessage('')
          onClose()
          onSuccess(data.data?.id) // Передаем ID созданной сделки
        }, 2000)
      } else {
        setErrors([data.error || 'Ошибка при создании сделки'])
      }
    } catch (error) {
      console.error('Error creating deal:', error)
      setErrors(['Ошибка при создании сделки'])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDurationChange = (duration: string) => {
    const isCustom = duration === 'custom'
    setIsCustomDuration(isCustom)
    
    setFormData(prev => ({ ...prev, duration }))
    
    // Если выбран произвольный срок, очищаем дату окончания
    if (isCustom) {
      setFormData(prev => ({ ...prev, duration, endDate: '' }))
      return
    }
    
    // Автоматически рассчитываем дату окончания на основе даты начала
    if (formData.startDate && duration) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + parseInt(duration))
      
      setFormData(prev => ({ 
        ...prev, 
        duration,
        endDate: endDate.toISOString().split('T')[0]
      }))
    }
  }

  const handleStartDateChange = (value: string) => {
    setFormData(prev => ({ ...prev, startDate: value }))
    
    // Автоматически рассчитываем дату окончания если выбрана длительность и не произвольный срок
    if (value && formData.duration && !isCustomDuration) {
      const startDate = new Date(value)
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + parseInt(formData.duration))
      
      setFormData(prev => ({ 
        ...prev, 
        startDate: value,
        endDate: endDate.toISOString().split('T')[0]
      }))
    }
  }

  const getTenants = () => {
    return clients.filter(client => 
      client.type === 'TENANT' || client.type === 'BOTH'
    )
  }

  const getLandlords = () => {
    return clients.filter(client => 
      client.type === 'LANDLORD' || client.type === 'BOTH'
    )
  }

  const handlePropertySelect = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId)
    if (property) {
      setFormData(prev => ({
        ...prev,
        propertyId: property.id,
        monthlyRent: property.price.toString()
      }))
    }
  }

  const handleTenantSelect = (tenantId: string) => {
    const tenant = clients.find(c => c.id === tenantId)
    if (tenant) {
      setFormData(prev => ({
        ...prev,
        tenantId: tenant.id
      }))
    }
  }

  const handleLandlordSelect = (landlordId: string) => {
    const landlord = clients.find(c => c.id === landlordId)
    if (landlord) {
      setFormData(prev => ({
        ...prev,
        landlordId: landlord.id
      }))
    }
  }

  const durationOptions = [
    { value: '1', label: '1 месяц' },
    { value: '3', label: '3 месяца' },
    { value: '6', label: '6 месяцев' },
    { value: '11', label: '11 месяцев (стандарт)' },
    { value: '12', label: '12 месяцев' },
    { value: '24', label: '24 месяца' },
    { value: '36', label: '36 месяцев' },
    { value: 'custom', label: 'Произвольный срок' }
  ]

  return (
    <TeamsModal
      isOpen={isOpen}
      onClose={onClose}
      title="Создать новую сделку"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Сообщения об ошибках и успехе */}
        {errors.length > 0 && (
          <TeamsAlert
            variant="error"
            title="Ошибка"
          >
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </TeamsAlert>
        )}

        {successMessage && (
          <TeamsAlert
            variant="success"
            title="Успешно"
          >
            {successMessage}
          </TeamsAlert>
        )}

        {/* Основная информация */}
        <div>
          <h3 className="text-lg font-medium text-[#323130] mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Основная информация
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Название сделки <span className="text-red-500">*</span>
              </label>
              <TeamsInput
                name="title"
                placeholder="Например: Аренда квартиры на ул. Ленина"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Описание
              </label>
              <TeamsTextarea
                name="description"
                placeholder="Дополнительная информация о сделке"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Объект недвижимости */}
        <div>
          <h3 className="text-lg font-medium text-[#323130] mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Объект недвижимости
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-[#323130] mb-1">
              Выберите объект <span className="text-red-500">*</span>
            </label>
            <TeamsSelect
              value={formData.propertyId}
              onChange={handlePropertySelect}
              options={[
                { value: '', label: 'Выберите объект недвижимости' },
                ...properties.map(property => ({
                  value: property.id,
                  label: `${property.title} - ${property.address} (${property.price} ₽/мес)`
                }))
              ]}
            />
          </div>
        </div>

        {/* Участники сделки */}
        <div>
          <h3 className="text-lg font-medium text-[#323130] mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Участники сделки
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Арендатор <span className="text-red-500">*</span>
              </label>
              <TeamsSelect
                value={formData.tenantId}
                onChange={handleTenantSelect}
                options={[
                  { value: '', label: 'Выберите арендатора' },
                  ...getTenants().map(client => ({
                    value: client.id,
                    label: `${client.firstName} ${client.lastName} (${client.phone})`
                  }))
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Арендодатель <span className="text-red-500">*</span>
              </label>
              <TeamsSelect
                value={formData.landlordId}
                onChange={handleLandlordSelect}
                options={[
                  { value: '', label: 'Выберите арендодателя' },
                  ...getLandlords().map(client => ({
                    value: client.id,
                    label: `${client.firstName} ${client.lastName} (${client.phone})`
                  }))
                ]}
              />
            </div>
          </div>
        </div>

        {/* Финансовые условия */}
        <div>
          <h3 className="text-lg font-medium text-[#323130] mb-4 flex items-center">
            <Banknote className="w-5 h-5 mr-2" />
            Финансовые условия
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Сумма аренды (₽/мес) <span className="text-red-500">*</span>
              </label>
              <TeamsInput
                name="monthlyRent"
                type="number"
                placeholder="0"
                value={formData.monthlyRent}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Залог (₽)
              </label>
              <TeamsInput
                name="deposit"
                type="number"
                placeholder="0"
                value={formData.deposit}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Комиссия (₽)
              </label>
              <TeamsInput
                name="commission"
                type="number"
                placeholder="0"
                value={formData.commission}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Даты аренды */}
        <div>
          <h3 className="text-lg font-medium text-[#323130] mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Даты аренды
          </h3>
          
          <div className="space-y-4">
            {/* Длительность аренды */}
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Срок аренды
              </label>
              <TeamsSelect
                value={formData.duration}
                onChange={handleDurationChange}
                options={durationOptions}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1">
                  Дата начала <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={formData.startDate}
                  onChange={handleStartDateChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1 flex items-center">
                  Дата окончания
                  {!isCustomDuration && formData.startDate && (
                    <span title="Рассчитывается автоматически">
                      <Lock className="w-4 h-4 ml-2 text-gray-400" />
                    </span>
                  )}
                </label>
                <DatePicker
                  value={formData.endDate}
                  onChange={(value) => handleDateChange('endDate', value)}
                  disabled={!isCustomDuration}
                />
                {!isCustomDuration && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Lock className="w-3 h-3 mr-1" />
                    Рассчитывается автоматически на основе срока аренды
                  </p>
                )}
                {isCustomDuration && (
                  <p className="text-xs text-blue-600 mt-1">
                    Укажите произвольную дату окончания
                  </p>
                )}
              </div>
            </div>

            {/* Информация о сроке */}
            {formData.startDate && formData.endDate && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center text-sm text-blue-700">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    Срок аренды: {formData.startDate} - {formData.endDate}
                    {!isCustomDuration && formData.duration && (
                      <span className="ml-2 text-blue-600">
                        ({formData.duration} {parseInt(formData.duration) === 1 ? 'месяц' : 
                          parseInt(formData.duration) < 5 ? 'месяца' : 'месяцев'})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <TeamsButton
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Отмена
          </TeamsButton>
          <TeamsButton 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать сделку'}
          </TeamsButton>
        </div>
      </form>
    </TeamsModal>
  )
} 