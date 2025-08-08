import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, checkUserExists } from '@/lib/simple-auth'

export async function OPTIONS() {
  const response = new NextResponse(null, {
    status: 200,
  })

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Проверка пользователей в БД')
    
    // Получаем всех пользователей
    const users = await getAllUsers()
    
    console.log('✅ Найдено пользователей:', users.length)
    
    return NextResponse.json({
      success: true,
      data: {
        totalUsers: users.length,
        users: users
      },
      message: `Найдено ${users.length} пользователей в БД`
    })
  } catch (error) {
    console.error('Ошибка проверки пользователей:', error)
    return NextResponse.json({
      success: false,
      message: 'Ошибка при проверке пользователей'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email обязателен'
      }, { status: 400 })
    }

    console.log('🔍 Проверка существования пользователя:', email)
    
    // Проверяем существование пользователя
    const exists = await checkUserExists(email)
    
    console.log('✅ Результат проверки:', exists ? 'пользователь найден' : 'пользователь не найден')
    
    return NextResponse.json({
      success: true,
      data: {
        email: email,
        exists: exists
      },
      message: exists ? 'Пользователь найден в БД' : 'Пользователь не найден в БД'
    })
  } catch (error) {
    console.error('Ошибка проверки пользователя:', error)
    return NextResponse.json({
      success: false,
      message: 'Ошибка при проверке пользователя'
    }, { status: 500 })
  }
} 