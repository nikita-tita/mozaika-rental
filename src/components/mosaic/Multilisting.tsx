'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Globe, TrendingUp, Target, CheckCircle, Clock, Eye, Edit3, Share2, BarChart3 } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  rooms: number;
  area: number;
  floor: number;
  totalFloors: number;
  description: string;
  photos: string[];
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: 'pending' | 'published' | 'error';
  views: number;
  contacts: number;
  publishedAt?: Date;
  listingUrl?: string;
  commission: number;
}

interface MultilistingProps {
  property: Property;
  onComplete: (publishedListings: Platform[]) => void;
  onBack: () => void;
}

export default function Multilisting({ property, onComplete, onBack }: MultilistingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState({
    title: property.title,
    description: property.description,
    tags: [] as string[],
    highlights: [] as string[]
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedListings, setPublishedListings] = useState<Platform[]>([]);

  // Доступные площадки
  const availablePlatforms: Platform[] = [
    {
      id: 'avito',
      name: 'Avito',
      icon: '🏠',
      color: 'bg-orange-500',
      status: 'pending',
      views: 0,
      contacts: 0,
      commission: 0
    },
    {
      id: 'cian',
      name: 'ЦИАН',
      icon: '🏢',
      color: 'bg-blue-500',
      status: 'pending',
      views: 0,
      contacts: 0,
      commission: 0
    },
    {
      id: 'domclick',
      name: 'ДомКлик',
      icon: '🏦',
      color: 'bg-green-500',
      status: 'pending',
      views: 0,
      contacts: 0,
      commission: 0
    },
    {
      id: 'yandex',
      name: 'Яндекс.Недвижимость',
      icon: '🔍',
      color: 'bg-red-500',
      status: 'pending',
      views: 0,
      contacts: 0,
      commission: 0
    },
    {
      id: 'realty',
      name: 'Realty',
      icon: '📊',
      color: 'bg-purple-500',
      status: 'pending',
      views: 0,
      contacts: 0,
      commission: 0
    }
  ];

  // ИИ-оптимизация контента
  const optimizeContent = useCallback(async () => {
    setIsOptimizing(true);
    
    // Имитация ИИ-оптимизации
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const optimized = {
      title: `Светлая ${property.rooms}-комнатная квартира в центре, ${property.area}м²`,
      description: `Отличная ${property.rooms}-комнатная квартира ${property.area}м² на ${property.floor}/${property.totalFloors} этаже в престижном районе. Квартира полностью готова к заселению, есть вся необходимая мебель и техника. Отличная транспортная доступность, рядом метро, магазины, школы и детские сады. Идеально подходит для семьи или командированных специалистов.`,
      tags: ['Светлая', 'Ремонт', 'Мебель', 'Техника', 'Метро', 'Центр'],
      highlights: [
        `Светлая ${property.rooms}-комнатная квартира`,
        `${property.area}м², ${property.floor}/${property.totalFloors} этаж`,
        'Полностью меблированная',
        'Вся техника в наличии',
        'Отличная транспортная доступность',
        'Рядом метро, магазины, школы'
      ]
    };
    
    setOptimizedContent(optimized);
    setIsOptimizing(false);
    setCurrentStep(2);
  }, [property]);

  // Публикация на площадках
  const publishListings = useCallback(async () => {
    setIsPublishing(true);
    
    const platformsToPublish = availablePlatforms.filter(p => selectedPlatforms.includes(p.id));
    
    // Имитация публикации на каждой площадке
    for (let i = 0; i < platformsToPublish.length; i++) {
      const platform = platformsToPublish[i];
      
      // Имитация времени публикации
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const publishedPlatform = {
        ...platform,
        status: 'published' as const,
        publishedAt: new Date(),
        listingUrl: `https://${platform.id}.ru/listing/${Math.random().toString(36).substr(2, 9)}`,
        views: Math.floor(Math.random() * 50) + 10,
        contacts: Math.floor(Math.random() * 8) + 2
      };
      
      setPublishedListings(prev => [...prev, publishedPlatform]);
    }
    
    setIsPublishing(false);
    setCurrentStep(3);
  }, [selectedPlatforms]);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'error': return <Eye className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Опубликовано';
      case 'pending': return 'Ожидает';
      case 'error': return 'Ошибка';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">📤 Мультилистинг</h1>
              <p className="text-gray-400">ИИ-оптимизация и размещение на множественных площадках</p>
            </div>
          </div>
          
          {/* Прогресс */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 rounded ${
              currentStep >= 2 ? 'bg-green-500' : 'bg-gray-700'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 rounded ${
              currentStep >= 3 ? 'bg-green-500' : 'bg-gray-700'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Шаг 1: ИИ-оптимизация контента */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">ИИ-оптимизация контента</h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">300₽</div>
                  <div className="text-sm text-gray-400">за объект</div>
                </div>
              </div>

              {/* Информация об объекте */}
              <div className="bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="font-medium mb-4">Объект для размещения</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Адрес</p>
                    <p className="font-medium">{property.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Цена</p>
                    <p className="font-medium text-green-400">{property.price.toLocaleString()} ₽/мес</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Комнаты</p>
                    <p className="font-medium">{property.rooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Площадь</p>
                    <p className="font-medium">{property.area}м²</p>
                  </div>
                </div>
              </div>

              {/* Текущий контент */}
              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Текущий контент</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок</label>
                  <input
                    type="text"
                    value={property.title}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <textarea
                    value={property.description}
                    readOnly
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-300"
                  />
                </div>
              </div>

              {/* ИИ-оптимизация */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">ИИ-оптимизация</h3>
                    <p className="text-gray-400 text-sm">Улучшение контента для максимального отклика</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>SEO-оптимизация заголовка</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Улучшение описания</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Подбор ключевых слов</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Анализ конкурентов</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={optimizeContent}
                  disabled={isOptimizing}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isOptimizing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Оптимизируем...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      Оптимизировать контент
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 2: Выбор площадок */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Выберите площадки для размещения</h2>

              {/* Оптимизированный контент */}
              <div className="bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="font-medium mb-4">Оптимизированный контент</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Заголовок</label>
                    <input
                      type="text"
                      value={optimizedContent.title}
                      onChange={(e) => setOptimizedContent({...optimizedContent, title: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Описание</label>
                    <textarea
                      value={optimizedContent.description}
                      onChange={(e) => setOptimizedContent({...optimizedContent, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Ключевые слова</label>
                    <div className="flex flex-wrap gap-2">
                      {optimizedContent.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Основные преимущества</label>
                    <div className="space-y-2">
                      {optimizedContent.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Площадки */}
              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Доступные площадки</h3>
                
                <div className="grid gap-4">
                  {availablePlatforms.map((platform) => (
                    <label key={platform.id} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={() => togglePlatform(platform.id)}
                        className="w-4 h-4 text-green-500"
                      />
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white`}>
                          <span className="text-lg">{platform.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium">{platform.name}</p>
                          <p className="text-gray-400 text-sm">Бесплатное размещение</p>
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-green-400 font-medium">0₽</p>
                        <p className="text-gray-400 text-xs">Комиссия</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={publishListings}
                  disabled={selectedPlatforms.length === 0 || isPublishing}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isPublishing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Публикуем...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Разместить на {selectedPlatforms.length} площадках
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 3: Результаты публикации */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Результаты публикации</h2>

              <div className="grid gap-4 mb-6">
                {publishedListings.map((platform) => (
                  <div key={platform.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center text-white`}>
                          <span className="text-xl">{platform.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{platform.name}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={`flex items-center gap-1 text-sm ${getStatusColor(platform.status)}`}>
                              {getStatusIcon(platform.status)}
                              {getStatusText(platform.status)}
                            </span>
                            {platform.publishedAt && (
                              <span className="text-gray-400 text-sm">
                                {platform.publishedAt.toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-400">Просмотры</p>
                            <p className="font-medium text-blue-400">{platform.views}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Контакты</p>
                            <p className="font-medium text-green-400">{platform.contacts}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {platform.listingUrl && (
                          <button
                            onClick={() => window.open(platform.listingUrl, '_blank')}
                            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                            title="Открыть объявление"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Статистика */}
              <div className="bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="font-medium mb-4">Общая статистика</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Площадок</p>
                    <p className="text-2xl font-bold text-blue-400">{publishedListings.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Просмотров</p>
                    <p className="text-2xl font-bold text-green-400">
                      {publishedListings.reduce((sum, p) => sum + p.views, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Контактов</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {publishedListings.reduce((sum, p) => sum + p.contacts, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">CTR</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {publishedListings.length > 0 
                        ? Math.round((publishedListings.reduce((sum, p) => sum + p.contacts, 0) / 
                           publishedListings.reduce((sum, p) => sum + p.views, 0)) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={() => onComplete(publishedListings)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Завершить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 