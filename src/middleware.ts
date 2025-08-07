import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWTToken, getCurrentUser } from '@/lib/auth'

// Защищенные маршруты
const protectedPaths = [
  '/dashboard',
  '/home',
  '/properties',
  '/clients',
  '/deals',
  '/contracts',
  '/payments',
  '/scoring',
  '/signature',
  '/multilisting',
  '/insurance',
  '/yandex-rental',
  '/notifications',
  '/settings',
  '/analytics',
  '/bookings'
]

// Маршруты авторизации
const authPaths = ['/login', '/register']

// Публичные маршруты
const publicPaths = ['/', '/properties', '/test-auth', '/test-auth-status', '/test-inputs', '/test-middleware', '/test-token', '/teams-ui-kit', '/test-simple']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // Пропускаем API маршруты
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Проверяем, является ли путь защищенным
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path) || pathname === path
  )

  // Проверяем, является ли путь страницей авторизации
  const isAuthPath = authPaths.some(path =>
    pathname.startsWith(path) || pathname === path
  )

  // Если это защищенный маршрут
  if (isProtectedPath) {
    // Если нет токена, перенаправляем на логин
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Просто проверяем наличие токена, без валидации
    // Валидация будет происходить на уровне API
  }

  // Если это страница авторизации и пользователь уже авторизован
  if (isAuthPath && token) {
    try {
      const user = await getCurrentUser(token)
      if (user) {
        // Перенаправляем на home
        return NextResponse.redirect(new URL('/home', request.url))
      }
    } catch (error) {
      // Если ошибка при проверке токена, просто продолжаем
      console.log('Ошибка проверки токена в middleware:', error)
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
    '/((?!api|_next/static|_next/image|favicon.ico|health|test).*)',
  ],
}