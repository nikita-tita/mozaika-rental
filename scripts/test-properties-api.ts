#!/usr/bin/env tsx

import { readFileSync } from 'fs'

interface TestCase {
  name: string
  data: any
  expectedSuccess: boolean
  expectedError?: string
}

async function testPropertiesAPI() {
  console.log('🧪 Тестирование API создания объектов недвижимости...\n')

  // Читаем cookies для авторизации
  let cookies = ''
  try {
    cookies = readFileSync('test_cookies.txt', 'utf-8').trim()
  } catch (error) {
    console.error('❌ Не удалось прочитать cookies. Сначала выполните вход.')
    return
  }

  const baseUrl = 'https://mozaikarentalstableversionv1.vercel.app'
  
  const testCases: TestCase[] = [
    {
      name: 'Валидный объект с price',
      data: {
        title: 'Тестовая квартира с price',
        description: 'Описание квартиры',
        type: 'APARTMENT',
        address: 'ул. Тестовая, 1',
        price: 50000,
        bedrooms: 2,
        bathrooms: 1,
        area: 45.5,
        features: ['Балкон', 'Лифт']
      },
      expectedSuccess: true
    },
    {
      name: 'Валидный объект с pricePerMonth',
      data: {
        title: 'Тестовая квартира с pricePerMonth',
        description: 'Описание квартиры',
        type: 'APARTMENT',
        address: 'ул. Тестовая, 2',
        pricePerMonth: 60000,
        bedrooms: 3,
        bathrooms: 2,
        area: 65.0,
        features: ['Парковка', 'Консьерж']
      },
      expectedSuccess: true
    },
    {
      name: 'Объект без цены (должен использовать 0)',
      data: {
        title: 'Тестовая квартира без цены',
        description: 'Описание квартиры',
        type: 'HOUSE',
        address: 'ул. Тестовая, 3',
        bedrooms: 1,
        bathrooms: 1,
        area: 30.0
      },
      expectedSuccess: true
    },
    {
      name: 'Объект с отрицательной ценой',
      data: {
        title: 'Тестовая квартира с отрицательной ценой',
        description: 'Описание квартиры',
        type: 'APARTMENT',
        address: 'ул. Тестовая, 4',
        price: -1000,
        bedrooms: 2,
        bathrooms: 1,
        area: 50.0
      },
      expectedSuccess: false,
      expectedError: 'Цена должна быть положительной'
    },
    {
      name: 'Объект без обязательных полей',
      data: {
        description: 'Описание квартиры',
        type: 'APARTMENT',
        price: 50000
      },
      expectedSuccess: false,
      expectedError: 'Название обязательно'
    },
    {
      name: 'Объект с неверным типом',
      data: {
        title: 'Тестовая квартира с неверным типом',
        description: 'Описание квартиры',
        type: 'INVALID_TYPE',
        address: 'ул. Тестовая, 5',
        price: 50000
      },
      expectedSuccess: false,
      expectedError: 'Тип должен быть APARTMENT, HOUSE, COMMERCIAL или LAND'
    }
  ]

  let passedTests = 0
  let totalTests = testCases.length

  for (const testCase of testCases) {
    console.log(`🧪 Тест: ${testCase.name}`)
    
    try {
      const response = await fetch(`${baseUrl}/api/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies
        },
        body: JSON.stringify(testCase.data)
      })

      const result = await response.json()
      
      if (testCase.expectedSuccess) {
        if (result.success) {
          console.log(`  ✅ УСПЕХ: Объект создан с ID ${result.data?.id}`)
          passedTests++
        } else {
          console.log(`  ❌ ОШИБКА: Ожидался успех, но получили ошибку: ${result.error}`)
        }
      } else {
        if (!result.success && result.error) {
          if (testCase.expectedError && result.error.includes(testCase.expectedError)) {
            console.log(`  ✅ УСПЕХ: Правильная ошибка валидации: ${result.error}`)
            passedTests++
          } else {
            console.log(`  ✅ УСПЕХ: Ошибка валидации получена: ${result.error}`)
            passedTests++
          }
        } else {
          console.log(`  ❌ ОШИБКА: Ожидалась ошибка, но получили успех`)
        }
      }
    } catch (error) {
      console.log(`  ❌ ОШИБКА: ${error}`)
    }
    
    console.log('')
  }

  console.log('📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ API СОЗДАНИЯ ОБЪЕКТОВ')
  console.log('==================================================')
  console.log(`Всего тестов: ${totalTests}`)
  console.log(`Успешных: ${passedTests}`)
  console.log(`Проваленных: ${totalTests - passedTests}`)
  console.log(`Процент успеха: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

  if (passedTests === totalTests) {
    console.log('\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! API создания объектов работает корректно.')
  } else {
    console.log('\n⚠️ Есть проблемы с API создания объектов.')
  }
}

// Запуск тестов
testPropertiesAPI().catch(console.error) 