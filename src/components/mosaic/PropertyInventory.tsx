'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Trash2, Eye, Edit3, CheckCircle, AlertCircle } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  estimatedValue: number;
  category: string;
  description: string;
  confidence: number;
  photoUrl?: string;
}

interface PropertyInventoryProps {
  onComplete: (inventory: InventoryItem[]) => void;
  onBack: () => void;
}

export default function PropertyInventory({ onComplete, onBack }: PropertyInventoryProps) {
  const [step, setStep] = useState(1);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // ИИ-анализ фотографий
  const analyzePhotos = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Имитация ИИ-анализа
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalysis: InventoryItem[] = [
      {
        id: '1',
        name: 'Холодильник Samsung',
        condition: 'excellent',
        estimatedValue: 45000,
        category: 'Бытовая техника',
        description: 'Двухкамерный холодильник с морозильной камерой, белый цвет',
        confidence: 95,
        photoUrl: '/api/photos/refrigerator.jpg'
      },
      {
        id: '2',
        name: 'Диван кожаный угловой',
        condition: 'good',
        estimatedValue: 35000,
        category: 'Мебель',
        description: 'Угловой диван из натуральной кожи, коричневый цвет',
        confidence: 88,
        photoUrl: '/api/photos/sofa.jpg'
      },
      {
        id: '3',
        name: 'Телевизор LG 55"',
        condition: 'excellent',
        estimatedValue: 65000,
        category: 'Электроника',
        description: 'Smart TV с разрешением 4K, черный цвет',
        confidence: 92,
        photoUrl: '/api/photos/tv.jpg'
      },
      {
        id: '4',
        name: 'Стол обеденный деревянный',
        condition: 'good',
        estimatedValue: 15000,
        category: 'Мебель',
        description: 'Обеденный стол из массива дерева, 6 мест',
        confidence: 85,
        photoUrl: '/api/photos/table.jpg'
      },
      {
        id: '5',
        name: 'Стиральная машина Bosch',
        condition: 'excellent',
        estimatedValue: 38000,
        category: 'Бытовая техника',
        description: 'Стиральная машина с сушкой, белый цвет',
        confidence: 90,
        photoUrl: '/api/photos/washer.jpg'
      }
    ];

    setInventoryItems(mockAnalysis);
    setTotalValue(mockAnalysis.reduce((sum, item) => sum + item.estimatedValue, 0));
    setIsAnalyzing(false);
    setStep(2);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedPhotos(prev => [...prev, ...acceptedFiles]);
  }, []);

  const downloadAct = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const editItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setStep(3);
  };

  const saveItem = (updatedItem: InventoryItem) => {
    setInventoryItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
    setSelectedItem(null);
    setStep(2);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'Отличное';
      case 'good': return 'Хорошее';
      case 'fair': return 'Удовлетворительное';
      case 'poor': return 'Плохое';
      default: return 'Неизвестно';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">📋 Опись имущества</h1>
              <p className="text-gray-400">ИИ-анализ фотографий и автоматическая генерация описи</p>
            </div>
          </div>
          
          {/* Прогресс */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 rounded ${
              step >= 2 ? 'bg-green-500' : 'bg-gray-700'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 rounded ${
              step >= 3 ? 'bg-green-500' : 'bg-gray-700'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Шаг 1: Загрузка фотографий */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Загрузите фотографии помещения</h2>
              <p className="text-gray-400 mb-6">
                ИИ проанализирует фотографии и автоматически создаст опись имущества с оценкой стоимости
              </p>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-green-400 bg-green-400/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                {isDragActive ? (
                  <p className="text-green-400">Отпустите файлы здесь...</p>
                ) : (
                  <div>
                    <p className="text-lg font-medium mb-2">Перетащите фотографии сюда</p>
                    <p className="text-gray-400">или нажмите для выбора файлов</p>
                    <p className="text-sm text-gray-500 mt-2">Поддерживаются: JPG, PNG, WebP</p>
                  </div>
                )}
              </div>

              {/* Загруженные фотографии */}
              {uploadedPhotos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Загруженные фотографии ({uploadedPhotos.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedPhotos.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Фото ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={analyzePhotos}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Анализируем...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Начать анализ
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 2: Результаты анализа */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Результаты ИИ-анализа</h2>
                  <p className="text-gray-400">Найдено {inventoryItems.length} предметов на общую сумму {totalValue.toLocaleString()} ₽</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{totalValue.toLocaleString()} ₽</div>
                  <div className="text-sm text-gray-400">Общая стоимость</div>
                </div>
              </div>

              <div className="space-y-4">
                {inventoryItems.map((item) => (
                  <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(item.condition)}`}>
                            {getConditionText(item.condition)}
                          </span>
                          <span className={`text-xs ${getConfidenceColor(item.confidence)}`}>
                            {item.confidence}% точность
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">Категория: {item.category}</span>
                          <span className="text-green-400 font-medium">{item.estimatedValue.toLocaleString()} ₽</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editItem(item)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={async () => {
                    try {
                      // Получаем токен из localStorage
                      const token = localStorage.getItem('token')
                      if (!token) {
                        // Показываем модальное окно с кнопкой входа
                        const shouldLogin = confirm('❌ Необходимо войти в систему\n\nХотите перейти на страницу входа?')
                        if (shouldLogin) {
                          window.location.href = '/login'
                        }
                        return
                      }

                      // Отправляем запрос на генерацию акта
                      const response = await fetch('/api/inventory/generate', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          inventoryItems,
                          propertyData: {
                            title: 'Объект недвижимости',
                            address: 'Адрес объекта',
                            type: 'Тип объекта',
                            area: 'Площадь'
                          }
                        })
                      })

                      if (!response.ok) {
                        if (response.status === 401) {
                          // Токен истек или недействителен
                          localStorage.removeItem('token')
                          const shouldLogin = confirm('❌ Сессия истекла\n\nХотите войти заново?')
                          if (shouldLogin) {
                            window.location.href = '/login'
                          }
                          return
                        }
                        throw new Error('Ошибка генерации акта')
                      }

                      const result = await response.json()
                      const act = result.data

                      // Показываем попап с успехом и кнопкой скачивания
                      const shouldDownload = confirm('✅ Опись имущества завершена!\n\nНайдено предметов: ' + inventoryItems.length + '\nОбщая стоимость: ' + totalValue.toLocaleString() + ' ₽\n\nХотите скачать акт приема-передачи?')
                      
                      if (shouldDownload) {
                        downloadAct(act.content, act.fileName)
                      }
                      
                      onComplete(inventoryItems)
                    } catch (error) {
                      console.error('Ошибка генерации акта:', error)
                      alert('❌ Ошибка при создании акта. Попробуйте еще раз.')
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Завершить опись
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 3: Редактирование предмета */}
        {step === 3 && selectedItem && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Редактирование предмета</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название</label>
                  <input
                    type="text"
                    value={selectedItem.name}
                    onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Состояние</label>
                  <select
                    value={selectedItem.condition}
                    onChange={(e) => setSelectedItem({...selectedItem, condition: e.target.value as any})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                  >
                    <option value="excellent">Отличное</option>
                    <option value="good">Хорошее</option>
                    <option value="fair">Удовлетворительное</option>
                    <option value="poor">Плохое</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Оценочная стоимость (₽)</label>
                  <input
                    type="number"
                    value={selectedItem.estimatedValue}
                    onChange={(e) => setSelectedItem({...selectedItem, estimatedValue: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Категория</label>
                  <input
                    type="text"
                    value={selectedItem.category}
                    onChange={(e) => setSelectedItem({...selectedItem, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <textarea
                    value={selectedItem.description}
                    onChange={(e) => setSelectedItem({...selectedItem, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => saveItem(selectedItem)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 