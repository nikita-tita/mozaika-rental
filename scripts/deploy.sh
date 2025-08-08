#!/bin/bash

# Скрипт для деплоя Mozaika Platform
set -e

echo "🚀 Начинаем деплой Mozaika Platform..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для логирования
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Проверяем наличие необходимых инструментов
check_dependencies() {
    log "Проверяем зависимости..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker не установлен"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose не установлен"
    fi
    
    if ! command -v git &> /dev/null; then
        error "Git не установлен"
    fi
    
    success "Все зависимости установлены"
}

# Очистка старых образов
cleanup() {
    log "Очищаем старые образы..."
    docker system prune -f
    success "Очистка завершена"
}

# Сборка Docker образа
build_image() {
    log "Собираем Docker образ..."
    docker build -t mozaika-platform:latest .
    success "Образ собран успешно"
}

# Запуск через Docker Compose
deploy_docker() {
    log "Запускаем через Docker Compose..."
    
    # Останавливаем старые контейнеры
    docker-compose down
    
    # Запускаем новые контейнеры
    docker-compose up -d
    
    # Ждем запуска сервисов
    log "Ждем запуска сервисов..."
    sleep 30
    
    # Проверяем статус
    docker-compose ps
    
    success "Деплой через Docker завершен"
}

# Деплой на Vercel
deploy_vercel() {
    log "Деплоим на Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        warning "Vercel CLI не установлен, устанавливаем..."
        npm i -g vercel
    fi
    
    vercel --prod
    success "Деплой на Vercel завершен"
}

# Проверка здоровья приложения
health_check() {
    log "Проверяем здоровье приложения..."
    
    # Ждем запуска
    sleep 10
    
    # Проверяем API
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        success "Приложение работает корректно"
    else
        error "Приложение не отвечает"
    fi
}

# Основная функция
main() {
    case "${1:-docker}" in
        "docker")
            check_dependencies
            cleanup
            build_image
            deploy_docker
            health_check
            ;;
        "vercel")
            deploy_vercel
            ;;
        "all")
            check_dependencies
            cleanup
            build_image
            deploy_docker
            health_check
            deploy_vercel
            ;;
        *)
            echo "Использование: $0 {docker|vercel|all}"
            echo "  docker  - деплой через Docker Compose"
            echo "  vercel  - деплой на Vercel"
            echo "  all     - деплой везде"
            exit 1
            ;;
    esac
    
    success "Деплой завершен успешно! 🎉"
}

# Запускаем основную функцию
main "$@" 