import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Если это страница авторизации и уже есть признак входа — просто редиректим на home
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}