'use client'

import { useState, useEffect } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsInput, TeamsSelect } from '@/components/ui/teams'
import { Search, Globe, ExternalLink, CheckCircle, Clock, BarChart3, Settings } from 'lucide-react'

export default function MultilistingPage() {
  const [listings, setListings] = useState([
    {
      id: '1',
      property: '2-к квартира, ул. Ленина, 1',
      platforms: ['avito', 'cian', 'domclick'],
      status: 'ACTIVE',
      views: 245,
      contacts: 12,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      property: 'Офис, ул. Пушкина, 10',
      platforms: ['avito', 'cian'],
      status: 'DRAFT',
      views: 0,
      contacts: 0,
      createdAt: '2024-01-20'
    }
  ])
  const [properties, setProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProperties(data.data)
      })
  }, [])

  const platforms = [
    { value: 'avito', label: 'Авито', icon: '🏠' },
    { value: 'cian', label: 'ЦИАН', icon: '🏢' },
    { value: 'domclick', label: 'ДомКлик', icon: '🏘️' },
    { value: 'yandex', label: 'Яндекс.Недвижимость', icon: '🔍' },
    { value: 'realty', label: 'Realty.ru', icon: '📋' }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <TeamsBadge variant="success">Активно</TeamsBadge>
      case 'DRAFT':
        return <TeamsBadge variant="warning">Черновик</TeamsBadge>
      case 'PAUSED':
        return <TeamsBadge variant="info">Приостановлено</TeamsBadge>
      case 'EXPIRED':
        return <TeamsBadge variant="error">Истекло</TeamsBadge>
      default:
        return <TeamsBadge variant="default">Неизвестно</TeamsBadge>
    }
  }

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find(p => p.value === platform)
    return platformData?.icon || '🏠'
  }

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const totalViews = listings.reduce((sum, listing) => sum + listing.views, 0)
  const totalContacts = listings.reduce((sum, listing) => sum + listing.contacts, 0)
  const activeListings = listings.filter(l => l.status === 'ACTIVE').length

  return (
    <div className="min-h-screen bg-[#faf9f8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#323130] mb-4 flex items-center">
            <Search className="w-8 h-8 mr-3 text-[#0078d4]" />
            Мультилистинг
          </h1>
          <p className="text-lg text-[#605e5c]">
            Автоматическая публикация объектов на всех популярных площадках
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{listings.length}</div>
            <div className="text-gray-600">Всего объявлений</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{activeListings}</div>
            <div className="text-gray-600">Активных объявлений</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{totalViews}</div>
            <div className="text-gray-600">Всего просмотров</div>
          </TeamsCard>
          <TeamsCard className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{totalContacts}</div>
            <div className="text-gray-600">Обращений</div>
          </TeamsCard>
        </div>

        {/* Создание нового объявления */}
        <TeamsCard className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#323130] mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Новое объявление
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TeamsSelect
              label="Объект недвижимости"
              placeholder="Выберите объект из вашей базы"
              value={selectedProperty}
              onChange={e => setSelectedProperty(e.target.value)}
              options={properties.map((p: any) => ({ value: p.id, label: p.title }))}
            />
            <TeamsInput
              label="Заголовок объявления"
              placeholder="Привлекательный заголовок"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <TeamsInput
              label="Цена"
              placeholder="45000"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#323130] mb-2">
              Площадки для публикации
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {platforms.map((platform) => (
                <label key={platform.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedPlatforms.includes(platform.value)}
                    onChange={() => handlePlatformChange(platform.value)}
                  />
                  <span className="text-lg">{platform.icon}</span>
                  <span className="text-sm text-[#605e5c]">{platform.label}</span>
                </label>
              ))}
            </div>
          </div>
          <TeamsButton>
            <Globe className="w-4 h-4 mr-2" />
            Опубликовать на всех площадках
          </TeamsButton>
        </TeamsCard>

        {/* Список объявлений */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-[#323130]">Мои объявления</h2>
          
          {listings.map((listing) => (
            <TeamsCard key={listing.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-[#323130] mr-3">{listing.property}</h3>
                    {getStatusBadge(listing.status)}
                  </div>
                  <div className="text-sm text-[#605e5c] space-y-1">
                    <div>Площадки: {listing.platforms.map(p => getPlatformIcon(p)).join(' ')}</div>
                    <div>Просмотры: {listing.views} | Обращения: {listing.contacts}</div>
                    <div>Создано: {listing.createdAt}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <TeamsButton variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Просмотреть
                </TeamsButton>
                <TeamsButton variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Статистика
                </TeamsButton>
                <TeamsButton variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-1" />
                  Настройки
                </TeamsButton>
              </div>
            </TeamsCard>
          ))}
        </div>

        {/* Подключенные площадки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {platforms.map((platform) => (
            <TeamsCard key={platform.value} className="p-6 text-center">
              <div className="text-4xl mb-4">{platform.icon}</div>
              <h3 className="text-lg font-semibold text-[#323130] mb-2">{platform.label}</h3>
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm text-green-600">Подключено</span>
              </div>
              <div className="text-sm text-[#605e5c] mb-4">
                Автоматическая синхронизация объявлений
              </div>
              <TeamsButton variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Настройки
              </TeamsButton>
            </TeamsCard>
          ))}
        </div>

        {/* Преимущества */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TeamsCard className="p-6 text-center">
            <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#323130] mb-2">Одна публикация</h3>
            <p className="text-[#605e5c]">
              Создайте объявление один раз и оно автоматически появится на всех площадках
            </p>
          </TeamsCard>
          
          <TeamsCard className="p-6 text-center">
            <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#323130] mb-2">Единая статистика</h3>
            <p className="text-[#605e5c]">
              Получайте сводную статистику по всем площадкам в одном месте
            </p>
          </TeamsCard>
          
          <TeamsCard className="p-6 text-center">
            <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#323130] mb-2">Экономия времени</h3>
            <p className="text-[#605e5c]">
              Автоматическое обновление объявлений на всех площадках одновременно
            </p>
          </TeamsCard>
        </div>
      </div>
    </div>
  )
} 