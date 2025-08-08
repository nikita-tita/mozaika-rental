import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function createSimpleUser() {
  try {
    // Создаем пользователя с простыми данными
    const hashedPassword = await hashPassword('123456')
    
    const user = await prisma.user.create({
      data: {
        email: 'user@test.com',
        password: hashedPassword,
        firstName: 'Простой',
        lastName: 'Пользователь',
        phone: '+7 (999) 000-00-00',
        role: 'REALTOR',
        verified: true
      }
    })
    
    console.log('✅ Простой пользователь создан:')
    console.log('📧 Email:', user.email)
    console.log('🔑 Пароль: 123456')
    console.log('👤 Имя:', user.firstName, user.lastName)
    console.log('🎯 Роль:', user.role)
    console.log('✅ Verified:', user.verified)
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ Пользователь уже существует')
    } else {
      console.error('❌ Ошибка создания пользователя:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createSimpleUser() 