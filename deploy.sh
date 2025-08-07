#!/bin/bash

# Цвета для красивого вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

APP_NAME="mozaika-prod"
APP_DIR="/home/mozaika/mozaika"

echo -e "${BLUE}🚀 Начинаю деплой приложения M²...${NC}"

# Переходим в директорию приложения
cd $APP_DIR || exit 1

echo -e "${YELLOW}📦 Останавливаю приложение...${NC}"
pm2 stop $APP_NAME || echo "Приложение уже остановлено"

echo -e "${YELLOW}⬇️ Получаю последние изменения из Git...${NC}"
git fetch origin
git reset --hard origin/main
git pull origin main

echo -e "${YELLOW}📚 Устанавливаю зависимости...${NC}"
yarn install --production=false

echo -e "${YELLOW}🗄️ Применяю миграции базы данных...${NC}"
npx prisma migrate deploy

echo -e "${YELLOW}⚙️ Генерирую Prisma клиент...${NC}"
npx prisma generate

echo -e "${YELLOW}🔨 Собираю приложение...${NC}"
yarn build

echo -e "${YELLOW}🔄 Запускаю приложение...${NC}"
pm2 start ecosystem.config.js || pm2 restart $APP_NAME

echo -e "${YELLOW}💾 Сохраняю конфигурацию PM2...${NC}"
pm2 save

echo -e "${GREEN}✅ Деплой завершен успешно!${NC}"
echo -e "${BLUE}📊 Статус приложения:${NC}"
pm2 status $APP_NAME

echo -e "${BLUE}📝 Последние логи:${NC}"
pm2 logs $APP_NAME --lines 10