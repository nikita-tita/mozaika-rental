import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient().$extends(withAccelerate())

async function createTestUser() {
  try {
    console.log('🚀 Создаем тестового пользователя...')
    
    // Проверяем подключение
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно')
    
    // Проверяем существующих пользователей
    const users = await prisma.user.findMany()
    console.log(`📊 Найдено пользователей: ${users.length}`)
    
    if (users.length === 0) {
      console.log('⚠️ Пользователей нет, создаем тестового пользователя...')
      
      const hashedPassword = await bcrypt.hash('password123', 10)
      
      const testUser = await prisma.user.create({
        data: {
          email: 'nikitatitov070@gmail.com',
          password: hashedPassword,
          firstName: 'Никита',
          lastName: 'Титов',
          role: 'REALTOR'
        }
      })
      
      console.log('✅ Тестовый пользователь создан:', {
        id: testUser.id,
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName
      })
      
      console.log('🔐 Данные для входа:')
      console.log('Email: nikitatitov070@gmail.com')
      console.log('Password: password123')
    } else {
      console.log('👥 Существующие пользователи:')
      users.forEach(user => {
        console.log(`- ${user.email} (${user.firstName} ${user.lastName})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser() 