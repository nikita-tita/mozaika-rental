'use client'

import { useState } from 'react'
import { TeamsButton, TeamsCard, TeamsInput } from '@/components/ui/teams'

export default function TestSimplePage() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('test123')
  const [status, setStatus] = useState('')

  const handleLogin = async () => {
    setStatus('Авторизация...')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      
      if (data.success) {
        setStatus('Успешно! Перезагружаем...')
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      } else {
        setStatus(`Ошибка: ${data.message}`)
      }
    } catch (error) {
      setStatus(`Ошибка сети: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Тест авторизации</h1>
          <p className="text-gray-600">Простая форма для проверки</p>
        </div>

        <TeamsCard className="p-6">
          <div className="space-y-4">
            <TeamsInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />

            <TeamsInput
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="test123"
            />

            <TeamsButton 
              onClick={handleLogin}
              className="w-full"
              disabled={status === 'Авторизация...'}
            >
              {status === 'Авторизация...' ? 'Авторизация...' : 'Войти'}
            </TeamsButton>

            {status && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-700">{status}</p>
              </div>
            )}
          </div>
        </TeamsCard>

        <div className="mt-6 text-center">
          <TeamsButton 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="mr-2"
          >
            Главная
          </TeamsButton>
          <TeamsButton 
            variant="outline" 
            onClick={() => window.location.href = '/login'}
          >
            Страница входа
          </TeamsButton>
        </div>
      </div>
    </div>
  )
} 