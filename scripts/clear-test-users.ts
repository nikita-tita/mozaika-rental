import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearTestUsers() {
  try {
    console.log('🧹 Начинаю очистку тестовых пользователей...')
    
    // Удаляем всех пользователей
    const deletedUsers = await prisma.user.deleteMany({})
    
    console.log(`✅ Удалено пользователей: ${deletedUsers.count}`)
    
    // Проверяем, что база пустая
    const remainingUsers = await prisma.user.findMany()
    console.log(`📊 Осталось пользователей в базе: ${remainingUsers.length}`)
    
    if (remainingUsers.length === 0) {
      console.log('🎉 База данных полностью очищена!')
    } else {
      console.log('⚠️ В базе остались пользователи:', remainingUsers.map(u => u.email))
    }
    
  } catch (error) {
    console.error('💥 Ошибка при очистке базы данных:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearTestUsers() 