import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'

// Защищенные маршруты
const protectedPaths = [
  '/dashboard',
  '/dashboard-enhanced',
  '/properties/new',
  '/properties/edit',
  '/bookings',
  '/deals',
  '/contracts',
  '/payments',
  '/clients',
  '/notifications',
  '/profile',
  '/settings',
  '/mosaic',
  '/scoring',
  '/signature',
  '/analytics',
  '/legal',
  '/multilisting'
]

// Маршруты только для неавторизованных пользователей
const authPaths = ['/login', '/register']

// Публичные маршруты
const publicPaths = ['/', '/properties', '/test-auth', '/test-auth-status', '/test-inputs', '/test-middleware', '/test-token', '/teams-ui-kit', '/test-simple']

export async function middleware(request: NextRequest) {
  // Отключаем middleware для упрощения
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}