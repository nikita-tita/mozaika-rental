import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    const hashedPassword = await hashPassword('test123')
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Тест',
        lastName: 'Пользователь',
        phone: '+7 (999) 123-45-67',
        role: 'REALTOR',
        verified: true,
        active: true
      }
    })
    
    console.log('✅ Тестовый пользователь создан:', user.email)
  } catch (error) {
    console.error('❌ Ошибка создания пользователя:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser() 