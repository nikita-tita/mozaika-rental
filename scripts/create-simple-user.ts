import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('🚀 Создаем тестового пользователя...')
    
    // Проверяем, существует ли уже пользователь
    const existingUser = await prisma.user.findFirst({
      where: {
        email: 'test@example.com'
      }
    })
    
    if (existingUser) {
      console.log('✅ Пользователь уже существует:', existingUser.email)
      return existingUser
    }
    
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        firstName: 'Тестовый',
        lastName: 'Пользователь',
        password: hashedPassword,
        role: 'REALTOR',
        verified: true,
        phone: '+7 (999) 123-45-67'
      }
    })
    
    console.log('✅ Пользователь создан успешно!')
    console.log('📧 Email:', user.email)
    console.log('🔑 Пароль: password123')
    console.log('🆔 ID:', user.id)
    
    return user
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
  .then(() => {
    console.log('🎉 Скрипт завершен успешно!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Ошибка выполнения скрипта:', error)
    process.exit(1)
  }) 