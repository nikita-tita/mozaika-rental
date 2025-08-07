import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId()
  const propertyId = params.id
  
  return ApiErrorHandler.withErrorHandling(async () => {
    // Получаем токен из заголовка Authorization или cookie
    const authHeader = request.headers.get('authorization')
    let token = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      token = request.cookies.get('auth-token')?.value
    }
    
    if (!token) {
      throw new Error('Unauthorized: No token provided')
    }

    const user = verifyJWTToken(token)
    if (!user) {
      throw new Error('Unauthorized: Invalid token')
    }

    logger.info('Fetching property details', { propertyId, userId: user.userId }, user.userId, requestId)

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
      throw new Error(`Property not found: ${propertyId}`)
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

    logger.info('Property details fetched successfully', { propertyId }, user.userId, requestId)

    return NextResponse.json({
      success: true,
      data: propertyWithImages
    })
  }, {
    method: 'GET',
    path: `/api/properties/${propertyId}`,
    userId: undefined,
    requestId
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId()
  const propertyId = params.id
  
  return ApiErrorHandler.withErrorHandling(async () => {
    // Получаем токен из заголовка Authorization или cookie
    const authHeader = request.headers.get('authorization')
    let token = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      token = request.cookies.get('auth-token')?.value
    }
    
    if (!token) {
      throw new Error('Unauthorized: No token provided')
    }

    const user = verifyJWTToken(token)
    if (!user) {
      throw new Error('Unauthorized: Invalid token')
    }

    const body = await request.json()

    logger.info('Updating property', { propertyId, userId: user.userId, updateData: body }, user.userId, requestId)

    // Проверяем, что объект принадлежит пользователю
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!existingProperty) {
      throw new Error(`Property not found: ${propertyId}`)
    }

    if (existingProperty.userId !== user.userId) {
      throw new Error(`Property access denied: ${propertyId} for user ${user.userId}`)
    }

    // Обновляем объект
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        address: body.address,
        price: body.pricePerMonth,
        area: body.area,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        features: body.features || []
      }
    })

    logger.info('Property updated successfully', { propertyId }, user.userId, requestId)

    return NextResponse.json({
      success: true,
      data: updatedProperty
    })
  }, {
    method: 'PUT',
    path: `/api/properties/${propertyId}`,
    userId: undefined,
    requestId
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Получаем токен из заголовка Authorization или cookie
    const authHeader = request.headers.get('authorization')
    let token = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      token = request.cookies.get('auth-token')?.value
    }
    
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

    const propertyId = params.id

    // Проверяем, что объект принадлежит пользователю
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { success: false, error: 'Объект недвижимости не найден' },
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
      message: 'Объект недвижимости успешно удален'
    })

  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 