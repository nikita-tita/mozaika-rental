'use client'

import { TeamsInput, TeamsButton, TeamsCard } from '@/components/ui/teams'

export default function TestInputsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Тест полей ввода
        </h1>

        <TeamsCard>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">TeamsInput компоненты:</h2>
              
              <div className="space-y-4">
                <TeamsInput
                  label="Email"
                  type="email"
                  placeholder="Введите email"
                  helperText="Это поле должно быть видимым"
                />
                
                <TeamsInput
                  label="Пароль"
                  type="password"
                  placeholder="Введите пароль"
                />
                
                <TeamsInput
                  label="Текст"
                  type="text"
                  placeholder="Введите текст"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Обычные HTML input:</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Обычный input
                  </label>
                  <input
                    type="text"
                    placeholder="Обычный input"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input с классом input-field
                  </label>
                  <input
                    type="text"
                    placeholder="Input с input-field классом"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Кнопки:</h2>
              
              <div className="space-x-4">
                <TeamsButton>Primary кнопка</TeamsButton>
                <TeamsButton variant="secondary">Secondary кнопка</TeamsButton>
                <TeamsButton variant="outline">Outline кнопка</TeamsButton>
              </div>
            </div>
          </div>
        </TeamsCard>
      </div>
    </div>
  )
} 