import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, sanitizeUser } from '@/lib/auth'
import { validateEmail } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone, role } = body

    console.log('Registration attempt:', { email, firstName, lastName, role })

    // Валидация
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Некорректный email адрес' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      )
    }

    // Проверяем существование пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      )
    }

    // Хешируем пароль
    const hashedPassword = await hashPassword(password)

    // Создаем пользователя
    console.log('Creating user with data:', { email, firstName, lastName, role })
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role: role || 'REALTOR'
      }
    })

    console.log('User created successfully:', user.id)

    return NextResponse.json({
      success: true,
      data: sanitizeUser(user),
      message: 'Пользователь успешно зарегистрирован'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}