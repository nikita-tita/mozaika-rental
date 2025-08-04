import { PrismaClient } from '@prisma/client'
import { verifyPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function testLogin() {
  try {
    console.log('🔍 Проверяем пользователя в базе...')
    
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    if (!user) {
      console.log('❌ Пользователь не найден')
      return
    }

    console.log('✅ Пользователь найден:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      active: user.active,
      verified: user.verified
    })

    console.log('🔑 Проверяем пароль...')
    const isValidPassword = await verifyPassword('test123', user.password)
    console.log('Пароль верный:', isValidPassword)

    if (isValidPassword) {
      console.log('✅ Авторизация должна пройти успешно')
    } else {
      console.log('❌ Пароль неверный')
    }

  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin() 