import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Тестирование cookie')
    
    // Получаем все cookie
    const allCookies = request.cookies.getAll()
    const authToken = request.cookies.get('auth-token')
    
    console.log('🍪 API: Все cookie:', allCookies.map(c => ({ name: c.name, value: c.value ? 'установлен' : 'не установлен' })))
    console.log('🍪 API: auth-token:', authToken ? 'найден' : 'не найден')
    
    return NextResponse.json({
      success: true,
      cookies: allCookies.map(c => ({ name: c.name, hasValue: !!c.value })),
      authToken: authToken ? 'найден' : 'не найден',
      userAgent: request.headers.get('user-agent'),
      host: request.headers.get('host'),
      origin: request.headers.get('origin')
    })

  } catch (error) {
    console.error('💥 API: Ошибка при тестировании cookie:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 