import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { CreateClientSchema } from '@/lib/validations'

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

    const clients = await prisma.client.findMany({
      where: {
        userId: user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: clients
    })

  } catch (error) {
    console.error('Error fetching clients:', error)
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
    try {
      const validationResult = CreateClientSchema.safeParse(body)

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message).join(', ')
        return NextResponse.json(
          { success: false, error: `Ошибка валидации: ${errors}` },
          { status: 400 }
        )
      }

      const validatedData = validationResult.data

      const client = await prisma.client.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          middleName: validatedData.middleName || null,
          email: validatedData.email || null,
          phone: validatedData.phone,
          birthDate: validatedData.birthDate || null,
          type: validatedData.type || 'TENANT',
          passport: validatedData.passport || null,
          snils: validatedData.snils || null,
          inn: validatedData.inn || null,
          address: validatedData.address || null,
          city: validatedData.city || null,
          notes: validatedData.notes || null,
          source: validatedData.source || null,
          isActive: true,
          userId: user.userId
        }
      })

      return NextResponse.json({
        success: true,
        data: client
      })
    } catch (error) {
      console.error('Validation error:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка валидации данных' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 