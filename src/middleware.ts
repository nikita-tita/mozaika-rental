import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Разрешаем все API запросы
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Для остальных запросов проверяем авторизацию
  const token = request.cookies.get('auth-token')?.value

  // Если нет токена и не на странице логина/регистрации
  if (!token && 
      !request.nextUrl.pathname.startsWith('/login') && 
      !request.nextUrl.pathname.startsWith('/register')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Если есть токен и на странице логина/регистрации
  if (token && 
      (request.nextUrl.pathname.startsWith('/login') || 
       request.nextUrl.pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
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