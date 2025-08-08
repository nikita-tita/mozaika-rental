import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

// GET /api/insurance/policies - получить все полисы пользователя
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const policies = await prisma.insurancePolicy.findMany({
      where: {
        userId: user.userId
      },
      include: {
        property: true,
        payments: true,
        claims: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(policies)
  } catch (error) {
    console.error('Error fetching insurance policies:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/insurance/policies - создать новый полис
export async function POST(request: NextRequest) {
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
    const {
      type,
      insuredAmount,
      deductible,
      premium,
      startDate,
      endDate,
      insuranceCompany,
      propertyId
    } = body

    // Генерируем номер полиса
    const policyNumber = `POL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const policy = await prisma.insurancePolicy.create({
      data: {
        policyNumber,
        type,
        status: 'DRAFT',
        insuredAmount: parseFloat(insuredAmount),
        deductible: parseFloat(deductible),
        premium: parseFloat(premium),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        insuranceCompany,
        propertyId: propertyId || null,
        userId: user.userId
      },
      include: {
        property: true
      }
    })

    return NextResponse.json(policy, { status: 201 })
  } catch (error) {
    console.error('Error creating insurance policy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 