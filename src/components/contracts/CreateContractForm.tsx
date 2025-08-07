'use client'

import { useState, useEffect } from 'react'
import { 
  TeamsButton, 
  TeamsInput, 
  TeamsSelect, 
  TeamsCard, 
  TeamsTextarea,
  TeamsModal,
  TeamsAlert
} from '@/components/ui/teams'
import { DatePicker } from '@/components/ui/DatePicker'
import { FileText, Building, Users, Calendar, DollarSign, CheckCircle } from 'lucide-react'

interface Deal {
  id: string
  title: string
  property: {
    id: string
    title: string
    address: string
    price: number
  }
  tenant: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  landlord: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  startDate: string
  endDate: string
  monthlyRent: number
  deposit: number
  status: string
}

interface CreateContractFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateContractForm({ isOpen, onClose, onSuccess }: CreateContractFormProps) {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    dealId: '',
    monthlyRent: '',
    deposit: '',
    utilities: false,
    additionalTerms: '',
    contractType: 'standard'
  })

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchDeals()
    }
  }, [isOpen])

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals?status=IN_PROGRESS')
      const data = await response.json()
      
      if (data.success) {
        setDeals(data.data)
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    setSuccessMessage('')

    if (!selectedDeal) {
      setErrors(['Выберите сделку для создания договора'])
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          dealId: selectedDeal.id,
          monthlyRent: parseFloat(formData.monthlyRent) || selectedDeal.monthlyRent,
          deposit: formData.deposit ? parseFloat(formData.deposit) : selectedDeal.deposit,
          // Генерируем содержание договора
          content: generateContractContent(selectedDeal, formData)
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(data.message || 'Договор успешно создан')
        setFormData({
          title: '',
          dealId: '',
          monthlyRent: '',
          deposit: '',
          utilities: false,
          additionalTerms: '',
          contractType: 'standard'
        })
        setSelectedDeal(null)
        
        // Скрываем сообщение об успехе через 2 секунды и закрываем форму
        setTimeout(() => {
          setSuccessMessage('')
          onClose()
          onSuccess()
        }, 2000)
      } else {
        setErrors([data.error || 'Ошибка при создании договора'])
      }
    } catch (error) {
      console.error('Error creating contract:', error)
      setErrors(['Ошибка при создании договора'])
    } finally {
      setLoading(false)
    }
  }

  const handleDealSelect = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId)
    if (deal) {
      setSelectedDeal(deal)
      setFormData(prev => ({
        ...prev,
        dealId: deal.id,
        title: `Договор аренды - ${deal.property.title}`,
        monthlyRent: deal.monthlyRent.toString(),
        deposit: deal.deposit ? deal.deposit.toString() : ''
      }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }))
  }

  const generateContractContent = (deal: Deal, formData: any) => {
    const startDate = new Date(deal.startDate).toLocaleDateString('ru-RU')
    const endDate = new Date(deal.endDate).toLocaleDateString('ru-RU')
    
    return `ДОГОВОР АРЕНДЫ НЕДВИЖИМОСТИ

г. Москва                                                                  ${startDate}

${deal.landlord.firstName} ${deal.landlord.lastName}, именуемый в дальнейшем "Арендодатель", 
в лице ${deal.landlord.firstName} ${deal.landlord.lastName}, действующий на основании права собственности, 
с одной стороны, и ${deal.tenant.firstName} ${deal.tenant.lastName}, именуемый в дальнейшем "Арендатор", 
с другой стороны, заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА
1.1. Арендодатель обязуется предоставить Арендатору во временное владение и пользование 
недвижимое имущество: ${deal.property.title}, расположенное по адресу: ${deal.property.address}.

2. СРОК ДЕЙСТВИЯ ДОГОВОРА
2.1. Договор вступает в силу с ${startDate} и действует до ${endDate}.

3. АРЕНДНАЯ ПЛАТА
3.1. Размер арендной платы составляет ${formData.monthlyRent || deal.monthlyRent} (${numberToWords(parseInt(formData.monthlyRent || deal.monthlyRent.toString()))}) рублей в месяц.
3.2. Арендная плата вносится Арендатором ежемесячно не позднее 5-го числа каждого месяца.

4. ЗАЛОГ
4.1. При заключении договора Арендатор вносит залог в размере ${formData.deposit || deal.deposit || 0} (${numberToWords(parseInt(formData.deposit || deal.deposit?.toString() || '0'))}) рублей.

5. ПРАВА И ОБЯЗАННОСТИ СТОРОН
5.1. Арендодатель обязуется:
- Передать Арендатору имущество в состоянии, соответствующем условиям договора
- Не вмешиваться в хозяйственную деятельность Арендатора

5.2. Арендатор обязуется:
- Использовать имущество в соответствии с его назначением
- Поддерживать имущество в исправном состоянии
- Своевременно вносить арендную плату

${formData.additionalTerms ? `
6. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ
${formData.additionalTerms}
` : ''}

7. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
7.1. Договор составлен в двух экземплярах, имеющих равную юридическую силу.
7.2. Все изменения и дополнения к договору действительны при письменном согласии сторон.

Арендодатель:                                    Арендатор:
${deal.landlord.firstName} ${deal.landlord.lastName}                    ${deal.tenant.firstName} ${deal.tenant.lastName}
Паспорт: _________________                      Паспорт: _________________
Подпись: _________________                      Подпись: _________________
Дата: _________________                         Дата: _________________`
  }

  const numberToWords = (num: number): string => {
    const units = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']
    const teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать']
    const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто']
    
    if (num === 0) return 'ноль'
    if (num < 10) return units[num]
    if (num < 20) return teens[num - 10]
    if (num < 100) {
      const unit = num % 10
      const ten = Math.floor(num / 10)
      return tens[ten] + (unit > 0 ? ' ' + units[unit] : '')
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100)
      const remainder = num % 100
      return (hundred > 1 ? units[hundred] + ' ' : '') + 'сто' + (remainder > 0 ? ' ' + numberToWords(remainder) : '')
    }
    if (num < 1000000) {
      const thousand = Math.floor(num / 1000)
      const remainder = num % 1000
      return numberToWords(thousand) + ' тысяча' + (remainder > 0 ? ' ' + numberToWords(remainder) : '')
    }
    
    return num.toString()
  }

  const contractTypeOptions = [
    { value: 'standard', label: 'Стандартный договор аренды' },
    { value: 'commercial', label: 'Коммерческая аренда' },
    { value: 'long_term', label: 'Долгосрочная аренда' }
  ]

  return (
    <TeamsModal
      isOpen={isOpen}
      onClose={onClose}
      title="Создать договор аренды"
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

        {/* Выбор сделки */}
        <div>
          <h3 className="text-lg font-medium text-[#323130] mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Выбор сделки
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-[#323130] mb-1">
              Выберите сделку <span className="text-red-500">*</span>
            </label>
            <TeamsSelect
              value={formData.dealId}
              onChange={handleDealSelect}
              options={[
                { value: '', label: 'Выберите сделку для создания договора' },
                ...deals.map(deal => ({
                  value: deal.id,
                  label: `${deal.title || deal.property.title} - ${deal.property.address}`
                }))
              ]}
            />
          </div>
        </div>

        {/* Информация о выбранной сделке */}
        {selectedDeal && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Информация о сделке</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div><strong>Объект:</strong> {selectedDeal.property.title} - {selectedDeal.property.address}</div>
              <div><strong>Арендатор:</strong> {selectedDeal.tenant.firstName} {selectedDeal.tenant.lastName}</div>
              <div><strong>Арендодатель:</strong> {selectedDeal.landlord.firstName} {selectedDeal.landlord.lastName}</div>
              <div><strong>Период:</strong> {new Date(selectedDeal.startDate).toLocaleDateString('ru-RU')} - {new Date(selectedDeal.endDate).toLocaleDateString('ru-RU')}</div>
              <div><strong>Арендная плата:</strong> {selectedDeal.monthlyRent} ₽/мес</div>
              {selectedDeal.deposit > 0 && (
                <div><strong>Залог:</strong> {selectedDeal.deposit} ₽</div>
              )}
            </div>
          </div>
        )}

        {/* Основная информация о договоре */}
        <div>
          <h3 className="text-lg font-medium text-[#323130] mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Информация о договоре
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Название договора <span className="text-red-500">*</span>
              </label>
              <TeamsInput
                name="title"
                placeholder="Название договора"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Тип договора
              </label>
              <TeamsSelect
                value={formData.contractType}
                onChange={(value) => setFormData(prev => ({ ...prev, contractType: value }))}
                options={contractTypeOptions}
              />
            </div>
          </div>
        </div>

        {/* Финансовые условия */}
        <div>
          <h3 className="text-lg font-medium text-[#323130] mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Финансовые условия
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Арендная плата (₽/мес) <span className="text-red-500">*</span>
              </label>
              <TeamsInput
                name="monthlyRent"
                type="number"
                placeholder="0"
                value={formData.monthlyRent}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">
                Залог (₽)
              </label>
              <TeamsInput
                name="deposit"
                type="number"
                placeholder="0"
                value={formData.deposit}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="utilities"
                checked={formData.utilities}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-[#323130]">Включить коммунальные услуги в арендную плату</span>
            </label>
          </div>
        </div>

        {/* Дополнительные условия */}
        <div>
          <h3 className="text-lg font-medium text-[#323130] mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Дополнительные условия
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-[#323130] mb-1">
              Дополнительные пункты договора
            </label>
            <TeamsTextarea
              name="additionalTerms"
              placeholder="Введите дополнительные условия договора..."
              value={formData.additionalTerms}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

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
            disabled={loading || !selectedDeal}
          >
            {loading ? 'Создание...' : 'Создать договор'}
          </TeamsButton>
        </div>
      </form>
    </TeamsModal>
  )
} 