import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testAuth() {
  try {
    console.log('🔍 Проверяем подключение к базе данных...')
    
    // Проверяем подключение
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно')
    
    // Проверяем наличие пользователей
    const users = await prisma.user.findMany()
    console.log(`📊 Найдено пользователей: ${users.length}`)
    
    if (users.length === 0) {
      console.log('⚠️ Пользователей нет, создаем тестового пользователя...')
      
      const hashedPassword = await bcrypt.hash('password123', 10)
      
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          firstName: 'Тест',
          lastName: 'Пользователь',
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
      console.log('Email: test@example.com')
      console.log('Password: password123')
    } else {
      console.log('👥 Существующие пользователи:')
      users.forEach(user => {
        console.log(`- ${user.email} (${user.firstName} ${user.lastName})`)
      })
    }
    
    // Проверяем сессии
    const sessions = await prisma.session.findMany()
    console.log(`🔑 Найдено активных сессий: ${sessions.length}`)
    
    if (sessions.length > 0) {
      console.log('📋 Активные сессии:')
      sessions.forEach(session => {
        console.log(`- ID: ${session.id}, User: ${session.userId}, Expires: ${session.expiresAt}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth() 