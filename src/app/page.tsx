'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Building2, 
  FileText, 
  Shield, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Star,
  Zap,
  BarChart3,
  Target,
  Award,
  Clock,
  Home,
  CreditCard,
  FileCheck,
  Smartphone,
  Play,
  X,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Timer,
  UserCheck,
  FileSignature,
  Upload,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  MapPin,
  AlertTriangle,
  Globe
} from 'lucide-react';

export default function HomePage() {
  const [activeDemo, setActiveDemo] = useState('scoring');
  const [activeStory, setActiveStory] = useState(0);

  const problems = [
    {
      icon: AlertTriangle,
      text: 'Клиенты не доверяют договору из интернета',
      color: 'text-red-500'
    },
    {
      icon: UserCheck,
      text: 'Проверка арендатора = гадание на кофейной гуще',
      color: 'text-red-500'
    },
    {
      icon: Clock,
      text: '3 часа на размещение одного объявления',
      color: 'text-red-500'
    },
    {
      icon: DollarSign,
      text: 'Доход только от новых сделок',
      color: 'text-red-500'
    },
    {
      icon: Target,
      text: 'Конкуренты демпингуют и предлагают то же самое',
      color: 'text-red-500'
    }
  ];

  const solutions = [
    {
      icon: Shield,
      text: 'Банковская проверка арендатора за 30 сек',
      color: 'text-green-500'
    },
    {
      icon: FileText,
      text: 'Договор генерируется за 2 минуты',
      color: 'text-green-500'
    },
    {
      icon: Globe,
      text: 'Размещение на 5 площадках одной кнопкой',
      color: 'text-green-500'
    },
    {
      icon: BarChart3,
      text: 'Превратите разовые сделки в пассивный доход',
      color: 'text-green-500'
    },
    {
      icon: Zap,
      text: 'Технологии которых нет ни у кого',
      color: 'text-green-500'
    }
  ];

  const demoTabs = [
    {
      id: 'scoring',
      title: 'Скоринг за 30 секунд',
      description: 'Банковская проверка арендатора',
      time: '30 сек',
      income: '+15,000₽',
      icon: UserCheck
    },
    {
      id: 'contract',
      title: 'Договор за 2 минуты',
      description: 'ИИ-генерация с юридической проверкой',
      time: '2 мин',
      income: '+25,000₽',
      icon: FileText
    },
    {
      id: 'listing',
      title: 'Размещение на 5 площадках',
      description: 'Автопостинг и синхронизация',
      time: '5 мин',
      income: '+20,000₽',
      icon: Upload
    },
    {
      id: 'signature',
      title: 'Подписание за 5 минут',
      description: 'Электронная подпись с SMS',
      time: '5 мин',
      income: '+5,000₽',
      icon: FileSignature
    }
  ];

  const successStories = [
    {
      name: 'Анна',
      city: 'Москва',
      avatar: '👩‍💼',
      before: {
        time: '8 часов на сделку',
        problem: 'Клиенты сомневались в договорах',
        income: '45,000₽/мес'
      },
      after: {
        time: '2.5 часа на сделку',
        result: 'Банковская проверка впечатляет всех',
        income: '127,000₽/мес'
      },
      quote: 'Клиенты теперь сами просят показать проверку!',
      video: 'Смотреть отзыв (60 сек)',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Михаил',
      city: 'Санкт-Петербург',
      avatar: '👨‍💻',
      before: {
        time: '12 часов в день',
        problem: '15 объектов, постоянный стресс',
        income: '180,000₽/мес'
      },
      after: {
        time: '6 часов в день',
        result: '40 объектов, 500к пассивного дохода',
        income: '680,000₽/мес'
      },
      quote: 'Автоматизация освободила время для семьи',
      video: 'Смотреть кейс (90 сек)',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Елена',
      city: 'Екатеринбург',
      avatar: '👩‍🎨',
      before: {
        time: 'Неделя на сделку',
        problem: 'Потеря клиентов из-за долгих проверок',
        income: '85,000₽/мес'
      },
      after: {
        time: '3 дня на сделку',
        result: 'Закрыла сделку на 5млн₽',
        income: '320,000₽/мес'
      },
      quote: 'Впервые вижу такой профессионализм!',
      video: 'Скриншот переписки',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { number: '₽127,000,000', label: 'Заработано риелторами за месяц', icon: DollarSign },
    { number: '8x', label: 'Среднее ускорение сделок', icon: Zap },
    { number: '2,847', label: 'Активных риелторов', icon: Users },
    { number: '99.7%', label: 'Точность проверки арендаторов', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-5xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium mb-8">
                <Timer className="w-4 h-4" />
                Хватит терять 60% времени на бумажки
              </div>

              {/* Краткое руководство */}
              <div className="bg-white rounded-2xl p-6 mb-8 border border-primary-200">
                <h3 className="text-lg font-semibold mb-4 text-center">Как пользоваться сервисом</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-brand-600 font-semibold text-xs">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-primary-900">Зарегистрируйтесь</p>
                      <p className="text-primary-600">Создайте аккаунт риелтора за 2 минуты</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-brand-600 font-semibold text-xs">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-primary-900">Выберите модуль</p>
                      <p className="text-primary-600">Скоринг, договоры, опись или подписи</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-brand-600 font-semibold text-xs">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-primary-900">Получите результат</p>
                      <p className="text-primary-600">Скачайте документы и отправьте клиенту</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-balance">
                <span className="gradient-text">Упростите работу</span><br />
                <span className="text-gray-900">и увеличьте доход на 40%</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto text-balance">
                2,847 риелторов уже используют М² для автоматизации рутинных задач:<br />
                банковский скоринг, автодоговоры, цифровые подписи
              </p>

              {/* Video Demo */}
              <div className="relative max-w-2xl mx-auto mb-12">
                <div className="bg-gradient-to-br from-brand-600 to-accent-600 rounded-2xl p-1">
                  <div className="bg-white rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-brand-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Смотрите как Анна закрыла сделку за 3 дня вместо 2 недель</h3>
                    <p className="text-gray-600 mb-3">30 секунд демонстрации</p>
                    <p className="text-sm text-gray-500">
                      Вы увидите: банковскую проверку арендатора, генерацию договора, 
                      электронную подпись и размещение объявления на 5 площадках
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/mosaic" 
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Попробовать технологии
                </Link>
                <button className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Смотреть полное демо
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="card-hover text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-brand-600" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary-900 mb-2">{stat.number}</div>
                  <div className="text-primary-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problems & Solutions */}
        <section id="problems" className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Problems */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4 text-red-600">ВАС ДОСТАЛО?</h2>
                  <p className="text-xl text-primary-600">Знакомые проблемы риелторов</p>
                </div>
                
                <div className="space-y-4">
                  {problems.map((problem, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-red-50 rounded-xl">
                      <problem.icon className={`w-6 h-6 mt-1 ${problem.color}`} />
                      <p className="text-primary-700 font-medium">{problem.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solutions */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4 text-green-600">М² РЕШАЕТ ЭТО ЗА СЕКУНДЫ</h2>
                  <p className="text-xl text-primary-600">Технологии которые работают</p>
                </div>
                
                <div className="space-y-4">
                  {solutions.map((solution, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                      <solution.icon className={`w-6 h-6 mt-1 ${solution.color}`} />
                      <p className="text-primary-700 font-medium">{solution.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section id="demo" className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">ПОСМОТРИТЕ КАК ЭТО РАБОТАЕТ</h2>
              <p className="text-xl text-primary-600 max-w-3xl mx-auto">
                Интерактивная демонстрация технологий М²
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {/* Demo Tabs */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {demoTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDemo(tab.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeDemo === tab.id
                        ? 'bg-brand-600 text-white shadow-medium'
                        : 'bg-white text-primary-700 border border-primary-200 hover:bg-primary-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="w-4 h-4" />
                      {tab.title}
                    </div>
                  </button>
                ))}
              </div>

              {/* Demo Content */}
              <div className="card-hover">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Demo Animation */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-primary-50 to-brand-50 rounded-2xl p-8 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Play className="w-8 h-8 text-brand-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {demoTabs.find(tab => tab.id === activeDemo)?.title}
                        </h3>
                        <p className="text-primary-600">
                          {demoTabs.find(tab => tab.id === activeDemo)?.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Demo Stats */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold mb-4">Результат</h4>
                      
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 border border-primary-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-primary-600">Сэкономленное время:</span>
                            <Timer className="w-4 h-4 text-brand-600" />
                          </div>
                          <div className="text-2xl font-bold text-primary-900">
                            {demoTabs.find(tab => tab.id === activeDemo)?.time}
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-primary-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-primary-600">Дополнительный доход:</span>
                            <DollarSign className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {demoTabs.find(tab => tab.id === activeDemo)?.income}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section id="stories" className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">ИСТОРИИ УСПЕХА</h2>
              <p className="text-xl text-primary-600 max-w-3xl mx-auto">
                Реальные риелторы, которые изменили свой бизнес с М²
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              {/* Story Navigation */}
              <div className="flex justify-center mb-8">
                <div className="flex space-x-2">
                  {successStories.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStory(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        activeStory === index ? 'bg-brand-600' : 'bg-primary-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Story Content */}
              <div className="card-hover">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Story Info */}
                  <div>
                    <div className={`w-20 h-20 bg-gradient-to-br ${successStories[activeStory].color} rounded-2xl flex items-center justify-center text-3xl mb-6`}>
                      {successStories[activeStory].avatar}
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-2">
                      {successStories[activeStory].name}
                    </h3>
                    <p className="text-brand-600 font-medium mb-6">
                      {successStories[activeStory].city}
                    </p>

                    <div className="space-y-6">
                      {/* Before */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 text-red-600">Было:</h4>
                        <div className="space-y-2 text-primary-600">
                          <p><Clock className="w-4 h-4 inline mr-2" />{successStories[activeStory].before.time}</p>
                          <p><AlertTriangle className="w-4 h-4 inline mr-2" />{successStories[activeStory].before.problem}</p>
                          <p><DollarSign className="w-4 h-4 inline mr-2" />{successStories[activeStory].before.income}</p>
                        </div>
                      </div>

                      {/* After */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 text-green-600">Стало:</h4>
                        <div className="space-y-2 text-primary-600">
                          <p><Zap className="w-4 h-4 inline mr-2" />{successStories[activeStory].after.time}</p>
                          <p><CheckCircle className="w-4 h-4 inline mr-2" />{successStories[activeStory].after.result}</p>
                          <p><DollarSign className="w-4 h-4 inline mr-2" />{successStories[activeStory].after.income}</p>
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="bg-primary-50 rounded-xl p-4">
                        <p className="text-primary-700 italic">
                          &ldquo;{successStories[activeStory].quote}&rdquo;
                        </p>
                      </div>

                      <button className="btn-primary w-full">
                        {successStories[activeStory].video}
                      </button>
                    </div>
                  </div>

                  {/* Story Visual */}
                  <div className="bg-gradient-to-br from-primary-50 to-brand-50 rounded-2xl p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium">
                        <ThumbsUp className="w-12 h-12 text-green-600" />
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Результат</h4>
                      <p className="text-primary-600">
                        {activeStory === 0 && '+180% к доходу за 6 месяцев'}
                        {activeStory === 1 && '+280% к доходу за 8 месяцев'}
                        {activeStory === 2 && '+276% к доходу за 4 месяца'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="card-hover">
                              <h2 className="text-4xl md:text-5xl font-bold mb-6">ГОТОВЫ УПРОСТИТЬ РАБОТУ?</h2>
              <p className="text-xl text-primary-600 mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к 2,847 риелторам, которые уже используют М² для автоматизации
              </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/register" 
                    className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Начать бесплатно
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Получить консультацию
                  </button>
                </div>
                
                <div className="mt-8 text-sm text-primary-500">
                  <p><CheckCircle className="w-4 h-4 inline mr-1" />Без регистрации • <CheckCircle className="w-4 h-4 inline mr-1" />Без карты • <CheckCircle className="w-4 h-4 inline mr-1" />Без обязательств</p>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}