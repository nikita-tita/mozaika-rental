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
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ success: false, error: "Не авторизован" }, { status: 401 })
    }
    
    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json({ success: false, error: "Недействительный токен" }, { status: 401 })
    }
    
    const body = await request.json()
    
    console.log('Received deal data:', body)
    
    // Валидация обязательных полей
    if (!body.title) {
      return NextResponse.json({ 
        success: false, 
        error: "Название сделки обязательно" 
      }, { status: 400 })
    }
    
    if (!body.propertyId) {
      return NextResponse.json({ 
        success: false, 
        error: "Объект недвижимости обязателен" 
      }, { status: 400 })
    }
    
    if (!body.tenantId) {
      return NextResponse.json({ 
        success: false, 
        error: "Арендатор обязателен" 
      }, { status: 400 })
    }
    
    if (!body.landlordId) {
      return NextResponse.json({ 
        success: false, 
        error: "Арендодатель обязателен" 
      }, { status: 400 })
    }
    
    const deal = await prisma.deal.create({
      data: {
        title: body.title,
        description: body.description || "",
        status: "IN_PROGRESS",
        monthlyRent: body.monthlyRent ? parseFloat(body.monthlyRent) : null,
        deposit: body.deposit ? parseFloat(body.deposit) : null,
        commission: body.commission ? parseFloat(body.commission) : null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        propertyId: body.propertyId,
        tenantId: body.tenantId,
        landlordId: body.landlordId,
        userId: user.userId
      },
      include: {
        property: true,
        tenant: true,
        landlord: true,
        client: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: deal,
      message: "Сделка успешно создана"
    })
    
  } catch (error) {
    console.error("Error creating deal:", error)
    
    // Более детальная обработка ошибок Prisma
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        success: false, 
        error: "Сделка с таким названием уже существует" 
      }, { status: 400 })
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        success: false, 
        error: "Указанный объект недвижимости, арендатор или арендодатель не найден" 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Внутренняя ошибка сервера" 
    }, { status: 500 })
  }
}
