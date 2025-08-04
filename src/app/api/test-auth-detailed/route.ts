import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('🔍 Детальный тест авторизации для:', email)

    // 1. Проверяем подключение к базе данных
    await prisma.$connect()
    console.log('✅ Подключение к БД успешно')

    // 2. Ищем пользователя
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ Пользователь не найден')
      return NextResponse.json({
        success: false,
        step: 'user_not_found',
        message: 'Пользователь не найден'
      })
    }

    console.log('✅ Пользователь найден:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      verified: user.verified
    })

    // 3. Проверяем пароль
    const isValidPassword = await verifyPassword(password, user.password)
    console.log('🔑 Проверка пароля:', isValidPassword ? 'успешно' : 'неверный пароль')

    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        step: 'invalid_password',
        message: 'Неверный пароль'
      })
    }

    // 4. Проверяем хеш пароля
    console.log('🔍 Детали пароля:', {
      providedPassword: password,
      hashedPasswordLength: user.password.length,
      hashedPasswordStart: user.password.substring(0, 10) + '...'
    })

    return NextResponse.json({
      success: true,
      message: 'Авторизация успешна',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified
      }
    })

  } catch (error) {
    console.error('❌ Ошибка в детальном тесте:', error)
    return NextResponse.json({
      success: false,
      step: 'error',
      message: 'Ошибка при тестировании',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 