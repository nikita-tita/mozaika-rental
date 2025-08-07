'use client'

import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Shield, 
  Zap, 
  CheckCircle,
  Star,
  Award,
  Target,
  BarChart3,
  Headphones,
  Camera,
  FileText
} from 'lucide-react'
import { TeamsCard, TeamsButton, TeamsBadge } from '@/components/ui/teams'

const advantages = [
  {
    icon: TrendingUp,
    title: 'Увеличение дохода',
    description: 'Получайте 72.5% от первого арендного платежа за каждый переданный лид',
    highlight: '72.5% комиссия'
  },
  {
    icon: Clock,
    title: 'Экономия времени',
    description: 'Яндекс берет на себя весь процесс: от звонка до заселения арендатора',
    highlight: 'Автоматизация'
  },
  {
    icon: Users,
    title: 'Качественные клиенты',
    description: 'Проверенные арендаторы с Яндекс.Аренда с полной документацией',
    highlight: 'Проверенные клиенты'
  },
  {
    icon: Shield,
    title: 'Безопасность сделок',
    description: 'Все договоры заключаются через официальную платформу Яндекс.Аренда',
    highlight: 'Защищенные сделки'
  }
]

export default function ProgramInfo() {
  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Программа сотрудничества с Яндекс.Аренда
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Уникальное предложение для агентов M²: повышенная комиссия и полная автоматизация процесса
        </p>
        <div className="mt-4">
          <TeamsBadge variant="warning" className="text-lg px-4 py-2">
            <Award className="w-4 h-4 mr-2" />
            Эксклюзивное предложение
          </TeamsBadge>
        </div>
      </div>

      {/* Преимущества */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Преимущества программы
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            return (
              <TeamsCard key={index} className="p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {advantage.title}
                      </h3>
                      <TeamsBadge variant="success" className="text-xs">
                        {advantage.highlight}
                      </TeamsBadge>
                    </div>
                    <p className="text-gray-600">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              </TeamsCard>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Готовы начать зарабатывать больше?
        </h2>
        <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
          Присоединяйтесь к программе M² × Яндекс.Аренда и получайте повышенную комиссию 
          при полной автоматизации процесса
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <TeamsButton size="lg" variant="secondary">
            Передать первый контакт
            <Zap className="w-4 h-4 ml-2" />
          </TeamsButton>
          <TeamsButton size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
            Посмотреть ленту лидов
            <BarChart3 className="w-4 h-4 ml-2" />
          </TeamsButton>
        </div>
      </div>
    </div>
  )
} 