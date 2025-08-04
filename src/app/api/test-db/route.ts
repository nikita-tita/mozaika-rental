import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Проверяем подключение к базе данных
    await prisma.$connect()
    
    // Пытаемся найти тестового пользователя (без колонки active)
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        verified: true,
        createdAt: true
      }
    })

    // Получаем общее количество пользователей
    const userCount = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: 'Подключение к базе данных успешно',
      data: {
        connected: true,
        testUserExists: !!testUser,
        testUser: testUser,
        totalUsers: userCount,
        databaseUrl: process.env.DATABASE_URL ? 'Настроен' : 'Не настроен'
      }
    })
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error)
    return NextResponse.json({
      success: false,
      message: 'Ошибка подключения к базе данных',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 