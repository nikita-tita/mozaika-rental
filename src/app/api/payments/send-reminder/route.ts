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
    const { paymentId, reminderType = 'EMAIL' } = body

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'ID платежа обязателен' },
        { status: 400 }
      )
    }

    // Получаем платеж с связанными данными
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: user.userId
      },
      include: {
        deal: {
          include: {
            property: true,
            tenant: true,
            landlord: true
          }
        },
        contract: true,
        property: true
      }
    })

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Платеж не найден' },
        { status: 404 }
      )
    }

    // Получаем контактные данные арендатора
    const tenant = payment.deal?.tenant || payment.deal?.client
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'Арендатор не найден' },
        { status: 404 }
      )
    }

    // Формируем текст напоминания
    const reminderText = `Уважаемый ${tenant.firstName} ${tenant.lastName}!

Напоминаем о необходимости оплаты по договору аренды.

Детали платежа:
- Объект: ${payment.deal?.property?.title || payment.property?.title || 'Не указан'}
- Сумма к оплате: ${payment.amount.toLocaleString()} ₽
- Срок оплаты: ${payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('ru-RU') : 'Не указан'}
- Тип платежа: ${getPaymentTypeLabel(payment.type)}

Просим произвести оплату в установленные сроки.

С уважением,
Команда М2 Аренда`

    // В реальном проекте здесь будет отправка email/SMS
    console.log('Отправка напоминания:', {
      to: tenant.email || tenant.phone,
      type: reminderType,
      text: reminderText
    })

    // Обновляем платеж
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        reminderSentAt: new Date(),
        reminderCount: {
          increment: 1
        },
        lastReminderType: reminderType
      },
      include: {
        deal: {
          include: {
            property: true,
            tenant: true,
            landlord: true
          }
        },
        contract: true,
        property: true
      }
    })

    // Создаем уведомление
    await prisma.notification.create({
      data: {
        title: 'Напоминание отправлено',
        message: `Напоминание о платеже ${payment.amount.toLocaleString()} ₽ отправлено арендатору ${tenant.firstName} ${tenant.lastName}`,
        type: 'SUCCESS',
        userId: user.userId
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        payment: updatedPayment,
        reminderSent: true,
        reminderType,
        recipient: {
          name: `${tenant.firstName} ${tenant.lastName}`,
          contact: tenant.email || tenant.phone
        }
      },
      message: 'Напоминание успешно отправлено'
    })

  } catch (error) {
    console.error('Error sending reminder:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

function getPaymentTypeLabel(type: string): string {
  switch (type) {
    case 'RENT':
      return 'Арендная плата'
    case 'UTILITIES':
      return 'Коммунальные услуги'
    case 'DEPOSIT':
      return 'Депозит'
    case 'MAINTENANCE':
      return 'Обслуживание'
    default:
      return 'Платеж'
  }
} 