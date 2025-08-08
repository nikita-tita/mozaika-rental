const fetch = require('node-fetch');

async function testAuth() {
  try {
    console.log('🔍 Тестируем авторизацию...');
    
    // Тестируем endpoint /api/auth/me
    const response = await fetch('http://localhost:3001/api/auth/me', {
      credentials: 'include'
    });
    
    console.log('📊 Статус ответа:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Ответ:', data);
    } else {
      console.log('❌ Ошибка:', response.statusText);
    }
    
  } catch (error) {
    console.error('💥 Ошибка:', error.message);
  }
}

testAuth(); 