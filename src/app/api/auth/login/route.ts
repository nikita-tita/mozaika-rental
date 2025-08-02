import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken, sanitizeUser } from '@/lib/auth'
import { validateEmail } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('Login attempt:', { email })

    // Валидация
    if (!email || !password) {
      console.log('Login validation failed: missing credentials')
      return NextResponse.json(
        { success: false, error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      console.log('Login validation failed: invalid email')
      return NextResponse.json(
        { success: false, error: 'Некорректный email адрес' },
        { status: 400 }
      )
    }

    // Поиск пользователя
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('Login failed: user not found')
      return NextResponse.json(
        { success: false, error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Проверка пароля
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      console.log('Login failed: invalid password')
      return NextResponse.json(
        { success: false, error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Генерация токена
    const token = generateToken(user.id, user.email, user.role)

    console.log('User logged in successfully:', user.id)

    // Создание ответа с токеном в cookie и в теле ответа
    const response = NextResponse.json({
      success: true,
      data: sanitizeUser(user),
      token: token,
      message: 'Успешный вход'
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 дней
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}