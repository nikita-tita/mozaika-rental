'use client'

import { useState } from 'react'
import { TeamsCard, TeamsButton, TeamsInput, TeamsSelect, TeamsTextarea } from '@/components/ui/teams'

export default function TestContractGenerationPage() {
  const [contractData, setContractData] = useState({
    propertyTitle: 'Тестовая квартира',
    propertyAddress: 'г. Москва, ул. Ленина, д. 1, кв. 5',
    landlordName: 'Иванов Иван Иванович',
    landlordPassport: '1234 567890',
    landlordPassportIssuedBy: 'УФМС России по г. Москве',
    landlordPassportIssuedDate: '01.01.2010',
    landlordSnils: '123-456-789 01',
    landlordInn: '123456789012',
    landlordAddress: 'г. Москва, ул. Пушкина, д. 10',
    landlordRegistrationAddress: 'г. Москва, ул. Пушкина, д. 10',
    tenantName: 'Петров Петр Петрович',
    tenantPassport: '9876 543210',
    tenantPassportIssuedBy: 'УФМС России по г. Москве',
    tenantPassportIssuedDate: '01.01.2015',
    tenantBirthDate: '01.01.1990',
    tenantPhone: '+7 (999) 123-45-67',
    tenantEmail: 'petrov@example.com',
    tenantRegistrationAddress: 'г. Москва, ул. Гагарина, д. 20',
    propertyType: 'Квартира',
    propertyArea: '45',
    propertyRooms: '2',
    propertyFloor: '5',
    propertyTotalFloors: '9',
    propertyCadastralNumber: '77:01:0001001:1234',
    propertyOwnershipType: 'Частная собственность',
    propertyFurnished: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    monthlyRent: 45000,
    paymentDay: '5',
    paymentSchedule: 'monthly',
    utilities: true,
    utilitiesIncluded: true,
    deposit: 45000,
    depositReturnConditions: 'Возвращается при расторжении договора при отсутствии претензий',
    latePaymentPenalty: 0.001,
    earlyTerminationConditions: 'Согласно законодательству РФ',
    additionalTerms: 'Все споры решаются путем переговоров, а при невозможности достижения соглашения - в судебном порядке.'
  })

  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (fileType: 'word' | 'pdf') => {
    setGenerating(true)
    setError(null)
    setResult(null)

    try {
      // Получаем токен из localStorage или cookies
      const token = localStorage.getItem('auth-token') || document.cookie.split('auth-token=')[1]?.split(';')[0]

      if (!token) {
        setError('Необходима авторизация для генерации договора')
        setGenerating(false)
        return
      }

      // Вызываем API для генерации
      const response = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contractData
        })
      })

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)

      // Теперь скачиваем файл
      const downloadResponse = await fetch('/api/contracts/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contractData,
          fileType
        })
      })

      if (!downloadResponse.ok) {
        throw new Error('Ошибка при скачивании файла')
      }

      // Скачиваем файл
      const blob = await downloadResponse.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Договор_аренды_${contractData.propertyTitle.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.${fileType === 'word' ? 'docx' : 'pdf'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      alert(`Договор успешно сгенерирован и скачан в формате ${fileType.toUpperCase()}`)
    } catch (error) {
      console.error('Ошибка при генерации договора:', error)
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Тест генерации договоров
          </h1>
          <p className="text-lg text-gray-600">
            Тестирование API генерации договоров в форматах Word и PDF
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Форма данных */}
          <TeamsCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Данные договора
            </h2>
            
            <div className="space-y-4">
              <TeamsInput
                label="Название объекта"
                value={contractData.propertyTitle}
                onChange={(e) => setContractData(prev => ({ ...prev, propertyTitle: e.target.value }))}
              />
              
              <TeamsInput
                label="Адрес объекта"
                value={contractData.propertyAddress}
                onChange={(e) => setContractData(prev => ({ ...prev, propertyAddress: e.target.value }))}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TeamsInput
                  label="Имя наймодателя"
                  value={contractData.landlordName}
                  onChange={(e) => setContractData(prev => ({ ...prev, landlordName: e.target.value }))}
                />
                <TeamsInput
                  label="Имя нанимателя"
                  value={contractData.tenantName}
                  onChange={(e) => setContractData(prev => ({ ...prev, tenantName: e.target.value }))}
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
              
              <TeamsInput
                label="Арендная плата (руб/мес)"
                type="number"
                value={contractData.monthlyRent}
                onChange={(e) => setContractData(prev => ({ ...prev, monthlyRent: parseInt(e.target.value) || 0 }))}
              />
              
              <TeamsInput
                label="Залог (руб)"
                type="number"
                value={contractData.deposit}
                onChange={(e) => setContractData(prev => ({ ...prev, deposit: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </TeamsCard>

          {/* Кнопки генерации */}
          <TeamsCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Генерация договора
            </h2>
            
            <div className="space-y-4">
              <TeamsButton
                onClick={() => handleGenerate('pdf')}
                disabled={generating}
                className="w-full"
              >
                {generating ? 'Генерация...' : '📄 Сгенерировать PDF'}
              </TeamsButton>
              
              <TeamsButton
                onClick={() => handleGenerate('word')}
                disabled={generating}
                variant="outline"
                className="w-full"
              >
                {generating ? 'Генерация...' : '📝 Сгенерировать Word'}
              </TeamsButton>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">Ошибка: {error}</p>
              </div>
            )}

            {result && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-semibold">Договор успешно сгенерирован!</p>
                <p className="text-green-700 text-sm mt-1">ID: {result.data?.id}</p>
                <p className="text-green-700 text-sm">Название: {result.data?.title}</p>
              </div>
            )}
          </TeamsCard>
        </div>

        {/* Информация о шаблоне */}
        <TeamsCard className="p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Информация о шаблоне
          </h2>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Используется реальный шаблон: <code>Договор найма жилого помещения.docx</code></p>
            <p>• Поддерживаются форматы: PDF и Word (.docx)</p>
            <p>• Автоматическое заполнение всех полей договора</p>
            <p>• Юридически корректная структура документа</p>
            <p>• Автоматическое скачивание файла после генерации</p>
          </div>
        </TeamsCard>
      </div>
    </div>
  )
} 