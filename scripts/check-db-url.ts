import { PrismaClient } from '@prisma/client'

console.log('🔍 Проверяем DATABASE_URL...')

// Проверяем переменную окружения
const dbUrl = process.env.DATABASE_URL
if (dbUrl) {
  console.log('✅ DATABASE_URL найден')
  console.log('URL:', dbUrl.substring(0, 20) + '...' + dbUrl.substring(dbUrl.length - 10))
  
  // Проверяем тип URL
  if (dbUrl.startsWith('prisma://')) {
    console.log('📊 Это Prisma Data Proxy URL')
  } else if (dbUrl.startsWith('postgresql://')) {
    console.log('📊 Это обычный PostgreSQL URL')
  } else if (dbUrl.startsWith('postgres://')) {
    console.log('📊 Это обычный PostgreSQL URL (короткий формат)')
  } else {
    console.log('❓ Неизвестный формат URL')
  }
} else {
  console.log('❌ DATABASE_URL не найден')
}

// Пробуем подключиться
const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Тестируем подключение...')
    await prisma.$connect()
    console.log('✅ Подключение успешно')
    
    const userCount = await prisma.user.count()
    console.log(`📊 Пользователей в базе: ${userCount}`)
    
  } catch (error) {
    console.error('❌ Ошибка подключения:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection() 