import { NotificationProvider, EmailTemplate } from '../types'

/**
 * Mock провайдер для тестирования уведомлений
 */
export class MockEmailProvider implements NotificationProvider {
  name = 'mock'

  async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    // Имитируем отправку email
    console.log(`📧 Mock Email sent to: ${to}`)
    console.log(`Subject: ${template.subject}`)
    console.log(`Body: ${template.textBody}`)
    
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Имитируем случайные ошибки (5% вероятность)
    if (Math.random() < 0.05) {
      console.error(`Failed to send email to ${to}`)
      return false
    }
    
    return true
  }

  async sendPush(deviceToken: string, title: string, body: string, data?: any): Promise<boolean> {
    console.log(`📱 Mock Push sent to: ${deviceToken}`)
    console.log(`Title: ${title}`)
    console.log(`Body: ${body}`)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (Math.random() < 0.05) {
      console.error(`Failed to send push to ${deviceToken}`)
      return false
    }
    
    return true
  }

  async sendSMS(phone: string, message: string): Promise<boolean> {
    console.log(`📱 Mock SMS sent to: ${phone}`)
    console.log(`Message: ${message}`)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (Math.random() < 0.1) {
      console.error(`Failed to send SMS to ${phone}`)
      return false
    }
    
    return true
  }
}