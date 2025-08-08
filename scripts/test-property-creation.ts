#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testPropertyCreation() {
  console.log('🧪 Тестирование создания объектов недвижимости...\n')

  try {
    // 1. Проверяем подключение к базе данных
    console.log('1️⃣ Проверка подключения к базе данных...')
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно\n')

    // 2. Проверяем существование тестового пользователя
    console.log('2️⃣ Проверка тестового пользователя...')
    const testUser = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' }
    })

    if (!testUser) {
      console.log('❌ Тестовый пользователь не найден')
      return
    }

    console.log('✅ Тестовый пользователь найден:', testUser.email)
    console.log()

    // 3. Тестируем создание объекта недвижимости
    console.log('3️⃣ Тестирование создания объекта недвижимости...')
    
    const testPropertyData = {
      title: 'Тестовая 2-к квартира',
      description: 'Красивая квартира в центре города',
      type: 'APARTMENT',
      address: 'ул. Ленина, д. 1, кв. 5',
      price: 50000,
      bedrooms: 2,
      bathrooms: 1,
      area: 65.5,
      features: ['Балкон', 'Лифт', 'Парковка'],
      images: [],
      userId: testUser.id
    }

    const newProperty = await prisma.property.create({
      data: testPropertyData
    })

    console.log('✅ Объект недвижимости создан успешно:')
    console.log(`   ID: ${newProperty.id}`)
    console.log(`   Название: ${newProperty.title}`)
    console.log(`   Тип: ${newProperty.type}`)
    console.log(`   Цена: ${newProperty.price} ₽`)
    console.log(`   Площадь: ${newProperty.area} м²`)
    console.log(`   Спальни: ${newProperty.bedrooms}`)
    console.log(`   Ванные: ${newProperty.bathrooms}`)
    console.log(`   Особенности: ${newProperty.features.join(', ')}`)
    console.log()

    // 4. Проверяем, что объект сохранился в базе
    console.log('4️⃣ Проверка сохранения объекта в базе...')
    const savedProperty = await prisma.property.findUnique({
      where: { id: newProperty.id },
      include: { user: true }
    })

    if (savedProperty) {
      console.log('✅ Объект найден в базе данных')
      console.log(`   Пользователь: ${savedProperty.user.firstName} ${savedProperty.user.lastName}`)
      console.log(`   Дата создания: ${savedProperty.createdAt}`)
    } else {
      console.log('❌ Объект не найден в базе данных')
    }
    console.log()

    // 5. Тестируем валидацию данных
    console.log('5️⃣ Тестирование валидации данных...')
    
    // Тест с некорректными данными
    try {
      await prisma.property.create({
        data: {
          title: '', // Пустое название
          type: 'APARTMENT',
          address: 'ул. Тестовая, д. 1',
          price: -1000, // Отрицательная цена
          userId: testUser.id
        }
      })
      console.log('❌ Объект с некорректными данными был создан (не должно было произойти)')
    } catch (error) {
      console.log('✅ Валидация работает: объект с некорректными данными не создан')
      console.log(`   Ошибка: ${error.message}`)
    }
    console.log()

    // 6. Проверяем статистику
    console.log('6️⃣ Статистика объектов недвижимости...')
    const propertyCount = await prisma.property.count()
    const userProperties = await prisma.property.count({
      where: { userId: testUser.id }
    })
    
    console.log(`📊 Всего объектов: ${propertyCount}`)
    console.log(`📊 Объектов пользователя ${testUser.email}: ${userProperties}`)
    console.log()

    // 7. Тестируем различные типы недвижимости
    console.log('7️⃣ Тестирование различных типов недвижимости...')
    
    const propertyTypes = ['APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND']
    
    for (const type of propertyTypes) {
      try {
        const property = await prisma.property.create({
          data: {
            title: `Тестовый ${type.toLowerCase()}`,
            description: `Описание для ${type.toLowerCase()}`,
            type: type as any,
            address: `ул. Тестовая, д. ${Math.floor(Math.random() * 100)}`,
            price: Math.floor(Math.random() * 100000) + 10000,
            userId: testUser.id
          }
        })
        console.log(`✅ ${type} создан успешно (ID: ${property.id})`)
      } catch (error) {
        console.log(`❌ Ошибка создания ${type}: ${error.message}`)
      }
    }
    console.log()

    // 8. Очистка тестовых данных
    console.log('8️⃣ Очистка тестовых данных...')
    const deletedProperties = await prisma.property.deleteMany({
      where: {
        title: {
          startsWith: 'Тестовый'
        }
      }
    })
    
    console.log(`🗑️ Удалено тестовых объектов: ${deletedProperties.count}`)
    console.log()

    console.log('🎉 Тестирование создания объектов недвижимости завершено успешно!')
    console.log('\n📋 Рекомендации:')
    console.log('   • Проверьте валидацию на фронтенде')
    console.log('   • Убедитесь, что все обязательные поля заполняются')
    console.log('   • Протестируйте загрузку изображений')
    console.log('   • Проверьте обработку ошибок')

  } catch (error) {
    console.error('❌ Ошибка при тестировании создания объектов:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем тестирование
testPropertyCreation()
  .then(() => {
    console.log('\n✅ Тестирование завершено')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Ошибка:', error)
    process.exit(1)
  }) 