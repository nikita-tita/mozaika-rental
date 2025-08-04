import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { CreateDealSchema } from '@/lib/validations'

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

    const deals = await prisma.deal.findMany({
      where: {
        userId: user.userId
      },
      include: {
        client: true,
        property: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: deals
    })

  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

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
    
    // Валидация с помощью Zod
    const validationResult = CreateDealSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(', ')
      return NextResponse.json(
        { success: false, error: `Ошибка валидации: ${errors}` },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    const deal = await prisma.deal.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        amount: validatedData.amount || null,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        userId: user.userId,
        clientId: validatedData.clientId || null,
        propertyId: validatedData.propertyId || null
      },
      include: {
        client: true,
        property: true
      }
    })

    return NextResponse.json({
      success: true,
      data: deal
    })

  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 