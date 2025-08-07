import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
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
    const { clientId, propertyId, linkType, comment } = body

    // Проверяем, что клиент принадлежит пользователю
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
        userId: user.userId
      }
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Клиент не найден' },
        { status: 404 }
      )
    }

    // Проверяем, что объект принадлежит пользователю
    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
        userId: user.userId
      }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Объект недвижимости не найден' },
        { status: 404 }
      )
    }

    // Проверяем, не существует ли уже такая связь
    const existingLink = await prisma.clientPropertyLink.findFirst({
      where: {
        clientId,
        propertyId,
        linkType
      }
    })

    if (existingLink) {
      return NextResponse.json(
        { success: false, error: 'Такая связь уже существует' },
        { status: 400 }
      )
    }

    // Создаем связь
    const link = await prisma.clientPropertyLink.create({
      data: {
        clientId,
        propertyId,
        linkType,
        comment: comment || null,
        userId: user.userId
      },
      include: {
        property: true,
        client: true
      }
    })

    return NextResponse.json({
      success: true,
      data: link,
      message: 'Связь успешно создана'
    })

  } catch (error) {
    console.error('Error creating property link:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const propertyId = searchParams.get('propertyId')

    const where: any = {
      userId: user.userId
    }

    if (clientId) {
      where.clientId = clientId
    }

    if (propertyId) {
      where.propertyId = propertyId
    }

    const links = await prisma.clientPropertyLink.findMany({
      where,
      include: {
        property: true,
        client: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: links
    })

  } catch (error) {
    console.error('Error fetching property links:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 