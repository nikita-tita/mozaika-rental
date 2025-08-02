import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Проверяем подключение к базе данных
    await prisma.$connect()
    
    // Получаем количество пользователей
    const userCount = await prisma.user.count()
    
    // Получаем схему базы данных
    const tables = await prisma.$queryRaw<Array<{table_name: string}>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    
    return NextResponse.json({
      success: true,
      message: 'Подключение к базе данных успешно',
      data: {
        connected: true,
        userCount,
        tables: tables.map((t) => t.table_name)
      }
    })

  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка подключения к базе данных',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 