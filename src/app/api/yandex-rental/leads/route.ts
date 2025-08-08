import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

// GET /api/yandex-rental/leads - Получить все лиды пользователя
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

    // Получаем лиды пользователя
    const leads = await prisma.yandexRentalLead.findMany({
      where: { userId: user.userId },
      orderBy: { submittedAt: 'desc' }
    })

    // Рассчитываем статистику
    const total = leads.length
    const completed = leads.filter(lead => lead.status === 'OCCUPIED').length
    const totalEarnings = leads
      .filter(lead => lead.status === 'OCCUPIED' && lead.commission)
      .reduce((sum, lead) => sum + (lead.commission || 0), 0)
    
    const avgTimeToRent = completed > 0 
      ? leads
          .filter(lead => lead.status === 'OCCUPIED')
          .reduce((sum, lead) => {
            const submitted = new Date(lead.submittedAt)
            const updated = new Date(lead.updatedAt)
            return sum + (updated.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24)
          }, 0) / completed
      : 0

    return NextResponse.json({
      success: true,
      leads,
      stats: {
        total,
        completed,
        totalEarnings,
        avgTimeToRent: Math.round(avgTimeToRent)
      }
    })

  } catch (error) {
    console.error('Ошибка при получении лидов:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST /api/yandex-rental/leads - Создать новый лид
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
    const {
      ownerName,
      phone,
      email,
      address,
      rentAmount,
      rentPeriod,
      commission,
      comment
    } = body

    // Валидация обязательных полей
    if (!ownerName || !phone || !address || !rentAmount) {
      return NextResponse.json(
        { success: false, error: 'Необходимо заполнить все обязательные поля' },
        { status: 400 }
      )
    }

    // Создаем новый лид
    const lead = await prisma.yandexRentalLead.create({
      data: {
        ownerName,
        phone,
        email: email || null,
        address,
        rentAmount: parseFloat(rentAmount),
        rentPeriod: parseInt(rentPeriod) || 11,
        commission: commission ? parseFloat(commission) : null,
        comment: comment || null,
        status: 'SUBMITTED',
        userId: user.userId
      }
    })

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Контакт собственника успешно передан'
    })

  } catch (error) {
    console.error('Ошибка при создании лида:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 