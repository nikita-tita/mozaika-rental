import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET /api/properties - Получить список недвижимости с фильтрами
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const city = searchParams.get('city')
    const district = searchParams.get('district')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minArea = searchParams.get('minArea')
    const maxArea = searchParams.get('maxArea')
    const rooms = searchParams.get('rooms')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Формируем фильтры
    const where: any = {
      status: 'AVAILABLE'
    }

    if (type && type !== 'ALL') {
      where.type = type
    }

    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive'
      }
    }

    if (district) {
      where.district = {
        contains: district,
        mode: 'insensitive'
      }
    }

    if (minPrice || maxPrice) {
      where.pricePerMonth = {}
      if (minPrice) where.pricePerMonth.gte = parseFloat(minPrice)
      if (maxPrice) where.pricePerMonth.lte = parseFloat(maxPrice)
    }

    if (minArea || maxArea) {
      where.area = {}
      if (minArea) where.area.gte = parseFloat(minArea)
      if (maxArea) where.area.lte = parseFloat(maxArea)
    }

    if (rooms) {
      where.rooms = parseInt(rooms)
    }

    // Получаем общее количество
    const total = await prisma.property.count({ where })

    // Получаем недвижимость с пагинацией
    const properties = await prisma.property.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    })

    // Вычисляем средний рейтинг для каждого объекта
    const propertiesWithRating = await Promise.all(
      properties.map(async (property) => {
        const reviews = await prisma.review.findMany({
          where: { propertyId: property.id },
          select: { rating: true }
        })
        
        const averageRating = reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0

        return {
          ...property,
          averageRating: Math.round(averageRating * 10) / 10
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: propertiesWithRating,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Properties fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST /api/properties - Создать новую недвижимость
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user || (user.role !== 'REALTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Только риелторы и администраторы могут создавать недвижимость' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      type,
      address,
      city,
      district,
      area,
      rooms,
      bedrooms,
      bathrooms,
      floor,
      totalFloors,
      pricePerMonth,
      deposit,
      utilities,
      amenities
    } = body

    // Валидация обязательных полей
    if (!title || !type || !address || !city || !area || !pricePerMonth) {
      return NextResponse.json(
        { success: false, error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      )
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        type,
        address,
        city,
        district,
        area: parseFloat(area),
        rooms: rooms ? parseInt(rooms) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        floor: floor ? parseInt(floor) : null,
        totalFloors: totalFloors ? parseInt(totalFloors) : null,
        pricePerMonth: parseFloat(pricePerMonth),
        deposit: deposit ? parseFloat(deposit) : null,
        utilities: Boolean(utilities),
        amenities: amenities || [],
        ownerId: user.userId,
        status: 'DRAFT'
      },
      include: {
        images: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: property,
      message: 'Недвижимость успешно создана'
    })

  } catch (error) {
    console.error('Property creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}