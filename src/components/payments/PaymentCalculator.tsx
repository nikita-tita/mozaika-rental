'use client'

import { useState, useEffect } from 'react'
import { TeamsCard, TeamsInput, TeamsButton, TeamsBadge } from '@/components/ui/teams'
import { Calculator, Banknote, Home, Zap, Shield, AlertCircle } from 'lucide-react'
import { formatPriceWithSymbol } from '@/lib/utils'

interface PaymentCalculatorProps {
  initialData?: {
    rentAmount?: number
    utilitiesAmount?: number
    depositAmount?: number
    penaltyAmount?: number
  }
  onCalculate?: (data: PaymentCalculationData) => void
  onSave?: (data: PaymentCalculationData) => void
  editable?: boolean
}

export interface PaymentCalculationData {
  rentAmount: number
  utilitiesAmount: number
  depositAmount: number
  penaltyAmount: number
  totalAmount: number
  breakdown: {
    rent: number
    utilities: number
    deposit: number
    penalty: number
  }
}

export default function PaymentCalculator({
  initialData = {},
  onCalculate,
  onSave,
  editable = true
}: PaymentCalculatorProps) {
  const [calculatorData, setCalculatorData] = useState({
    rentAmount: initialData.rentAmount?.toString() || '',
    utilitiesAmount: initialData.utilitiesAmount?.toString() || '',
    depositAmount: initialData.depositAmount?.toString() || '',
    penaltyAmount: initialData.penaltyAmount?.toString() || ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Вычисляем итоговую сумму
  const calculateTotal = () => {
    const rent = parseFloat(calculatorData.rentAmount) || 0
    const utilities = parseFloat(calculatorData.utilitiesAmount) || 0
    const deposit = parseFloat(calculatorData.depositAmount) || 0
    const penalty = parseFloat(calculatorData.penaltyAmount) || 0
    return rent + utilities + deposit + penalty
  }

  const totalAmount = calculateTotal()

  // Формируем данные для передачи
  const getCalculationData = (): PaymentCalculationData => ({
    rentAmount: parseFloat(calculatorData.rentAmount) || 0,
    utilitiesAmount: parseFloat(calculatorData.utilitiesAmount) || 0,
    depositAmount: parseFloat(calculatorData.depositAmount) || 0,
    penaltyAmount: parseFloat(calculatorData.penaltyAmount) || 0,
    totalAmount,
    breakdown: {
      rent: parseFloat(calculatorData.rentAmount) || 0,
      utilities: parseFloat(calculatorData.utilitiesAmount) || 0,
      deposit: parseFloat(calculatorData.depositAmount) || 0,
      penalty: parseFloat(calculatorData.penaltyAmount) || 0
    }
  })

  // Валидация данных
  const validateData = () => {
    const newErrors: Record<string, string> = {}

    if (parseFloat(calculatorData.rentAmount) < 0) {
      newErrors.rentAmount = 'Арендная плата не может быть отрицательной'
    }

    if (parseFloat(calculatorData.utilitiesAmount) < 0) {
      newErrors.utilitiesAmount = 'Коммунальные услуги не могут быть отрицательными'
    }

    if (parseFloat(calculatorData.depositAmount) < 0) {
      newErrors.depositAmount = 'Депозит не может быть отрицательным'
    }

    if (parseFloat(calculatorData.penaltyAmount) < 0) {
      newErrors.penaltyAmount = 'Штраф не может быть отрицательным'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setCalculatorData(prev => ({ ...prev, [field]: value }))
    
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCalculate = () => {
    if (!validateData()) return

    const data = getCalculationData()
    if (onCalculate) {
      onCalculate(data)
    }
  }

  const handleSave = () => {
    if (!validateData()) return

    const data = getCalculationData()
    if (onSave) {
      onSave(data)
    }
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Восстанавливаем исходные данные
    setCalculatorData({
      rentAmount: initialData.rentAmount?.toString() || '',
      utilitiesAmount: initialData.utilitiesAmount?.toString() || '',
      depositAmount: initialData.depositAmount?.toString() || '',
      penaltyAmount: initialData.penaltyAmount?.toString() || ''
    })
    setErrors({})
  }

  // Автоматический расчет при изменении данных
  useEffect(() => {
    if (onCalculate) {
      const data = getCalculationData()
      onCalculate(data)
    }
  }, [calculatorData])

  return (
    <TeamsCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Калькулятор платежей
        </h2>
        {editable && !isEditing && (
          <TeamsButton onClick={handleEdit} variant="outline" size="sm">
            Редактировать
          </TeamsButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Арендная плата */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Home className="w-4 h-4 mr-2" />
            Арендная плата (₽/мес)
          </label>
          <TeamsInput
            type="number"
            placeholder="45000"
            value={calculatorData.rentAmount}
            onChange={(e) => handleInputChange('rentAmount', e.target.value)}
            disabled={!isEditing && !editable}
            error={errors.rentAmount}
          />
          {errors.rentAmount && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.rentAmount}
            </p>
          )}
        </div>

        {/* Коммунальные услуги */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Коммунальные услуги (₽/мес)
          </label>
          <TeamsInput
            type="number"
            placeholder="5000"
            value={calculatorData.utilitiesAmount}
            onChange={(e) => handleInputChange('utilitiesAmount', e.target.value)}
            disabled={!isEditing && !editable}
            error={errors.utilitiesAmount}
          />
          {errors.utilitiesAmount && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.utilitiesAmount}
            </p>
          )}
        </div>

        {/* Депозит */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Депозит (₽)
          </label>
          <TeamsInput
            type="number"
            placeholder="45000"
            value={calculatorData.depositAmount}
            onChange={(e) => handleInputChange('depositAmount', e.target.value)}
            disabled={!isEditing && !editable}
            error={errors.depositAmount}
          />
          {errors.depositAmount && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.depositAmount}
            </p>
          )}
        </div>

        {/* Штрафы */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Штрафы (₽)
          </label>
          <TeamsInput
            type="number"
            placeholder="0"
            value={calculatorData.penaltyAmount}
            onChange={(e) => handleInputChange('penaltyAmount', e.target.value)}
            disabled={!isEditing && !editable}
            error={errors.penaltyAmount}
          />
          {errors.penaltyAmount && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.penaltyAmount}
            </p>
          )}
        </div>
      </div>

      {/* Итоговая сумма */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-900">Итого к оплате:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatPriceWithSymbol(totalAmount)}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Аренда:</span>
            <span>{formatPriceWithSymbol(parseFloat(calculatorData.rentAmount) || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Коммунальные:</span>
            <span>{formatPriceWithSymbol(parseFloat(calculatorData.utilitiesAmount) || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Депозит:</span>
            <span>{formatPriceWithSymbol(parseFloat(calculatorData.depositAmount) || 0)}</span>
          </div>
          {(parseFloat(calculatorData.penaltyAmount) || 0) > 0 && (
            <div className="flex justify-between">
              <span>Штрафы:</span>
              <span>{formatPriceWithSymbol(parseFloat(calculatorData.penaltyAmount) || 0)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Кнопки действий */}
      {isEditing && (
        <div className="mt-6 flex gap-3">
          <TeamsButton onClick={handleSave} className="flex-1">
            <Banknote className="w-4 h-4 mr-2" />
            Сохранить расчет
          </TeamsButton>
          <TeamsButton onClick={handleCancel} variant="outline">
            Отмена
          </TeamsButton>
        </div>
      )}

      {!isEditing && editable && (
        <div className="mt-6">
          <TeamsButton onClick={handleCalculate} className="w-full">
            <Calculator className="w-4 h-4 mr-2" />
            Рассчитать
          </TeamsButton>
        </div>
      )}
    </TeamsCard>
  )
} 