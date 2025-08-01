import { NextRequest, NextResponse } from 'next/server'
import { logger } from './logger'
import { v4 as uuidv4 } from 'uuid'

export function withRequestLogging(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const requestId = uuidv4()
    const startTime = Date.now()
    
    // Добавляем requestId в заголовки для передачи в другие части приложения
    const requestWithId = new NextRequest(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      cache: request.cache,
      credentials: request.credentials,
      integrity: request.integrity,
      keepalive: request.keepalive,
      mode: request.mode,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      signal: request.signal,
    })
    
    // Добавляем requestId в заголовки
    requestWithId.headers.set('x-request-id', requestId)
    
    try {
      // Логируем входящий запрос
      logger.apiRequest(
        request.method,
        request.nextUrl.pathname,
        undefined, // userId будет определен позже
        requestId
      )
      
      // Выполняем обработчик
      const response = await handler(requestWithId)
      
      // Вычисляем время выполнения
      const duration = Date.now() - startTime
      
      // Логируем ответ
      logger.apiResponse(
        request.method,
        request.nextUrl.pathname,
        response.status,
        undefined, // userId будет определен позже
        requestId
      )
      
      // Добавляем requestId в заголовки ответа
      response.headers.set('x-request-id', requestId)
      response.headers.set('x-response-time', `${duration}ms`)
      
      return response
      
    } catch (error) {
      // Логируем ошибку
      logger.apiError(
        request.method,
        request.nextUrl.pathname,
        error,
        undefined, // userId будет определен позже
        requestId
      )
      
      // Возвращаем ошибку 500
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: 'Внутренняя ошибка сервера',
          requestId 
        },
        { status: 500 }
      )
      
      errorResponse.headers.set('x-request-id', requestId)
      return errorResponse
    }
  }
}

// Утилита для получения requestId из запроса
export function getRequestId(request: NextRequest): string | undefined {
  return request.headers.get('x-request-id') || undefined
}

// Утилита для получения requestId из заголовков ответа
export function getRequestIdFromResponse(response: NextResponse): string | undefined {
  return response.headers.get('x-request-id') || undefined
} 