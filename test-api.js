const { createServer } = require('http')
const { parse } = require('url')

// Простой тестовый сервер для проверки API routes
const server = createServer((req, res) => {
  const { pathname } = parse(req.url)
  
  console.log(`Запрос: ${req.method} ${pathname}`)
  
  if (pathname === '/api/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      message: 'API работает!',
      timestamp: new Date().toISOString()
    }))
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

server.listen(3001, () => {
  console.log('Тестовый сервер запущен на порту 3001')
}) 