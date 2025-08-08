'use client'

import { useState, useEffect } from 'react'
import { 
  Banknote, 
  Calculator, 
  Settings, 
  Save,
  Info,
  TrendingUp
} from 'lucide-react'
import { 
  TeamsCard, 
  TeamsButton, 
  TeamsInput, 
  TeamsBadge 
} from '@/components/ui/teams'

interface CommissionSettings {
  baseCommission: number // Базовая комиссия (72.5%)
  minRentAmount: number // Минимальная сумма аренды для расчета комиссии
  maxCommission: number // Максимальная комиссия
  autoCalculate: boolean // Автоматический расчет комиссии
}

export default function CommissionSettings() {
  const [settings, setSettings] = useState<CommissionSettings>({
    baseCommission: 72.5,
    minRentAmount: 10000,
    maxCommission: 50000,
    autoCalculate: true
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [testRentAmount, setTestRentAmount] = useState('50000')

  const calculateCommission = (rentAmount: number) => {
    if (rentAmount < settings.minRentAmount) return 0
    
    const commission = rentAmount * (settings.baseCommission / 100)
    return Math.min(commission, settings.maxCommission)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Здесь будет API вызов для сохранения настроек
      await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация API
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testCommission = calculateCommission(parseFloat(testRentAmount) || 0)

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Настройка комиссий
        </h2>
        <p className="text-gray-600">
          Настройте параметры расчета комиссионного вознаграждения для лидов Яндекс.Аренда
        </p>
      </div>

      {/* Основные настройки */}
      <TeamsCard className="p-6">
        <div className="flex items-center mb-6">
          <Settings className="w-6 h-6 text-primary-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Параметры комиссии
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Базовая комиссия */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Базовая комиссия (%)
            </label>
            <TeamsInput
              type="number"
              value={settings.baseCommission}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                baseCommission: parseFloat(e.target.value) || 0
              }))}
              min="0"
              max="100"
              step="0.1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Процент от первого арендного платежа
            </p>
          </div>

          {/* Минимальная сумма аренды */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Минимальная сумма аренды (₽)
            </label>
            <TeamsInput
              type="number"
              value={settings.minRentAmount}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                minRentAmount: parseFloat(e.target.value) || 0
              }))}
              min="0"
              step="1000"
            />
            <p className="text-sm text-gray-500 mt-1">
              Комиссия не начисляется ниже этой суммы
            </p>
          </div>

          {/* Максимальная комиссия */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Максимальная комиссия (₽)
            </label>
            <TeamsInput
              type="number"
              value={settings.maxCommission}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                maxCommission: parseFloat(e.target.value) || 0
              }))}
              min="0"
              step="1000"
            />
            <p className="text-sm text-gray-500 mt-1">
              Ограничение максимальной комиссии
            </p>
          </div>

          {/* Автоматический расчет */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Автоматический расчет
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoCalculate}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  autoCalculate: e.target.checked
                }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Автоматически рассчитывать комиссию при передаче лида
              </span>
            </div>
          </div>
        </div>

        {/* Кнопка сохранения */}
        <div className="mt-6 flex justify-end">
          <TeamsButton
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Сохранение...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Сохранить настройки
              </>
            )}
          </TeamsButton>
        </div>

        {isSaved && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <Info className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                Настройки успешно сохранены
              </span>
            </div>
          </div>
        )}
      </TeamsCard>

      {/* Калькулятор комиссии */}
      <TeamsCard className="p-6">
        <div className="flex items-center mb-6">
          <Calculator className="w-6 h-6 text-primary-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Калькулятор комиссии
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ввод суммы аренды */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сумма аренды (₽/мес)
            </label>
            <TeamsInput
              type="number"
              value={testRentAmount}
              onChange={(e) => setTestRentAmount(e.target.value)}
              placeholder="50000"
              min="0"
              step="1000"
            />
          </div>

          {/* Результат расчета */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Комиссия
            </label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="text-2xl font-bold text-primary-600">
                {testCommission.toLocaleString()} ₽
              </div>
              <div className="text-sm text-gray-600">
                {settings.baseCommission}% от {parseFloat(testRentAmount).toLocaleString()} ₽
              </div>
            </div>
          </div>
        </div>

        {/* Информация о расчете */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Как рассчитывается комиссия:</p>
              <ul className="space-y-1">
                <li>• Базовая комиссия: {settings.baseCommission}% от суммы аренды</li>
                <li>• Минимальная сумма: {settings.minRentAmount.toLocaleString()} ₽</li>
                <li>• Максимальная комиссия: {settings.maxCommission.toLocaleString()} ₽</li>
                {parseFloat(testRentAmount) < settings.minRentAmount && (
                  <li className="text-red-600">• Сумма ниже минимальной - комиссия не начисляется</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </TeamsCard>

      {/* Примеры расчета */}
      <TeamsCard className="p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-primary-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Примеры расчета комиссии
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { rent: 30000, label: 'Студия' },
            { rent: 50000, label: '1-комнатная' },
            { rent: 80000, label: '2-комнатная' }
          ].map((example, index) => {
            const commission = calculateCommission(example.rent)
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {example.label}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {example.rent.toLocaleString()} ₽/мес
                </div>
                <div className="text-2xl font-bold text-primary-600">
                  {commission.toLocaleString()} ₽
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  комиссия
                </div>
              </div>
            )
          })}
        </div>
      </TeamsCard>

      {/* Информационный блок */}
      <TeamsCard className="p-6 border-yellow-200 bg-yellow-50">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 mb-1">
              Важная информация
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Комиссия выплачивается только после успешного заселения арендатора</li>
              <li>• Расчет производится от первого арендного платежа</li>
              <li>• При изменении настроек новые параметры применяются к новым лидам</li>
              <li>• История расчетов сохраняется для каждого лида</li>
            </ul>
          </div>
        </div>
      </TeamsCard>
    </div>
  )
} 