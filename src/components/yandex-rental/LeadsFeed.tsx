'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  Phone, 
  Camera, 
  Globe, 
  Eye, 
  FileText, 
  Home, 
  X,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Banknote,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react'
import { 
  TeamsCard, 
  TeamsButton, 
  TeamsBadge, 
  TeamsInput,
  TeamsSelect,
  TeamsTable
} from '@/components/ui/teams'

interface YandexLead {
  id: string
  ownerName: string
  phone: string
  email?: string
  address: string
  comment?: string
  rentAmount?: number
  rentPeriod: number
  commission?: number
  status: YandexLeadStatus
  submittedAt: string
  updatedAt: string
}

type YandexLeadStatus = 
  | 'SUBMITTED'
  | 'CALLED_OWNER'
  | 'PHOTO_SCHEDULED'
  | 'PUBLISHED'
  | 'FIRST_SHOWING'
  | 'CONTRACT_SIGNED'
  | 'OCCUPIED'
  | 'FAILED'

const statusConfig = {
  SUBMITTED: {
    label: 'Принят',
    icon: Clock,
    color: 'default' as const,
    description: 'Контакт передан, ожидается звонок'
  },
  CALLED_OWNER: {
    label: 'Созвон с собственником',
    icon: Phone,
    color: 'primary' as const,
    description: 'Менеджер связался с собственником'
  },
  PHOTO_SCHEDULED: {
    label: 'Запланирована фотосессия',
    icon: Camera,
    color: 'warning' as const,
    description: 'Назначена дата фотосессии'
  },
  PUBLISHED: {
    label: 'Объявление опубликовано',
    icon: Globe,
    color: 'success' as const,
    description: 'Объект размещен на Яндекс.Аренда'
  },
  FIRST_SHOWING: {
    label: 'Первый показ',
    icon: Eye,
    color: 'info' as const,
    description: 'Проведен первый показ'
  },
  CONTRACT_SIGNED: {
    label: 'Договор подписан',
    icon: FileText,
    color: 'primary' as const,
    description: 'Арендатор подписал договор'
  },
  OCCUPIED: {
    label: 'Заселён',
    icon: Home,
    color: 'success' as const,
    description: 'Арендатор заселился'
  },
  FAILED: {
    label: 'Сделка не состоялась',
    icon: X,
    color: 'error' as const,
    description: 'Сделка не состоялась'
  }
}

const statusOptions = [
  { value: '', label: 'Все статусы' },
  ...Object.entries(statusConfig).map(([value, config]) => ({
    value,
    label: config.label
  }))
]

interface LeadsFeedProps {
  onUpdate?: () => void
}

export default function LeadsFeed({ onUpdate }: LeadsFeedProps) {
  const [leads, setLeads] = useState<YandexLead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<YandexLead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    totalEarnings: 0,
    avgTimeToRent: 0
  })

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, searchTerm, statusFilter])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/yandex-rental/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads || [])
        setStats(data.stats || {
          total: 0,
          completed: 0,
          totalEarnings: 0,
          avgTimeToRent: 0
        })
      }
    } catch (error) {
      console.error('Ошибка при загрузке лидов:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterLeads = () => {
    let filtered = [...leads]

    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
      )
    }

    // Фильтр по статусу
    if (statusFilter) {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    setFilteredLeads(filtered)
  }

  const handleStatusUpdate = async (leadId: string, newStatus: YandexLeadStatus) => {
    try {
      const response = await fetch(`/api/yandex-rental/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (response.ok) {
        await fetchLeads() // Обновляем данные
        onUpdate?.() // Уведомляем родительский компонент
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: YandexLeadStatus) => {
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <TeamsBadge variant={config.color} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </TeamsBadge>
    )
  }

  if (isLoading) {
    return (
      <TeamsCard className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка лидов...</p>
        </div>
      </TeamsCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TeamsCard className="p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600">Всего лидов</div>
        </TeamsCard>
        
        <TeamsCard className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-600">Завершённых сделок</div>
        </TeamsCard>
        
        <TeamsCard className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {stats.totalEarnings.toLocaleString()} ₽
          </div>
          <div className="text-sm text-gray-600">Общий заработок</div>
        </TeamsCard>
        
        <TeamsCard className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {stats.avgTimeToRent} дн.
          </div>
          <div className="text-sm text-gray-600">Среднее время до сдачи</div>
        </TeamsCard>
      </div>

      {/* Фильтры */}
      <TeamsCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <TeamsInput
              placeholder="Поиск по имени, адресу или телефону..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <TeamsButton
            variant="outline"
            onClick={fetchLeads}
            className="w-full md:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </TeamsButton>
        </div>
      </TeamsCard>

      {/* Таблица лидов */}
      <TeamsCard>
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Лиды не найдены
            </h3>
            <p className="text-gray-600">
              {leads.length === 0 
                ? 'У вас пока нет переданных лидов. Передайте первый контакт собственника.'
                : 'Попробуйте изменить параметры поиска.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Собственник
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Адрес
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата передачи
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Комиссия
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {lead.ownerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.phone}
                        </div>
                        {lead.email && (
                          <div className="text-sm text-gray-500">
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {lead.address}
                      </div>
                      <div className="text-sm text-gray-500">
                        {lead.rentPeriod} мес.
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {formatDate(lead.submittedAt)}
                    </td>
                    <td className="px-4 py-4">
                      {lead.commission ? (
                        <div className="text-sm font-medium text-green-600">
                          {lead.commission.toLocaleString()} ₽
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <TeamsButton
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Открыть модальное окно с деталями
                            console.log('Открыть детали лида:', lead.id)
                          }}
                        >
                          Детали
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
  )
} 