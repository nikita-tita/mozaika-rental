import { NextResponse } from 'next/server'
import { logger } from './logger'

export interface ApiError {
  code: string
  message: string
  details?: any
  statusCode: number
}

export class ApiErrorHandler {
  static createError(
    code: string,
    message: string,
    statusCode: number = 500,
    details?: any
  ): ApiError {
    return {
      code,
      message,
      details,
      statusCode
    }
  }

  static handleError(
    error: any,
    context: {
      method: string
      path: string
      userId?: string
      requestId?: string
    }
  ): NextResponse {
    const { method, path, userId, requestId } = context

    // Логируем ошибку
    logger.apiError(method, path, error, userId, requestId)

    // Определяем тип ошибки и создаем соответствующий ответ
    let apiError: ApiError

    if (error instanceof Error) {
      // Ошибки валидации
      if (error.message.includes('validation') || error.message.includes('Validation')) {
        apiError = this.createError(
          'VALIDATION_ERROR',
          'Ошибка валидации данных',
          400,
          { details: error.message }
        )
      }
      // Ошибки авторизации
      else if (error.message.includes('unauthorized') || error.message.includes('Unauthorized')) {
        apiError = this.createError(
          'UNAUTHORIZED',
          'Не авторизован',
          401
        )
      }
      // Ошибки доступа
      else if (error.message.includes('forbidden') || error.message.includes('Forbidden')) {
        apiError = this.createError(
          'FORBIDDEN',
          'Нет прав доступа',
          403
        )
      }
      // Ошибки "не найдено"
      else if (error.message.includes('not found') || error.message.includes('Not found')) {
        apiError = this.createError(
          'NOT_FOUND',
          'Ресурс не найден',
          404
        )
      }
      // Ошибки базы данных
      else if (error.message.includes('database') || error.message.includes('Database')) {
        apiError = this.createError(
          'DATABASE_ERROR',
          'Ошибка базы данных',
          500,
          { details: process.env.NODE_ENV === 'development' ? error.message : undefined }
        )
      }
      // Ошибки файловой системы
      else if (error.message.includes('file') || error.message.includes('File')) {
        apiError = this.createError(
          'FILE_ERROR',
          'Ошибка работы с файлами',
          500,
          { details: process.env.NODE_ENV === 'development' ? error.message : undefined }
        )
      }
      // Общие ошибки
      else {
        apiError = this.createError(
          'INTERNAL_ERROR',
          'Внутренняя ошибка сервера',
          500,
          { details: process.env.NODE_ENV === 'development' ? error.message : undefined }
        )
      }
    } else {
      // Неизвестные ошибки
      apiError = this.createError(
        'UNKNOWN_ERROR',
        'Неизвестная ошибка',
        500,
        { details: process.env.NODE_ENV === 'development' ? String(error) : undefined }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: apiError.message,
        code: apiError.code,
        ...(apiError.details && { details: apiError.details })
      },
      { status: apiError.statusCode }
    )
  }

  static async withErrorHandling<T>(
    handler: () => Promise<T>,
    context?: {
      method?: string
      path?: string
      userId?: string
      requestId?: string
    }
  ): Promise<NextResponse> {
    try {
      const result = await handler()
      if (result instanceof NextResponse) {
        return result
      }
      return NextResponse.json(result)
    } catch (error) {
      const defaultContext = {
        method: 'UNKNOWN',
        path: 'UNKNOWN',
        ...context
      }
      return this.handleError(error, defaultContext)
    }
  }

  // Специфичные ошибки для бизнес-логики
  static propertyNotFound(propertyId: string): ApiError {
    return this.createError(
      'PROPERTY_NOT_FOUND',
      `Объект недвижимости с ID ${propertyId} не найден`,
      404
    )
  }

  static propertyAccessDenied(propertyId: string, userId: string): ApiError {
    return this.createError(
      'PROPERTY_ACCESS_DENIED',
      'Нет прав для редактирования этого объекта',
      403,
      { propertyId, userId }
    )
  }

  static invalidPropertyData(details: any): ApiError {
    return this.createError(
      'INVALID_PROPERTY_DATA',
      'Некорректные данные объекта',
      400,
      { details }
    )
  }

  static dealNotFound(dealId: string): ApiError {
    return this.createError(
      'DEAL_NOT_FOUND',
      `Сделка с ID ${dealId} не найдена`,
      404
    )
  }

  static contractNotFound(contractId: string): ApiError {
    return this.createError(
      'CONTRACT_NOT_FOUND',
      `Договор с ID ${contractId} не найден`,
      404
    )
  }

  static userNotFound(userId: string): ApiError {
    return this.createError(
      'USER_NOT_FOUND',
      `Пользователь с ID ${userId} не найден`,
      404
    )
  }

  static fileUploadError(details: string): ApiError {
    return this.createError(
      'FILE_UPLOAD_ERROR',
      'Ошибка загрузки файла',
      500,
      { details }
    )
  }
}

// Утилиты для создания requestId
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Декоратор для API маршрутов
export function withApiErrorHandling(
  handler: (request: Request, context: any) => Promise<NextResponse>
) {
  return async (request: Request, context: any) => {
    const requestId = generateRequestId()
    const method = request.method
    const path = new URL(request.url).pathname

    // Логируем запрос
    logger.apiRequest(method, path, undefined, requestId)

    try {
      const result = await handler(request, context)
      
      // Логируем успешный ответ
      logger.apiResponse(method, path, result.status, undefined, requestId)
      
      return result
    } catch (error) {
      return ApiErrorHandler.handleError(error, {
        method,
        path,
        requestId
      })
    }
  }
} 