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
  TeamsSkeleton
} from '@/components/ui/teams'
import { Plus, Users, Search, Filter, MapPin, Phone, Mail } from 'lucide-react'
import { PropertySelector } from '@/components/ui/PropertySelector'

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
  properties?: Array<{
    id: string
    title: string
    address: string
    type: string
  }>
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showPropertyLink, setShowPropertyLink] = useState(false)
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
    type: 'TENANT' as const,
    passport: '',
    snils: '',
    inn: '',
    address: '',
    city: '',
    notes: '',
    source: ''
  })

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
    
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        setShowAddForm(false)
        setFormData({
          firstName: '',
          lastName: '',
          middleName: '',
          email: '',
          phone: '',
          birthDate: '',
          type: 'TENANT',
          passport: '',
          snils: '',
          inn: '',
          address: '',
          city: '',
          notes: '',
          source: ''
        })
        fetchClients()
      }
    } catch (error) {
      console.error('Error creating client:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      middleName: client.middleName || '',
      email: client.email || '',
      phone: client.phone,
      birthDate: client.birthDate || '',
      type: client.type,
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

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedClient) return

    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        setShowEditForm(false)
        setSelectedClient(null)
        fetchClients()
        // Сброс формы
        setFormData({
          firstName: '',
          lastName: '',
          middleName: '',
          email: '',
          phone: '',
          birthDate: '',
          type: 'TENANT',
          passport: '',
          snils: '',
          inn: '',
          address: '',
          city: '',
          notes: '',
          source: ''
        })
      }
    } catch (error) {
      console.error('Error updating client:', error)
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
      case 'BOTH': return 'Оба'
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
      <div className="max-w-7xl mx-auto px-responsive-sm sm:px-responsive-md lg:px-responsive-lg py-responsive-lg sm:py-responsive-xl">
        <nav className="flex mb-responsive-md sm:mb-responsive-lg" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-responsive-sm sm:space-x-responsive-md">
            <li>
              <div className="flex items-center">
                <a href="/dashboard" className="text-gray-400 hover:text-gray-500 text-sm sm:text-base">
                  Главная
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm sm:text-base">Клиенты</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="mt-responsive-lg sm:mt-responsive-xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-responsive-md sm:mb-responsive-lg gap-responsive-sm sm:gap-responsive-md">
            <div>
              <h1 className="text-responsive-h2 font-bold text-[#323130] flex items-center">
                <Users className="mr-responsive-sm sm:mr-responsive-md h-6 w-6 sm:h-8 sm:w-8 text-[#0078d4]" />
                Клиенты
              </h1>
              <p className="mt-responsive-sm sm:mt-responsive-md text-sm sm:text-base text-[#605e5c]">
                Управление базой клиентов
              </p>
            </div>
            <TeamsButton
              onClick={() => setShowAddForm(true)}
              icon={<Plus className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Добавить клиента
            </TeamsButton>
          </div>

          {/* Фильтры и поиск */}
          <TeamsCard variant="elevated" padding="lg" className="mb-responsive-md sm:mb-responsive-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-responsive-sm sm:gap-responsive-md">
              <TeamsInput
                type="text"
                placeholder="Поиск по имени, телефону, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
              <TeamsSelect
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
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
              <div className="text-center py-responsive-lg sm:py-responsive-xl">
                <Users className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-[#605e5c]" />
                <h3 className="mt-responsive-sm sm:mt-responsive-md text-sm sm:text-base font-medium text-[#323130]">Клиенты не найдены</h3>
                <p className="mt-responsive-xs sm:mt-responsive-sm text-xs sm:text-sm text-[#605e5c]">
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
                      <th className="px-responsive-sm sm:px-responsive-md py-responsive-sm sm:py-responsive-md text-left text-xs font-medium text-[#605e5c] uppercase tracking-wider">
                        Клиент
                      </th>
                      <th className="px-responsive-sm sm:px-responsive-md py-responsive-sm sm:py-responsive-md text-left text-xs font-medium text-[#605e5c] uppercase tracking-wider">
                        Контакты
                      </th>
                      <th className="px-responsive-sm sm:px-responsive-md py-responsive-sm sm:py-responsive-md text-left text-xs font-medium text-[#605e5c] uppercase tracking-wider">
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
                            >
                              Редактировать
                            </TeamsButton>
                            <TeamsButton
                              size="sm"
                              variant="outline"
                              onClick={() => handleLinkProperty(client)}
                            >
                              Связать с объектом
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
        </div>

        {/* Модальное окно добавления клиента */}
        <TeamsModal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="Добавить нового клиента"
        >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <TeamsInput
                      name="phone"
                      placeholder="Телефон"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <TeamsInput
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Дата рождения
                    </label>
                    <TeamsInput
                      name="birthDate"
                      type="date"
                      placeholder="Дата рождения"
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Тип клиента
                    </label>
                    <TeamsSelect
                      options={[
                        { value: 'TENANT', label: 'Арендатор' },
                        { value: 'LANDLORD', label: 'Арендодатель' },
                        { value: 'BOTH', label: 'Оба типа' }
                      ]}
                      value={formData.type}
                      onChange={(value) => setFormData(prev => ({ ...prev, type: value as 'TENANT' | 'LANDLORD' | 'BOTH' }))}
                      placeholder="Выберите тип клиента"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    >
                      Отмена
                    </TeamsButton>
                    <TeamsButton type="submit">
                      Добавить клиента
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Отчество
              </label>
              <TeamsInput
                name="middleName"
                placeholder="Отчество"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <TeamsInput
                  name="phone"
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата рождения
              </label>
              <TeamsInput
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип клиента <span className="text-red-500">*</span>
              </label>
              <TeamsSelect
                value={formData.type}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value as 'TENANT' | 'LANDLORD' | 'BOTH' }))}
                options={[
                  { value: 'TENANT', label: 'Арендатор' },
                  { value: 'LANDLORD', label: 'Арендодатель' },
                  { value: 'BOTH', label: 'Оба типа' }
                ]}
                placeholder="Выберите тип клиента"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  СНИЛС
                </label>
                <TeamsInput
                  name="snils"
                  placeholder="СНИЛС"
                  value={formData.snils}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ИНН
              </label>
              <TeamsInput
                name="inn"
                placeholder="ИНН"
                value={formData.inn}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Город
                </label>
                <TeamsInput
                  name="city"
                  placeholder="Город"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              >
                Отмена
              </TeamsButton>
              <TeamsButton type="submit">
                Сохранить изменения
              </TeamsButton>
            </div>
          </form>
        </TeamsModal>

        {/* Модальное окно связи с объектом */}
        <TeamsModal
          isOpen={showPropertyLink}
          onClose={() => setShowPropertyLink(false)}
          title="Связать клиента с объектом"
        >
          {selectedClient && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Клиент: {selectedClient.firstName} {selectedClient.lastName}</h4>
                <p className="text-sm text-gray-600">Выберите объект недвижимости для связи с клиентом</p>
              </div>
              
              <PropertySelector
                selectedProperty={null}
                onPropertySelect={(property) => {
                  // Здесь будет логика связи клиента с объектом
                  console.log('Linking client to property:', { client: selectedClient, property })
                  setShowPropertyLink(false)
                }}
                onPropertyCreate={() => {
                  // Перенаправление на создание объекта
                  window.open('/properties/new', '_blank')
                }}
                placeholder="Выберите объект для связи"
              />
              
              <div className="flex justify-end space-x-3 pt-4">
                <TeamsButton
                  variant="outline"
                  onClick={() => setShowPropertyLink(false)}
                >
                  Отмена
                </TeamsButton>
              </div>
            </div>
          )}
        </TeamsModal>
      </div>
    </div>
  )
} 