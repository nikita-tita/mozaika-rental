import fetch from 'node-fetch'

async function testDealAPI() {
  try {
    console.log('Testing deal API...')
    
    // Сначала получим токен аутентификации
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    })
    
    const loginData = await loginResponse.json()
    console.log('Login response:', loginData)
    
    if (!loginData.success) {
      console.log('Login failed')
      return
    }
    
    // Получаем cookies из ответа
    const cookies = loginResponse.headers.get('set-cookie')
    console.log('Cookies:', cookies)
    
    // Тестовые данные для создания сделки
    const dealData = {
      title: 'Тестовая сделка через API',
      description: 'Описание тестовой сделки',
      propertyId: 'cme2h5ch10002u1ww22d3qxsx',
      tenantId: 'cme2jtzeb0001u10x7yvsotd2',
      landlordId: 'cme2jtzej0003u10xkfrr6l05',
      monthlyRent: 50000,
      deposit: 100000,
      commission: 25000,
      startDate: '2024-01-01',
      endDate: '2024-12-01'
    }
    
    console.log('Sending deal data:', dealData)
    
    // Создаем сделку
    const dealResponse = await fetch('http://localhost:3001/api/deals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify(dealData)
    })
    
    const dealResult = await dealResponse.json()
    console.log('Deal creation response:', dealResult)
    
  } catch (error) {
    console.error('Error testing deal API:', error)
  }
}

testDealAPI() 