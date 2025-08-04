const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Тестирование подключения к базе данных...')
    
    // Проверяем подключение
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно')
    
    // Проверяем количество пользователей
    const userCount = await prisma.user.count()
    console.log(`📊 Количество пользователей в базе: ${userCount}`)
    
    // Проверяем конкретного пользователя
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    if (testUser) {
      console.log('✅ Тестовый пользователь найден:', {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role
      })
    } else {
      console.log('❌ Тестовый пользователь не найден')
    }
    
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection() 