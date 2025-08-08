import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

// GET /api/insurance/policies/[id] - получить конкретный полис
export async function GET(
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

    const policy = await prisma.insurancePolicy.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      },
      include: {
        property: true,
        payments: true,
        claims: true
      }
    })

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
    }

    return NextResponse.json(policy)
  } catch (error) {
    console.error('Error fetching insurance policy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/insurance/policies/[id] - обновить полис
export async function PUT(
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
    const {
      type,
      insuredAmount,
      deductible,
      premium,
      startDate,
      endDate,
      insuranceCompany,
      propertyId,
      status
    } = body

    const policy = await prisma.insurancePolicy.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
    }

    const updatedPolicy = await prisma.insurancePolicy.update({
      where: {
        id: params.id
      },
      data: {
        type,
        insuredAmount: parseFloat(insuredAmount),
        deductible: parseFloat(deductible),
        premium: parseFloat(premium),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        insuranceCompany,
        propertyId: propertyId || null,
        status
      },
      include: {
        property: true
      }
    })

    return NextResponse.json(updatedPolicy)
  } catch (error) {
    console.error('Error updating insurance policy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/insurance/policies/[id] - удалить полис
export async function DELETE(
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

    const policy = await prisma.insurancePolicy.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
    }

    await prisma.insurancePolicy.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Policy deleted successfully' })
  } catch (error) {
    console.error('Error deleting insurance policy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 