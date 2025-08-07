import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Список публичных путей, которые не требуют аутентификации
const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register']

export function middleware(request: NextRequest) {
  // Проверяем, является ли путь публичным
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Если это API запрос, пропускаем его
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Если это публичный путь, пропускаем
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Для всех остальных путей проверяем наличие токена
  const token = request.cookies.get('auth-token')?.value

  // Если нет токена, редиректим на логин
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}