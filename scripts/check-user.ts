import { PrismaClient } from '@prisma/client'
import { verifyPassword, hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    console.log('Проверка пользователя в базе данных...')
    
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    if (!user) {
      console.log('❌ Пользователь не найден')
      return
    }

    console.log('✅ Пользователь найден:')
    console.log('ID:', user.id)
    console.log('Email:', user.email)
    console.log('Имя:', user.firstName, user.lastName)
    console.log('Роль:', user.role)
    console.log('Верифицирован:', user.verified)
    console.log('Пароль (хеш):', user.password.substring(0, 20) + '...')

    // Тестируем пароль
    console.log('\nТестирование пароля...')
    const testPassword = 'password123'
    const isPasswordValid = await verifyPassword(testPassword, user.password)
    console.log('Пароль "password123" валиден:', isPasswordValid)

    // Создаем новый хеш для сравнения
    const newHash = await hashPassword(testPassword)
    console.log('Новый хеш:', newHash.substring(0, 20) + '...')
    
    const isNewHashValid = await verifyPassword(testPassword, newHash)
    console.log('Новый хеш валиден:', isNewHashValid)

  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser() 