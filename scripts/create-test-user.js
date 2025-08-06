const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Проверяем, существует ли уже тестовый пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@mozaika.com' }
    })

    if (existingUser) {
      console.log('Тестовый пользователь уже существует')
      return existingUser
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash('test123456', 10)

    // Создаем тестового пользователя
    const user = await prisma.user.create({
      data: {
        email: 'test@mozaika.com',
        password: hashedPassword,
        firstName: 'Тест',
        lastName: 'Пользователь',
        phone: '+7 (999) 123-45-67',
        role: 'REALTOR',
        verified: true
      }
    })

    console.log('Тестовый пользователь создан:', {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role
    })

    return user
  } catch (error) {
    console.error('Ошибка создания тестового пользователя:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем скрипт
createTestUser()
  .then(() => {
    console.log('Скрипт завершен успешно')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Ошибка выполнения скрипта:', error)
    process.exit(1)
  }) 