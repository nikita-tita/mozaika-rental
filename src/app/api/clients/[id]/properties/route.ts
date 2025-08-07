import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

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

    // Получаем связи клиента с объектами
    const links = await prisma.clientPropertyLink.findMany({
      where: {
        clientId,
        userId: user.userId
      },
      include: {
        property: true
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
    console.error('Error fetching client properties:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 