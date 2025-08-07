#!/bin/bash

# Цвета для красивого вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Быстрый запуск M² Mozaika${NC}"

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не установлен! Установите Node.js 18+ перед продолжением.${NC}"
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Требуется Node.js версии 18 или выше. Текущая версия: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) найден${NC}"

# Проверяем наличие yarn
if ! command -v yarn &> /dev/null; then
    echo -e "${YELLOW}⚠️ Yarn не найден, устанавливаем...${NC}"
    npm install -g yarn
fi

echo -e "${GREEN}✅ Yarn $(yarn -v) готов${NC}"

# Устанавливаем зависимости
echo -e "${YELLOW}📦 Устанавливаю зависимости...${NC}"
yarn install

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️ Создаю .env файл из примера...${NC}"
    cp env.example .env
    echo -e "${RED}⚠️ ВАЖНО: Отредактируйте .env файл с вашими настройками!${NC}"
fi

# Генерируем Prisma клиент
echo -e "${YELLOW}🔧 Генерирую Prisma клиент...${NC}"
npx prisma generate

# Проверяем подключение к базе данных
echo -e "${YELLOW}🗄️ Проверяю подключение к базе данных...${NC}"
if npx prisma db push --accept-data-loss; then
    echo -e "${GREEN}✅ База данных готова${NC}"
else
    echo -e "${RED}❌ Ошибка подключения к базе данных!${NC}"
    echo -e "${YELLOW}Проверьте DATABASE_URL в .env файле${NC}"
    exit 1
fi

# Собираем проект для проверки
echo -e "${YELLOW}🔨 Собираю проект...${NC}"
if yarn build; then
    echo -e "${GREEN}✅ Сборка успешна${NC}"
else
    echo -e "${RED}❌ Ошибка сборки!${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Все готово к запуску!${NC}"
echo -e "${BLUE}📝 Доступные команды:${NC}"
echo -e "  ${YELLOW}yarn dev${NC}     - Запуск в режиме разработки"
echo -e "  ${YELLOW}yarn build${NC}   - Сборка для продакшена"
echo -e "  ${YELLOW}yarn start${NC}   - Запуск продакшен версии"
echo -e "  ${YELLOW}yarn test${NC}    - Запуск тестов"

echo -e "${BLUE}🚀 Запускаю в режиме разработки...${NC}"
yarn dev