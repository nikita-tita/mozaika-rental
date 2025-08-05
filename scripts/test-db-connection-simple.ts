import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Тестируем подключение к базе данных...')
    
    // Проверяем подключение
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно')
    
    // Пробуем простой запрос
    const userCount = await prisma.user.count()
    console.log(`📊 Количество пользователей в базе: ${userCount}`)
    
    // Пробуем получить одного пользователя
    const user = await prisma.user.findFirst()
    if (user) {
      console.log('👤 Найден пользователь:', {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      })
    } else {
      console.log('⚠️ Пользователей в базе нет')
    }
    
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error)
    
    // Выводим детали ошибки
    if (error instanceof Error) {
      console.error('Сообщение:', error.message)
      console.error('Стек:', error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection() 