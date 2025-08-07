import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

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

    const linkId = params.id

    // Проверяем, что связь принадлежит пользователю
    const existingLink = await prisma.clientPropertyLink.findUnique({
      where: {
        id: linkId,
        userId: user.userId
      }
    })

    if (!existingLink) {
      return NextResponse.json(
        { success: false, error: 'Связь не найдена' },
        { status: 404 }
      )
    }

    // Удаляем связь
    await prisma.clientPropertyLink.delete({
      where: { id: linkId }
    })

    return NextResponse.json({
      success: true,
      message: 'Связь успешно удалена'
    })

  } catch (error) {
    console.error('Error deleting property link:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 