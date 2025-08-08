import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id
    
    // Получаем токен из cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    // Получаем объект недвижимости
    const property = await prisma.property.findUnique({
      where: {
        id: propertyId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Объект не найден' },
        { status: 404 }
      )
    }

    // Преобразуем данные в формат, ожидаемый фронтендом
    const propertyWithImages = {
      ...property,
      images: property.images.map((image, index) => ({
        id: `img_${index}`,
        url: image,
        alt: property.title,
        isMain: index === 0
      })),
      amenities: property.features || [],
      owner: property.user,
      pricePerMonth: property.price,
      deposit: property.price * 0.1, // Временное решение - залог 10% от цены
      city: property.address.split(',')[0] || 'Москва',
      rooms: property.bedrooms,
      area: property.area || 0
    }

    return NextResponse.json({
      success: true,
      data: propertyWithImages
    })

  } catch (error) {
    console.error('Ошибка при получении объекта:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id
    
    // Получаем токен из cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Проверяем, что объект существует и принадлежит пользователю
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { success: false, error: 'Объект не найден' },
        { status: 404 }
      )
    }

    if (existingProperty.userId !== user.userId) {
      return NextResponse.json(
        { success: false, error: 'Нет прав для редактирования этого объекта' },
        { status: 403 }
      )
    }

    // Обновляем объект
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        status: body.status,
        address: body.address,
        area: body.area,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        price: body.pricePerMonth,
        features: body.amenities || [],
        images: body.images?.map((img: any) => img.url) || [],
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedProperty,
      message: 'Объект успешно обновлен'
    })

  } catch (error) {
    console.error('Ошибка при обновлении объекта:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id
    
    // Получаем токен из cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    // Проверяем, что объект существует и принадлежит пользователю
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { success: false, error: 'Объект не найден' },
        { status: 404 }
      )
    }

    if (existingProperty.userId !== user.userId) {
      return NextResponse.json(
        { success: false, error: 'Нет прав для удаления этого объекта' },
        { status: 403 }
      )
    }

    // Удаляем объект
    await prisma.property.delete({
      where: { id: propertyId }
    })

    return NextResponse.json({
      success: true,
      message: 'Объект успешно удален'
    })

  } catch (error) {
    console.error('Ошибка при удалении объекта:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 