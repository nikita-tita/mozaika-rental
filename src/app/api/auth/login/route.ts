import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function OPTIONS() {
  const response = new NextResponse(null, {
    status: 200,
  })

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('🔐 Попытка входа для:', email)

    // Валидация входных данных
    if (!email || !password) {
      console.log('❌ Отсутствуют обязательные поля')
      return NextResponse.json({
        success: false,
        message: 'Email и пароль обязательны'
      }, { status: 400 })
    }

    // Получаем информацию о клиенте
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    console.log('🔍 Выполняем авторизацию...')
    // Авторизация пользователя
    const result = await loginUser(email, password, userAgent, ipAddress)

    console.log('📋 Результат авторизации:', { success: result.success, message: result.message })

    if (result.success && result.token) {
      console.log('✅ Авторизация успешна, устанавливаем cookie')
      // Создаем ответ с cookie
      const response = NextResponse.json({
        success: true,
        data: result.user,
        message: result.message
      })

      // Добавляем CORS заголовки
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

      // Устанавливаем cookie с токеном
      const isProduction = process.env.NODE_ENV === 'production'
      const isVercel = process.env.VERCEL === '1'

      response.cookies.set('auth-token', result.token, {
        httpOnly: true,
        secure: isProduction || isVercel,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 дней
        path: '/'
      })

      return response
    } else {
      console.log('❌ Авторизация не удалась:', result.message)
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Ошибка авторизации:', error)
    return NextResponse.json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    }, { status: 500 })
  }
}