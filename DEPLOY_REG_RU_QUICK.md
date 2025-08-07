# 🚀 Быстрый деплой M² на REG.RU

## 📋 Что нужно

1. **VPS на REG.RU** (от 2GB RAM)
2. **Домен** (можете купить на REG.RU)
3. **10-15 минут времени**

## ⚡ Быстрые действия

### 1. Заказ VPS в REG.RU

1. Зайдите в [панель REG.RU](https://www.reg.ru/user/account/#/card/110482996)
2. Найдите раздел **"VPS/VDS"** → **"Заказать VPS"**
3. Выберите конфигурацию:
   - **OS**: Ubuntu 22.04 LTS
   - **RAM**: минимум 2GB
   - **SSD**: минимум 20GB
4. При заказе обязательно укажите **SSH ключ** или запомните **пароль root**

### 2. Настройка домена

1. В панели REG.RU перейдите к вашему домену
2. В **DNS настройках** создайте **A-запись**:
   ```
   @ → IP_АДРЕС_VPS
   www → IP_АДРЕС_VPS
   ```

### 3. Деплой (одной командой!)

Подключитесь к VPS и выполните:

```bash
# Подключение к серверу
ssh root@YOUR_VPS_IP

# Установка и настройка (автоматически)
curl -sSL https://raw.githubusercontent.com/YOUR_USERNAME/mozaika/main/install-server.sh | bash
```

### 4. Настройка переменных

После установки отредактируйте файл окружения:

```bash
sudo -u mozaika nano /home/mozaika/mozaika/.env
```

Измените:
- `DATABASE_URL` - будет настроен автоматически
- `JWT_SECRET` - сгенерируется автоматически
- `CORS_ORIGIN` - замените на ваш домен
- `NEXTAUTH_URL` - замените на ваш домен

### 5. Финализация

```bash
# Перезапуск с новыми настройками
sudo -u mozaika /home/mozaika/deploy.sh

# Настройка SSL (автоматически)
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🎉 Готово!

Ваше приложение доступно по адресу: `https://yourdomain.com`

## 🔧 Полезные команды

```bash
# Статус приложения
pm2 status

# Логи приложения
pm2 logs mozaika-prod

# Обновление приложения
/home/mozaika/deploy.sh

# Перезапуск
pm2 restart mozaika-prod
```

## 📞 Нужна помощь?

Если что-то не работает, смотрите полную инструкцию в файле `deploy-reg-ru.md`