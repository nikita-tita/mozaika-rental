'use client'

import { TeamsButton, TeamsCard } from '@/components/ui/teams'
import { Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <TeamsCard className="max-w-md w-full mx-4">
        <div className="text-center p-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Страница не найдена
          </h1>
          <p className="text-gray-600 mb-8">
            Запрашиваемая страница не существует или была перемещена.
          </p>
          <Link href="/">
            <TeamsButton className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Вернуться на главную
            </TeamsButton>
          </Link>
        </div>
      </TeamsCard>
    </div>
  )
} 