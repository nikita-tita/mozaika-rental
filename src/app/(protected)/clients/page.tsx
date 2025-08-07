'use client'

import { useState, useEffect } from 'react'
import { 
  TeamsButton, 
  TeamsInput, 
  TeamsCard, 
  TeamsSelect,
  TeamsTextarea,
  TeamsTable,
  TeamsTableHeader,
  TeamsTableBody,
  TeamsTableRow,
  TeamsTableCell,
  TeamsTableHeaderCell,
  TeamsBadge,
  TeamsModal,
  TeamsNavigation,
  TeamsSkeleton,
  TeamsAlert,
  TeamsMultiSelect
} from '@/components/ui/teams'
import { DatePicker } from '@/components/ui/DatePicker'
import { ClientPropertyLink } from '@/components/clients/ClientPropertyLink'
import { Plus, Users, Search, Filter, MapPin, Phone, Mail, AlertCircle, CheckCircle, Trash2, Edit, Link } from 'lucide-react'

interface Client {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  email?: string
  phone: string
  birthDate?: string
  type: 'TENANT' | 'LANDLORD' | 'BOTH'
  passport?: string
  snils?: string
  inn?: string
  address?: string
  city?: string
  notes?: string
  source?: string
  isActive: boolean
  createdAt: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showPropertyLink, setShowPropertyLink] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    birthDate: '',
    types: [] as string[],
    passport: '',
    snils: '',
    inn: '',
    address: '',
    city: '',
    notes: '',
    source: ''
  })
  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      
      if (data.success) {
        setClients(data.data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors([])
    setSuccessMessage('')
    
    // Преобразуем множественные типы в один тип
    const clientType = formData.types.includes('TENANT') && formData.types.includes('LANDLORD') 
      ? 'BOTH' 
      : formData.types.includes('TENANT') 
        ? 'TENANT' 
        : formData.types.includes('LANDLORD') 
          ? 'LANDLORD' 
          : 'TENANT'
    
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          type: clientType
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccessMessage(data.message || 'Клиент успешно создан')
        setShowAddForm(false)
        setFormData({
          firstName: '',
          lastName: '',
          middleName: '',
          email: '',
          phone: '',
          birthDate: '',
          types: [],
          passport: '',
          snils: '',
          inn: '',
          address: '',
          city: '',
          notes: '',
          source: ''
        })
        fetchClients()
        
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrors([data.error || 'Ошибка при создании клиента'])
      }
    } catch (error) {
      console.error('Error creating client:', error)
      setErrors(['Ошибка при создании клиента'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (value: string) => {
    setFormData(prev => ({ ...prev, birthDate: value }))
  }

  const handleTypesChange = (value: string[]) => {
    setFormData(prev => ({ ...prev, types: value }))
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    // Преобразуем тип клиента в массив типов
    const types = client.type === 'BOTH' 
      ? ['TENANT', 'LANDLORD'] 
      : client.type === 'TENANT' 
        ? ['TENANT'] 
        : ['LANDLORD']
    
    setFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      middleName: client.middleName || '',
      email: client.email || '',
      phone: client.phone,
      birthDate: client.birthDate || '',
      types,
      passport: client.passport || '',
      snils: client.snils || '',
      inn: client.inn || '',
      address: client.address || '',
      city: client.city || '',
      notes: client.notes || '',
      source: client.source || ''
    })
    setShowEditForm(true)
  }

  const handleLinkProperty = (client: Client) => {
    setSelectedClient(client)
    setShowPropertyLink(true)
  }

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteClient = async () => {
    if (!selectedClient) return

    setIsSubmitting(true)
    setErrors([])
    setSuccessMessage('')

    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccessMessage('Клиент успешно удален')
        setShowDeleteConfirm(false)
        setSelectedClient(null)
        fetchClients()
        
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrors([data.error || 'Ошибка при удалении клиента'])
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      setErrors(['Ошибка при удалении клиента'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors([])
    setSuccessMessage('')
    
    if (!selectedClient) return

    // Преобразуем множественные типы в один тип
    const clientType = formData.types.includes('TENANT') && formData.types.includes('LANDLORD') 
      ? 'BOTH' 
      : formData.types.includes('TENANT') 
        ? 'TENANT' 
        : formData.types.includes('LANDLORD') 
          ? 'LANDLORD' 
          : 'TENANT'

    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          type: clientType
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccessMessage('Клиент успешно обновлен')
        setShowEditForm(false)
        setSelectedClient(null)
        fetchClients()
        setFormData({
          firstName: '',
          lastName: '',
          middleName: '',
          email: '',
          phone: '',
          birthDate: '',
          types: [],
          passport: '',
          snils: '',
          inn: '',
          address: '',
          city: '',
          notes: '',
          source: ''
        })
        
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrors([data.error || 'Ошибка при обновлении клиента'])
      }
    } catch (error) {
      console.error('Error updating client:', error)
      setErrors(['Ошибка при обновлении клиента'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'ALL' || client.type === filterType
    
    return matchesSearch && matchesType
  })

  const getClientTypeLabel = (type: string) => {
    switch (type) {
      case 'TENANT': return 'Арендатор'
      case 'LANDLORD': return 'Арендодатель'
      case 'BOTH': return 'Оба типа'
      default: return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[#e1dfdd] rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-[#e1dfdd] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#323130] flex items-center">
            <Users className="mr-3 h-8 w-8 text-[#0078d4]" />
            Клиенты
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#605e5c]">
            Управление базой клиентов
          </p>
        </div>

        {/* Сообщения об ошибках и успехе */}
        {errors.length > 0 && (
          <TeamsAlert
            variant="error"
            title="Ошибка"
            className="mb-4"
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
            className="mb-4"
          >
            {successMessage}
          </TeamsAlert>
        )}

        {/* Кнопка добавления */}
        <div className="flex justify-end mb-6">
          <TeamsButton
            onClick={() => setShowAddForm(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Добавить клиента
          </TeamsButton>
        </div>

        {/* Фильтры и поиск */}
        <TeamsCard variant="elevated" padding="lg" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TeamsInput
              type="text"
              placeholder="Поиск по имени, телефону, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
            <TeamsSelect
              value={filterType}
              onChange={(value) => setFilterType(value)}
              options={[
                { value: 'ALL', label: 'Все клиенты' },
                { value: 'TENANT', label: 'Арендаторы' },
                { value: 'LANDLORD', label: 'Арендодатели' },
                { value: 'BOTH', label: 'Оба типа' }
              ]}
            />
          </div>
        </TeamsCard>

        {/* Список клиентов */}
        <TeamsCard variant="elevated" padding="sm" className="overflow-hidden">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-[#605e5c]" />
              <h3 className="mt-2 text-sm font-medium text-[#323130]">Клиенты не найдены</h3>
              <p className="mt-1 text-sm text-[#605e5c]">
                {searchTerm || filterType !== 'ALL' 
                  ? 'Попробуйте изменить параметры поиска'
                  : 'Начните с добавления первого клиента'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e1dfdd]">
                <thead className="bg-[#faf9f8]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#605e5c] uppercase tracking-wider">
                      Клиент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#605e5c] uppercase tracking-wider">
                      Контакты
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#605e5c] uppercase tracking-wider">
                      Тип
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#605e5c] uppercase tracking-wider">
                      Дата добавления
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#605e5c] uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#e1dfdd]">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-[#faf9f8]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-[#323130]">
                            {client.firstName} {client.lastName}
                          </div>
                          {client.middleName && (
                            <div className="text-sm text-[#605e5c]">
                              {client.middleName}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#323130]">{client.phone}</div>
                        {client.email && (
                          <div className="text-sm text-[#605e5c]">{client.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          client.type === 'TENANT' ? 'bg-[#deecf9] text-[#0078d4]' :
                          client.type === 'LANDLORD' ? 'bg-[#dff6dd] text-[#107c10]' :
                          'bg-[#f3e5f5] text-[#5c2d91]'
                        }`}>
                          {getClientTypeLabel(client.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#605e5c]">
                        {formatDate(client.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#605e5c]">
                        <div className="flex space-x-2">
                          <TeamsButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClient(client)}
                            icon={<Edit className="w-3 h-3" />}
                          >
                            Редактировать
                          </TeamsButton>
                          <TeamsButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleLinkProperty(client)}
                            icon={<Link className="w-3 h-3" />}
                          >
                            Связать
                          </TeamsButton>
                          <TeamsButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClient(client)}
                            icon={<Trash2 className="w-3 h-3" />}
                          >
                            Удалить
                          </TeamsButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TeamsCard>

        {/* Модальное окно добавления клиента */}
        <TeamsModal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="Добавить нового клиента"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1">
                  Имя <span className="text-red-500">*</span>
                </label>
                <TeamsInput
                  name="firstName"
                  placeholder="Имя"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1">
                  Фамилия <span className="text-red-500">*</span>
                </label>
                <TeamsInput
                  name="lastName"
                  placeholder="Фамилия"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Отчество
              </label>
              <TeamsInput
                name="middleName"
                placeholder="Отчество"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Телефон <span className="text-red-500">*</span>
              </label>
              <TeamsInput
                name="phone"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Email
              </label>
              <TeamsInput
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Дата рождения
              </label>
              <DatePicker
                value={formData.birthDate}
                onChange={handleDateChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Роли клиента <span className="text-red-500">*</span>
              </label>
              <TeamsMultiSelect
                value={formData.types}
                onChange={handleTypesChange}
                options={[
                  { value: 'TENANT', label: 'Арендатор' },
                  { value: 'LANDLORD', label: 'Арендодатель' }
                ]}
                placeholder="Выберите роли клиента"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Паспорт
              </label>
              <TeamsInput
                name="passport"
                placeholder="Паспорт (серия номер)"
                value={formData.passport}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                СНИЛС
              </label>
              <TeamsInput
                name="snils"
                placeholder="СНИЛС"
                value={formData.snils}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                ИНН
              </label>
              <TeamsInput
                name="inn"
                placeholder="ИНН"
                value={formData.inn}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Адрес
              </label>
              <TeamsInput
                name="address"
                placeholder="Адрес"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Город
              </label>
              <TeamsInput
                name="city"
                placeholder="Город"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Источник клиента
              </label>
              <TeamsInput
                name="source"
                placeholder="Источник клиента"
                value={formData.source}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Заметки
              </label>
              <TeamsTextarea
                name="notes"
                placeholder="Заметки"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <TeamsButton
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                disabled={isSubmitting}
              >
                Отмена
              </TeamsButton>
              <TeamsButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Создание...' : 'Добавить клиента'}
              </TeamsButton>
            </div>
          </form>
        </TeamsModal>

        {/* Модальное окно редактирования клиента */}
        <TeamsModal
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          title="Редактировать клиента"
        >
          <form onSubmit={handleUpdateClient} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1">
                  Имя <span className="text-red-500">*</span>
                </label>
                <TeamsInput
                  name="firstName"
                  placeholder="Имя"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1">
                  Фамилия <span className="text-red-500">*</span>
                </label>
                <TeamsInput
                  name="lastName"
                  placeholder="Фамилия"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Отчество
              </label>
              <TeamsInput
                name="middleName"
                placeholder="Отчество"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Телефон <span className="text-red-500">*</span>
              </label>
              <TeamsInput
                name="phone"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Email
              </label>
              <TeamsInput
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Дата рождения
              </label>
              <DatePicker
                value={formData.birthDate}
                onChange={handleDateChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Роли клиента <span className="text-red-500">*</span>
              </label>
              <TeamsMultiSelect
                value={formData.types}
                onChange={handleTypesChange}
                options={[
                  { value: 'TENANT', label: 'Арендатор' },
                  { value: 'LANDLORD', label: 'Арендодатель' }
                ]}
                placeholder="Выберите роли клиента"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Паспорт
              </label>
              <TeamsInput
                name="passport"
                placeholder="Паспорт (серия номер)"
                value={formData.passport}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                СНИЛС
              </label>
              <TeamsInput
                name="snils"
                placeholder="СНИЛС"
                value={formData.snils}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                ИНН
              </label>
              <TeamsInput
                name="inn"
                placeholder="ИНН"
                value={formData.inn}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Адрес
              </label>
              <TeamsInput
                name="address"
                placeholder="Адрес"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Город
              </label>
              <TeamsInput
                name="city"
                placeholder="Город"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Источник клиента
              </label>
              <TeamsInput
                name="source"
                placeholder="Источник клиента"
                value={formData.source}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Заметки
              </label>
              <TeamsTextarea
                name="notes"
                placeholder="Заметки"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <TeamsButton
                type="button"
                variant="outline"
                onClick={() => setShowEditForm(false)}
                disabled={isSubmitting}
              >
                Отмена
              </TeamsButton>
              <TeamsButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
              </TeamsButton>
            </div>
          </form>
        </TeamsModal>

        {/* Модальное окно подтверждения удаления */}
        <TeamsModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Подтверждение удаления"
        >
          <div className="space-y-4">
            <div className="bg-[#faf9f8] p-4 rounded-lg">
              <h3 className="font-medium text-[#323130] mb-2">
                Удалить клиента: {selectedClient?.firstName} {selectedClient?.lastName}?
              </h3>
              <p className="text-sm text-[#605e5c]">
                Это действие нельзя отменить. Все данные клиента будут удалены безвозвратно.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <TeamsButton
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
              >
                Отмена
              </TeamsButton>
              <TeamsButton 
                type="button"
                variant="outline"
                onClick={confirmDeleteClient}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Удаление...' : 'Удалить'}
              </TeamsButton>
            </div>
          </div>
        </TeamsModal>

        {/* Компонент связывания с объектами */}
        <ClientPropertyLink
          isOpen={showPropertyLink}
          onClose={() => setShowPropertyLink(false)}
          client={selectedClient}
          onLinkSuccess={() => {
            // Можно добавить обновление данных если нужно
          }}
        />
      </div>
    </div>
  )
}