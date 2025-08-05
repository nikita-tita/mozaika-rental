'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TeamsButton, TeamsInput, TeamsSelect, TeamsTextarea, TeamsCard, TeamsBadge } from '@/components/ui/teams'
import { PropertySelector } from './PropertySelector'
import { FileText, User, Calendar, DollarSign, AlertCircle, CheckCircle, Plus } from 'lucide-react'

interface Property {
  id: string
  title: string
  address: string
  type: string
  area: number
  rooms: number
  pricePerMonth: number
  status: string
  images: Array<{ url: string; alt: string }>
  createdAt: string
}

interface ContractFormData {
  property: Property | null
  landlordName: string
  landlordPassport: string
  landlordPassportIssuedBy: string
  landlordPassportIssuedDate: string
  landlordSnils: string
  landlordInn: string
  landlordAddress: string
  landlordRegistrationAddress: string
  
  tenantName: string
  tenantPassport: string
  tenantPassportIssuedBy: string
  tenantPassportIssuedDate: string
  tenantBirthDate: string
  tenantPhone: string
  tenantEmail: string
  tenantRegistrationAddress: string
  
  startDate: string
  endDate: string
  monthlyRent: number
  deposit: number
  utilities: boolean
  utilitiesIncluded: boolean
  paymentSchedule: string
  paymentDay: number
  latePaymentPenalty: number
  earlyTerminationConditions: string
  depositReturnConditions: string
  additionalTerms: string
}

interface ContractFormProps {
  onSubmit: (data: ContractFormData) => void
  loading?: boolean
  initialData?: Partial<ContractFormData>
}

