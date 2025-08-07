const fetch = require('node-fetch');

async function testAuth() {
  const baseUrl = 'https://mozaika-rental-m2-6zuoll69o-nikitas-projects-c62d7451.vercel.app';
  
  try {
    // Тест 1: Проверяем доступность главной страницы
    console.log('🔍 Тест 1: Проверка главной страницы');
    const homeResponse = await fetch(baseUrl);
    console.log('Статус главной страницы:', homeResponse.status);
    
    // Тест 2: Проверяем API health
    console.log('\n🔍 Тест 2: Проверка API health');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    console.log('Статус health API:', healthResponse.status);
    if (healthResponse.ok) {
      const healthData = await healthResponse.text();
      console.log('Health API ответ:', healthData);
    }
    
    // Тест 3: Проверяем страницу логина
    console.log('\n🔍 Тест 3: Проверка страницы логина');
    const loginResponse = await fetch(`${baseUrl}/login`);
    console.log('Статус страницы логина:', loginResponse.status);
    
    // Тест 4: Тестируем API логина с неправильными данными
    console.log('\n🔍 Тест 4: Тест API логина с неправильными данными');
    const loginApiResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'wrong@email.com',
        password: 'wrongpassword'
      })
    });
    console.log('Статус API логина:', loginApiResponse.status);
    if (loginApiResponse.ok) {
      const loginData = await loginApiResponse.json();
      console.log('Ответ API логина:', loginData);
    } else {
      const errorText = await loginApiResponse.text();
      console.log('Ошибка API логина:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testAuth(); 