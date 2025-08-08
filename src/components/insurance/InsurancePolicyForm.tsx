'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Building2, 
  Users, 
  FileText, 
  CreditCard,
  Calculator,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react'
import { 
  TeamsCard, 
  TeamsButton, 
  TeamsInput, 
  TeamsSelect, 
  TeamsDatePicker,
  TeamsAlert
} from '@/components/ui/teams'

interface InsurancePolicyFormProps {
  onSuccess?: (policy: any) => void
  onCancel?: () => void
  initialData?: any
}

const insuranceTypes = [
  {
    value: 'PROPERTY',
    label: 'Страхование имущества',
    description: 'Защита объектов недвижимости от повреждений',
    icon: Building2
  },
  {
    value: 'LIABILITY',
    label: 'Страхование ответственности',
    description: 'Защита от претензий арендаторов',
    icon: Users
  },
  {
    value: 'RENTAL_INCOME',
    label: 'Страхование арендных платежей',
    description: 'Защита от невыплаты арендной платы',
    icon: CreditCard
  },
  {
    value: 'LEGAL_PROTECTION',
    label: 'Юридическая защита',
    description: 'Покрытие расходов на юридические услуги',
    icon: FileText
  },
  {
    value: 'COMPREHENSIVE',
    label: 'Комплексное страхование',
    description: 'Полная защита по всем направлениям',
    icon: Shield
  }
]

const propertyTypes = [
  { value: 'APARTMENT', label: 'Квартира' },
  { value: 'HOUSE', label: 'Дом' },
  { value: 'COMMERCIAL', label: 'Коммерческая недвижимость' },
  { value: 'LAND', label: 'Земельный участок' }
]

const locations = [
  { value: 'center', label: 'Центр города' },
  { value: 'residential', label: 'Спальный район' },
  { value: 'outskirts', label: 'Окраина города' }
]

const insuranceCompanies = [
  { value: 'Росгосстрах', label: 'Росгосстрах' },
  { value: 'АльфаСтрахование', label: 'АльфаСтрахование' },
  { value: 'Сбербанк Страхование', label: 'Сбербанк Страхование' },
  { value: 'ВТБ Страхование', label: 'ВТБ Страхование' }
]

