import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

async function checkPermissions() {
  try {
    console.log('🔍 Проверяем права доступа...')
    
    // Проверяем подключение
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно')
    
    // Проверяем текущего пользователя
    const currentUser = await prisma.$queryRaw`SELECT current_user`
    console.log('👤 Текущий пользователь:', currentUser)
    
    // Проверяем права на схему public
    const permissions = await prisma.$queryRaw`
      SELECT privilege_type 
      FROM information_schema.role_table_grants 
      WHERE table_schema = 'public' 
      AND grantee = current_user
    `
    console.log('🔑 Права на схему public:', permissions)
    
    // Проверяем существующие таблицы
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('📊 Существующие таблицы:', tables)
    
    // Пробуем создать простую таблицу
    try {
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS test_table (id TEXT PRIMARY KEY)`
      console.log('✅ Можем создавать таблицы')
      await prisma.$executeRaw`DROP TABLE test_table`
      console.log('✅ Можем удалять таблицы')
    } catch (error) {
      console.log('❌ Не можем создавать таблицы:', error)
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPermissions() 