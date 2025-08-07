# 🚀 Деплой M² на REG.RU

## 📋 Общие требования

Для успешного деплоя вашего проекта на REG.RU потребуется:

1. **VPS сервер** на REG.RU (минимум 2GB RAM, 20GB SSD)
2. **Домен** подключенный к VPS
3. **SSH доступ** к серверу
4. **Базовые знания** Linux/Ubuntu

## 🛒 Настройка VPS на REG.RU

### Шаг 1: Заказ VPS

1. Войдите в панель управления REG.RU
2. Перейдите в раздел "VPS/VDS" 
3. Выберите конфигурацию (рекомендуется минимум 2GB RAM)
4. Выберите Ubuntu 20.04/22.04 LTS как операционную систему
5. При заказе обязательно укажите SSH ключ или запомните пароль root

### Шаг 2: Получение данных доступа

После заказа VPS вы получите:
- **IP адрес сервера** (например: 185.xxx.xxx.xxx)
- **Логин**: root
- **Пароль** или SSH ключ

## 🔧 Настройка сервера

### Подключение к серверу

```bash
# Подключение по SSH
ssh root@YOUR_SERVER_IP

# Или с указанием ключа
ssh -i ~/.ssh/your_key root@YOUR_SERVER_IP
```

### Обновление системы

```bash
# Обновляем пакеты
apt update && apt upgrade -y

# Устанавливаем необходимые утилиты
apt install -y curl wget git nano ufw
```

### Создание пользователя для приложения

```bash
# Создаем пользователя
adduser mozaika
usermod -aG sudo mozaika

# Настраиваем SSH ключи для нового пользователя
mkdir -p /home/mozaika/.ssh
cp /root/.ssh/authorized_keys /home/mozaika/.ssh/
chown -R mozaika:mozaika /home/mozaika/.ssh
chmod 700 /home/mozaika/.ssh
chmod 600 /home/mozaika/.ssh/authorized_keys
```

### Установка Node.js

```bash
# Переключаемся на пользователя mozaika
su - mozaika

# Устанавливаем NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Устанавливаем Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Устанавливаем глобальные пакеты
npm install -g pm2 yarn
```

### Установка PostgreSQL

```bash
# Возвращаемся к root
exit

# Устанавливаем PostgreSQL
apt install -y postgresql postgresql-contrib

# Запускаем и включаем автозапуск
systemctl start postgresql
systemctl enable postgresql

# Настраиваем базу данных
sudo -u postgres psql << EOF
CREATE DATABASE m2_rental;
CREATE USER mozaika_user WITH ENCRYPTED PASSWORD 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE m2_rental TO mozaika_user;
ALTER USER mozaika_user CREATEDB;
\q
EOF
```

### Настройка файрвола

```bash
# Включаем ufw
ufw enable

# Разрешаем SSH
ufw allow ssh

# Разрешаем HTTP и HTTPS
ufw allow 80
ufw allow 443

# Разрешаем порт приложения (3000)
ufw allow 3000

# Проверяем статус
ufw status
```

## 🚀 Деплой приложения

### Клонирование проекта

```bash
# Переключаемся на пользователя mozaika
su - mozaika

# Клонируем проект (замените на ваш репозиторий)
git clone https://github.com/YOUR_USERNAME/mozaika.git
cd mozaika
```

### Настройка переменных окружения

```bash
# Создаем файл окружения
cp env.example .env
nano .env
```

Настройте файл `.env`:

```env
# База данных
DATABASE_URL="postgresql://mozaika_user:STRONG_PASSWORD_HERE@localhost:5432/m2_rental"

# JWT секреты (генерируйте случайные строки)
JWT_SECRET="your-super-secret-jwt-key-32-chars-min"

# Логирование
LOG_LEVEL="INFO"

# Next.js
NEXT_TELEMETRY_DISABLED="1"

# Доменное имя (замените на ваш домен)
CORS_ORIGIN="https://yourdomain.com"

# Остальные настройки по необходимости...
```

### Установка зависимостей

```bash
# Устанавливаем зависимости
yarn install

# Генерируем Prisma клиент
npx prisma generate

# Применяем миграции базы данных
npx prisma migrate deploy

# Собираем проект
yarn build
```

### Настройка PM2

```bash
# Создаем конфигурацию PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'mozaika',
    script: 'npm',
    args: 'start',
    cwd: '/home/mozaika/mozaika',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '512M',
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    time: true
  }]
}
EOF

# Создаем директорию для логов
mkdir -p logs

# Запускаем приложение
pm2 start ecosystem.config.js

# Сохраняем конфигурацию PM2
pm2 save

# Настраиваем автозапуск
pm2 startup
```

## 🌐 Настройка Nginx (рекомендуется)

### Установка Nginx

```bash
# Возвращаемся к root
exit

# Устанавливаем Nginx
apt install -y nginx

# Запускаем и включаем автозапуск
systemctl start nginx
systemctl enable nginx
```

### Конфигурация Nginx

