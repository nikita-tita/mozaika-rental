'use client';

import React, { useState } from 'react';
import { 
  Puzzle, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Star, 
  TrendingUp, 
  Users, 
  Shield,
  FileText,
  Search,
  ClipboardList,
  FileSignature,
  Globe,
  Shield as ShieldIcon,
  CreditCard,
  Zap
} from 'lucide-react';
import ContractBuilder from './ContractBuilder';
import TenantScoring from './TenantScoring';
import PropertyInventory from './PropertyInventory';
import DigitalSignature from './DigitalSignature';
import Multilisting from './Multilisting';

interface MosaicModule {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  price: number;
  status: 'available' | 'completed' | 'locked';
  isRequired?: boolean;
  dependencies?: string[];
}

interface MosaicBuilderProps {
  onComplete: (workflow: any) => void;
}

export default function MosaicBuilder({ onComplete }: MosaicBuilderProps) {
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [workflowData, setWorkflowData] = useState<any>({});

  // Моковые данные для демонстрации
  const mockProperty = {
    id: '1',
    title: 'Двухкомнатная квартира в центре',
    description: 'Современная квартира с ремонтом',
    type: 'APARTMENT' as const,
    status: 'AVAILABLE' as const,
    address: 'ул. Ленина, 1',
    city: 'Москва',
    area: 65,
    rooms: 2,
    amenities: ['Wi-Fi', 'Мебель', 'Бытовая техника'],
    images: [],
    ownerId: '1',
    pricePerMonth: 0,
    deposit: 0,
    utilities: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockRealtor = {
    id: '1',
    email: 'realtor@example.com',
    firstName: 'Анна',
    lastName: 'Петрова',
    role: 'REALTOR' as const,
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Все доступные модули мозайки
  const mosaicModules: MosaicModule[] = [
    {
      id: 'contract',
      name: 'Конструктор договора',
      description: 'Создание профессионального договора аренды с автоматическим заполнением',
      icon: FileText,
      color: 'from-blue-500 to-purple-600',
      price: 0,
      status: 'available',
      isRequired: true
    },
    {
      id: 'scoring',
      name: 'Скоринг арендатора',
      description: 'Банковская проверка арендатора через НБКИ и ФССП',
      icon: Search,
      color: 'from-green-500 to-blue-600',
      price: 0,
      status: 'available',
      isRequired: true
    },
    {
      id: 'inventory',
      name: 'Опись имущества',
      description: 'ИИ-анализ фотографий и автоматическая генерация описи',
      icon: ClipboardList,
      color: 'from-purple-500 to-pink-600',
      price: 0,
      status: 'available'
    },
    {
      id: 'signature',
      name: 'Электронная подпись',
      description: 'Безопасное подписание документов через ЭЦП',
      icon: FileSignature,
      color: 'from-green-500 to-blue-600',
      price: 50,
      status: 'available',
      dependencies: ['contract']
    },
    {
      id: 'multilisting',
      name: 'Мультилистинг',
      description: 'ИИ-оптимизация и размещение на множественных площадках',
      icon: Globe,
      color: 'from-purple-500 to-pink-600',
      price: 300,
      status: 'available',
      dependencies: ['inventory']
    },
    {
      id: 'insurance',
      name: 'Страховка аренды',
      description: 'Страхование имущества и ответственности арендатора',
      icon: ShieldIcon,
      color: 'from-yellow-500 to-orange-600',
      price: 500,
      status: 'locked',
      dependencies: ['scoring']
    },
    {
      id: 'escrow',
      name: 'Безопасный залог',
      description: 'Эскроу-счет для безопасного хранения депозита',
      icon: CreditCard,
      color: 'from-red-500 to-pink-600',
      price: 650,
      status: 'locked',
      dependencies: ['scoring']
    },
    {
      id: 'salary',
      name: 'Оклад риелтора',
      description: 'Пассивный доход от аренды объекта',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      price: 4500,
      status: 'locked',
      dependencies: ['multilisting']
    },
    {
      id: 'yandex',
      name: 'Яндекс Аренда',
      description: 'Эксклюзивное партнерство с повышенной комиссией',
      icon: Zap,
      color: 'from-red-500 to-yellow-600',
      price: 18000,
      status: 'locked',
      dependencies: ['multilisting']
    }
  ];

  // Проверка доступности модуля
  const isModuleAvailable = (module: MosaicModule) => {
    if (module.status === 'locked') return false;
    if (!module.dependencies) return true;
    return module.dependencies.every(dep => completedModules.includes(dep));
  };

  // Получение статуса модуля
  const getModuleStatus = (module: MosaicModule) => {
    if (completedModules.includes(module.id)) return 'completed';
    if (isModuleAvailable(module)) return 'available';
    return 'locked';
  };

  // Завершение модуля
  const completeModule = (moduleId: string, data: any) => {
    setCompletedModules(prev => [...prev, moduleId]);
    setWorkflowData((prev: any) => ({ ...prev, [moduleId]: data }));
    setCurrentModule(null);
  };

  // Открытие модуля
  const openModule = (module: MosaicModule) => {
    if (isModuleAvailable(module)) {
      setCurrentModule(module.id);
    }
  };

  // Возврат к выбору модулей
  const backToMosaic = () => {
    setCurrentModule(null);
  };

  // Завершение workflow
  const finishWorkflow = () => {
    const totalCost = mosaicModules
      .filter(m => completedModules.includes(m.id))
      .reduce((sum, m) => sum + m.price, 0);

    const workflow = {
      modules: completedModules,
      data: workflowData,
      totalCost,
      completedAt: new Date()
    };

    onComplete(workflow);
  };

  // Рендер модуля
  const renderModule = () => {
    switch (currentModule) {
      case 'contract':
        return (
          <ContractBuilder
            property={mockProperty}
            realtor={mockRealtor}
            onContractGenerated={(data) => completeModule('contract', data)}
          />
        );
      case 'scoring':
        return (
          <TenantScoring
            onScoringComplete={(data) => completeModule('scoring', data)}
            onClose={backToMosaic}
          />
        );
      case 'inventory':
        return (
          <PropertyInventory
            onComplete={(data) => completeModule('inventory', data)}
            onBack={backToMosaic}
          />
        );
      case 'signature':
        return (
          <DigitalSignature
            documents={workflowData.contract ? [workflowData.contract] : []}
            onComplete={(data) => completeModule('signature', data)}
            onBack={backToMosaic}
          />
        );
      case 'multilisting':
        return (
          <Multilisting
            property={workflowData.inventory || {
              id: '1',
              title: 'Квартира для аренды',
              address: 'Москва, ул. Тверская, 1',
              price: 70000,
              rooms: 2,
              area: 65,
              floor: 5,
              totalFloors: 12,
              description: 'Уютная квартира в центре',
              photos: [],
              amenities: [],
              coordinates: { lat: 55.7558, lng: 37.6176 }
            }}
            onComplete={(data) => completeModule('multilisting', data)}
            onBack={backToMosaic}
          />
        );
      default:
        return null;
    }
  };

  // Если открыт модуль, показываем его
  if (currentModule) {
    return renderModule();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Puzzle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">🧩 Собери свою сделку</h1>
              <p className="text-gray-400">Выберите модули для создания персонального workflow</p>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-green-400">{completedModules.length}</p>
                  <p className="text-gray-400 text-sm">Завершено</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-yellow-400">{mosaicModules.length - completedModules.length}</p>
                  <p className="text-gray-400 text-sm">Доступно</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {mosaicModules
                      .filter(m => completedModules.includes(m.id))
                      .reduce((sum, m) => sum + m.price, 0)
                      .toLocaleString()}₽
                  </p>
                  <p className="text-gray-400 text-sm">Стоимость</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-purple-400">
                    {Math.round((completedModules.length / mosaicModules.length) * 100)}%
                  </p>
                  <p className="text-gray-400 text-sm">Прогресс</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Модули мозайки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mosaicModules.map((module) => {
            const status = getModuleStatus(module);
            const isAvailable = isModuleAvailable(module);
            
            return (
              <div
                key={module.id}
                className={`relative bg-gray-800 rounded-xl p-6 transition-all cursor-pointer ${
                  isAvailable 
                    ? 'hover:bg-gray-700 hover:transform hover:scale-105' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => openModule(module)}
              >
                {/* Статус */}
                <div className="absolute top-4 right-4">
                  {status === 'completed' && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {status === 'locked' && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Иконка и заголовок */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center`}>
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{module.name}</h3>
                    <p className="text-gray-400 text-sm">{module.description}</p>
                  </div>
                </div>

                {/* Цена и статус */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {module.price === 0 ? (
                      <span className="text-green-400 font-medium">Бесплатно</span>
                    ) : (
                      <span className="text-yellow-400 font-medium">{module.price.toLocaleString()}₽</span>
                    )}
                    {module.isRequired && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                        Обязательно
                      </span>
                    )}
                  </div>
                  
                  {isAvailable && (
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* Зависимости */}
                {module.dependencies && module.dependencies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm mb-2">Требует:</p>
                    <div className="flex flex-wrap gap-1">
                      {module.dependencies.map((dep) => {
                        const depModule = mosaicModules.find(m => m.id === dep);
                        const isCompleted = completedModules.includes(dep);
                        return (
                          <span
                            key={dep}
                            className={`px-2 py-1 rounded text-xs ${
                              isCompleted 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-gray-600 text-gray-400'
                            }`}
                          >
                            {depModule?.name.split(' ')[1] || dep}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Кнопки действий */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-gray-400">
            <p>Выберите модули для создания вашего персонального workflow</p>
            <p className="text-sm">Обязательные модули отмечены красным</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={finishWorkflow}
              disabled={completedModules.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Завершить сделку
            </button>
          </div>
        </div>

        {/* Подсказки */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h3 className="font-medium mb-4">💡 Рекомендуемые workflow</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-green-400 mb-2">🚀 Быстрая сделка</h4>
              <p className="text-sm text-gray-400 mb-3">Договор → Скоринг → Подпись</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Время: 30 мин</span>
                <span>•</span>
                <span>Стоимость: 50₽</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">📈 Масштабирование</h4>
              <p className="text-sm text-gray-400 mb-3">Все модули для роста бизнеса</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Время: 2 часа</span>
                <span>•</span>
                <span>Стоимость: 24,500₽</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-purple-400 mb-2">🛡️ Максимальная защита</h4>
              <p className="text-sm text-gray-400 mb-3">Скоринг → Страховка → Эскроу</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Время: 1 час</span>
                <span>•</span>
                <span>Стоимость: 1,150₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 