import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Список публичных путей
const PUBLIC_PATHS = ['/', '/login', '/register']

export function middleware(request: NextRequest) {
  // Проверяем, является ли путь публичным
  const isPublicPath = PUBLIC_PATHS.includes(request.nextUrl.pathname)

  // Если это публичный путь или API запрос, пропускаем
  if (isPublicPath || request.nextUrl.pathname.startsWith('/api/')) {
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}