const bcryptjs = require('bcryptjs');

// Тестовые пароли
const testPasswords = [
  'password',
  '123456',
  'admin',
  'test',
  'qwerty',
  'password123',
  'admin123'
];

// Хеш из базы данных
const hashedPassword = '$2b$12$7Z8268NSgq1WFATweBwgluws1N/DkISntZGJdpPnUnmlwoqL22gqq';

console.log('🔍 Тестируем пароли...');

testPasswords.forEach(password => {
  const isValid = bcryptjs.compareSync(password, hashedPassword);
  console.log(`Пароль "${password}": ${isValid ? '✅' : '❌'}`);
});

console.log('\n💡 Попробуйте один из этих паролей для входа'); 