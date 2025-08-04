'use client'

import { TeamsButton, TeamsCard } from '@/components/ui/teams'
import { RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <TeamsCard className="max-w-md w-full mx-4">
        <div className="text-center p-8">
          <div className="text-6xl font-bold text-red-300 mb-4">500</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Что-то пошло не так
          </h1>
          <p className="text-gray-600 mb-8">
            Произошла ошибка при загрузке страницы. Попробуйте обновить страницу.
          </p>
          <TeamsButton onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Попробовать снова
          </TeamsButton>
        </div>
      </TeamsCard>
    </div>
  )
} 