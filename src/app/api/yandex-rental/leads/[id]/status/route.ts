import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

// PATCH /api/yandex-rental/leads/[id]/status - Обновить статус лида
export async function PATCH(
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

    const body = await request.json()
    const { status, comment } = body
    const leadId = params.id

    // Проверяем, что лид существует и принадлежит пользователю
    const existingLead = await prisma.yandexRentalLead.findUnique({
      where: { id: leadId }
    })

    if (!existingLead) {
      return NextResponse.json(
        { success: false, error: 'Лид не найден' },
        { status: 404 }
      )
    }

    if (existingLead.userId !== user.userId) {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Валидация статуса
    const validStatuses = [
      'SUBMITTED',
      'CALLED_OWNER',
      'PHOTO_SCHEDULED',
      'PUBLISHED',
      'FIRST_SHOWING',
      'CONTRACT_SIGNED',
      'OCCUPIED',
      'FAILED'
    ]

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Неверный статус' },
        { status: 400 }
      )
    }

    // Обновляем статус лида
    const updatedLead = await prisma.yandexRentalLead.update({
      where: { id: leadId },
      data: {
        status,
        updatedAt: new Date()
      }
    })

    // Создаем запись в истории статусов
    await prisma.yandexLeadStatusHistory.create({
      data: {
        leadId,
        status,
        comment: comment || null
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: `Статус лида изменен на "${status}"`
    })

  } catch (error) {
    console.error('Ошибка при обновлении статуса лида:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 