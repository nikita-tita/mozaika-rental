import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface TeamsLoadingOverlayProps {
  isLoading: boolean
  message?: string
  progress?: number
  className?: string
  variant?: 'overlay' | 'inline' | 'skeleton'
}

export const TeamsLoadingOverlay: React.FC<TeamsLoadingOverlayProps> = ({
  isLoading,
  message = 'Загрузка...',
  progress,
  className,
  variant = 'overlay'
}) => {
  if (!isLoading) return null

  const renderProgressBar = () => {
    if (progress === undefined) return null

    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    )
  }

  const renderInline = () => (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <div className="flex items-center space-x-3">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <div>
          <p className="text-sm font-medium text-gray-900">{message}</p>
          {renderProgressBar()}
        </div>
      </div>
    </div>
  )

  const renderOverlay = () => (
    <div className={cn(
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
          {renderProgressBar()}
        </div>
      </div>
    </div>
  )

  const renderSkeleton = () => (
    <div className={cn('animate-pulse', className)}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  )

  switch (variant) {
    case 'inline':
      return renderInline()
    case 'skeleton':
      return renderSkeleton()
    case 'overlay':
    default:
      return renderOverlay()
  }
}

// Компонент для скелетонной загрузки
export const TeamsSkeleton: React.FC<{
  className?: string
  lines?: number
  variant?: 'text' | 'card' | 'table'
}> = ({ className, lines = 3, variant = 'text' }) => {
  const renderTextSkeleton = () => (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-gray-200 rounded',
            i === 0 ? 'w-3/4' : i === 1 ? 'w-1/2' : 'w-5/6'
          )}
        />
      ))}
    </div>
  )

  const renderCardSkeleton = () => (
    <div className={cn('bg-white rounded-lg p-4 shadow-sm', className)}>
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  )

  const renderTableSkeleton = () => (
    <div className={cn('space-y-3', className)}>
      {/* Заголовок таблицы */}
      <div className="flex space-x-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      {/* Строки таблицы */}
      {Array.from({ length: lines }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: 4 }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={cn(
                'h-4 bg-gray-200 rounded flex-1',
                colIndex === 0 && 'w-16',
                colIndex === 3 && 'w-20'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )

  switch (variant) {
    case 'card':
      return renderCardSkeleton()
    case 'table':
      return renderTableSkeleton()
    case 'text':
    default:
      return renderTextSkeleton()
  }
} 