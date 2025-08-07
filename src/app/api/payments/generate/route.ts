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
    const { dealId, contractId, months = 12 } = body

    if (!dealId && !contractId) {
      return NextResponse.json(
        { success: false, error: 'Необходимо указать ID сделки или договора' },
        { status: 400 }
      )
    }

    let deal, contract

    if (dealId) {
      deal = await prisma.deal.findFirst({
        where: {
          id: dealId,
          userId: user.userId
        },
        include: {
          property: true,
          tenant: true,
          landlord: true
        }
      })

      if (!deal) {
        return NextResponse.json(
          { success: false, error: 'Сделка не найдена' },
          { status: 404 }
        )
      }
    }

    if (contractId) {
      contract = await prisma.contract.findFirst({
        where: {
          id: contractId,
          userId: user.userId
        },
        include: {
          deal: {
            include: {
              property: true,
              tenant: true,
              landlord: true
            }
          }
        }
      })

      if (!contract) {
        return NextResponse.json(
          { success: false, error: 'Договор не найден' },
          { status: 404 }
        )
      }

      deal = contract.deal
    }

    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Сделка не найдена' },
        { status: 404 }
      )
    }

    const generatedPayments = []

    // Генерируем платежи на основе данных сделки
    const startDate = deal.startDate ? new Date(deal.startDate) : new Date()
    const monthlyRent = deal.monthlyRent || deal.property?.price || 0
    const deposit = deal.deposit || 0

    // Депозит (единоразовый платеж)
    if (deposit > 0) {
      const depositPayment = await prisma.payment.create({
        data: {
          type: 'DEPOSIT',
          status: 'PENDING',
          amount: deposit,
          dueDate: startDate,
          userId: user.userId,
          dealId: deal.id,
          contractId: contract?.id,
          propertyId: deal.propertyId,
          depositAmount: deposit,
          description: `Депозит по договору аренды ${deal.property?.title || 'объекта'}`,
          notes: 'Единоразовый платеж при заключении договора'
        }
      })
      generatedPayments.push(depositPayment)
    }

    // Ежемесячные платежи
    for (let i = 0; i < months; i++) {
      const paymentDate = new Date(startDate)
      paymentDate.setMonth(paymentDate.getMonth() + i)

      // Арендная плата
      if (monthlyRent > 0) {
        const rentPayment = await prisma.payment.create({
          data: {
            type: 'RENT',
            status: 'PENDING',
            amount: monthlyRent,
            dueDate: paymentDate,
            userId: user.userId,
            dealId: deal.id,
            contractId: contract?.id,
            propertyId: deal.propertyId,
            rentAmount: monthlyRent,
            description: `Арендная плата за ${paymentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}`,
            notes: `Ежемесячный платеж №${i + 1}`
          }
        })
        generatedPayments.push(rentPayment)
      }

      // Коммунальные услуги (примерно 10% от аренды)
      const utilitiesAmount = Math.round(monthlyRent * 0.1)
      if (utilitiesAmount > 0) {
        const utilitiesPayment = await prisma.payment.create({
          data: {
            type: 'UTILITIES',
            status: 'PENDING',
            amount: utilitiesAmount,
            dueDate: paymentDate,
            userId: user.userId,
            dealId: deal.id,
            contractId: contract?.id,
            propertyId: deal.propertyId,
            utilitiesAmount: utilitiesAmount,
            description: `Коммунальные услуги за ${paymentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}`,
            notes: `Ежемесячный платеж №${i + 1}`
          }
        })
        generatedPayments.push(utilitiesPayment)
      }
    }

    // Создаем уведомление
    await prisma.notification.create({
      data: {
        title: 'Платежи сгенерированы',
        message: `Создано ${generatedPayments.length} платежей на общую сумму ${generatedPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} ₽`,
        type: 'SUCCESS',
        userId: user.userId
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        payments: generatedPayments,
        totalAmount: generatedPayments.reduce((sum, p) => sum + p.amount, 0),
        deal: deal,
        contract: contract
      },
      message: `Успешно создано ${generatedPayments.length} платежей`
    })

  } catch (error) {
    console.error('Error generating payments:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 