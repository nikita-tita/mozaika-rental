import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Тестирование подключения к БД')
    
    // Проверяем подключение к БД
    await prisma.$connect()
    console.log('✅ Подключение к БД успешно')
    
    // Пробуем получить количество пользователей
    const userCount = await prisma.user.count()
    console.log('✅ Количество пользователей в БД:', userCount)
    
    // Пробуем получить количество клиентов
    const clientCount = await prisma.client.count()
    console.log('✅ Количество клиентов в БД:', clientCount)
    
    // Пробуем получить количество объектов недвижимости
    const propertyCount = await prisma.property.count()
    console.log('✅ Количество объектов недвижимости в БД:', propertyCount)
    
    return NextResponse.json({
      success: true,
      message: 'Подключение к БД работает',
      data: {
        database: 'Connected',
        users: userCount,
        clients: clientCount,
        properties: propertyCount,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error)
    return NextResponse.json({
      success: false,
      message: 'Ошибка подключения к БД',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    console.log('🔍 Тестовый POST запрос:', action)

    switch (action) {
      case 'test-connection':
        await prisma.$connect()
        await prisma.$disconnect()
        return NextResponse.json({
          success: true,
          message: 'Подключение к БД работает',
          timestamp: new Date().toISOString()
        })

      case 'get-stats':
        const userCount = await prisma.user.count()
        const clientCount = await prisma.client.count()
        const propertyCount = await prisma.property.count()
        
        return NextResponse.json({
          success: true,
          data: {
            users: userCount,
            clients: clientCount,
            properties: propertyCount
          },
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          success: false,
          message: 'Неизвестное действие',
          timestamp: new Date().toISOString()
        }, { status: 400 })
    }
  } catch (error) {
    console.error('❌ Ошибка в POST запросе:', error)
    return NextResponse.json({
      success: false,
      message: 'Ошибка обработки запроса',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 