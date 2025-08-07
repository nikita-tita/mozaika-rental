# 🚀 Быстрый деплой M² на REG.RU

## ⚡ За 5 минут

1. **Заказать VPS на REG.RU** (Ubuntu 22.04, 2GB RAM)
2. **Подключиться к серверу**: `ssh root@YOUR_IP`
3. **Запустить автоустановку**:
   ```bash
   curl -sSL https://raw.githubusercontent.com/nikita-tita/mozaika-rental/main/install-server.sh | bash
   ```
4. **Настроить домен**: добавить A-запись в DNS
5. **Настроить SSL**: `certbot --nginx -d yourdomain.com`

## 🎯 Готово!

Ваше приложение доступно по домену: `https://yourdomain.com`

## 🔧 Полезные команды

```bash
# Статус приложения
pm2 status

# Обновление
sudo -u mozaika /home/mozaika/deploy.sh

# Логи
pm2 logs mozaika
```

**Подробная инструкция**: `deploy-reg-ru.md`