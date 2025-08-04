'use client'

import { useState } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsInput, TeamsSelect } from '@/components/ui/teams'
import { UserCheck, Search, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react'

export default function ScoringPage() {
  const [searchData, setSearchData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    passport: '',
    phone: '',
    email: ''
  })
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)

  const handleSearch = async () => {
    setSearching(true)
    // Имитация API запроса
    setTimeout(() => {
      const mockResult = {
        score: Math.floor(Math.random() * 100) + 1,
        status: Math.random() > 0.3 ? 'APPROVED' : 'REJECTED',
        details: {
          creditHistory: Math.random() > 0.2,
          courtCases: Math.random() > 0.8,
          debts: Math.random() > 0.7,
          income: Math.floor(Math.random() * 200000) + 50000
        },
        recommendations: [
          'Клиент имеет положительную кредитную историю',
          'Нет задолженностей по налогам',
          'Достаточный уровень дохода для аренды'
        ]
      }
      setResult(mockResult)
      setSearching(false)
    }, 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <TeamsBadge variant="success">Отлично</TeamsBadge>
    if (score >= 60) return <TeamsBadge variant="warning">Хорошо</TeamsBadge>
    return <TeamsBadge variant="error">Плохо</TeamsBadge>
  }

  const handleCreateContract = () => {
    // Подготавливаем данные для создания договора
    const contractData = {
      propertyTitle: 'Объект недвижимости',
      propertyAddress: 'Адрес объекта',
      landlordName: 'Наймодатель',
      landlordPassport: 'Паспорт наймодателя',
      tenantName: `${searchData.lastName} ${searchData.firstName} ${searchData.middleName}`.trim(),
      tenantPassport: searchData.passport,
      tenantPhone: searchData.phone,
      tenantEmail: searchData.email,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      monthlyRent: result.details.income * 0.3, // 30% от дохода
      deposit: result.details.income * 0.3,
      utilities: true,
      additionalTerms: `Скоринговый балл: ${result.score}. Рекомендация: ${result.status === 'APPROVED' ? 'Одобрен' : 'Отклонен'}`
    }

    // Сохраняем данные в localStorage для передачи на страницу договоров
    localStorage.setItem('scoringContractData', JSON.stringify(contractData))
    
    // Перенаправляем на страницу договоров
    window.location.href = '/contracts'
  }

  const handleSaveResult = async () => {
    setSaving(true)
    try {
      // Имитация сохранения результата
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Сохраняем результат в localStorage
      const savedResults = JSON.parse(localStorage.getItem('scoringResults') || '[]')
      const newResult = {
        id: Date.now(),
        date: new Date().toISOString(),
        tenantData: searchData,
        scoringResult: result
      }
      savedResults.push(newResult)
      localStorage.setItem('scoringResults', JSON.stringify(savedResults))
      
      alert('Результат скоринга успешно сохранен!')
    } catch (error) {
      console.error('Ошибка при сохранении:', error)
      alert('Ошибка при сохранении результата')
    } finally {
      setSaving(false)
    }
  }

  const handleSendReport = async () => {
    setSending(true)
    try {
      // Имитация отправки отчета
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Создаем отчет
      const report = {
        date: new Date().toISOString(),
        tenant: `${searchData.lastName} ${searchData.firstName} ${searchData.middleName}`.trim(),
        passport: searchData.passport,
        phone: searchData.phone,
        email: searchData.email,
        score: result.score,
        status: result.status,
        details: result.details,
        recommendations: result.recommendations
      }
      
      // Создаем и скачиваем отчет
      const reportText = `
ОТЧЕТ ПО СКОРИНГУ АРЕНДАТОРА

Дата проверки: ${new Date().toLocaleDateString('ru-RU')}
Арендатор: ${report.tenant}
Паспорт: ${report.passport}
Телефон: ${report.phone}
Email: ${report.email}

РЕЗУЛЬТАТЫ ПРОВЕРКИ:
- Скоринговый балл: ${report.score}
- Статус: ${report.status === 'APPROVED' ? 'Одобрен' : 'Отклонен'}
- Средний доход: ${report.details.income.toLocaleString()} ₽

ПРОВЕРКИ:
- Кредитная история: ${report.details.creditHistory ? 'Положительная' : 'Отрицательная'}
- Судебные дела: ${report.details.courtCases ? 'Есть' : 'Нет'}
- Задолженности: ${report.details.debts ? 'Есть' : 'Нет'}

РЕКОМЕНДАЦИИ:
${report.recommendations.map(rec => `• ${rec}`).join('\n')}

Отчет сгенерирован системой М² для автоматизации документооборота.
      `
      
      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Скоринг_${searchData.lastName}_${searchData.firstName}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      alert('Отчет успешно отправлен и скачан!')
    } catch (error) {
      console.error('Ошибка при отправке отчета:', error)
      alert('Ошибка при отправке отчета')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <UserCheck className="w-8 h-8 mr-3 text-blue-600" />
            Скоринг арендаторов
          </h1>
          <p className="text-lg text-gray-600">
            Проверка платежеспособности и надежности потенциальных арендаторов через НБКИ и ФССП
          </p>
        </div>

        {/* Форма поиска */}
        <TeamsCard className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Поиск арендатора</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <TeamsInput
              label="Имя"
              value={searchData.firstName}
              onChange={(e) => setSearchData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="Введите имя"
            />
            <TeamsInput
              label="Фамилия"
              value={searchData.lastName}
              onChange={(e) => setSearchData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Введите фамилию"
            />
            <TeamsInput
              label="Отчество"
              value={searchData.middleName}
              onChange={(e) => setSearchData(prev => ({ ...prev, middleName: e.target.value }))}
              placeholder="Введите отчество"
            />
            <TeamsInput
              label="Паспорт"
              value={searchData.passport}
              onChange={(e) => setSearchData(prev => ({ ...prev, passport: e.target.value }))}
              placeholder="Серия и номер"
            />
            <TeamsInput
              label="Телефон"
              value={searchData.phone}
              onChange={(e) => setSearchData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+7 (999) 123-45-67"
            />
            <TeamsInput
              label="Email"
              value={searchData.email}
              onChange={(e) => setSearchData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
            />
          </div>
          <TeamsButton 
            onClick={handleSearch} 
            disabled={searching}
            className="w-full md:w-auto"
          >
            {searching ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Проверка...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Проверить арендатора
              </>
            )}
          </TeamsButton>
        </TeamsCard>

        {/* Результаты */}
        {result && (
          <div className="space-y-6">
            {/* Основной результат */}
            <TeamsCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Результат проверки</h2>
                {getScoreBadge(result.score)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(result.score)} mb-2`}>
                    {result.score}
                  </div>
                  <div className="text-gray-600">Скоринговый балл</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900 mb-2">
                    {result.details.income.toLocaleString()} ₽
                  </div>
                  <div className="text-gray-600">Средний доход</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900 mb-2">
                    {result.status === 'APPROVED' ? 'Одобрен' : 'Отклонен'}
                  </div>
                  <div className="text-gray-600">Рекомендация</div>
                </div>
              </div>
            </TeamsCard>

            {/* Детали проверки */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TeamsCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Проверки</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Кредитная история</span>
                    {result.details.creditHistory ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Судебные дела</span>
                    {!result.details.courtCases ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Задолженности</span>
                    {!result.details.debts ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </div>
              </TeamsCard>

              <TeamsCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Рекомендации</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{rec}</span>
                    </div>
                  ))}
                </div>
              </TeamsCard>
            </div>

            {/* Действия */}
            <TeamsCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Дальнейшие действия</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <TeamsButton 
                  variant="primary"
                  onClick={handleCreateContract}
                  disabled={result.status !== 'APPROVED'}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Создать договор
                </TeamsButton>
                <TeamsButton 
                  variant="outline"
                  onClick={handleSaveResult}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    'Сохранить результат'
                  )}
                </TeamsButton>
                <TeamsButton 
                  variant="outline"
                  onClick={handleSendReport}
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    'Отправить отчет'
                  )}
                </TeamsButton>
              </div>
              {result.status !== 'APPROVED' && (
                <p className="text-sm text-red-600 mt-2">
                  Договор можно создать только для одобренных арендаторов
                </p>
              )}
            </TeamsCard>
          </div>
        )}

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
            <div className="text-gray-600">Проверок за месяц</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">99.7%</div>
            <div className="text-gray-600">Точность проверки</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">2.3с</div>
            <div className="text-gray-600">Среднее время проверки</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">85%</div>
            <div className="text-gray-600">Одобренных арендаторов</div>
          </TeamsCard>
        </div>
      </div>
    </div>
  )
} 