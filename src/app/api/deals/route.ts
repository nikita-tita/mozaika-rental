import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

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

    const deals = await prisma.deal.findMany({
      where: {
        userId: user.userId,
        status: {
          in: ['COMPLETED', 'IN_PROGRESS']
        }
      },
      include: {
        property: true,
        tenant: true,
        landlord: true,
        client: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: deals
    })

  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value; if (!token) { return NextResponse.json({ success: false, error: "Не авторизован" }, { status: 401 }); } const user = verifyJWTToken(token); if (!user) { return NextResponse.json({ success: false, error: "Недействительный токен" }, { status: 401 }); } const body = await request.json(); const deal = await prisma.deal.create({ data: { title: body.title || "Новая сделка", description: body.description || "", status: "DRAFT", monthlyRent: body.monthlyRent || 0, deposit: body.deposit || 0, startDate: body.startDate ? new Date(body.startDate) : null, endDate: body.endDate ? new Date(body.endDate) : null, propertyId: body.propertyId, tenantId: body.tenantId, landlordId: body.landlordId, userId: user.userId }, include: { property: true, tenant: true, landlord: true, client: true } }); return NextResponse.json({ success: true, data: deal, message: "Сделка успешно создана" }); } catch (error) { console.error("Error creating deal:", error); return NextResponse.json({ success: false, error: "Внутренняя ошибка сервера" }, { status: 500 }); } }