export default function InsurancePolicyForm({ 
  onSuccess, 
  onCancel, 
  initialData 
}: InsurancePolicyFormProps) {
  const [formData, setFormData] = useState({
    type: '',
    insuredAmount: '',
    deductible: '',
    premium: '',
    startDate: '',
    endDate: '',
    insuranceCompany: '',
    propertyId: '',
    propertyType: '',
    propertyAge: '',
    location: '',
    coveragePeriod: '12'
  })

  const [calculation, setCalculation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculatePremium = async () => {
    if (!formData.type || !formData.insuredAmount || !formData.propertyType || !formData.location) {
      setError('Заполните все обязательные поля для расчета')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/insurance/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: formData.type,
          insuredAmount: parseFloat(formData.insuredAmount),
          propertyType: formData.propertyType,
          propertyAge: parseInt(formData.propertyAge) || 10,
          location: formData.location,
          coveragePeriod: parseInt(formData.coveragePeriod)
        })
      })

      if (!response.ok) {
        throw new Error('Ошибка расчета')
      }

      const data = await response.json()
      setCalculation(data)
      
      // Автоматически заполняем рассчитанные значения
      setFormData(prev => ({
        ...prev,
        premium: data.calculation.premium.toString(),
        deductible: data.calculation.deductible.toString()
      }))
    } catch (error) {
      setError('Ошибка при расчете стоимости страхования')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.type || !formData.insuredAmount || !formData.premium) {
      setError('Заполните все обязательные поля')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/insurance/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: formData.type,
          insuredAmount: parseFloat(formData.insuredAmount),
          deductible: parseFloat(formData.deductible),
          premium: parseFloat(formData.premium),
          startDate: formData.startDate,
          endDate: formData.endDate,
          insuranceCompany: formData.insuranceCompany,
          propertyId: formData.propertyId || null
        })
      })

      if (!response.ok) {
        throw new Error('Ошибка создания полиса')
      }

      const policy = await response.json()
      onSuccess?.(policy)
    } catch (error) {
      setError('Ошибка при создании страхового полиса')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <TeamsCard className="p-6">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-primary-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-900">
            {initialData ? 'Редактировать полис' : 'Создать страховой полис'}
          </h2>
        </div>

        {error && (
          <TeamsAlert variant="error" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            {error}
          </TeamsAlert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Тип страхования */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип страхования *
            </label>
            <TeamsSelect
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
              placeholder="Выберите тип страхования"
            >
              {insuranceTypes.map((type) => {
                const Icon = type.icon
                return (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                )
              })}
            </TeamsSelect>
          </div>

          {/* Параметры объекта */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип недвижимости
              </label>
              <TeamsSelect
                value={formData.propertyType}
                onValueChange={(value) => handleInputChange('propertyType', value)}
                placeholder="Выберите тип"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </TeamsSelect>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Возраст недвижимости (лет)
              </label>
              <TeamsInput
                type="number"
                value={formData.propertyAge}
                onChange={(e) => handleInputChange('propertyAge', e.target.value)}
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Расположение
              </label>
              <TeamsSelect
                value={formData.location}
                onValueChange={(value) => handleInputChange('location', value)}
                placeholder="Выберите район"
              >
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </TeamsSelect>
            </div>
          </div>

          {/* Страховая сумма */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Страховая сумма (₽) *
            </label>
            <TeamsInput
              type="number"
              value={formData.insuredAmount}
              onChange={(e) => handleInputChange('insuredAmount', e.target.value)}
              placeholder="1000000"
              required
            />
          </div>

          {/* Период страхования */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Период страхования (месяцев)
            </label>
            <TeamsInput
              type="number"
              value={formData.coveragePeriod}
              onChange={(e) => handleInputChange('coveragePeriod', e.target.value)}
              placeholder="12"
              min="1"
              max="60"
            />
          </div>

          {/* Кнопка расчета */}
          <div className="flex justify-center">
            <TeamsButton
              type="button"
              onClick={calculatePremium}
              disabled={loading || !formData.type || !formData.insuredAmount}
              className="flex items-center"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {loading ? 'Рассчитываем...' : 'Рассчитать стоимость'}
            </TeamsButton>
          </div>

          {/* Результаты расчета */}
          {calculation && (
            <TeamsCard className="p-4 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Результаты расчета
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Премия (₽)
                  </label>
                  <TeamsInput
                    type="number"
                    value={formData.premium}
                    onChange={(e) => handleInputChange('premium', e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Франшиза (₽)
                  </label>
                  <TeamsInput
                    type="number"
                    value={formData.deductible}
                    onChange={(e) => handleInputChange('deductible', e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Период
                  </label>
                  <div className="text-blue-900 font-medium">
                    {calculation.calculation.period} месяцев
                  </div>
                </div>
              </div>

              {/* Предложения страховых компаний */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-blue-700 mb-2">
                  Предложения страховых компаний:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {calculation.companies.map((company: any, index: number) => (
                    <div
                      key={index}
                      className="p-2 bg-white rounded border cursor-pointer hover:border-blue-300"
                      onClick={() => handleInputChange('insuranceCompany', company.name)}
                    >
                      <div className="font-medium text-sm">{company.name}</div>
                      <div className="text-xs text-gray-600">
                        {Math.round(company.premium)} ₽ • Рейтинг: {company.rating}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TeamsCard>
          )}

          {/* Даты действия */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата начала действия
              </label>
              <TeamsDatePicker
                value={formData.startDate}
                onChange={(date) => handleInputChange('startDate', date)}
                placeholder="Выберите дату"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата окончания действия
              </label>
              <TeamsDatePicker
                value={formData.endDate}
                onChange={(date) => handleInputChange('endDate', date)}
                placeholder="Выберите дату"
              />
            </div>
          </div>

          {/* Страховая компания */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Страховая компания
            </label>
            <TeamsSelect
              value={formData.insuranceCompany}
              onValueChange={(value) => handleInputChange('insuranceCompany', value)}
              placeholder="Выберите страховую компанию"
            >
              {insuranceCompanies.map((company) => (
                <option key={company.value} value={company.value}>
                  {company.label}
                </option>
              ))}
            </TeamsSelect>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-4 pt-6">
            {onCancel && (
              <TeamsButton
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Отмена
              </TeamsButton>
            )}
            <TeamsButton
              type="submit"
              disabled={loading || !formData.type || !formData.insuredAmount || !formData.premium}
            >
              {loading ? 'Создаем...' : (initialData ? 'Обновить' : 'Создать полис')}
            </TeamsButton>
          </div>
        </form>
      </TeamsCard>
    </div>
  )
} 