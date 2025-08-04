'use client'

import { useEffect, useState } from 'react'
import { verifyJWTToken } from '@/lib/auth'

export default function TestTokenPage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null)

  useEffect(() => {
    // Получаем токен из cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1]

    if (token) {
      console.log('🔍 TestTokenPage: найден токен:', token.substring(0, 50) + '...')
      const decoded = verifyJWTToken(token)
      console.log('🔍 TestTokenPage: результат проверки токена:', decoded)
      setTokenInfo({ token: token.substring(0, 50) + '...', decoded })
    } else {
      console.log('🔍 TestTokenPage: токен не найден')
      setTokenInfo({ token: 'не найден', decoded: null })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Тест токена</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Информация о токене</h2>
          
          {tokenInfo ? (
            <div className="space-y-4">
              <div>
                <strong>Токен:</strong> {tokenInfo.token}
              </div>
              <div>
                <strong>Результат проверки:</strong>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm mt-2">
                  {JSON.stringify(tokenInfo.decoded, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p>Загрузка...</p>
          )}
        </div>
      </div>
    </div>
  )
} 