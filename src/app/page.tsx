'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Puzzle, ArrowRight, CheckCircle, TrendingUp, Shield, Users, Star, Zap } from 'lucide-react';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(1);

  const features = [
    {
      icon: '🧩',
      title: 'Мозайка модулей',
      description: 'Собери свой персональный workflow из 9 профессиональных модулей',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: '🔍',
      title: 'Банковский скоринг',
      description: 'Бесплатная проверка арендаторов через НБКИ и ФССП',
      color: 'from-green-500 to-blue-600'
    },
    {
      icon: '📝',
      title: 'Конструктор договоров',
      description: 'Автоматическое создание профессиональных договоров аренды',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: '🤖',
      title: 'ИИ-оптимизация',
      description: 'Искусственный интеллект улучшает контент и анализирует фото',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const modules = [
    {
      name: '📝 Конструктор договора',
      price: 'Бесплатно',
      description: 'Точка входа в экосистему'
    },
    {
      name: '🔍 Скоринг арендатора',
      price: 'Бесплатно',
      description: 'Банковский уровень проверки'
    },
    {
      name: '📋 Опись имущества',
      price: 'Бесплатно',
      description: 'ИИ-анализ фотографий'
    },
    {
      name: '✍️ Электронная подпись',
      price: '50₽',
      description: 'Безопасное подписание'
    },
    {
      name: '📤 Мультилистинг',
      price: '300₽',
      description: 'Размещение на площадках'
    },
    {
      name: '🛡️ Страховка аренды',
      price: '500₽',
      description: 'Защита имущества'
    }
  ];

  const personas = [
    {
      name: 'Процессник Анна',
      description: 'Контроль качества и профессиональный подход',
      modules: ['Договор', 'ПЭП', 'Скоринг', 'Опись'],
      revenue: '500₽/мес',
      ltv: '3.0х'
    },
    {
      name: 'Объемник Михаил',
      description: 'Масштабирование и рост бизнеса',
      modules: ['Мультилистинг', 'Яндекс Аренда', 'Оклад'],
      revenue: '12,300₽/мес',
      ltv: '27.7х'
    },
    {
      name: 'Имиджмейкер Елена',
      description: 'Премиум-сервис и высокие комиссии',
      modules: ['Скоринг', 'Страховка', 'Эскроу', 'ПЭП'],
      revenue: '11,200₽/мес',
      ltv: '16.8х'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">M²</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">M² - Аренда</h1>
                <p className="text-xs text-gray-400">Платформа для риелторов</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Возможности
              </Link>
              <Link href="#modules" className="text-gray-300 hover:text-white transition-colors">
                Модули
              </Link>
              <Link href="#personas" className="text-gray-300 hover:text-white transition-colors">
                Персоны
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Тарифы
              </Link>
            </nav>
            <div className="flex space-x-3">
              <Link 
                href="/login" 
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Войти
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all"
              >
                Начать бесплатно
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                Первая в России операционная система для риелторов
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  Собери свою сделку
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-4xl mx-auto">
                Единственная платформа, где риелтор конструирует персональный процесс аренды 
                из профессиональных модулей с ИИ-оптимизацией
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/mosaic" 
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Puzzle className="w-5 h-5" />
                  Попробовать мозайку
                </Link>
                <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-lg font-semibold transition-all flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Демо-версия
                </button>
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">9</div>
                <div className="text-gray-400">Модулей мозайки</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">0₽</div>
                <div className="text-gray-400">Вход в экосистему</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">18.9х</div>
                <div className="text-gray-400">LTV/CAC</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">1.1</div>
                <div className="text-gray-400">Месяц окупаемости</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Уникальные возможности</h2>
              <p className="text-xl text-gray-400">Технологии банковского уровня для риелторов</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 text-lg">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modules */}
        <section id="modules" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Мозайка из 9 модулей</h2>
              <p className="text-xl text-gray-400">Каждый модуль решает конкретную задачу риелтора</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{module.name}</h3>
                    <span className="text-green-400 font-medium">{module.price}</span>
                  </div>
                  <p className="text-gray-400 mb-4">{module.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4" />
                    <span>Готов к использованию</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personas */}
        <section id="personas" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Три генеральные персоны</h2>
              <p className="text-xl text-gray-400">Каждый риелтор найдет свой путь в экосистеме</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {personas.map((persona, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                    👤
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{persona.name}</h3>
                  <p className="text-gray-400 mb-6">{persona.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Модули:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {persona.modules.map((module, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                            {module}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                      <div>
                        <p className="text-sm text-gray-500">Выручка</p>
                        <p className="text-green-400 font-semibold">{persona.revenue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">LTV/CAC</p>
                        <p className="text-purple-400 font-semibold">{persona.ltv}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Готов стать частью экосистемы?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Присоединяйтесь к тысячам риелторов, которые уже используют M² для роста своего бизнеса
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
              >
                Начать бесплатно
              </Link>
              <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-lg font-semibold transition-all">
                Связаться с нами
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold">M²</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">M² - Аренда</h3>
                  <p className="text-sm text-gray-400">Платформа для риелторов</p>
                </div>
              </div>
              <p className="text-gray-400">
                Первая в России комплексная операционная система для риелторов
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Модули</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Интеграции</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Документация</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">О нас</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Блог</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Карьера</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Контакты</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Помощь</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Сообщество</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Статус</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Безопасность</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 M² - Аренда. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}