'use client'

import { useEffect, useState } from 'react'

export default function TestMiddlewarePage() {
  const [cookies, setCookies] = useState<string>('')
  const [userAgent, setUserAgent] = useState<string>('')

  useEffect(() => {
    // Получаем все cookies
    const allCookies = document.cookie
    setCookies(allCookies)
    
    // Получаем User-Agent
    setUserAgent(navigator.userAgent)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Тест Middleware</h1>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Информация о запросе</h2>
          
          <div className="space-y-4">
            <div>
              <strong>Cookies:</strong>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm mt-2 overflow-auto">
                {cookies || 'Нет cookies'}
              </pre>
            </div>
            
            <div>
              <strong>User-Agent:</strong>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm mt-2 overflow-auto">
                {userAgent}
              </pre>
            </div>
            
            <div>
              <strong>URL:</strong>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm mt-2">
                {typeof window !== 'undefined' ? window.location.href : 'Недоступно'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 