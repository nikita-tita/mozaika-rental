'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { TeamsButton, TeamsCard, TeamsAlert } from './index'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class TeamsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by TeamsErrorBoundary:', error, errorInfo)
    this.setState({ error, errorInfo })
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleGoHome = () => {
    window.location.href = '/dashboard'
  }

  handleGoBack = () => {
    window.history.back()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <TeamsCard className="max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Что-то пошло не так
              </h2>
              
              <p className="text-gray-600 mb-6">
                Произошла неожиданная ошибка. Мы уже работаем над её устранением.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <TeamsAlert
                  variant="error"
                  title="Детали ошибки (только для разработчиков)"
                  className="mb-4 text-left"
                >
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                    <div><strong>Ошибка:</strong> {this.state.error.message}</div>
                    {this.state.errorInfo && (
                      <div className="mt-2">
                        <strong>Stack:</strong>
                        <pre className="mt-1 text-xs overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </TeamsAlert>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <TeamsButton
                  onClick={this.handleRetry}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Попробовать снова
                </TeamsButton>
                
                <TeamsButton
                  variant="outline"
                  onClick={this.handleGoBack}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </TeamsButton>
                
                <TeamsButton
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Главная
                </TeamsButton>
              </div>
            </div>
          </TeamsCard>
        </div>
      )
    }

    return this.props.children
  }
}

// Хук для обработки ошибок в функциональных компонентах
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    console.error('Error handled by useErrorHandler:', error)
    setError(error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}

// Компонент для отображения ошибок в функциональных компонентах
export const TeamsErrorDisplay: React.FC<{
  error: Error | null
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}> = ({ error, onRetry, onDismiss, className }) => {
  if (!error) return null

  return (
    <TeamsAlert
      variant="error"
      title="Произошла ошибка"
      onClose={onDismiss}
      className={className}
    >
      <div className="space-y-3">
        <p className="text-sm">{error.message}</p>
        
        {onRetry && (
          <TeamsButton
            size="sm"
            onClick={onRetry}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Попробовать снова
          </TeamsButton>
        )}
      </div>
    </TeamsAlert>
  )
} 