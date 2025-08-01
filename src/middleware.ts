import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Защищенные маршруты
const protectedPaths = ['/dashboard', '/properties/new', '/bookings', '/profile']

// Маршруты только для неавторизованных пользователей
const authPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // Проверяем, является ли путь защищенным
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))

  // Если пользователь не авторизован и пытается зайти на защищенную страницу
  if (isProtectedPath && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Если пользователь авторизован и пытается зайти на страницу входа/регистрации
  if (isAuthPath && token) {
    const user = verifyToken(token)
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Проверяем валидность токена для защищенных маршрутов
  if (isProtectedPath && token) {
    const user = verifyToken(token)
    if (!user) {
      // Токен недействителен, перенаправляем на логин
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

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