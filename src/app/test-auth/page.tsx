'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function TestAuthPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testRegistration = async () => {
    try {
      addResult('Начинаем тест регистрации...')
      
      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'testpass123',
        firstName: 'Тест',
        lastName: 'Пользователь',
        phone: '+7 (999) 123-45-67',
        role: 'REALTOR'
      }

      addResult(`Регистрируем пользователя: ${testUser.email}`)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testUser)
      })

      addResult(`Статус ответа: ${response.status}`)

      const data = await response.json()
      addResult(`Ответ сервера: ${JSON.stringify(data, null, 2)}`)

      if (data.success) {
        addResult(`✅ Регистрация успешна! Email: ${testUser.email}`)
        return testUser.email
      } else {
        addResult(`❌ Ошибка регистрации: ${data.error}`)
        return null
      }
    } catch (error) {
      addResult(`❌ Ошибка при регистрации: ${error}`)
      return null
    }
  }

  const testLogin = async (email: string) => {
    try {
      addResult('Начинаем тест входа...')
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: 'testpass123'
        })
      })

      addResult(`Статус ответа входа: ${response.status}`)

      const data = await response.json()
      addResult(`Ответ сервера входа: ${JSON.stringify(data, null, 2)}`)

      if (data.success) {
        addResult(`✅ Вход успешен! Токен получен: ${data.token ? 'Да' : 'Нет'}`)
        addResult(`Пользователь: ${data.data.firstName} ${data.data.lastName}`)
        addResult(`Роль: ${data.data.role}`)
        return true
      } else {
        addResult(`❌ Ошибка входа: ${data.error}`)
        return false
      }
    } catch (error) {
      addResult(`❌ Ошибка при входе: ${error}`)
      return false
    }
  }

  const testDatabaseConnection = async () => {
    try {
      addResult('Проверяем подключение к базе данных...')
      
      const response = await fetch('/api/test-db', {
        method: 'GET'
      })

      const data = await response.json()
      addResult(`Статус БД: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      addResult(`❌ Ошибка подключения к БД: ${error}`)
    }
  }

  const runFullTest = async () => {
    setIsLoading(true)
    setTestResults([])
    addResult('=== НАЧАЛО ТЕСТИРОВАНИЯ ===')
    
    // Тест подключения к БД
    await testDatabaseConnection()
    
    // Тест регистрации
    const email = await testRegistration()
    
    if (email) {
      // Тест входа
      await testLogin(email)
    }
    
    addResult('=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Тестирование регистрации и входа
          </h1>
          
          <div className="mb-6">
            <Button onClick={runFullTest} className="mb-4" loading={isLoading}>
              Запустить полный тест
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Результаты тестов:</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">Нажмите &quot;Запустить полный тест&quot; для начала тестирования</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 