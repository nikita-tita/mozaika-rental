'use client'

import { useState, useEffect } from 'react'
import { 
  TeamsButton, 
  TeamsSelect, 
  TeamsModal,
  TeamsAlert
} from '@/components/ui/teams'
import { DollarSign, Calendar, FileText } from 'lucide-react'

interface Deal {
  id: string
  title: string
  monthlyRent: number
  deposit?: number
  startDate: string
  endDate?: string
  property: {
    title: string
    address: string
  }
  tenant: {
    firstName: string
    lastName: string
  }
}

interface Contract {
  id: string
  title: string
  deal: Deal
}

interface GeneratePaymentsFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  deals: Deal[]
  contracts: Contract[]
}

export default function GeneratePaymentsForm({ 
  isOpen, 
  onClose, 
  onSuccess, 
  deals: initialDeals = [], 
  contracts: initialContracts = [] 
}: GeneratePaymentsFormProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedType, setSelectedType] = useState<'deal' | 'contract'>('deal')
  const [selectedId, setSelectedId] = useState('')
  const [deals, setDeals] = useState(initialDeals)
  const [contracts, setContracts] = useState(initialContracts)

  // Загрузка данных при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      loadDeals()
      loadContracts()
    }
  }, [isOpen])

  const loadDeals = async () => {
    try {
      const response = await fetch('/api/deals')
      const data = await response.json()
      if (data.success) {
        setDeals(data.data)
      }
    } catch (error) {
      console.error('Error loading deals:', error)
    }
  }

  const loadContracts = async () => {
    try {
      const response = await fetch('/api/contracts')
      const data = await response.json()
      if (data.success) {
        setContracts(data.data)
      }
    } catch (error) {
      console.error('Error loading contracts:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    setSuccessMessage('')

    try {
      const response = await fetch('/api/payments/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dealId: selectedType === 'deal' ? selectedId : undefined,
          contractId: selectedType === 'contract' ? selectedId : undefined
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(data.message || 'Платежи успешно сгенерированы')
        
        // Скрываем сообщение об успехе через 2 секунды и закрываем форму
        setTimeout(() => {
          setSuccessMessage('')
          onClose()
          onSuccess()
        }, 2000)
      } else {
        setErrors([data.error || 'Ошибка при генерации платежей'])
      }
    } catch (error) {
      console.error('Error generating payments:', error)
      setErrors(['Ошибка при генерации платежей'])
    } finally {
      setLoading(false)
    }
  }

  const getOptions = () => {
    if (selectedType === 'deal') {
      return [
        { value: '', label: 'Выберите сделку' },
        ...deals.map(deal => ({
          value: deal.id,
          label: `${deal.title} (${deal.monthlyRent?.toLocaleString()} ₽/мес)`
        }))
      ]
    } else {
      return [
        { value: '', label: 'Выберите договор' },
        ...contracts.map(contract => ({
          value: contract.id,
          label: `${contract.title} (${contract.deal.monthlyRent?.toLocaleString()} ₽/мес)`
        }))
      ]
    }
  }

  const selectedDeal = selectedType === 'deal' 
    ? deals.find(d => d.id === selectedId)
    : contracts.find(c => c.id === selectedId)?.deal

  return (
    <TeamsModal
      isOpen={isOpen}
      onClose={onClose}
      title="Генерация платежей"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Сообщения об ошибках и успехе */}
        {errors.length > 0 && (
          <TeamsAlert
            variant="error"
            title="Ошибка"
          >
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </TeamsAlert>
        )}

        {successMessage && (
          <TeamsAlert
            variant="success"
            title="Успешно"
          >
            {successMessage}
          </TeamsAlert>
        )}

        {/* Выбор типа сущности */}
        <div>
          <h3 className="text-lg font-medium text-[#323130] mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Выбор источника данных
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Тип сущности
              </label>
              <TeamsSelect
                value={selectedType}
                onChange={(value) => {
                  setSelectedType(value as 'deal' | 'contract')
                  setSelectedId('')
                }}
                options={[
                  { value: 'deal', label: 'Сделка' },
                  { value: 'contract', label: 'Договор' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Выберите {selectedType === 'deal' ? 'сделку' : 'договор'}
              </label>
              <TeamsSelect
                value={selectedId}
                onChange={setSelectedId}
                options={getOptions()}
              />
            </div>
          </div>
        </div>

        {/* Информация о выбранной сущности */}
        {selectedDeal && (
          <div>
            <h3 className="text-lg font-medium text-[#323130] mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Информация для генерации
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div><strong>Объект:</strong> {selectedDeal.property?.title} - {selectedDeal.property?.address}</div>
              <div><strong>Арендатор:</strong> {selectedDeal.tenant?.firstName} {selectedDeal.tenant?.lastName}</div>
              <div><strong>Сумма аренды:</strong> {selectedDeal.monthlyRent?.toLocaleString()} ₽/мес</div>
              {selectedDeal.deposit && (
                <div><strong>Залог:</strong> {selectedDeal.deposit.toLocaleString()} ₽</div>
              )}
              <div><strong>Период:</strong> {selectedDeal.startDate} - {selectedDeal.endDate || 'неопределенный срок'}</div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Будет сгенерировано:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ежемесячные платежи за аренду (5-е число каждого месяца)</li>
                {selectedDeal.deposit && (
                  <li>• Платеж за залог (в день начала аренды)</li>
                )}
                <li>• Все платежи будут привязаны к {selectedType === 'deal' ? 'сделке' : 'договору'}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <TeamsButton
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Отмена
          </TeamsButton>
          <TeamsButton 
            type="submit" 
            disabled={loading || !selectedId}
          >
            {loading ? 'Генерация...' : 'Сгенерировать платежи'}
          </TeamsButton>
        </div>
      </form>
    </TeamsModal>
  )
} 