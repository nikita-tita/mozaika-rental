import { prisma } from '../src/lib/prisma'

async function clearAllData() {
  try {
    console.log('🧹 Начинаю полную очистку базы данных...')
    
    // Удаляем данные в правильном порядке (сначала зависимые таблицы)
    console.log('🗑️ Удаляем уведомления...')
    await prisma.notification.deleteMany()
    
    console.log('🗑️ Удаляем платежи...')
    await prisma.payment.deleteMany()
    
    console.log('🗑️ Удаляем отзывы...')
    await prisma.review.deleteMany()
    
    console.log('🗑️ Удаляем контракты...')
    await prisma.contract.deleteMany()
    
    console.log('🗑️ Удаляем бронирования...')
    await prisma.booking.deleteMany()
    
    console.log('🗑️ Удаляем изображения объектов...')
    await prisma.propertyImage.deleteMany()
    
    console.log('🗑️ Удаляем объекты недвижимости...')
    await prisma.property.deleteMany()
    
    console.log('🗑️ Удаляем клиентов...')
    await prisma.client.deleteMany()
    
    console.log('🗑️ Удаляем модули M2...')
    await prisma.tenantScoring.deleteMany()
    await prisma.propertyInventory.deleteMany()
    await prisma.digitalSignature.deleteMany()
    await prisma.multilisting.deleteMany()
    await prisma.rentalInsurance.deleteMany()
    await prisma.escrowAccount.deleteMany()
    await prisma.realtorSalary.deleteMany()
    await prisma.yandexRentSubmission.deleteMany()
    
    console.log('🗑️ Удаляем настройки уведомлений...')
    await prisma.notificationSettings.deleteMany()
    
    console.log('🗑️ Удаляем шаблоны контрактов...')
    await prisma.contractTemplate.deleteMany()
    
    console.log('🗑️ Удаляем пользователей...')
    await prisma.user.deleteMany()
    
    console.log('✅ База данных полностью очищена!')
    
  } catch (error) {
    console.error('💥 Ошибка при очистке базы данных:', error)
    throw error
  }
}

// Запуск скрипта
if (require.main === module) {
  clearAllData()
    .then(() => {
      console.log('\n🎉 Очистка завершена успешно!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Ошибка:', error)
      process.exit(1)
    })
}

export { clearAllData } 