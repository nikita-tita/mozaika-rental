'use client'

import { useState, useEffect } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsInput, TeamsSelect, TeamsTextarea, TeamsModal } from '@/components/ui/teams'
import { FileText, Download, Eye, Edit, Plus, Calendar, User, Home, Filter, Search } from 'lucide-react'
import CreateContractForm from '@/components/contracts/CreateContractForm'

const statusOptions = [
  { value: 'ALL', label: 'Все статусы' },
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'SIGNED', label: 'Подписан' },
  { value: 'EXPIRED', label: 'Истек' },
  { value: 'TERMINATED', label: 'Расторгнут' }
]

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    status: 'ALL',
    search: ''
  })
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  useEffect(() => {
    fetchContracts()
  }, [filters])

  const fetchContracts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'ALL') {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/contracts?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setContracts(data.data)
      }
    } catch (error) {
      console.error('Error fetching contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <TeamsBadge variant="warning">Черновик</TeamsBadge>
      case 'SIGNED':
        return <TeamsBadge variant="success">Подписан</TeamsBadge>
      case 'EXPIRED':
        return <TeamsBadge variant="error">Истек</TeamsBadge>
      case 'TERMINATED':
        return <TeamsBadge variant="error">Расторгнут</TeamsBadge>
      default:
        return <TeamsBadge variant="default">Неизвестно</TeamsBadge>
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Договор создан, но не подписан'
      case 'SIGNED':
        return 'Договор подписан и активен'
      case 'EXPIRED':
        return 'Срок действия договора истек'
      case 'TERMINATED':
        return 'Договор расторгнут досрочно'
      default:
        return 'Статус не определен'
    }
  }

  const handleViewContract = (contract: any) => {
    setSelectedContract(contract)
    setShowViewModal(true)
  }

  const handleEditContract = (contract: any) => {
    setSelectedContract(contract)
    setShowEditModal(true)
  }

  const handleDownloadContract = async (contract: any, fileType: 'word' | 'pdf' = 'pdf') => {
    try {
      // Подготавливаем данные для генерации договора
      const contractData = {
        propertyTitle: contract.deal?.property?.title || 'Не указано',
        propertyAddress: contract.deal?.property?.address || 'Не указано',
        landlordName: `${contract.deal?.landlord?.firstName || ''} ${contract.deal?.landlord?.lastName || ''}`.trim() || 'Не указано',
        tenantName: `${contract.deal?.tenant?.firstName || ''} ${contract.deal?.tenant?.lastName || ''}`.trim() || 'Не указано',
        startDate: contract.deal?.startDate || new Date().toISOString(),
        endDate: contract.deal?.endDate || new Date().toISOString(),
        monthlyRent: contract.deal?.monthlyRent || 0,
        deposit: contract.deal?.deposit || 0,
        utilities: false,
        additionalTerms: ''
      }

      // Вызываем API для генерации и скачивания файла
      const response = await fetch('/api/contracts/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contractData,
          fileType
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Ошибка при генерации договора')
      }

      // Скачиваем файл
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Договор_аренды_${contract.title.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.${fileType === 'word' ? 'txt' : 'html'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      alert(`Договор успешно скачан в формате ${fileType.toUpperCase()}`)
    } catch (error) {
      console.error('Ошибка при скачивании договора:', error)
      alert('Ошибка при скачивании договора. Попробуйте еще раз.')
    }
  }

  const filteredContracts = contracts.filter(contract => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      return (
        contract.title?.toLowerCase().includes(searchTerm) ||
        contract.deal?.property?.title?.toLowerCase().includes(searchTerm) ||
        contract.deal?.property?.address?.toLowerCase().includes(searchTerm) ||
        `${contract.deal?.tenant?.firstName} ${contract.deal?.tenant?.lastName}`.toLowerCase().includes(searchTerm) ||
        `${contract.deal?.landlord?.firstName} ${contract.deal?.landlord?.lastName}`.toLowerCase().includes(searchTerm)
      )
    }
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-blue-600" />
            Каталог договоров
          </h1>
          <p className="text-lg text-gray-600">
            Управление договорами аренды с возможностью создания, редактирования и скачивания
          </p>
        </div>

        {/* Кнопка создания */}
        <div className="mb-6 flex justify-end">
          <TeamsButton
            onClick={() => setShowCreateForm(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Создать договор
          </TeamsButton>
        </div>

        {/* Фильтры */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <TeamsInput
                  placeholder="Поиск по названию, объекту, арендатору..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <TeamsSelect
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              options={statusOptions}
              placeholder="Выберите статус"
              className="w-full sm:w-48"
            />
            <div className="flex gap-2">
              <TeamsButton
                variant={viewMode === 'cards' ? 'primary' : 'outline'}
                onClick={() => setViewMode('cards')}
                size="sm"
              >
                Карточки
              </TeamsButton>
              <TeamsButton
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                onClick={() => setViewMode('table')}
                size="sm"
              >
                Таблица
              </TeamsButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список договоров */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Мои договоры ({filteredContracts.length})
              </h2>
            </div>
            
            {filteredContracts.length === 0 ? (
              <TeamsCard className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filters.search || filters.status !== 'ALL' ? 'Договоры не найдены' : 'Нет созданных договоров'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {filters.search || filters.status !== 'ALL' 
                    ? 'Попробуйте изменить параметры поиска'
                    : 'Создайте первый договор на основе существующей сделки'
                  }
                </p>
                {!filters.search && filters.status === 'ALL' && (
                  <TeamsButton
                    onClick={() => setShowCreateForm(true)}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Создать договор
                  </TeamsButton>
                )}
              </TeamsCard>
            ) : viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredContracts.map((contract) => (
                  <ContractCard
                    key={contract.id}
                    contract={contract}
                    getStatusBadge={getStatusBadge}
                    getStatusDescription={getStatusDescription}
                    onView={handleViewContract}
                    onEdit={handleEditContract}
                    onDownload={handleDownloadContract}
                    showDownloadMenu={showDownloadMenu}
                    setShowDownloadMenu={setShowDownloadMenu}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Договор
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Объект
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата создания
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {contract.deal?.property?.title || 'Не указано'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contract.deal?.property?.address || 'Адрес не указан'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(contract.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(contract.createdAt).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <TeamsButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewContract(contract)}
                            >
                              <Eye className="w-4 h-4" />
                            </TeamsButton>
                            <TeamsButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditContract(contract)}
                            >
                              <Edit className="w-4 h-4" />
                            </TeamsButton>
                            <div className="relative">
                              <TeamsButton
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDownloadMenu(contract.id)}
                              >
                                <Download className="w-4 h-4" />
                              </TeamsButton>
                              {showDownloadMenu === contract.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        handleDownloadContract(contract, 'pdf')
                                        setShowDownloadMenu(null)
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      📄 Скачать PDF
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDownloadContract(contract, 'word')
                                        setShowDownloadMenu(null)
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      📝 Скачать Word
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Информационная панель */}
          <div className="space-y-6">
            <TeamsCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Статистика договоров
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Всего договоров:</span>
                  <span className="font-semibold">{contracts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Активных:</span>
                  <span className="font-semibold text-green-600">
                    {contracts.filter(c => c.status === 'SIGNED').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Черновиков:</span>
                  <span className="font-semibold text-yellow-600">
                    {contracts.filter(c => c.status === 'DRAFT').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Истекших:</span>
                  <span className="font-semibold text-red-600">
                    {contracts.filter(c => c.status === 'EXPIRED').length}
                  </span>
                </div>
              </div>
            </TeamsCard>

            <TeamsCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Статусы договоров
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <TeamsBadge variant="warning" className="mr-2">Черновик</TeamsBadge>
                  <span>Договор создан, но не подписан</span>
                </div>
                <div className="flex items-center">
                  <TeamsBadge variant="success" className="mr-2">Подписан</TeamsBadge>
                  <span>Договор подписан и активен</span>
                </div>
                <div className="flex items-center">
                  <TeamsBadge variant="error" className="mr-2">Истек</TeamsBadge>
                  <span>Срок действия договора истек</span>
                </div>
                <div className="flex items-center">
                  <TeamsBadge variant="error" className="mr-2">Расторгнут</TeamsBadge>
                  <span>Договор расторгнут досрочно</span>
                </div>
              </div>
            </TeamsCard>
          </div>
        </div>
      </div>

      {/* Модальное окно просмотра договора */}
      <TeamsModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Просмотр договора"
        size="lg"
      >
        {selectedContract && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">{selectedContract.title}</h3>
              <div className="space-y-2 text-sm">
                {selectedContract.deal?.property && (
                  <div><strong>Объект:</strong> {selectedContract.deal.property.title} - {selectedContract.deal.property.address}</div>
                )}
                {selectedContract.deal?.tenant && (
                  <div><strong>Арендатор:</strong> {selectedContract.deal.tenant.firstName} {selectedContract.deal.tenant.lastName}</div>
                )}
                {selectedContract.deal?.landlord && (
                  <div><strong>Арендодатель:</strong> {selectedContract.deal.landlord.firstName} {selectedContract.deal.landlord.lastName}</div>
                )}
                {selectedContract.deal?.startDate && (
                  <div><strong>Период:</strong> {new Date(selectedContract.deal.startDate).toLocaleDateString('ru-RU')} - {new Date(selectedContract.deal.endDate).toLocaleDateString('ru-RU')}</div>
                )}
                {selectedContract.deal?.monthlyRent && (
                  <div><strong>Сумма:</strong> {selectedContract.deal.monthlyRent.toLocaleString()} ₽/мес</div>
                )}
                <div><strong>Статус:</strong> {getStatusBadge(selectedContract.status)}</div>
              </div>
            </div>
            
            <div className="bg-white border p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900">Текст договора:</h4>
              <div className="text-sm space-y-2 text-gray-900 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">{selectedContract.content}</pre>
              </div>
            </div>
          </div>
        )}
      </TeamsModal>

      {/* Модальное окно редактирования договора */}
      <TeamsModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Редактирование договора"
        size="lg"
      >
        {selectedContract && (
          <div className="space-y-4">
            <TeamsInput
              label="Название договора"
              value={selectedContract.title}
              onChange={(e) => setSelectedContract({...selectedContract, title: e.target.value})}
            />
            <TeamsTextarea
              label="Содержание договора"
              value={selectedContract.content}
              onChange={(e) => setSelectedContract({...selectedContract, content: e.target.value})}
              rows={10}
            />
            <TeamsSelect
              value={selectedContract.status}
              onChange={(value) => setSelectedContract({...selectedContract, status: value})}
              options={[
                { value: 'DRAFT', label: 'Черновик' },
                { value: 'SIGNED', label: 'Подписан' },
                { value: 'EXPIRED', label: 'Истек' },
                { value: 'TERMINATED', label: 'Расторгнут' }
              ]}
            />
            
            <div className="flex gap-2 pt-4">
              <TeamsButton
                onClick={() => {
                  // Обновляем договор в списке
                  setContracts(prev => prev.map((c: any) => 
                    c.id === selectedContract.id ? selectedContract : c
                  ))
                  setShowEditModal(false)
                }}
                className="flex-1"
              >
                Сохранить изменения
              </TeamsButton>
              <TeamsButton
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Отмена
              </TeamsButton>
            </div>
          </div>
        )}
      </TeamsModal>

      {/* Форма создания договора */}
      <CreateContractForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={fetchContracts}
      />
    </div>
  )
}

interface ContractCardProps {
  contract: any
  getStatusBadge: (status: string) => React.ReactNode
  getStatusDescription: (status: string) => string
  onView: (contract: any) => void
  onEdit: (contract: any) => void
  onDownload: (contract: any, fileType: 'word' | 'pdf') => void
  showDownloadMenu: string | null
  setShowDownloadMenu: (id: string | null) => void
}

function ContractCard({
  contract,
  getStatusBadge,
  getStatusDescription,
  onView,
  onEdit,
  onDownload,
  showDownloadMenu,
  setShowDownloadMenu
}: ContractCardProps) {
  return (
    <TeamsCard className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{contract.title}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            {contract.deal?.property && (
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-1" />
                {contract.deal.property.title} - {contract.deal.property.address}
              </div>
            )}
            {contract.deal?.tenant && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {contract.deal.tenant.firstName} {contract.deal.tenant.lastName}
              </div>
            )}
            {contract.deal?.startDate && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(contract.deal.startDate).toLocaleDateString('ru-RU')} - {new Date(contract.deal.endDate).toLocaleDateString('ru-RU')}
              </div>
            )}
            {contract.deal?.monthlyRent && (
              <div className="font-medium text-gray-900">
                {contract.deal.monthlyRent.toLocaleString()} ₽/мес
              </div>
            )}
          </div>
        </div>
        <div className="ml-4">
          {getStatusBadge(contract.status)}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mb-3">
        {getStatusDescription(contract.status)}
      </div>
      
      <div className="flex gap-2">
        <TeamsButton 
          variant="outline" 
          size="sm"
          onClick={() => onView(contract)}
        >
          <Eye className="w-4 h-4 mr-1" />
          Просмотр
        </TeamsButton>
        <TeamsButton 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(contract)}
        >
          <Edit className="w-4 h-4 mr-1" />
          Редактировать
        </TeamsButton>
        <div className="relative">
          <TeamsButton 
            variant="outline" 
            size="sm"
            onClick={() => setShowDownloadMenu(contract.id)}
          >
            <Download className="w-4 h-4 mr-1" />
            Скачать
          </TeamsButton>
          {showDownloadMenu === contract.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                <button
                  onClick={() => {
                    onDownload(contract, 'pdf')
                    setShowDownloadMenu(null)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  📄 Скачать PDF
                </button>
                <button
                  onClick={() => {
                    onDownload(contract, 'word')
                    setShowDownloadMenu(null)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  📝 Скачать Word
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </TeamsCard>
  )
}