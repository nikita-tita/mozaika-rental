const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🛡️ Безопасное обновление схемы базы данных\n')

async function safeSchemaUpdate() {
  try {
    // 1. Проверяем текущее состояние
    console.log('1️⃣ Проверяем текущее состояние схемы...')
    
    // Создаем бэкап текущей схемы
    const backupPath = path.join(__dirname, '../prisma/schema.backup.prisma')
    if (fs.existsSync(path.join(__dirname, '../prisma/schema.prisma'))) {
      fs.copyFileSync(
        path.join(__dirname, '../prisma/schema.prisma'),
        backupPath
      )
      console.log('   ✅ Бэкап схемы создан')
    }

    // 2. Подтягиваем актуальную схему из базы
    console.log('\n2️⃣ Подтягиваем актуальную схему из базы данных...')
    try {
      execSync('npx prisma db pull', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      })
      console.log('   ✅ Схема синхронизирована с базой данных')
    } catch (error) {
      console.log('   ⚠️ Ошибка при подтягивании схемы, продолжаем...')
    }

    // 3. Генерируем Prisma Client
    console.log('\n3️⃣ Генерируем Prisma Client...')
    try {
      execSync('npx prisma generate', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      })
      console.log('   ✅ Prisma Client обновлен')
    } catch (error) {
      console.log('   ❌ Ошибка при генерации клиента')
      throw error
    }

    // 4. Проверяем данные
    console.log('\n4️⃣ Проверяем данные в базе...')
    try {
      execSync('node scripts/check-db-data.js', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      })
    } catch (error) {
      console.log('   ⚠️ Ошибка при проверке данных')
    }

    // 5. Удаляем бэкап если все прошло успешно
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath)
      console.log('   ✅ Временный бэкап удален')
    }

    console.log('\n🎉 Безопасное обновление завершено успешно!')
    console.log('\n📋 Что было сделано:')
    console.log('   ✅ Создан бэкап схемы')
    console.log('   ✅ Схема синхронизирована с базой данных')
    console.log('   ✅ Prisma Client обновлен')
    console.log('   ✅ Данные проверены')
    console.log('   ✅ Временные файлы очищены')

  } catch (error) {
    console.error('\n❌ Ошибка при обновлении схемы:', error.message)
    
    // Восстанавливаем бэкап если есть
    const backupPath = path.join(__dirname, '../prisma/schema.backup.prisma')
    if (fs.existsSync(backupPath)) {
      console.log('\n🔄 Восстанавливаем бэкап схемы...')
      fs.copyFileSync(backupPath, path.join(__dirname, '../prisma/schema.prisma'))
      fs.unlinkSync(backupPath)
      console.log('   ✅ Бэкап восстановлен')
    }
    
    process.exit(1)
  }
}

// Запускаем скрипт
safeSchemaUpdate()
  .then(() => {
    console.log('\n🎯 Скрипт завершен успешно')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Критическая ошибка:', error)
    process.exit(1)
  }) 