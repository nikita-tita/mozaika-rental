import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'

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

  // Проверяем, является ли путь защищенным
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path) || pathname === path
  )

  // Проверяем, является ли путь страницей авторизации
  const isAuthPath = authPaths.some(path =>
    pathname.startsWith(path) || pathname === path
  )

  // Проверяем, является ли путь публичным
  const isPublicPath = publicPaths.some(path =>
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

    // Проверяем валидность токена
    const decoded = verifyJWTToken(token)
    if (!decoded) {
      // Токен недействителен, удаляем его и перенаправляем на логин
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.set('auth-token', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0
      })
      return response
    }
  }

  // Если это страница авторизации и пользователь уже авторизован
  if (isAuthPath && token) {
    const decoded = verifyJWTToken(token)
    if (decoded) {
      // Перенаправляем на dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
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