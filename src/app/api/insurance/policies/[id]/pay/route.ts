import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

// POST /api/insurance/policies/[id]/pay - оплатить полис
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { paymentMethod, amount } = body

    // Проверяем, что полис существует и принадлежит пользователю
    const policy = await prisma.insurancePolicy.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
    }

    // Создаем запись об оплате
    const payment = await prisma.insurancePayment.create({
      data: {
        policyId: params.id,
        amount: parseFloat(amount),
        paymentMethod,
        status: 'PENDING'
      }
    })

    // Обновляем статус полиса
    await prisma.insurancePolicy.update({
      where: { id: params.id },
      data: { status: 'ACTIVE' }
    })

    return NextResponse.json({
      success: true,
      payment,
      message: 'Payment processed successfully'
    })
  } catch (error) {
    console.error('Error processing insurance payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 