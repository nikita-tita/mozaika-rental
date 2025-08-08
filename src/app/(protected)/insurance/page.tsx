'use client'

import { useState } from 'react'
import { 
  Shield, 
  Building2, 
  Users, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Star,
  Clock,
  Banknote,
  Phone,
  Calculator,
  Plus,
  List
} from 'lucide-react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsTabs } from '@/components/ui/teams'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import InsurancePolicyForm from '@/components/insurance/InsurancePolicyForm'
import InsurancePoliciesList from '@/components/insurance/InsurancePoliciesList'
import ExpiringPoliciesAlert from '@/components/insurance/ExpiringPoliciesAlert'

const insuranceTypes = [
  {
    id: 'property',
    title: 'Страхование имущества',
    description: 'Защита объектов недвижимости от повреждений, кражи и стихийных бедствий',
    icon: Building2,
    color: 'blue',
    features: [
      'Покрытие ущерба от пожара',
      'Защита от затопления',
      'Кража и грабеж',
      'Стихийные бедствия',
      'Вандализм'
    ],
    price: 'от 2,000 ₽/год',
    coverage: 'до 5,000,000 ₽'
  },
  {
    id: 'liability',
    title: 'Страхование ответственности',
    description: 'Защита от претензий арендаторов и третьих лиц',
    icon: Users,
    color: 'green',
    features: [
      'Ответственность перед арендаторами',
      'Повреждение имущества третьих лиц',
      'Медицинские расходы',
      'Юридическая защита',
      'Компенсация морального вреда'
    ],
    price: 'от 1,500 ₽/год',
    coverage: 'до 3,000,000 ₽'
  },
  {
    id: 'rental',
    title: 'Страхование арендных платежей',
    description: 'Защита от невыплаты арендной платы и связанных расходов',
    icon: CreditCard,
    color: 'purple',
    features: [
      'Невыплата арендной платы',
      'Расходы на выселение',
      'Потеря дохода',
      'Юридические услуги',
      'Восстановление имущества'
    ],
    price: 'от 3,000 ₽/год',
    coverage: 'до 12 месяцев аренды'
  },
  {
    id: 'legal',
    title: 'Юридическая защита',
    description: 'Покрытие расходов на юридические услуги при спорах с арендаторами',
    icon: FileText,
    color: 'orange',
    features: [
      'Консультации юристов',
      'Представительство в суде',
      'Составление документов',
      'Досудебное урегулирование',
      'Обжалование решений'
    ],
    price: 'от 5,000 ₽/год',
    coverage: 'до 500,000 ₽'
  }
]

const benefits = [
  {
    icon: Shield,
    title: 'Надежная защита',
    description: 'Покрытие всех основных рисков арендодателя'
  },
  {
    icon: Clock,
    title: 'Быстрое оформление',
    description: 'Оформление полиса за 15 минут онлайн'
  },
  {
    icon: Banknote,
    title: 'Доступные цены',
    description: 'Конкурентные тарифы от ведущих страховщиков'
  },
  {
    icon: Star,
    title: 'Качественный сервис',
    description: 'Поддержка 24/7 и быстрое урегулирование убытков'
  }
]

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 border-blue-200 text-blue-700'
    case 'green':
      return 'bg-green-50 border-green-200 text-green-700'
    case 'purple':
      return 'bg-purple-50 border-purple-200 text-purple-700'
    case 'orange':
      return 'bg-orange-50 border-orange-200 text-orange-700'
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700'
  }
}