export const ContractForm: React.FC<ContractFormProps> = ({
  onSubmit,
  loading = false,
  initialData = {}
}) => {
  const router = useRouter()
  const [formData, setFormData] = useState<ContractFormData>({
    property: null,
    landlordName: '',
    landlordPassport: '',
    landlordPassportIssuedBy: '',
    landlordPassportIssuedDate: '',
    landlordSnils: '',
    landlordInn: '',
    landlordAddress: '',
    landlordRegistrationAddress: '',
    
    tenantName: '',
    tenantPassport: '',
    tenantPassportIssuedBy: '',
    tenantPassportIssuedDate: '',
    tenantBirthDate: '',
    tenantPhone: '',
    tenantEmail: '',
    tenantRegistrationAddress: '',
    
    startDate: '',
    endDate: '',
    monthlyRent: 0,
    deposit: 0,
    utilities: false,
    utilitiesIncluded: false,
    paymentSchedule: 'monthly',
    paymentDay: 1,
    latePaymentPenalty: 0,
    earlyTerminationConditions: '',
    depositReturnConditions: '',
    additionalTerms: '',
    ...initialData
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  useEffect(() => {
    // Автозаполнение данных объекта
    if (formData.property) {
      setFormData(prev => ({
        ...prev,
        monthlyRent: formData.property.pricePerMonth
      }))
    }
  }, [formData.property])

  const updateFormData = (field: keyof ContractFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.property) {
          newErrors.property = 'Необходимо выбрать объект'
        }
        break
      case 2:
        if (!formData.landlordName) newErrors.landlordName = 'Обязательное поле'
        if (!formData.landlordPassport) newErrors.landlordPassport = 'Обязательное поле'
        if (!formData.landlordPassportIssuedBy) newErrors.landlordPassportIssuedBy = 'Обязательное поле'
        if (!formData.landlordPassportIssuedDate) newErrors.landlordPassportIssuedDate = 'Обязательное поле'
        break
      case 3:
        if (!formData.tenantName) newErrors.tenantName = 'Обязательное поле'
        if (!formData.tenantPassport) newErrors.tenantPassport = 'Обязательное поле'
        if (!formData.tenantPassportIssuedBy) newErrors.tenantPassportIssuedBy = 'Обязательное поле'
        if (!formData.tenantPassportIssuedDate) newErrors.tenantPassportIssuedDate = 'Обязательное поле'
        if (!formData.tenantPhone) newErrors.tenantPhone = 'Обязательное поле'
        break
      case 4:
        if (!formData.startDate) newErrors.startDate = 'Обязательное поле'
        if (!formData.endDate) newErrors.endDate = 'Обязательное поле'
        if (formData.monthlyRent <= 0) newErrors.monthlyRent = 'Сумма должна быть больше 0'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData)
    }
  }

  const handlePropertyCreate = () => {
    router.push('/properties/new')
  }

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Шаг {currentStep} из {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Выбор объекта</h2>
        <p className="text-gray-600">Выберите объект недвижимости для договора аренды</p>
      </div>

      <div className="space-y-4">
        <PropertySelector
          selectedProperty={formData.property}
          onPropertySelect={(property) => updateFormData('property', property)}
          onPropertyCreate={handlePropertyCreate}
          placeholder="Выберите объект из базы данных"
        />

        {errors.property && (
          <div className="flex items-center text-error-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errors.property}
          </div>
        )}

        {formData.property && (
          <TeamsCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Информация об объекте</h3>
              <TeamsBadge variant="success">Выбран</TeamsBadge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <p className="text-gray-900">{formData.property.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                <p className="text-gray-900">{formData.property.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                <p className="text-gray-900">{formData.property.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Площадь</label>
                <p className="text-gray-900">{formData.property.area} м²</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Комнаты</label>
                <p className="text-gray-900">{formData.property.rooms}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена в месяц</label>
                <p className="text-gray-900 font-semibold">
                  {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    minimumFractionDigits: 0
                  }).format(formData.property.pricePerMonth)}
                </p>
              </div>
            </div>
          </TeamsCard>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Данные арендодателя</h2>
        <p className="text-gray-600">Заполните информацию об арендодателе</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamsInput
          label="ФИО арендодателя"
          value={formData.landlordName}
          onChange={(e) => updateFormData('landlordName', e.target.value)}
          error={errors.landlordName}
          required
        />

        <TeamsInput
          label="Серия и номер паспорта"
          value={formData.landlordPassport}
          onChange={(e) => updateFormData('landlordPassport', e.target.value)}
          error={errors.landlordPassport}
          required
        />

        <TeamsInput
          label="Кем выдан паспорт"
          value={formData.landlordPassportIssuedBy}
          onChange={(e) => updateFormData('landlordPassportIssuedBy', e.target.value)}
          error={errors.landlordPassportIssuedBy}
          required
        />

        <TeamsInput
          label="Дата выдачи паспорта"
          type="date"
          value={formData.landlordPassportIssuedDate}
          onChange={(e) => updateFormData('landlordPassportIssuedDate', e.target.value)}
          error={errors.landlordPassportIssuedDate}
          required
        />

        <TeamsInput
          label="СНИЛС"
          value={formData.landlordSnils}
          onChange={(e) => updateFormData('landlordSnils', e.target.value)}
        />

        <TeamsInput
          label="ИНН"
          value={formData.landlordInn}
          onChange={(e) => updateFormData('landlordInn', e.target.value)}
        />

        <TeamsInput
          label="Адрес проживания"
          value={formData.landlordAddress}
          onChange={(e) => updateFormData('landlordAddress', e.target.value)}
        />

        <TeamsInput
          label="Адрес регистрации"
          value={formData.landlordRegistrationAddress}
          onChange={(e) => updateFormData('landlordRegistrationAddress', e.target.value)}
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Данные арендатора</h2>
        <p className="text-gray-600">Заполните информацию об арендаторе</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamsInput
          label="ФИО арендатора"
          value={formData.tenantName}
          onChange={(e) => updateFormData('tenantName', e.target.value)}
          error={errors.tenantName}
          required
        />

        <TeamsInput
          label="Серия и номер паспорта"
          value={formData.tenantPassport}
          onChange={(e) => updateFormData('tenantPassport', e.target.value)}
          error={errors.tenantPassport}
          required
        />

        <TeamsInput
          label="Кем выдан паспорт"
          value={formData.tenantPassportIssuedBy}
          onChange={(e) => updateFormData('tenantPassportIssuedBy', e.target.value)}
          error={errors.tenantPassportIssuedBy}
          required
        />

        <TeamsInput
          label="Дата выдачи паспорта"
          type="date"
          value={formData.tenantPassportIssuedDate}
          onChange={(e) => updateFormData('tenantPassportIssuedDate', e.target.value)}
          error={errors.tenantPassportIssuedDate}
          required
        />

        <TeamsInput
          label="Дата рождения"
          type="date"
          value={formData.tenantBirthDate}
          onChange={(e) => updateFormData('tenantBirthDate', e.target.value)}
        />

        <TeamsInput
          label="Телефон"
          type="tel"
          value={formData.tenantPhone}
          onChange={(e) => updateFormData('tenantPhone', e.target.value)}
          error={errors.tenantPhone}
          required
        />

        <TeamsInput
          label="Email"
          type="email"
          value={formData.tenantEmail}
          onChange={(e) => updateFormData('tenantEmail', e.target.value)}
        />

        <TeamsInput
          label="Адрес регистрации"
          value={formData.tenantRegistrationAddress}
          onChange={(e) => updateFormData('tenantRegistrationAddress', e.target.value)}
        />
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Условия аренды</h2>
        <p className="text-gray-600">Укажите условия договора аренды</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamsInput
          label="Дата начала аренды"
          type="date"
          value={formData.startDate}
          onChange={(e) => updateFormData('startDate', e.target.value)}
          error={errors.startDate}
          required
        />

        <TeamsInput
          label="Дата окончания аренды"
          type="date"
          value={formData.endDate}
          onChange={(e) => updateFormData('endDate', e.target.value)}
          error={errors.endDate}
          required
        />

        <TeamsInput
          label="Ежемесячная плата (₽)"
          type="number"
          value={formData.monthlyRent}
          onChange={(e) => updateFormData('monthlyRent', Number(e.target.value))}
          error={errors.monthlyRent}
          required
        />

        <TeamsInput
          label="Депозит (₽)"
          type="number"
          value={formData.deposit}
          onChange={(e) => updateFormData('deposit', Number(e.target.value))}
        />

        <TeamsSelect
          label="График платежей"
          value={formData.paymentSchedule}
          onChange={(value) => updateFormData('paymentSchedule', value)}
          options={[
            { value: 'monthly', label: 'Ежемесячно' },
            { value: 'weekly', label: 'Еженедельно' },
            { value: 'quarterly', label: 'Ежеквартально' }
          ]}
        />

        <TeamsInput
          label="День платежа"
          type="number"
          min="1"
          max="31"
          value={formData.paymentDay}
          onChange={(e) => updateFormData('paymentDay', Number(e.target.value))}
        />

        <TeamsInput
          label="Штраф за просрочку (%)"
          type="number"
          value={formData.latePaymentPenalty}
          onChange={(e) => updateFormData('latePaymentPenalty', Number(e.target.value))}
        />
      </div>

      <div className="space-y-4">
        <TeamsTextarea
          label="Условия досрочного расторжения"
          value={formData.earlyTerminationConditions}
          onChange={(e) => updateFormData('earlyTerminationConditions', e.target.value)}
          placeholder="Укажите условия досрочного расторжения договора..."
        />

        <TeamsTextarea
          label="Условия возврата депозита"
          value={formData.depositReturnConditions}
          onChange={(e) => updateFormData('depositReturnConditions', e.target.value)}
          placeholder="Укажите условия возврата депозита..."
        />

        <TeamsTextarea
          label="Дополнительные условия"
          value={formData.additionalTerms}
          onChange={(e) => updateFormData('additionalTerms', e.target.value)}
          placeholder="Дополнительные условия договора..."
        />
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return renderStep1()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {renderProgressBar()}
      
      <TeamsCard className="p-8">
        {renderCurrentStep()}
        
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <TeamsButton
            onClick={handlePrev}
            disabled={currentStep === 1}
            variant="outline"
          >
            Назад
          </TeamsButton>
          
          {currentStep < totalSteps ? (
            <TeamsButton
              onClick={handleNext}
              variant="primary"
            >
              Далее
            </TeamsButton>
          ) : (
            <TeamsButton
              onClick={handleSubmit}
              variant="primary"
              loading={loading}
            >
              Создать договор
            </TeamsButton>
          )}
        </div>
      </TeamsCard>
    </div>
  )
} 