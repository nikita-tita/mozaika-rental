'use client'

import { useState, useEffect } from 'react'
import { 
  TeamsModal, 
  TeamsSelect, 
  TeamsTextarea, 
  TeamsButton, 
  TeamsAlert,
  TeamsCard,
  TeamsBadge
} from '@/components/ui/teams'
import { MapPin, User, Calendar } from 'lucide-react'

interface Property {
  id: string
  title: string
  address: string
  type: string
  price: number
}

interface Client {
  id: string
  firstName: string
  lastName: string
  type: string
}

interface ClientPropertyLinkProps {
  isOpen: boolean
  onClose: () => void
  client: Client | null
  onLinkSuccess: () => void
}

interface PropertyLink {
  id: string
  propertyId: string
  clientId: string
  linkType: 'OWNER' | 'TENANT' | 'INTERESTED'
  comment?: string
  createdAt: string
  property: Property
}

export function ClientPropertyLink({ isOpen, onClose, client, onLinkSuccess }: ClientPropertyLinkProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [linkType, setLinkType] = useState<'OWNER' | 'TENANT' | 'INTERESTED'>('TENANT')
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [existingLinks, setExistingLinks] = useState<PropertyLink[]>([])

  useEffect(() => {
    if (isOpen && client) {
      fetchProperties()
      fetchExistingLinks()
    }
  }, [isOpen, client])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      const data = await response.json()
      
      if (data.success) {
        setProperties(data.data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      setError('Ошибка при загрузке объектов недвижимости')
    }
  }

  const fetchExistingLinks = async () => {
    if (!client) return
    
    try {
      const response = await fetch(`/api/clients/${client.id}/properties`)
      const data = await response.json()
      
      if (data.success) {
        setExistingLinks(data.data)
      }
    } catch (error) {
      console.error('Error fetching existing links:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!client || !selectedPropertyId) return

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/clients/property-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: client.id,
          propertyId: selectedPropertyId,
          linkType,
          comment
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccess('Связь успешно создана')
        setSelectedPropertyId('')
        setLinkType('TENANT')
        setComment('')
        fetchExistingLinks()
        onLinkSuccess()
        
        setTimeout(() => {
          setSuccess('')
        }, 3000)
      } else {
        setError(data.error || 'Ошибка при создании связи')
      }
    } catch (error) {
      console.error('Error creating property link:', error)
      setError('Ошибка при создании связи')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту связь?')) return

    try {
      const response = await fetch(`/api/clients/property-links/${linkId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccess('Связь успешно удалена')
        fetchExistingLinks()
        onLinkSuccess()
        
        setTimeout(() => {
          setSuccess('')
        }, 3000)
      } else {
        setError(data.error || 'Ошибка при удалении связи')
      }
    } catch (error) {
      console.error('Error deleting property link:', error)
      setError('Ошибка при удалении связи')
    }
  }

  const getLinkTypeLabel = (type: string) => {
    switch (type) {
      case 'OWNER': return 'Владелец'
      case 'TENANT': return 'Арендатор'
      case 'INTERESTED': return 'Заинтересован'
      default: return type
    }
  }

  const getLinkTypeColor = (type: string) => {
    switch (type) {
      case 'OWNER': return 'bg-[#dff6dd] text-[#107c10]'
      case 'TENANT': return 'bg-[#deecf9] text-[#0078d4]'
      case 'INTERESTED': return 'bg-[#fff4ce] text-[#856404]'
      default: return 'bg-[#f3f2f1] text-[#605e5c]'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  return (
    <TeamsModal
      isOpen={isOpen}
      onClose={onClose}
      title="Связать клиента с объектом"
    >
      <div className="space-y-6">
        {/* Информация о клиенте */}
        {client && (
          <TeamsCard variant="elevated" padding="md">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-[#0078d4]" />
              <div>
                <h3 className="font-medium text-[#323130]">
                  {client.firstName} {client.lastName}
                </h3>
                <p className="text-sm text-[#605e5c]">
                  Тип: {client.type === 'TENANT' ? 'Арендатор' : 
                         client.type === 'LANDLORD' ? 'Арендодатель' : 'Оба типа'}
                </p>
              </div>
            </div>
          </TeamsCard>
        )}

        {/* Сообщения об ошибках и успехе */}
        {error && (
          <TeamsAlert variant="error" title="Ошибка">
            {error}
          </TeamsAlert>
        )}

        {success && (
          <TeamsAlert variant="success" title="Успешно">
            {success}
          </TeamsAlert>
        )}

        {/* Существующие связи */}
        {existingLinks.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-[#323130] mb-3">
              Существующие связи
            </h3>
            <div className="space-y-3">
              {existingLinks.map((link) => (
                <TeamsCard key={link.id} variant="elevated" padding="md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-[#605e5c]" />
                        <h4 className="font-medium text-[#323130]">
                          {link.property.title}
                        </h4>
                        <TeamsBadge className={getLinkTypeColor(link.linkType)}>
                          {getLinkTypeLabel(link.linkType)}
                        </TeamsBadge>
                      </div>
                      <p className="text-sm text-[#605e5c] mb-2">
                        {link.property.address}
                      </p>
                      {link.comment && (
                        <p className="text-sm text-[#605e5c] mb-2">
                          {link.comment}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-[#605e5c]">
                        <Calendar className="w-3 h-3" />
                        <span>Создано: {formatDate(link.createdAt)}</span>
                      </div>
                    </div>
                    <TeamsButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      Удалить
                    </TeamsButton>
                  </div>
                </TeamsCard>
              ))}
            </div>
          </div>
        )}

        {/* Форма создания новой связи */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#323130] mb-2">
              Выберите объект
            </label>
            <TeamsSelect
              value={selectedPropertyId}
              onChange={(value) => setSelectedPropertyId(value)}
              placeholder="Выберите объект недвижимости"
              options={properties.map(property => ({
                value: property.id,
                label: `${property.title} - ${property.address}`
              }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#323130] mb-2">
              Тип связи
            </label>
            <TeamsSelect
              value={linkType}
              onChange={(value) => setLinkType(value as 'OWNER' | 'TENANT' | 'INTERESTED')}
              options={[
                { value: 'OWNER', label: 'Владелец объекта' },
                { value: 'TENANT', label: 'Арендатор объекта' },
                { value: 'INTERESTED', label: 'Заинтересован в аренде' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#323130] mb-2">
              Комментарий
            </label>
            <TeamsTextarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Дополнительная информация о связи"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <TeamsButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </TeamsButton>
            <TeamsButton 
              type="submit" 
              disabled={isLoading || !selectedPropertyId}
            >
              {isLoading ? 'Создание...' : 'Связать'}
            </TeamsButton>
          </div>
        </form>
      </div>
    </TeamsModal>
  )
} 