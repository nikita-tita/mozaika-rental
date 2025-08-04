import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Проверка подключения к базе данных
    await prisma.$queryRaw`SELECT 1`
    
    // Получение статистики
    const userCount = await prisma.user.count()
    const propertyCount = await prisma.property.count()
    
    return NextResponse.json({
      success: true,
      status: 'operational',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        userCount,
        propertyCount
      },
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    console.error('Status check failed:', error)
    
    return NextResponse.json({
      success: false,
      status: 'error',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }, { status: 500 })
  }
} 