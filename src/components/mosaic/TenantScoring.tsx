'use client'

import React, { useState } from 'react'
import type { TenantScoring } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface TenantScoringProps {
  onScoringComplete: (scoring: TenantScoring) => void
  onClose: () => void
}

interface ScoringForm {
  fullName: string
  passport: string
  birthDate: string
}

export default function TenantScoring({ onScoringComplete, onClose }: TenantScoringProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'result'>('form')
  const [formData, setFormData] = useState<ScoringForm>({
    fullName: '',
    passport: '',
    birthDate: ''
  })
  const [scoringResult, setScoringResult] = useState<TenantScoring | null>(null)

  const updateFormData = (field: keyof ScoringForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const startScoring = async () => {
    setStep('processing')
    
    try {
      // Имитация API запроса к банковским системам
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Генерация результата скоринга
      const mockScoring: TenantScoring = {
        id: `scoring_${Date.now()}`,
        fullName: formData.fullName,
        passport: formData.passport,
        birthDate: new Date(formData.birthDate),
        score: Math.floor(Math.random() * 400) + 600, // 600-1000
        riskLevel: Math.random() > 0.3 ? 'low' : Math.random() > 0.6 ? 'medium' : 'high',
        factors: {
          creditHistory: Math.random() > 0.2 ? 'excellent' : 'good',
          debtLoad: Math.random() > 0.3 ? 'low' : 'medium',
          employment: Math.random() > 0.4 ? 'stable' : 'temporary',
          income: Math.random() > 0.5 ? 'sufficient' : 'insufficient'
        },
        recommendations: Math.random() > 0.3 
          ? 'Рекомендуется стандартный депозит'
          : 'Рекомендуется увеличенный депозит или поручитель',
        nbkiData: {
          creditScore: Math.floor(Math.random() * 300) + 700,
          activeLoans: Math.floor(Math.random() * 3),
          overduePayments: Math.floor(Math.random() * 2)
        },
        okbData: {
          creditScore: Math.floor(Math.random() * 300) + 700,
          activeLoans: Math.floor(Math.random() * 3),
          overduePayments: Math.floor(Math.random() * 2)
        },
        fsspData: {
          hasEnforcementProceedings: Math.random() > 0.8,
          totalDebt: Math.random() > 0.9 ? Math.floor(Math.random() * 100000) : 0
        },
        realtorId: 'current_realtor_id', // TODO: Получить из контекста
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setScoringResult(mockScoring)
      setStep('result')
    } catch (error) {
      console.error('Ошибка скоринга:', error)
      setStep('form')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-500'
    if (score >= 650) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 800) return 'ОТЛИЧНО'
    if (score >= 650) return 'ХОРОШО'
    return 'РИСКОВАННО'
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500 bg-green-500/10'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10'
      case 'high': return 'text-red-500 bg-red-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getRiskLevelLabel = (level: string) => {
    switch (level) {
      case 'low': return 'НИЗКИЙ РИСК'
      case 'medium': return 'СРЕДНИЙ РИСК'
      case 'high': return 'ВЫСОКИЙ РИСК'
      default: return 'НЕИЗВЕСТНО'
    }
  }

  const renderForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">🔍 Скоринг арендатора</h2>
        <p className="text-gray-400">Банковская проверка за 30 секунд</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ФИО арендатора
            </label>
            <Input
              value={formData.fullName}
              onChange={(e) => updateFormData('fullName', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Петров Петр Петрович"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Паспортные данные
            </label>
            <Input
              value={formData.passport}
              onChange={(e) => updateFormData('passport', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="1234 567890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Дата рождения
            </label>
            <Input
              type="date"
              value={formData.birthDate}
              onChange={(e) => updateFormData('birthDate', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-400 text-xl">ℹ️</div>
          <div>
            <h4 className="font-medium text-blue-400 mb-1">Как работает скоринг?</h4>
            <p className="text-sm text-blue-300">
              Мы проверяем данные в НБКИ, ОКБ и ФССП - тех же системах, что используют банки. 
              Это гарантирует надежность проверки и защиту от мошенничества.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={onClose}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Отмена
        </Button>
        <Button
          onClick={startScoring}
          disabled={!formData.fullName || !formData.passport || !formData.birthDate}
          className="bg-green-500 hover:bg-green-600 text-black"
        >
          🔍 Начать проверку
        </Button>
      </div>
    </div>
  )

  const renderProcessing = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Проверка в банковских системах</h2>
        <p className="text-gray-400">Получаем данные из НБКИ, ОКБ и ФССП...</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
          
          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">НБКИ</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Проверено</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">ОКБ</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Проверено</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">ФССП</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-400 text-sm">Проверяется...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderResult = () => {
    if (!scoringResult) return null

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Результат скоринга</h2>
          <p className="text-gray-400">Проверка завершена успешно</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Основной результат */}
            <div className="md:col-span-2">
              <div className="text-center p-6 bg-gray-700 rounded-lg">
                <div className="text-4xl font-bold mb-2">
                  <span className={getScoreColor(scoringResult.score)}>
                    {scoringResult.score}
                  </span>
                  <span className="text-gray-400 text-2xl">/1000</span>
                </div>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getRiskLevelColor(scoringResult.riskLevel)}`}>
                  {getRiskLevelLabel(scoringResult.riskLevel)}
                </div>
                <p className="text-gray-400 mt-2">{getScoreLabel(scoringResult.score)}</p>
              </div>
            </div>

            {/* Факторы */}
            <div>
              <h4 className="font-medium text-white mb-3">Факторы оценки</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Кредитная история</span>
                  <span className="text-white capitalize">{scoringResult.factors.creditHistory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Долговая нагрузка</span>
                  <span className="text-white capitalize">{scoringResult.factors.debtLoad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Занятость</span>
                  <span className="text-white capitalize">{scoringResult.factors.employment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Доход</span>
                  <span className="text-white capitalize">{scoringResult.factors.income}</span>
                </div>
              </div>
            </div>

            {/* Рекомендации */}
            <div>
              <h4 className="font-medium text-white mb-3">Рекомендации</h4>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-300 text-sm">{scoringResult.recommendations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Детальная информация */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="font-medium text-white mb-4">Детальная информация</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-400 mb-2">НБКИ</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Кредитный рейтинг</span>
                  <span className="text-white">{scoringResult.nbkiData?.creditScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Активные кредиты</span>
                  <span className="text-white">{scoringResult.nbkiData?.activeLoans}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Просрочки</span>
                  <span className="text-white">{scoringResult.nbkiData?.overduePayments}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-400 mb-2">ОКБ</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Кредитный рейтинг</span>
                  <span className="text-white">{scoringResult.okbData?.creditScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Активные кредиты</span>
                  <span className="text-white">{scoringResult.okbData?.activeLoans}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Просрочки</span>
                  <span className="text-white">{scoringResult.okbData?.overduePayments}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-400 mb-2">ФССП</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Исполнительные производства</span>
                  <span className="text-white">
                    {scoringResult.fsspData?.hasEnforcementProceedings ? 'Есть' : 'Нет'}
                  </span>
                </div>
                {scoringResult.fsspData?.hasEnforcementProceedings && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Общий долг</span>
                    <span className="text-white">
                      {scoringResult.fsspData?.totalDebt?.toLocaleString()} ₽
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            onClick={() => setStep('form')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Проверить другого
          </Button>
          <Button
            onClick={() => {
              onScoringComplete(scoringResult)
              onClose()
            }}
            className="bg-green-500 hover:bg-green-600 text-black"
          >
            ✅ Использовать результат
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {step === 'form' && renderForm()}
      {step === 'processing' && renderProcessing()}
      {step === 'result' && renderResult()}
    </div>
  )
} 