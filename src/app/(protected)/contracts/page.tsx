'use client'

import { useState, useEffect } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsInput, TeamsSelect, TeamsTextarea, TeamsModal } from '@/components/ui/teams'
import { FileText, Download, Eye, Edit, Plus, Calendar, User, Home } from 'lucide-react'

export default function ContractsPage() {
  const [contractData, setContractData] = useState({
    propertyType: '',
    address: '',
    landlordName: '',
    landlordPassport: '',
    tenantName: '',
    tenantPassport: '',
    startDate: '',
    endDate: '',
    rentAmount: '',
    deposit: '',
    utilities: false,
    additionalTerms: ''
  })
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

  const propertyTypes = [
    { value: 'APARTMENT', label: 'Квартира' },
    { value: 'HOUSE', label: 'Дом' },
    { value: 'OFFICE', label: 'Офис' },
    { value: 'COMMERCIAL', label: 'Коммерческое помещение' },
    { value: 'WAREHOUSE', label: 'Склад' }
  ]

  const handleGenerate = async () => {
    setGenerating(true)
    // Имитация генерации договора
    setTimeout(() => {
      const newContract = {
        id: Date.now().toString(),
        title: `Договор аренды ${contractData.propertyType.toLowerCase()}`,
        property: contractData.address,
        tenant: contractData.tenantName,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        status: 'DRAFT',
        amount: contractData.rentAmount
      }
      setContracts(prev => [newContract, ...prev])
      setGenerating(false)
      // Сброс формы
      setContractData({
        propertyType: '',
        address: '',
        landlordName: '',
        landlordPassport: '',
        tenantName: '',
        tenantPassport: '',
        startDate: '',
        endDate: '',
        rentAmount: '',
        deposit: '',
        utilities: false,
        additionalTerms: ''
      })
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
      // Подготавливаем данные для генерации договора
      const contractData = {
        propertyTitle: contract.title,
        propertyAddress: contract.property,
        landlordName: contract.landlordName || 'Не указано',
        landlordPassport: contract.landlordPassport || 'Не указано',
        tenantName: contract.tenant,
        tenantPassport: contract.tenantPassport || 'Не указано',
        startDate: contract.startDate,
        endDate: contract.endDate,
        monthlyRent: parseInt(contract.amount) || 0,
        deposit: parseInt(contract.amount) || 0,
        utilities: contract.utilities || false,
        additionalTerms: contract.additionalTerms || ''
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
      a.download = `Договор_аренды_${contract.title.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.${fileType === 'word' ? 'docx' : 'pdf'}`
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Форма создания договора */}
          <TeamsCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Новый договор
            </h2>
            
            <div className="space-y-4">
              <TeamsSelect
                label="Тип недвижимости"
                value={contractData.propertyType}
                onChange={(value) => setContractData(prev => ({ ...prev, propertyType: value }))}
                options={propertyTypes}
                placeholder="Выберите тип"
              />
              
              <TeamsInput
                label="Адрес объекта"
                value={contractData.address}
                onChange={(e) => setContractData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="ул. Ленина, 1, кв. 5"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TeamsInput
                  label="Имя арендодателя"
                  value={contractData.landlordName}
                  onChange={(e) => setContractData(prev => ({ ...prev, landlordName: e.target.value }))}
                  placeholder="Иванов Иван Иванович"
                />
                <TeamsInput
                  label="Паспорт арендодателя"
                  value={contractData.landlordPassport}
                  onChange={(e) => setContractData(prev => ({ ...prev, landlordPassport: e.target.value }))}
                  placeholder="1234 567890"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TeamsInput
                  label="Имя арендатора"
                  value={contractData.tenantName}
                  onChange={(e) => setContractData(prev => ({ ...prev, tenantName: e.target.value }))}
                  placeholder="Петров Петр Петрович"
                />
                <TeamsInput
                  label="Паспорт арендатора"
                  value={contractData.tenantPassport}
                  onChange={(e) => setContractData(prev => ({ ...prev, tenantPassport: e.target.value }))}
                  placeholder="9876 543210"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TeamsInput
                  label="Дата начала"
                  type="date"
                  value={contractData.startDate}
                  onChange={(e) => setContractData(prev => ({ ...prev, startDate: e.target.value }))}
                />
                <TeamsInput
                  label="Дата окончания"
                  type="date"
                  value={contractData.endDate}
                  onChange={(e) => setContractData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TeamsInput
                  label="Арендная плата (₽/мес)"
                  value={contractData.rentAmount}
                  onChange={(e) => setContractData(prev => ({ ...prev, rentAmount: e.target.value }))}
                  placeholder="45000"
                />
                <TeamsInput
                  label="Депозит (₽)"
                  value={contractData.deposit}
                  onChange={(e) => setContractData(prev => ({ ...prev, deposit: e.target.value }))}
                  placeholder="45000"
                />
              </div>
              
              <TeamsTextarea
                label="Дополнительные условия"
                value={contractData.additionalTerms}
                onChange={(e) => setContractData(prev => ({ ...prev, additionalTerms: e.target.value }))}
                placeholder="Дополнительные условия договора..."
                rows={3}
              />
              
              <TeamsButton 
                onClick={handleGenerate} 
                disabled={generating}
                className="w-full"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Создать договор
                  </>
                )}
              </TeamsButton>
            </div>
          </TeamsCard>

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
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
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
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">100%</div>
            <div className="text-gray-600">Юридическая корректность</div>
          </TeamsCard>
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
                <div><strong>Объект:</strong> {selectedContract.property}</div>
                <div><strong>Арендатор:</strong> {selectedContract.tenant}</div>
                <div><strong>Период:</strong> {selectedContract.startDate} - {selectedContract.endDate}</div>
                <div><strong>Сумма:</strong> {parseInt(selectedContract.amount).toLocaleString()} ₽/мес</div>
                <div><strong>Статус:</strong> {getStatusBadge(selectedContract.status)}</div>
              </div>
            </div>
            
            <div className="bg-white border p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900">Текст договора:</h4>
              <div className="text-sm space-y-2 text-gray-900">
                <p><strong>ДОГОВОР АРЕНДЫ</strong></p>
                <p>Настоящий договор заключен между арендодателем и арендатором о предоставлении в аренду указанного помещения.</p>
                <p><strong>Объект аренды:</strong> {selectedContract.property}</p>
                <p><strong>Арендатор:</strong> {selectedContract.tenant}</p>
                <p><strong>Срок аренды:</strong> с {selectedContract.startDate} по {selectedContract.endDate}</p>
                <p><strong>Арендная плата:</strong> {parseInt(selectedContract.amount).toLocaleString()} ₽/мес</p>
                <p><strong>Условия:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>Арендодатель обязуется предоставить помещение в надлежащем состоянии</li>
                  <li>Арендатор обязуется своевременно вносить арендную плату</li>
                  <li>Арендатор обязуется бережно относиться к имуществу</li>
                </ul>
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
            <TeamsInput
              label="Объект"
              value={selectedContract.property}
              onChange={(e) => setSelectedContract({...selectedContract, property: e.target.value})}
            />
            <TeamsInput
              label="Арендатор"
              value={selectedContract.tenant}
              onChange={(e) => setSelectedContract({...selectedContract, tenant: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <TeamsInput
                label="Дата начала"
                type="date"
                value={selectedContract.startDate}
                onChange={(e) => setSelectedContract({...selectedContract, startDate: e.target.value})}
              />
              <TeamsInput
                label="Дата окончания"
                type="date"
                value={selectedContract.endDate}
                onChange={(e) => setSelectedContract({...selectedContract, endDate: e.target.value})}
              />
            </div>
            <TeamsInput
              label="Арендная плата"
              value={selectedContract.amount}
              onChange={(e) => setSelectedContract({...selectedContract, amount: e.target.value})}
            />
            <TeamsSelect
              label="Статус"
              value={selectedContract.status}
              onChange={(value) => setSelectedContract({...selectedContract, status: value})}
              options={[
                { value: 'DRAFT', label: 'Черновик' },
                { value: 'ACTIVE', label: 'Активен' },
                { value: 'EXPIRED', label: 'Истек' }
              ]}
            />
            
            <div className="flex gap-2 pt-4">
              <TeamsButton
                onClick={() => {
                  // Обновляем договор в списке
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
    </div>
  )
}