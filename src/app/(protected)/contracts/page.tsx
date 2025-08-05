'use client'

import { useState } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsModal } from '@/components/ui/teams'
import { ContractForm } from '@/components/ui/ContractForm'
import { FileText, Download, Eye, Edit, Plus, Calendar, User, Home } from 'lucide-react'

export default function ContractsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState<string | null>(null)
  const [contracts, setContracts] = useState([
    {
      id: '1',
      title: 'Договор аренды квартиры',
      property: '2-к квартира, ул. Ленина, 1',
      tenant: 'Иванов Иван Иванович',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'ACTIVE',
      amount: '45000'
    },
    {
      id: '2',
      title: 'Договор аренды офиса',
      property: 'Офис, ул. Пушкина, 10',
      tenant: 'ООО "Рога и копыта"',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      status: 'DRAFT',
      amount: '120000'
    }
  ])

  const handleCreateContract = async (contractData: any) => {
    setGenerating(true)
    setTimeout(() => {
      const newContract = {
        id: Date.now().toString(),
        title: `Договор аренды ${contractData.property?.title || 'объекта'}`,
        property: contractData.property?.address || 'Не указан',
        tenant: contractData.tenantName,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        status: 'DRAFT',
        amount: contractData.monthlyRent
      }
      setContracts(prev => [newContract, ...prev])
      setGenerating(false)
      setShowCreateForm(false)
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <TeamsBadge variant="warning">Черновик</TeamsBadge>
      case 'ACTIVE':
        return <TeamsBadge variant="success">Активен</TeamsBadge>
      case 'EXPIRED':
        return <TeamsBadge variant="error">Истек</TeamsBadge>
      default:
        return <TeamsBadge variant="default">Неизвестно</TeamsBadge>
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
      const response = await fetch('/api/contracts/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contractData: contract,
          fileType
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `contract-${contract.id}.${fileType}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        throw new Error('Ошибка при скачивании')
      }
    } catch (error) {
      console.error('Ошибка при скачивании договора:', error)
      alert('Ошибка при скачивании договора. Попробуйте еще раз.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-blue-600" />
            Генерация договоров
          </h1>
          <p className="text-lg text-gray-600">
            Создание юридически корректных договоров аренды с автоматическим заполнением данных
          </p>
        </div>

        {/* Кнопка создания нового договора */}
        <div className="mb-8">
          <TeamsButton
            onClick={() => setShowCreateForm(true)}
            variant="primary"
            size="lg"
            className="flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Создать новый договор
          </TeamsButton>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{contracts.length}</div>
            <div className="text-gray-600">Всего договоров</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {contracts.filter(c => c.status === 'ACTIVE').length}
            </div>
            <div className="text-gray-600">Активных договоров</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">2.5 мин</div>
            <div className="text-gray-600">Среднее время создания</div>
          </TeamsCard>
        </div>

        {/* Список договоров */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Мои договоры</h2>
          
          {contracts.map((contract) => (
            <TeamsCard key={contract.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{contract.title}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <Home className="w-4 h-4 mr-1" />
                      {contract.property}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {contract.tenant}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {contract.startDate} - {contract.endDate}
                    </div>
                    <div className="font-medium text-gray-900">
                      {parseInt(contract.amount).toLocaleString()} ₽/мес
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {getStatusBadge(contract.status)}
                </div>
              </div>
              
              <div className="flex gap-2">
                <TeamsButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewContract(contract)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Просмотр
                </TeamsButton>
                <TeamsButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditContract(contract)}
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
            </TeamsCard>
          ))}
        </div>

        {/* Модальные окна */}
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
                  <div><strong>Объект:</strong> {selectedContract.property}</div>
                  <div><strong>Арендатор:</strong> {selectedContract.tenant}</div>
                  <div><strong>Период:</strong> {selectedContract.startDate} - {selectedContract.endDate}</div>
                  <div><strong>Сумма:</strong> {parseInt(selectedContract.amount).toLocaleString()} ₽/мес</div>
                  <div><strong>Статус:</strong> {getStatusBadge(selectedContract.status)}</div>
                </div>
              </div>
            </div>
          )}
        </TeamsModal>

        <TeamsModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Редактирование договора"
          size="lg"
        >
          {selectedContract && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название договора
                  </label>
                  <input
                    type="text"
                    value={selectedContract.title}
                    onChange={(e) => setSelectedContract({...selectedContract, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Объект
                  </label>
                  <input
                    type="text"
                    value={selectedContract.property}
                    onChange={(e) => setSelectedContract({...selectedContract, property: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Арендатор
                </label>
                <input
                  type="text"
                  value={selectedContract.tenant}
                  onChange={(e) => setSelectedContract({...selectedContract, tenant: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата начала
                  </label>
                  <input
                    type="date"
                    value={selectedContract.startDate}
                    onChange={(e) => setSelectedContract({...selectedContract, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата окончания
                  </label>
                  <input
                    type="date"
                    value={selectedContract.endDate}
                    onChange={(e) => setSelectedContract({...selectedContract, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Арендная плата
                </label>
                <input
                  type="number"
                  value={selectedContract.amount}
                  onChange={(e) => setSelectedContract({...selectedContract, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  value={selectedContract.status}
                  onChange={(e) => setSelectedContract({...selectedContract, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DRAFT">Черновик</option>
                  <option value="ACTIVE">Активен</option>
                  <option value="EXPIRED">Истек</option>
                </select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <TeamsButton
                  onClick={() => {
                    setContracts(prev => prev.map(c => 
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

        <TeamsModal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          title="Создание нового договора"
          size="xl"
        >
          <ContractForm
            onSubmit={handleCreateContract}
            loading={generating}
          />
        </TeamsModal>
      </div>
    </div>
  )
} 