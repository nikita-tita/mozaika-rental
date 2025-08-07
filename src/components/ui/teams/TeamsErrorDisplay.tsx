'use client'

import { useState, useEffect } from 'react'
import { TeamsAlert, TeamsButton } from './index'
import { AlertCircle, RefreshCw, X } from 'lucide-react'

interface ApiError {
  code: string
  message: string
  details?: any
}

interface TeamsErrorDisplayProps {
  error: ApiError | string | null
  onRetry?: () => void
  onDismiss?: () => void
  showDetails?: boolean
  className?: string
}

const getErrorMessage = (error: ApiError | string): string => {
  if (typeof error === 'string') {
    return error
  }

  // Специфичные сообщения для разных кодов ошибок
  const errorMessages: Record<string, string> = {
    'VALIDATION_ERROR': 'Проверьте правильность введенных данных',
    'UNAUTHORIZED': 'Необходима авторизация. Пожалуйста, войдите в систему',
    'FORBIDDEN': 'У вас нет прав для выполнения этого действия',
    'NOT_FOUND': 'Запрашиваемый ресурс не найден',
    'PROPERTY_NOT_FOUND': 'Объект недвижимости не найден',
    'PROPERTY_ACCESS_DENIED': 'У вас нет прав для работы с этим объектом',
    'DEAL_NOT_FOUND': 'Сделка не найдена',
    'CONTRACT_NOT_FOUND': 'Договор не найден',
    'USER_NOT_FOUND': 'Пользователь не найден',
    'FILE_UPLOAD_ERROR': 'Ошибка при загрузке файла',
    'DATABASE_ERROR': 'Ошибка базы данных. Попробуйте позже',
    'FILE_ERROR': 'Ошибка работы с файлами',
    'INTERNAL_ERROR': 'Внутренняя ошибка сервера. Попробуйте позже',
    'UNKNOWN_ERROR': 'Произошла неизвестная ошибка'
  }

  return errorMessages[error.code] || error.message || 'Произошла ошибка'
}

const getErrorVariant = (error: ApiError | string): 'error' | 'warning' | 'info' => {
  if (typeof error === 'string') {
    return 'error'
  }

  const warningCodes = ['VALIDATION_ERROR', 'UNAUTHORIZED']
  const infoCodes = ['NOT_FOUND']

  if (warningCodes.includes(error.code)) {
    return 'warning'
  }

  if (infoCodes.includes(error.code)) {
    return 'info'
  }

  return 'error'
}

export function TeamsErrorDisplay({
  error,
  onRetry,
  onDismiss,
  showDetails = false,
  className = ''
}: TeamsErrorDisplayProps) {
  const [showErrorDetails, setShowErrorDetails] = useState(showDetails)

  useEffect(() => {
    setShowErrorDetails(showDetails)
  }, [showDetails])

  if (!error) {
    return null
  }

  const message = getErrorMessage(error)
  const variant = getErrorVariant(error)
  const hasDetails = typeof error === 'object' && error.details

  return (
    <div className={`mb-4 ${className}`}>
      <TeamsAlert variant={variant} title="Ошибка">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm">{message}</p>
            
            {hasDetails && showErrorDetails && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(error.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {hasDetails && (
              <TeamsButton
                variant="outline"
                size="sm"
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="text-xs"
              >
                {showErrorDetails ? 'Скрыть' : 'Детали'}
              </TeamsButton>
            )}
            
            {onRetry && (
              <TeamsButton
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Повторить
              </TeamsButton>
            )}
            
            {onDismiss && (
              <TeamsButton
                variant="outline"
                size="sm"
                onClick={onDismiss}
                className="text-xs"
              >
                <X className="h-3 w-3" />
              </TeamsButton>
            )}
          </div>
        </div>
      </TeamsAlert>
    </div>
  )
}

// Хук для обработки ошибок API
export function useApiError() {
  const [error, setError] = useState<ApiError | string | null>(null)

  const handleApiError = (response: Response, data?: any) => {
    if (!response.ok) {
      const errorData = data || { message: 'Произошла ошибка' }
      setError({
        code: errorData.code || 'UNKNOWN_ERROR',
        message: errorData.error || errorData.message || 'Произошла ошибка',
        details: errorData.details
      })
      return true
    }
    return false
  }

  const clearError = () => {
    setError(null)
  }

  return {
    error,
    setError,
    handleApiError,
    clearError
  }
}

// Компонент для отображения ошибок загрузки
export function TeamsLoadingError({
  error,
  onRetry,
  loading = false,
  className = ''
}: {
  error: ApiError | string | null
  onRetry?: () => void
  loading?: boolean
  className?: string
}) {
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Загрузка...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ошибка загрузки
        </h3>
        <p className="text-gray-600 mb-4">
          {getErrorMessage(error)}
        </p>
        {onRetry && (
          <TeamsButton onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Попробовать снова
          </TeamsButton>
        )}
      </div>
    )
  }

  return null
} 