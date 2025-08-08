import { NextRequest, NextResponse } from 'next/server'
import { simpleLogin } from '@/lib/simple-auth'

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

    console.log('🔍 Выполняем простую авторизацию...')
    // Простая авторизация пользователя
    const result = await simpleLogin(email, password)

    console.log('📋 Результат авторизации:', { success: result.success, message: result.message })

    if (result.success) {
      console.log('✅ Простая авторизация успешна')
      // Создаем простой ответ без токенов
      const response = NextResponse.json({
        success: true,
        data: result.user,
        message: result.message
      })

      // Добавляем CORS заголовки
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

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