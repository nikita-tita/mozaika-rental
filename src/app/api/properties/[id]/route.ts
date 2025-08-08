import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Получение объекта недвижимости:', params.id)
    
    const property = await prisma.property.findUnique({
      where: {
        id: params.id
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    if (!property) {
      console.log('❌ Объект не найден:', params.id)
      return NextResponse.json(
        { success: false, error: 'Объект не найден' },
        { status: 404 }
      )
    }

    console.log('✅ Объект найден:', property.title)
    return NextResponse.json({
      success: true,
      data: property
    })

  } catch (error) {
    console.error('❌ Ошибка получения объекта:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Обновление объекта недвижимости:', params.id)
    
    const body = await request.json()
    
    const property = await prisma.property.update({
      where: {
        id: params.id
      },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        address: body.address,
        price: body.price || body.pricePerMonth || 0,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        area: body.area,
        features: body.features || []
      }
    })

    console.log('✅ Объект обновлен:', property.title)
    return NextResponse.json({
      success: true,
      data: property
    })

  } catch (error) {
    console.error('❌ Ошибка обновления объекта:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Удаление объекта недвижимости:', params.id)
    
    await prisma.property.delete({
      where: {
        id: params.id
      }
    })

    console.log('✅ Объект удален:', params.id)
    return NextResponse.json({
      success: true,
      message: 'Объект успешно удален'
    })

  } catch (error) {
    console.error('❌ Ошибка удаления объекта:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 