'use client'

import React, { useState, useEffect } from 'react'
import { ContractTemplate, Property, User } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'

interface ContractBuilderProps {
  property: Property
  realtor: User
  onContractGenerated: (contractData: any) => void
}

interface ContractData {
  // Основные данные
  propertyTitle: string
  propertyAddress: string
  propertyType: string
  monthlyRent: number
  deposit: number
  
  // Арендодатель
  landlordName: string
  landlordPassport: string
  landlordAddress: string
  
  // Арендатор
  tenantName: string
  tenantPassport: string
  tenantPhone: string
  tenantEmail: string
  
  // Условия
  startDate: string
  endDate: string
  utilities: boolean
  additionalTerms: string
}

export default function ContractBuilder({ 
  property, 
  realtor, 
  onContractGenerated 
}: ContractBuilderProps) {
  const [step, setStep] = useState(1)
  const [contractData, setContractData] = useState<ContractData>({
    propertyTitle: property.title,
    propertyAddress: `${property.address}, ${property.city}`,
    propertyType: property.type,
    monthlyRent: property.pricePerMonth,
    deposit: property.deposit || 0,
    landlordName: '',
    landlordPassport: '',
    landlordAddress: '',
    tenantName: '',
    tenantPassport: '',
    tenantPhone: '',
    tenantEmail: '',
    startDate: '',
    endDate: '',
    utilities: property.utilities,
    additionalTerms: ''
  })

  const [templates, setTemplates] = useState<ContractTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  // Загрузка шаблонов договоров
  useEffect(() => {
    // TODO: Загрузить шаблоны с сервера
    const defaultTemplates: ContractTemplate[] = [
      {
        id: '1',
        name: 'Стандартный договор аренды',
        description: 'Базовый шаблон для аренды жилой недвижимости',
        content: '',
        variables: {},
        isDefault: true,
        isActive: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Премиум договор аренды',
        description: 'Расширенный шаблон с дополнительными условиями',
        content: '',
        variables: {},
        isDefault: false,
        isActive: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    setTemplates(defaultTemplates)
    setSelectedTemplate(defaultTemplates[0]?.id || '')
  }, [])

  const updateContractData = (field: keyof ContractData, value: any) => {
    setContractData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateContract = async () => {
    try {
      // TODO: Отправить данные на сервер для генерации договора
      const response = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          contractData,
          propertyId: property.id,
          realtorId: realtor.id
        }),
      })

      if (response.ok) {
        const result = await response.json()
        onContractGenerated(result.data)
      }
    } catch (error) {
      console.error('Ошибка генерации договора:', error)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">📝 Конструктор договора</h2>
        <p className="text-gray-400">Создайте профессиональный договор аренды за 3 минуты</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Выберите шаблон</h3>
        <div className="grid gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <h4 className="font-medium text-white">{template.name}</h4>
              <p className="text-sm text-gray-400 mt-1">{template.description}</p>
              {template.isDefault && (
                <span className="inline-block bg-green-500 text-black text-xs px-2 py-1 rounded mt-2">
                  По умолчанию
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <div></div>
        <Button
          onClick={() => setStep(2)}
          disabled={!selectedTemplate}
          className="bg-green-500 hover:bg-green-600 text-black"
        >
          Далее
        </Button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Данные объекта</h2>
        <p className="text-gray-400">Проверьте и при необходимости измените информацию об объекте</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Название объекта
          </label>
          <Input
            value={contractData.propertyTitle}
            onChange={(e) => updateContractData('propertyTitle', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Адрес
          </label>
          <Input
            value={contractData.propertyAddress}
            onChange={(e) => updateContractData('propertyAddress', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Тип недвижимости
          </label>
          <Select
            value={contractData.propertyType}
            onChange={(e) => updateContractData('propertyType', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            options={[
              { value: 'APARTMENT', label: 'Квартира' },
              { value: 'HOUSE', label: 'Дом' },
              { value: 'STUDIO', label: 'Студия' },
              { value: 'COMMERCIAL', label: 'Коммерческая' },
              { value: 'ROOM', label: 'Комната' }
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Арендная плата (₽/мес)
          </label>
          <Input
            type="number"
            value={contractData.monthlyRent}
            onChange={(e) => updateContractData('monthlyRent', Number(e.target.value))}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Залог (₽)
          </label>
          <Input
            type="number"
            value={contractData.deposit}
            onChange={(e) => updateContractData('deposit', Number(e.target.value))}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="utilities"
            checked={contractData.utilities}
            onChange={(e) => updateContractData('utilities', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="utilities" className="text-sm text-gray-300">
            Коммунальные услуги включены
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={() => setStep(1)}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Назад
        </Button>
        <Button
          onClick={() => setStep(3)}
          className="bg-green-500 hover:bg-green-600 text-black"
        >
          Далее
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Данные арендодателя</h2>
        <p className="text-gray-400">Введите информацию о собственнике недвижимости</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ФИО арендодателя
          </label>
          <Input
            value={contractData.landlordName}
            onChange={(e) => updateContractData('landlordName', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Иванов Иван Иванович"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Паспортные данные
          </label>
          <Input
            value={contractData.landlordPassport}
            onChange={(e) => updateContractData('landlordPassport', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="1234 567890"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Адрес регистрации
          </label>
          <Input
            value={contractData.landlordAddress}
            onChange={(e) => updateContractData('landlordAddress', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={() => setStep(2)}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Назад
        </Button>
        <Button
          onClick={() => setStep(4)}
          className="bg-green-500 hover:bg-green-600 text-black"
        >
          Далее
        </Button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Данные арендатора</h2>
        <p className="text-gray-400">Введите информацию о будущем арендаторе</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ФИО арендатора
          </label>
          <Input
            value={contractData.tenantName}
            onChange={(e) => updateContractData('tenantName', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Петров Петр Петрович"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Паспортные данные
          </label>
          <Input
            value={contractData.tenantPassport}
            onChange={(e) => updateContractData('tenantPassport', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="9876 543210"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Телефон
          </label>
          <Input
            value={contractData.tenantPhone}
            onChange={(e) => updateContractData('tenantPhone', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <Input
            type="email"
            value={contractData.tenantEmail}
            onChange={(e) => updateContractData('tenantEmail', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="tenant@example.com"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={() => setStep(3)}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Назад
        </Button>
        <Button
          onClick={() => setStep(5)}
          className="bg-green-500 hover:bg-green-600 text-black"
        >
          Далее
        </Button>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Условия аренды</h2>
        <p className="text-gray-400">Укажите сроки и дополнительные условия</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Дата начала аренды
          </label>
          <Input
            type="date"
            value={contractData.startDate}
            onChange={(e) => updateContractData('startDate', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Дата окончания аренды
          </label>
          <Input
            type="date"
            value={contractData.endDate}
            onChange={(e) => updateContractData('endDate', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Дополнительные условия
          </label>
          <Textarea
            value={contractData.additionalTerms}
            onChange={(e) => updateContractData('additionalTerms', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            rows={4}
            placeholder="Дополнительные условия договора..."
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={() => setStep(4)}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Назад
        </Button>
        <Button
          onClick={() => setStep(6)}
          className="bg-green-500 hover:bg-green-600 text-black"
        >
          Далее
        </Button>
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Проверка данных</h2>
        <p className="text-gray-400">Проверьте все данные перед генерацией договора</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-white mb-2">Объект недвижимости</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p><strong>Название:</strong> {contractData.propertyTitle}</p>
              <p><strong>Адрес:</strong> {contractData.propertyAddress}</p>
              <p><strong>Тип:</strong> {contractData.propertyType}</p>
              <p><strong>Арендная плата:</strong> {contractData.monthlyRent.toLocaleString()} ₽/мес</p>
              <p><strong>Залог:</strong> {contractData.deposit.toLocaleString()} ₽</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-2">Арендодатель</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p><strong>ФИО:</strong> {contractData.landlordName}</p>
              <p><strong>Паспорт:</strong> {contractData.landlordPassport}</p>
              <p><strong>Адрес:</strong> {contractData.landlordAddress}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-2">Арендатор</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p><strong>ФИО:</strong> {contractData.tenantName}</p>
              <p><strong>Паспорт:</strong> {contractData.tenantPassport}</p>
              <p><strong>Телефон:</strong> {contractData.tenantPhone}</p>
              <p><strong>Email:</strong> {contractData.tenantEmail}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-2">Условия</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p><strong>Начало:</strong> {contractData.startDate}</p>
              <p><strong>Окончание:</strong> {contractData.endDate}</p>
              <p><strong>Коммунальные:</strong> {contractData.utilities ? 'Включены' : 'Не включены'}</p>
            </div>
          </div>
        </div>

        {contractData.additionalTerms && (
          <div>
            <h4 className="font-medium text-white mb-2">Дополнительные условия</h4>
            <p className="text-sm text-gray-400">{contractData.additionalTerms}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          onClick={() => setStep(5)}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Назад
        </Button>
        <Button
          onClick={generateContract}
          className="bg-green-500 hover:bg-green-600 text-black"
        >
          🎉 Создать договор
        </Button>
      </div>
    </div>
  )

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Шаг {step} из 6</span>
        <span>{Math.round((step / 6) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 6) * 100}%` }}
        ></div>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderProgressBar()}
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
      {step === 6 && renderStep6()}
    </div>
  )
} 