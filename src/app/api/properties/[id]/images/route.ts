import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

interface RouteContext {
  params: { id: string }
}

// POST /api/properties/[id]/images - Добавить изображения к недвижимости
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    const propertyId = params.id
    const body = await request.json()
    const { images } = body

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Изображения не найдены' },
        { status: 400 }
      )
    }

    // Проверяем, что недвижимость существует и принадлежит пользователю
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        ownerId: user.userId
      }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Недвижимость не найдена или нет доступа' },
        { status: 404 }
      )
    }

    // Создаем записи изображений в базе данных
    const imageRecords = images.map((url: string, index: number) => ({
      url,
      propertyId,
      order: index,
      alt: `Фото ${property.title} ${index + 1}`
    }))

    await prisma.propertyImage.createMany({
      data: imageRecords
    })

    // Получаем созданные изображения
    const createdImages = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: createdImages,
      message: 'Изображения успешно добавлены'
    })

  } catch (error) {
    console.error('Property images creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// GET /api/properties/[id]/images - Получить изображения недвижимости
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const propertyId = params.id

    const images = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: images
    })

  } catch (error) {
    console.error('Property images fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE /api/properties/[id]/images - Удалить изображение
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    const propertyId = params.id
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'ID изображения не указан' },
        { status: 400 }
      )
    }

    // Проверяем, что недвижимость принадлежит пользователю
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        ownerId: user.userId
      }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Недвижимость не найдена или нет доступа' },
        { status: 404 }
      )
    }

    // Удаляем изображение
    await prisma.propertyImage.delete({
      where: {
        id: imageId,
        propertyId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Изображение успешно удалено'
    })

  } catch (error) {
    console.error('Property image deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}