export default function InsurancePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showForm, setShowForm] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<any>(null)

  const handlePolicySuccess = (policy: any) => {
    setShowForm(false)
    setEditingPolicy(null)
    // Можно добавить уведомление об успехе
  }

  const handleEditPolicy = (policy: any) => {
    setEditingPolicy(policy)
    setShowForm(true)
    setActiveTab('form')
  }

  const handleDeletePolicy = (policyId: string) => {
    // Можно добавить уведомление об удалении
  }

  const handlePayPolicy = (policy: any) => {
    // Можно добавить уведомление об оплате
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Страхование недвижимости
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Комплексная защита ваших объектов недвижимости и интересов как арендодателя
            </p>
          </div>

          {/* Уведомления об истечении полисов */}
          <ExpiringPoliciesAlert />

          {/* Tabs */}
          <div className="mb-8">
            <TeamsTabs value={activeTab} onValueChange={setActiveTab}>
              <TeamsTabs.List>
                <TeamsTabs.Trigger value="overview" className="flex items-center">
                  <List className="w-4 h-4 mr-2" />
                  Обзор
                </TeamsTabs.Trigger>
                <TeamsTabs.Trigger value="policies" className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Мои полисы
                </TeamsTabs.Trigger>
                <TeamsTabs.Trigger value="form" className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Новый полис
                </TeamsTabs.Trigger>
              </TeamsTabs.List>
            </TeamsTabs>
          </div>

          {/* Tab Content */}
          <TeamsTabs.Content value="overview">
            {/* Benefits */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Почему стоит застраховаться?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <TeamsCard key={index} className="text-center p-6">
                      <div className="flex justify-center mb-4">
                        <Icon className="w-8 h-8 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </TeamsCard>
                  )
                })}
              </div>
            </div>

          {/* Insurance Types */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Виды страхования
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {insuranceTypes.map((type) => {
                const Icon = type.icon
                return (
                  <TeamsCard key={type.id} className="p-6">
                    <div className="flex items-start mb-4">
                      <div className={`w-12 h-12 ${getColorClasses(type.color)} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {type.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {type.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center text-green-600">
                            <Banknote className="w-4 h-4 mr-1" />
                            {type.price}
                          </div>
                          <div className="flex items-center text-blue-600">
                            <Shield className="w-4 h-4 mr-1" />
                            {type.coverage}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <TeamsButton className="w-full">
                      Оформить полис
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </TeamsButton>
                  </TeamsCard>
                )
              })}
            </div>
          </div>

          {/* How it works */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Как это работает?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Выберите тип страхования
                </h3>
                <p className="text-gray-600">
                  Определите, какие риски вы хотите застраховать
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Заполните анкету
                </h3>
                <p className="text-gray-600">
                  Укажите данные объекта и ваши контактные данные
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Получите полис
                </h3>
                <p className="text-gray-600">
                  Оплатите и получите страховой полис на email
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary-600 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Готовы застраховать свою недвижимость?
            </h2>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Получите консультацию специалиста и подберите оптимальный вариант страхования для ваших объектов
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TeamsButton size="lg" variant="secondary">
                Получить консультацию
                <Phone className="w-4 h-4 ml-2" />
              </TeamsButton>
              <TeamsButton size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                Рассчитать стоимость
                <Calculator className="w-4 h-4 ml-2" />
              </TeamsButton>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Часто задаваемые вопросы
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TeamsCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Что покрывает страхование имущества?
                </h3>
                <p className="text-gray-600">
                  Страхование имущества покрывает ущерб от пожара, затопления, кражи, стихийных бедствий и вандализма.
                </p>
              </TeamsCard>
              
              <TeamsCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Как быстро происходит выплата?
                </h3>
                <p className="text-gray-600">
                  Выплата производится в течение 5-15 рабочих дней после предоставления всех необходимых документов.
                </p>
              </TeamsCard>
              
              <TeamsCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Можно ли застраховать несколько объектов?
                </h3>
                <p className="text-gray-600">
                  Да, вы можете застраховать любое количество объектов недвижимости по одному полису.
                </p>
              </TeamsCard>
              
              <TeamsCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Что делать при наступлении страхового случая?
                </h3>
                <p className="text-gray-600">
                  Немедленно сообщите о происшествии в страховую компанию и зафиксируйте ущерб фотографиями.
                </p>
              </TeamsCard>
            </div>
          </div>
          </TeamsTabs.Content>

          {/* Мои полисы */}
          <TeamsTabs.Content value="policies">
            <InsurancePoliciesList
              onEdit={handleEditPolicy}
              onDelete={handleDeletePolicy}
              onPay={handlePayPolicy}
            />
          </TeamsTabs.Content>

          {/* Форма создания полиса */}
          <TeamsTabs.Content value="form">
            <InsurancePolicyForm
              onSuccess={handlePolicySuccess}
              onCancel={() => setActiveTab('policies')}
              initialData={editingPolicy}
            />
          </TeamsTabs.Content>
        </div>
      </div>
    </ProtectedRoute>
  )
} 