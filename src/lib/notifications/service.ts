import { prisma } from '@/lib/prisma'
import { NotificationData, NotificationType, NotificationChannel, EmailTemplate } from './types'
import { MockEmailProvider } from './providers/mock'

/**
 * Сервис для управления уведомлениями
 */
export class NotificationService {
  private static emailProvider = new MockEmailProvider()

  /**
   * Создает и отправляет уведомление
   */
  static async createNotification(data: NotificationData): Promise<string> {
    try {
      // Получаем настройки пользователя
      const userSettings = await this.getUserSettings(data.recipientId)
      
      // Фильтруем каналы на основе настроек пользователя
      const enabledChannels = this.filterEnabledChannels(data.channel, data.type, userSettings)
      
      if (enabledChannels.length === 0) {
        console.log(`No enabled channels for user ${data.recipientId}, notification type ${data.type}`)
        return ''
      }

      // Создаем уведомление в базе данных
      const notification = await prisma.notification.create({
        data: {
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data || {},
          userId: data.recipientId,
          channels: enabledChannels,
          priority: data.priority,
          scheduledAt: data.scheduledAt,
          expiresAt: data.expiresAt,
          propertyId: data.data?.propertyId,
          bookingId: data.data?.bookingId,
          contractId: data.data?.contractId,
          paymentId: data.data?.paymentId
        }
      })

      // Отправляем уведомление (если не отложенное)
      if (!data.scheduledAt || data.scheduledAt <= new Date()) {
        await this.sendNotification(notification.id)
      }

      return notification.id

    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  /**
   * Отправляет уведомление по всем каналам
   */
  static async sendNotification(notificationId: string): Promise<void> {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        include: { user: true }
      })

      if (!notification) {
        throw new Error(`Notification ${notificationId} not found`)
      }

      const sentChannels: string[] = []

      // Отправляем по каждому каналу
      for (const channel of notification.channels) {
        try {
          let sent = false

          switch (channel) {
            case 'email':
              if (notification.user.email) {
                sent = await this.sendEmailNotification(notification, notification.user.email)
              }
              break

            case 'push':
              // Здесь будет отправка push-уведомлений
              sent = await this.sendPushNotification(notification)
              break

            case 'sms':
              if (notification.user.phone) {
                sent = await this.sendSMSNotification(notification, notification.user.phone)
              }
              break

            case 'in_app':
              // Для in-app уведомлений просто помечаем как отправленное
              sent = true
              break
          }

          if (sent) {
            sentChannels.push(channel)
          }
        } catch (error) {
          console.error(`Error sending notification via ${channel}:`, error)
        }
      }

      // Обновляем статус отправки
      await prisma.notification.update({
        where: { id: notificationId },
        data: { sentChannels }
      })

    } catch (error) {
      console.error('Error sending notification:', error)
      throw error
    }
  }

  /**
   * Отправляет email уведомление
   */
  private static async sendEmailNotification(notification: any, email: string): Promise<boolean> {
    try {
      const template = this.generateEmailTemplate(notification)
      return await this.emailProvider.sendEmail(email, template)
    } catch (error) {
      console.error('Error sending email notification:', error)
      return false
    }
  }

  /**
   * Отправляет push уведомление
   */
  private static async sendPushNotification(notification: any): Promise<boolean> {
    try {
      // Здесь будет интеграция с push-сервисом (Firebase, OneSignal и т.д.)
      console.log(`Push notification sent: ${notification.title}`)
      return true
    } catch (error) {
      console.error('Error sending push notification:', error)
      return false
    }
  }

  /**
   * Отправляет SMS уведомление
   */
  private static async sendSMSNotification(notification: any, phone: string): Promise<boolean> {
    try {
      // Здесь будет интеграция с SMS-сервисом
      console.log(`SMS sent to ${phone}: ${notification.message}`)
      return true
    } catch (error) {
      console.error('Error sending SMS notification:', error)
      return false
    }
  }

  /**
   * Получает настройки уведомлений пользователя
   */
  private static async getUserSettings(userId: string) {
    let settings = await prisma.notificationSettings.findUnique({
      where: { userId }
    })

    // Создаем настройки по умолчанию, если их нет
    if (!settings) {
      settings = await prisma.notificationSettings.create({
        data: {
          userId,
          emailEnabled: true,
          pushEnabled: true,
          smsEnabled: false,
          settings: {}
        }
      })
    }

    return settings
  }

  /**
   * Фильтрует каналы на основе настроек пользователя
   */
  private static filterEnabledChannels(
    requestedChannels: NotificationChannel[], 
    type: NotificationType, 
    userSettings: any
  ): string[] {
    const enabledChannels: string[] = []

    for (const channel of requestedChannels) {
      let enabled = false

      switch (channel) {
        case NotificationChannel.EMAIL:
          enabled = userSettings.emailEnabled
          break
        case NotificationChannel.PUSH:
          enabled = userSettings.pushEnabled
          break
        case NotificationChannel.SMS:
          enabled = userSettings.smsEnabled
          break
        case NotificationChannel.IN_APP:
          enabled = true // In-app уведомления всегда включены
          break
      }

      // Проверяем настройки для конкретного типа уведомления
      if (enabled && userSettings.settings) {
        const typeSettings = userSettings.settings[type]
        if (typeSettings && typeSettings[channel] === false) {
          enabled = false
        }
      }

      if (enabled) {
        enabledChannels.push(channel)
      }
    }

    return enabledChannels
  }

  /**
   * Генерирует email шаблон для уведомления
   */
  private static generateEmailTemplate(notification: any): EmailTemplate {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const templates: Record<string, (n: any) => EmailTemplate> = {
      [NotificationType.BOOKING_CREATED]: (n) => ({
        subject: '🏠 Новое бронирование',
        htmlBody: `
          <h2>Новое бронирование</h2>
          <p>${n.message}</p>
          <p><a href="${baseUrl}/bookings">Просмотреть бронирования</a></p>
        `,
        textBody: n.message
      }),

      [NotificationType.PAYMENT_REQUIRED]: (n) => ({
        subject: '💳 Требуется оплата',
        htmlBody: `
          <h2>Требуется оплата</h2>
          <p>${n.message}</p>
          <p><a href="${baseUrl}/payments">Перейти к оплате</a></p>
        `,
        textBody: n.message
      }),

      [NotificationType.CONTRACT_SIGNED]: (n) => ({
        subject: '📄 Договор подписан',
        htmlBody: `
          <h2>Договор подписан</h2>
          <p>${n.message}</p>
          <p><a href="${baseUrl}/contracts">Просмотреть договоры</a></p>
        `,
        textBody: n.message
      })
    }

    const templateFn = templates[notification.type]
    if (templateFn) {
      return templateFn(notification)
    }

    // Шаблон по умолчанию
    return {
      subject: notification.title,
      htmlBody: `<h2>${notification.title}</h2><p>${notification.message}</p>`,
      textBody: notification.message
    }
  }

  /**
   * Помечает уведомление как прочитанное
   */
  static async markAsRead(notificationId: string, userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: userId
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })
  }

  /**
   * Помечает все уведомления пользователя как прочитанные
   */
  static async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId: userId,
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })
  }

  /**
   * Получает уведомления пользователя
   */
  static async getUserNotifications(userId: string, options: {
    page?: number
    limit?: number
    unreadOnly?: boolean
  } = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options
    const skip = (page - 1) * limit

    const where: any = { userId }
    if (unreadOnly) {
      where.read = false
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.notification.count({ where })
    ])

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + notifications.length < total
    }
  }

  /**
   * Обрабатывает отложенные уведомления
   */
  static async processScheduledNotifications(): Promise<void> {
    const scheduledNotifications = await prisma.notification.findMany({
      where: {
        scheduledAt: {
          lte: new Date()
        },
        sentChannels: {
          isEmpty: true
        }
      }
    })

    for (const notification of scheduledNotifications) {
      try {
        await this.sendNotification(notification.id)
      } catch (error) {
        console.error(`Error processing scheduled notification ${notification.id}:`, error)
      }
    }
  }
}