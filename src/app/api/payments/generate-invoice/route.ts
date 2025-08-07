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
    const { paymentId } = body

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

    // Генерируем номер счета
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Создаем PDF счет (в реальном проекте здесь будет генерация PDF)
    const invoicePdf = `/invoices/${invoiceNumber}.pdf`

    // Обновляем платеж
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        invoiceNumber,
        invoicePdf,
        invoiceSentAt: new Date()
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

    // Формируем данные для PDF
    const invoiceData = {
      invoiceNumber,
      invoiceDate: new Date().toLocaleDateString('ru-RU'),
      payment: updatedPayment,
      totalAmount: updatedPayment.amount,
      breakdown: {
        rent: updatedPayment.rentAmount || 0,
        utilities: updatedPayment.utilitiesAmount || 0,
        deposit: updatedPayment.depositAmount || 0,
        penalty: updatedPayment.penaltyAmount || 0
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        payment: updatedPayment,
        invoiceData,
        pdfUrl: invoicePdf
      },
      message: 'Счет успешно сгенерирован'
    })

  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 