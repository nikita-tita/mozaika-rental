#!/bin/bash

# Автоматическая установка M² на Ubuntu VPS
# Использование: curl -sSL https://raw.githubusercontent.com/nikita-tita/mozaika-rental/main/install-server.sh | bash

set -e

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Автоматическая установка M² Mozaika на Ubuntu VPS${NC}"

# Проверка запуска от root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Скрипт должен запускаться от root пользователя!${NC}"
   echo "Используйте: sudo $0"
   exit 1
fi

# Обновление системы
echo -e "${YELLOW}📦 Обновляю систему...${NC}"
apt update && apt upgrade -y

# Установка базовых пакетов
echo -e "${YELLOW}📦 Устанавливаю базовые пакеты...${NC}"
apt install -y curl wget git nano ufw nginx postgresql postgresql-contrib certbot python3-certbot-nginx

# Настройка файрвола
echo -e "${YELLOW}🔒 Настраиваю файрвол...${NC}"
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 3000

# Создание пользователя
echo -e "${YELLOW}👤 Создаю пользователя mozaika...${NC}"
adduser --disabled-password --gecos "" mozaika
usermod -aG sudo mozaika

# Настройка SSH ключей
if [ -f "/root/.ssh/authorized_keys" ]; then
    mkdir -p /home/mozaika/.ssh
    cp /root/.ssh/authorized_keys /home/mozaika/.ssh/
    chown -R mozaika:mozaika /home/mozaika/.ssh
    chmod 700 /home/mozaika/.ssh
    chmod 600 /home/mozaika/.ssh/authorized_keys
fi

# Установка Node.js
echo -e "${YELLOW}⚙️ Устанавливаю Node.js...${NC}"
sudo -u mozaika bash << 'EOF'
cd ~
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18
nvm alias default 18
npm install -g pm2 yarn
EOF

# Настройка PostgreSQL
echo -e "${YELLOW}🗄️ Настраиваю PostgreSQL...${NC}"
systemctl start postgresql
systemctl enable postgresql

# Генерация случайного пароля
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Создание базы данных
sudo -u postgres psql << EOF
CREATE DATABASE m2_rental;
CREATE USER mozaika_user WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE m2_rental TO mozaika_user;
ALTER USER mozaika_user CREATEDB;
\q
EOF

# Клонирование проекта
echo -e "${YELLOW}📥 Клонирую проект...${NC}"
sudo -u mozaika bash << EOF
cd ~
git clone https://github.com/nikita-tita/mozaika-rental.git mozaika
cd mozaika
EOF

# Настройка переменных окружения
echo -e "${YELLOW}⚙️ Настраиваю переменные окружения...${NC}"
sudo -u mozaika bash << EOF
cd ~/mozaika
cp env.example .env
sed -i "s|postgresql://postgres:password@localhost:5432/m2_rental|postgresql://mozaika_user:$DB_PASSWORD@localhost:5432/m2_rental|g" .env
sed -i "s|your-super-secret-jwt-key-here|$JWT_SECRET|g" .env
EOF

# Установка зависимостей и сборка
echo -e "${YELLOW}📦 Устанавливаю зависимости...${NC}"
sudo -u mozaika bash << 'EOF'
cd ~/mozaika
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
yarn install
npx prisma generate
npx prisma migrate deploy
yarn build
EOF

# Настройка PM2
echo -e "${YELLOW}🔄 Настраиваю PM2...${NC}"
sudo -u mozaika bash << 'EOF'
cd ~/mozaika
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup
EOF

# Выполнение команды pm2 startup от root
sudo env PATH=$PATH:/home/mozaika/.nvm/versions/node/v18.*/bin /home/mozaika/.nvm/versions/node/v18.*/lib/node_modules/pm2/bin/pm2 startup systemd -u mozaika --hp /home/mozaika

# Настройка Nginx
echo -e "${YELLOW}🌐 Настраиваю Nginx...${NC}"
cat > /etc/nginx/sites-available/mozaika << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/mozaika /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}✅ Установка завершена!${NC}"
echo -e "${BLUE}📝 Важная информация:${NC}"
echo -e "  🗄️ Пароль БД: ${YELLOW}$DB_PASSWORD${NC}"
echo -e "  🔑 JWT Secret: ${YELLOW}$JWT_SECRET${NC}"
echo -e "${BLUE}📝 Следующие шаги:${NC}"
echo -e "  1. Отредактируйте ${YELLOW}/home/mozaika/mozaika/.env${NC} файл"
echo -e "  2. Установите SSL: ${YELLOW}certbot --nginx -d yourdomain.com${NC}"
echo -e "  3. Обновите домен в настройках"
echo -e "${GREEN}🎉 Приложение доступно по IP адресу сервера!${NC}"