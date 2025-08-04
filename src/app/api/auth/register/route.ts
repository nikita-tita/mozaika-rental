import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone } = body

    // Валидация входных данных
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({
        success: false,
        message: 'Все обязательные поля должны быть заполнены'
      }, { status: 400 })
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Некорректный формат email'
      }, { status: 400 })
    }

    // Проверка пароля
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Пароль должен содержать минимум 6 символов'
      }, { status: 400 })
    }

    // Регистрация пользователя
    const result = await registerUser(email, password, firstName, lastName, phone)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.user,
        message: result.message
      })
    } else {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 409 })
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    return NextResponse.json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    }, { status: 500 })
  }
}