import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Проверяем, существует ли колонка features
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'properties' 
      AND column_name = 'features'
    `

    if (!result || (result as any[]).length === 0) {
      // Добавляем колонку features
      await prisma.$executeRaw`ALTER TABLE properties ADD COLUMN features TEXT[] DEFAULT '{}'`
      console.log('✅ Колонка features добавлена')
    }

    // Проверяем, существует ли колонка images
    const imagesResult = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'properties' 
      AND column_name = 'images'
    `

    if (!imagesResult || (imagesResult as any[]).length === 0) {
      // Добавляем колонку images
      await prisma.$executeRaw`ALTER TABLE properties ADD COLUMN images TEXT[] DEFAULT '{}'`
      console.log('✅ Колонка images добавлена')
    }

    // Проверяем, существует ли колонка price
    const priceResult = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'properties' 
      AND column_name = 'price'
    `

    if (!priceResult || (priceResult as any[]).length === 0) {
      // Добавляем колонку price
      await prisma.$executeRaw`ALTER TABLE properties ADD COLUMN price DECIMAL(10,2) DEFAULT 0`
      console.log('✅ Колонка price добавлена')
    }

    // Проверяем, существует ли колонка status
    const statusResult = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'properties' 
      AND column_name = 'status'
    `

    if (!statusResult || (statusResult as any[]).length === 0) {
      // Добавляем колонку status
      await prisma.$executeRaw`ALTER TABLE properties ADD COLUMN status TEXT DEFAULT 'AVAILABLE'`
      console.log('✅ Колонка status добавлена')
    }

    // Проверяем, существует ли колонка userId
    const userIdResult = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'properties' 
      AND column_name = 'userId'
    `

    if (!userIdResult || (userIdResult as any[]).length === 0) {
      // Добавляем колонку userId
      await prisma.$executeRaw`ALTER TABLE properties ADD COLUMN "userId" TEXT`
      console.log('✅ Колонка userId добавлена')
    }

    // Проверяем, существует ли колонка city
    const cityResult = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'properties' 
      AND column_name = 'city'
    `

    if (!cityResult || (cityResult as any[]).length === 0) {
      // Добавляем колонку city
      await prisma.$executeRaw`ALTER TABLE properties ADD COLUMN city TEXT`
      console.log('✅ Колонка city добавлена')
    }

    return NextResponse.json({
      success: true,
      message: 'База данных обновлена успешно'
    })

  } catch (error) {
    console.error('Ошибка обновления базы данных:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка обновления базы данных' },
      { status: 500 }
    )
  }
} 