import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken, sanitizeUser } from '@/lib/auth'
import { validateEmail } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { withRequestLogging, getRequestId } from '@/lib/request-logger'
import { logger } from '@/lib/logger'

async function loginHandler(request: NextRequest) {
  const requestId = getRequestId(request)
  
  try {
    const body = await request.json()
    const { email, password } = body

    logger.debug('Login attempt', { email }, undefined, requestId)

    // Валидация
    if (!email || !password) {
      logger.warn('Login validation failed: missing credentials', { email }, undefined, requestId)
      return NextResponse.json(
        { success: false, error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      logger.warn('Login validation failed: invalid email', { email }, undefined, requestId)
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
      logger.warn('Login failed: user not found', { email }, undefined, requestId)
      return NextResponse.json(
        { success: false, error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Проверка пароля
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      logger.warn('Login failed: invalid password', { email }, undefined, requestId)
      return NextResponse.json(
        { success: false, error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Генерация токена
    const token = generateToken(user.id, user.email, user.role)

    logger.info('User logged in successfully', { userId: user.id, email: user.email }, user.id, requestId)

    // Создание ответа с токеном в cookie
    const response = NextResponse.json({
      success: true,
      data: sanitizeUser(user),
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
    logger.error('Login error', { error: error instanceof Error ? error.message : String(error) }, undefined, requestId)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export const POST = withRequestLogging(loginHandler)