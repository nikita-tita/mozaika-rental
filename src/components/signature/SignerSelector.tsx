'use client'

import { useState, useEffect } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsInput, TeamsSelect, TeamsModal } from '@/components/ui/teams'
import { User, Plus, X, Search, UserPlus } from 'lucide-react'

interface Client {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  type: 'TENANT' | 'LANDLORD' | 'OTHER'
}

interface SelectedSigner {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  role: 'landlord' | 'tenant' | 'realtor' | 'witness'
}

interface SignerSelectorProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (signers: SelectedSigner[]) => void
  selectedSigners: SelectedSigner[]
}

export default function SignerSelector({ isOpen, onClose, onConfirm, selectedSigners }: SignerSelectorProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClients, setSelectedClients] = useState<SelectedSigner[]>(selectedSigners)
  const [showNewSignerForm, setShowNewSignerForm] = useState(false)
  const [newSigner, setNewSigner] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'tenant'
  })

  const roleOptions = [
    { value: 'landlord', label: 'Арендодатель' },
    { value: 'tenant', label: 'Арендатор' },
    { value: 'realtor', label: 'Риелтор' },
    { value: 'witness', label: 'Свидетель' }
  ]

  useEffect(() => {
    if (isOpen) {
      fetchClients()
    }
  }, [isOpen])

  const fetchClients = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      if (data.success) {
        setClients(data.data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const addClient = (client: Client, role: string) => {
    const newSigner: SelectedSigner = {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      role: role as 'landlord' | 'tenant' | 'realtor' | 'witness'
    }
    
    // Проверяем, что клиент еще не добавлен
    if (!selectedClients.find(s => s.id === client.id)) {
      setSelectedClients(prev => [...prev, newSigner])
    }
  }

  const removeClient = (clientId: string) => {
    setSelectedClients(prev => prev.filter(c => c.id !== clientId))
  }

  const updateClientRole = (clientId: string, role: string) => {
    setSelectedClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, role: role as 'landlord' | 'tenant' | 'realtor' | 'witness' } : c
    ))
  }

  const handleAddNewSigner = async () => {
    if (!newSigner.firstName || !newSigner.lastName || !newSigner.phone) {
      alert('Пожалуйста, заполните обязательные поля: имя, фамилия и телефон')
      return
    }

    try {
      // Создаем нового клиента
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: newSigner.firstName,
          lastName: newSigner.lastName,
          email: newSigner.email || undefined,
          phone: newSigner.phone,
          type: newSigner.role === 'landlord' ? 'LANDLORD' : 'TENANT'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Добавляем нового подписанта
        const newSignerData: SelectedSigner = {
          id: data.data.id,
          firstName: newSigner.firstName,
          lastName: newSigner.lastName,
          email: newSigner.email,
          phone: newSigner.phone,
          role: newSigner.role as 'landlord' | 'tenant' | 'realtor' | 'witness'
        }
        
        setSelectedClients(prev => [...prev, newSignerData])
        
        // Обновляем список клиентов
        await fetchClients()
        
        // Сбрасываем форму
        setNewSigner({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'tenant'
        })
        setShowNewSignerForm(false)
      } else {
        alert('Ошибка при создании подписанта: ' + data.error)
      }
    } catch (error) {
      console.error('Error creating new signer:', error)
      alert('Ошибка при создании подписанта')
    }
  }

  const handleConfirm = () => {
    onConfirm(selectedClients)
    onClose()
  }

  const filteredClients = clients.filter(client => 
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  )

  const getClientTypeText = (type: string) => {
    switch (type) {
      case 'TENANT': return 'Арендатор'
      case 'LANDLORD': return 'Арендодатель'
      case 'OTHER': return 'Другой'
      default: return 'Неизвестно'
    }
  }

  const getRoleText = (role: string) => {
    return roleOptions.find(r => r.value === role)?.label || 'Подписант'
  }

  return (
    <TeamsModal
      isOpen={isOpen}
      onClose={onClose}
      title="Выбор подписантов"
      size="lg"
    >
      <div className="space-y-6">
        {/* Поиск клиентов */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Поиск клиентов
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <TeamsInput
              placeholder="Поиск по имени, email или телефону..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Кнопка добавления нового подписанта */}
        <div>
          <TeamsButton
            variant="outline"
            onClick={() => setShowNewSignerForm(true)}
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Добавить нового подписанта
          </TeamsButton>
        </div>

        {/* Форма добавления нового подписанта */}
        {showNewSignerForm && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-gray-900">Новый подписант</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя *
                </label>
                <TeamsInput
                  value={newSigner.firstName}
                  onChange={(e) => setNewSigner(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Имя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Фамилия *
                </label>
                <TeamsInput
                  value={newSigner.lastName}
                  onChange={(e) => setNewSigner(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Фамилия"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <TeamsInput
                  type="email"
                  value={newSigner.email}
                  onChange={(e) => setNewSigner(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон *
                </label>
                <TeamsInput
                  value={newSigner.phone}
                  onChange={(e) => setNewSigner(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Роль
              </label>
              <TeamsSelect
                options={roleOptions}
                value={newSigner.role}
                onChange={(role) => {
                  if (role) {
                    setNewSigner(prev => ({ ...prev, role }))
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <TeamsButton onClick={handleAddNewSigner}>
                Добавить
              </TeamsButton>
              <TeamsButton
                variant="outline"
                onClick={() => setShowNewSignerForm(false)}
              >
                Отмена
              </TeamsButton>
            </div>
          </div>
        )}

        {/* Список клиентов */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Доступные клиенты</h3>
          {loading ? (
            <div className="text-center py-4">Загрузка клиентов...</div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {client.firstName} {client.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {client.email && `${client.email} • `}{client.phone}
                    </div>
                    <div className="text-xs text-gray-400">
                      {getClientTypeText(client.type)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TeamsSelect
                      options={roleOptions}
                      placeholder="Роль"
                      onChange={(role) => {
                        if (role) {
                          addClient(client, role)
                        }
                      }}
                      className="w-32"
                    />
                  </div>
                </div>
              ))}
              {filteredClients.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Клиенты не найдены
                </div>
              )}
            </div>
          )}
        </div>

        {/* Выбранные подписанты */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">
            Выбранные подписанты ({selectedClients.length})
          </h3>
          <div className="space-y-2">
            {selectedClients.map((signer) => (
              <div key={signer.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {signer.firstName} {signer.lastName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {signer.email && `${signer.email} • `}{signer.phone}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    {getRoleText(signer.role)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TeamsSelect
                    options={roleOptions}
                    value={signer.role}
                    onChange={(role) => {
                      if (role) {
                        updateClientRole(signer.id, role)
                      }
                    }}
                    className="w-32"
                  />
                  <TeamsButton
                    variant="outline"
                    size="sm"
                    onClick={() => removeClient(signer.id)}
                  >
                    <X className="w-4 h-4" />
                  </TeamsButton>
                </div>
              </div>
            ))}
            {selectedClients.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Подписанты не выбраны
              </div>
            )}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <TeamsButton variant="outline" onClick={onClose}>
            Отмена
          </TeamsButton>
          <TeamsButton 
            onClick={handleConfirm}
            disabled={selectedClients.length === 0}
          >
            Подтвердить ({selectedClients.length})
          </TeamsButton>
        </div>
      </div>
    </TeamsModal>
  )
} 