```bash
# Создаем конфигурацию сайта
cat > /etc/nginx/sites-available/mozaika << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Активируем сайт
ln -s /etc/nginx/sites-available/mozaika /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Проверяем конфигурацию
nginx -t

# Перезапускаем Nginx
systemctl restart nginx
```

## 🔒 Настройка SSL (Let's Encrypt)

```bash
# Устанавливаем Certbot
apt install -y certbot python3-certbot-nginx

# Получаем SSL сертификат (замените на ваш домен)
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Настраиваем автообновление сертификатов
crontab -e
# Добавьте строку:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔄 Настройка автообновления

### Создание скрипта деплоя

```bash
# Переключаемся на пользователя mozaika
su - mozaika

# Создаем скрипт обновления
cat > ~/deploy.sh << 'EOF'
#!/bin/bash
cd /home/mozaika/mozaika

echo "🔄 Обновление приложения..."

# Останавливаем приложение
pm2 stop mozaika

# Получаем последние изменения
git pull origin main

# Устанавливаем зависимости
yarn install

# Применяем миграции базы данных
npx prisma migrate deploy

# Генерируем Prisma клиент
npx prisma generate

# Собираем проект
yarn build

# Запускаем приложение
pm2 start mozaika

echo "✅ Обновление завершено!"
EOF

# Делаем скрипт исполняемым
chmod +x ~/deploy.sh
```

### Настройка Webhook (опционально)

Для автоматического деплоя при push в GitHub:

```bash
# Устанавливаем простой webhook сервер
npm install -g github-webhook-handler

# Создаем скрипт webhook
cat > ~/webhook.js << 'EOF'
const http = require('http')
const createHandler = require('github-webhook-handler')
const { exec } = require('child_process')

const handler = createHandler({ path: '/webhook', secret: 'YOUR_WEBHOOK_SECRET' })

http.createServer((req, res) => {
  handler(req, res, (err) => {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)

handler.on('error', (err) => {
  console.error('Error:', err.message)
})

handler.on('push', (event) => {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
  
  if (event.payload.ref === 'refs/heads/main') {
    exec('/home/mozaika/deploy.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      console.log(`stdout: ${stdout}`)
      console.error(`stderr: ${stderr}`)
    })
  }
})

console.log('Webhook server running on port 7777')
EOF

# Запускаем webhook через PM2
pm2 start webhook.js --name "webhook"
pm2 save
```

## 📊 Мониторинг и логи

### Просмотр логов

```bash
# Логи приложения
pm2 logs mozaika

# Логи Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Логи PostgreSQL
tail -f /var/log/postgresql/postgresql-*-main.log
```

### Мониторинг ресурсов

```bash
# Статус процессов
pm2 status

# Мониторинг в реальном времени
pm2 monit

# Использование диска
df -h

# Использование памяти
free -m
```

## 🐛 Устранение неполадок

### Проблемы с базой данных

```bash
# Проверка подключения к PostgreSQL
sudo -u postgres psql -c "SELECT version();"

# Проверка существования базы данных
sudo -u postgres psql -l

# Сброс пароля пользователя базы данных
sudo -u postgres psql -c "ALTER USER mozaika_user PASSWORD 'NEW_PASSWORD';"
```

### Проблемы с приложением

```bash
# Перезапуск приложения
pm2 restart mozaika

# Очистка кэша и переустановка зависимостей
rm -rf node_modules .next
yarn install
yarn build

# Проверка портов
netstat -tulpn | grep :3000
```

### Проблемы с Nginx

```bash
# Проверка конфигурации
nginx -t

# Перезапуск Nginx
systemctl restart nginx

# Проверка статуса
systemctl status nginx
```

## 🔧 Оптимизация производительности

### Настройка PostgreSQL

```bash
# Редактируем конфигурацию PostgreSQL
nano /etc/postgresql/14/main/postgresql.conf

# Рекомендуемые настройки для небольшого VPS:
# shared_buffers = 256MB
# effective_cache_size = 1GB
# work_mem = 4MB
# max_connections = 100

# Перезапускаем PostgreSQL
systemctl restart postgresql
```

### Настройка Nginx для статических файлов

```bash
# Обновляем конфигурацию Nginx
nano /etc/nginx/sites-available/mozaika

# Добавляем обработку статических файлов:
location /_next/static/ {
    alias /home/mozaika/mozaika/.next/static/;
    expires 365d;
    access_log off;
}

location /images/ {
    alias /home/mozaika/mozaika/public/images/;
    expires 30d;
    access_log off;
}
```

## 📞 Поддержка и контакты

При возникновении проблем:

1. **Техподдержка REG.RU**: https://www.reg.ru/support/
2. **Документация Next.js**: https://nextjs.org/docs
3. **Документация Prisma**: https://www.prisma.io/docs

---

**🎉 Поздравляем! Ваше приложение M² успешно развернуто на REG.RU!**

Теперь оно доступно по адресу: `https://yourdomain.com`