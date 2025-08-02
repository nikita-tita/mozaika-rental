'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Search, 
  ClipboardList, 
  FileSignature,
  ArrowRight,
  CheckCircle,
  Timer,
  TrendingUp,
  Users
} from 'lucide-react';

export default function HomePage() {
  const keyActions = [
    {
      icon: FileText,
      title: 'Создать договор',
      description: 'Профессиональный договор аренды за 2 минуты',
      href: '/mosaic',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Search,
      title: 'Проверить арендатора',
      description: 'Банковская проверка через НБКИ за 30 секунд',
      href: '/mosaic',
      color: 'from-green-500 to-blue-600'
    },
    {
      icon: ClipboardList,
      title: 'Сделать опись',
      description: 'ИИ-анализ фото и автоматическая опись имущества',
      href: '/mosaic',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: FileSignature,
      title: 'Подписать',
      description: 'Электронная подпись документов',
      href: '/mosaic',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const stats = [
    {
      icon: Users,
      value: '2,847',
      label: 'Активных риелторов'
    },
    {
      icon: TrendingUp,
      value: '8x',
      label: 'Среднее ускорение сделок'
    },
    {
      icon: CheckCircle,
      value: '99.7%',
      label: 'Точность проверки'
    },
    {
      icon: Timer,
      value: '30 сек',
      label: 'Время скоринга'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#00ff88] to-[#007fff] bg-clip-text text-transparent">
            Упростите работу риелтора
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Автоматизируйте рутинные задачи: договоры, скоринг, опись имущества
          </p>

          {/* Key Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {keyActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group bg-[#2d2d2d] rounded-xl p-6 hover:bg-[#3d3d3d] transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/register" 
              className="bg-gradient-to-r from-[#00ff88] to-[#007fff] text-black font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Начать бесплатно
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/mosaic" 
              className="border border-gray-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Попробовать демо
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-[#2d2d2d] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-[#00ff88]" />
                </div>
                <div className="text-2xl font-bold text-[#00ff88] mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-[#2d2d2d]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00ff88] to-[#007fff] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Зарегистрируйтесь</h3>
              <p className="text-gray-400">Создайте аккаунт риелтора за 2 минуты</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00ff88] to-[#007fff] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Выберите модуль</h3>
              <p className="text-gray-400">Скоринг, договоры, опись или подписи</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00ff88] to-[#007fff] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Получите результат</h3>
              <p className="text-gray-400">Скачайте документы и отправьте клиенту</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Готовы упростить работу?</h2>
          <p className="text-gray-300 mb-8">
            Присоединяйтесь к 2,847 риелторам, которые уже используют М² для автоматизации
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="bg-gradient-to-r from-[#00ff88] to-[#007fff] text-black font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Начать бесплатно
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/mosaic" 
              className="border border-gray-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Попробовать демо
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm mt-6">
            Без регистрации • Без карты • Без обязательств
          </p>
        </div>
      </section>
    </div>
  );
}