import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { CreateClientSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const clientId = params.id

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

    return NextResponse.json({
      success: true,
      data: client
    })

  } catch (error) {
    console.error('Error fetching client:', error)
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

    const clientId = params.id
    const body = await request.json()

    // Проверяем, что клиент принадлежит пользователю
    const existingClient = await prisma.client.findUnique({
      where: {
        id: clientId,
        userId: user.userId
      }
    })

    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: 'Клиент не найден' },
        { status: 404 }
      )
    }

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

      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          middleName: validatedData.middleName || null,
          email: validatedData.email || null,
          phone: validatedData.phone,
          birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
          type: validatedData.type,
          passport: validatedData.passport || null,
          snils: validatedData.snils || null,
          inn: validatedData.inn || null,
          address: validatedData.address || null,
          city: validatedData.city || null,
          notes: validatedData.notes || null,
          source: validatedData.source || null
        }
      })

      return NextResponse.json({
        success: true,
        data: updatedClient
      })
    } catch (error) {
      console.error('Validation error:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка валидации данных' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error updating client:', error)
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

    const clientId = params.id

    // Проверяем, что клиент принадлежит пользователю
    const existingClient = await prisma.client.findUnique({
      where: {
        id: clientId,
        userId: user.userId
      }
    })

    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: 'Клиент не найден' },
        { status: 404 }
      )
    }

    // Удаляем клиента
    await prisma.client.delete({
      where: { id: clientId }
    })

    return NextResponse.json({
      success: true,
      message: 'Клиент успешно удален'
    })

  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 