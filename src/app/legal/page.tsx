'use client'

import { useState } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsInput, TeamsSelect, TeamsTextarea } from '@/components/ui/teams'
import { Shield, FileText, AlertTriangle, CheckCircle, Clock, Users, Scale } from 'lucide-react'

export default function LegalPage() {
  const [cases, setCases] = useState([
    {
      id: '1',
      title: 'Защита от недобросовестного арендатора',
      type: 'TENANT_PROTECTION',
      status: 'ACTIVE',
      priority: 'HIGH',
      description: 'Арендатор не оплачивает аренду в течение 3 месяцев',
      assignedTo: 'Юридический отдел',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Проверка договора аренды',
      type: 'CONTRACT_REVIEW',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      description: 'Проверка договора на соответствие законодательству',
      assignedTo: 'Юридический отдел',
      createdAt: '2024-01-10'
    }
  ])

  const caseTypes = [
    { value: 'TENANT_PROTECTION', label: 'Защита от арендатора' },
    { value: 'CONTRACT_REVIEW', label: 'Проверка договора' },
    { value: 'EVICTION', label: 'Выселение' },
    { value: 'DEBT_COLLECTION', label: 'Взыскание долгов' },
    { value: 'DISPUTE_RESOLUTION', label: 'Разрешение споров' }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <TeamsBadge variant="warning">В работе</TeamsBadge>
      case 'COMPLETED':
        return <TeamsBadge variant="success">Завершено</TeamsBadge>
      case 'PENDING':
        return <TeamsBadge variant="info">Ожидает</TeamsBadge>
      case 'CLOSED':
        return <TeamsBadge variant="default">Закрыто</TeamsBadge>
      default:
        return <TeamsBadge variant="default">Неизвестно</TeamsBadge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <TeamsBadge variant="error">Высокий</TeamsBadge>
      case 'MEDIUM':
        return <TeamsBadge variant="warning">Средний</TeamsBadge>
      case 'LOW':
        return <TeamsBadge variant="success">Низкий</TeamsBadge>
      default:
        return <TeamsBadge variant="default">Неизвестно</TeamsBadge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            Правовая защита
          </h1>
          <p className="text-lg text-gray-600">
            Юридическое сопровождение сделок и защита интересов арендодателей
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{cases.length}</div>
            <div className="text-gray-600">Всего дел</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {cases.filter(c => c.status === 'COMPLETED').length}
            </div>
            <div className="text-gray-600">Завершенных дел</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {cases.filter(c => c.status === 'ACTIVE').length}
            </div>
            <div className="text-gray-600">Активных дел</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
            <div className="text-gray-600">Успешных дел</div>
          </TeamsCard>
        </div>

        {/* Создание нового дела */}
        <TeamsCard className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Новое юридическое дело
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название дела
              </label>
              <TeamsInput
                placeholder="Краткое описание проблемы"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип дела
              </label>
              <TeamsSelect
                options={caseTypes}
                placeholder="Выберите тип"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Приоритет
              </label>
              <TeamsSelect
                options={[
                  { value: 'LOW', label: 'Низкий' },
                  { value: 'MEDIUM', label: 'Средний' },
                  { value: 'HIGH', label: 'Высокий' }
                ]}
                placeholder="Выберите приоритет"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Связанный объект
              </label>
              <TeamsInput
                placeholder="Адрес объекта недвижимости"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание проблемы
            </label>
            <TeamsTextarea
              placeholder="Подробное описание ситуации..."
              rows={3}
            />
          </div>
          <div className="mt-4">
            <TeamsButton>
              <Shield className="w-4 h-4 mr-2" />
              Создать дело
            </TeamsButton>
          </div>
        </TeamsCard>

        {/* Список дел */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Мои юридические дела</h2>
          
          {cases.map((case_) => (
            <TeamsCard key={case_.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-gray-900 mr-3">{case_.title}</h3>
                    {getPriorityBadge(case_.priority)}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Тип: {caseTypes.find(t => t.value === case_.type)?.label}</div>
                    <div>Описание: {case_.description}</div>
                    <div>Ответственный: {case_.assignedTo}</div>
                    <div>Создано: {case_.createdAt}</div>
                  </div>
                </div>
                <div className="ml-4">
                  {getStatusBadge(case_.status)}
                </div>
              </div>
              
              <div className="flex gap-2">
                <TeamsButton variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-1" />
                  Документы
                </TeamsButton>
                <TeamsButton variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-1" />
                  Консультация
                </TeamsButton>
                <TeamsButton variant="outline" size="sm">
                  <Clock className="w-4 h-4 mr-1" />
                  Статус
                </TeamsButton>
              </div>
            </TeamsCard>
          ))}
        </div>

        {/* Услуги */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TeamsCard className="p-6 text-center">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Защита интересов</h3>
            <p className="text-gray-600 mb-4">
              Полная юридическая защита ваших интересов в спорах с арендаторами
            </p>
            <TeamsButton variant="outline" size="sm">
              Подробнее
            </TeamsButton>
          </TeamsCard>
          
          <TeamsCard className="p-6 text-center">
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Проверка документов</h3>
            <p className="text-gray-600 mb-4">
              Юридическая экспертиза договоров и других документов
            </p>
            <TeamsButton variant="outline" size="sm">
              Подробнее
            </TeamsButton>
          </TeamsCard>
          
          <TeamsCard className="p-6 text-center">
            <Scale className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Судопроизводство</h3>
            <p className="text-gray-600 mb-4">
              Представительство в суде и ведение судебных дел
            </p>
            <TeamsButton variant="outline" size="sm">
              Подробнее
            </TeamsButton>
          </TeamsCard>
        </div>

        {/* Преимущества */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamsCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Наши преимущества</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-600">Опыт более 10 лет в сфере недвижимости</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-600">98% успешных дел</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-600">Бесплатная первичная консультация</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-600">Работаем по всей России</span>
              </div>
            </div>
          </TeamsCard>

          <TeamsCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Частые случаи</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-gray-600">Неоплата аренды</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-gray-600">Порча имущества</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-gray-600">Досрочное расторжение</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-gray-600">Споры по депозиту</span>
              </div>
            </div>
          </TeamsCard>
        </div>
      </div>
    </div>
  )
} 