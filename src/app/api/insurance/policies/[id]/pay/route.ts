import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// POST /api/insurance/policies/[id]/pay - оплатить полис
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await auth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { paymentMethod, transactionId } = body

    // Проверяем, что полис существует и принадлежит пользователю
    const policy = await prisma.insurancePolicy.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
    }

    if (policy.status === 'ACTIVE') {
      return NextResponse.json(
        { error: 'Policy is already active' },
        { status: 400 }
      )
    }

    // Создаем запись об оплате
    const payment = await prisma.insurancePayment.create({
      data: {
        amount: policy.premium,
        status: 'PAID',
        paymentMethod,
        transactionId: transactionId || `TXN-${Date.now()}`,
        paidAt: new Date(),
        policyId: params.id
      }
    })

    // Обновляем статус полиса на активный
    const updatedPolicy = await prisma.insurancePolicy.update({
      where: {
        id: params.id
      },
      data: {
        status: 'ACTIVE'
      },
      include: {
        property: true,
        payments: true
      }
    })

    // Создаем уведомление об успешной оплате
    await prisma.notification.create({
      data: {
        title: 'Полис страхования оплачен',
        message: `Полис ${policy.policyNumber} успешно оплачен и активирован`,
        type: 'SUCCESS',
        userId: user.id,
        policyId: params.id
      }
    })

    return NextResponse.json({
      policy: updatedPolicy,
      payment
    })
  } catch (error) {
    console.error('Error processing insurance payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 