import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Создаем копию заголовков
  const requestHeaders = new Headers(request.headers)

  // Добавляем заголовки для отключения кэширования
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Устанавливаем заголовки для отключения кэширования
  response.headers.set('Cache-Control', 'no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  
  // Добавляем временную метку для принудительного обновления
  response.headers.set('x-timestamp', new Date().toISOString())

  return response
}

// Указываем, для каких путей применять middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}