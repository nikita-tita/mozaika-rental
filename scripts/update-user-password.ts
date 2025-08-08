import { prisma } from '../src/lib/prisma'
import { hashPassword } from '../src/lib/auth'

async function updateTestUserPassword() {
  try {
    console.log('🔧 Обновление пароля тестового пользователя...')

    // Находим тестового пользователя
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    if (!testUser) {
      console.log('❌ Тестовый пользователь не найден')
      return
    }

    // Создаем новый хеш пароля
    const newHashedPassword = await hashPassword('testpassword123')

    // Обновляем пароль
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { password: newHashedPassword }
    })

    console.log('✅ Пароль тестового пользователя обновлен!')
    console.log(`📧 Email: ${updatedUser.email}`)
    console.log(`🔑 Новый пароль: testpassword123`)
    console.log(`🆔 ID: ${updatedUser.id}`)

    return updatedUser

  } catch (error) {
    console.error('❌ Ошибка при обновлении пароля:', error)
    throw error
  }
}

// Запуск скрипта
if (require.main === module) {
  updateTestUserPassword()
    .then(() => {
      console.log('\n🎉 Скрипт завершен успешно!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Ошибка:', error)
      process.exit(1)
    })
}

export { updateTestUserPassword } 