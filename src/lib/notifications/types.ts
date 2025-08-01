export enum NotificationType {
  BOOKING_CREATED = 'booking_created',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  CONTRACT_SIGNED = 'contract_signed',
  PAYMENT_REQUIRED = 'payment_required',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed',
  PROPERTY_APPROVED = 'property_approved',
  PROPERTY_REJECTED = 'property_rejected',
  REVIEW_RECEIVED = 'review_received',
  MESSAGE_RECEIVED = 'message_received',
  SYSTEM_ANNOUNCEMENT = 'system_announcement'
}

export enum NotificationChannel {
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  IN_APP = 'in_app'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface NotificationData {
  type: NotificationType
  channel: NotificationChannel[]
  priority: NotificationPriority
  recipientId: string
  title: string
  message: string
  data?: Record<string, any>
  scheduledAt?: Date
  expiresAt?: Date
}

export interface EmailTemplate {
  subject: string
  htmlBody: string
  textBody: string
}

export interface NotificationProvider {
  name: string
  sendEmail(to: string, template: EmailTemplate): Promise<boolean>
  sendPush(deviceToken: string, title: string, body: string, data?: any): Promise<boolean>
  sendSMS(phone: string, message: string): Promise<boolean>
}

export interface NotificationSettings {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  notificationTypes: {
    [key in NotificationType]?: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }
}