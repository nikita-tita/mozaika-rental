export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  userId?: string
  requestId?: string
}

class Logger {
  private level: LogLevel
  private isDevelopment: boolean

  constructor() {
    const envLevel = process.env.LOG_LEVEL
    const levelMap: Record<string, LogLevel> = {
      DEBUG: LogLevel.DEBUG,
      INFO: LogLevel.INFO,
      WARN: LogLevel.WARN,
      ERROR: LogLevel.ERROR,
    }
    this.level = envLevel && levelMap[envLevel.toUpperCase()] !== undefined
      ? levelMap[envLevel.toUpperCase()]
      : LogLevel.INFO
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private formatMessage(entry: LogEntry): string {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR']
    const timestamp = new Date().toISOString()
    const levelName = levelNames[entry.level]
    
    let message = `[${timestamp}] ${levelName}: ${entry.message}`
    
    if (entry.userId) {
      message += ` | User: ${entry.userId}`
    }
    
    if (entry.requestId) {
      message += ` | Request: ${entry.requestId}`
    }
    
    if (entry.data && this.isDevelopment) {
      message += ` | Data: ${JSON.stringify(entry.data, null, 2)}`
    }
    
    return message
  }

  private log(level: LogLevel, message: string, data?: any, userId?: string, requestId?: string) {
    if (level >= this.level) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data,
        userId,
        requestId
      }
      
      const formattedMessage = this.formatMessage(entry)
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage)
          break
        case LogLevel.INFO:
          console.info(formattedMessage)
          break
        case LogLevel.WARN:
          console.warn(formattedMessage)
          break
        case LogLevel.ERROR:
          console.error(formattedMessage)
          break
      }
    }
  }

  debug(message: string, data?: any, userId?: string, requestId?: string) {
    this.log(LogLevel.DEBUG, message, data, userId, requestId)
  }

  info(message: string, data?: any, userId?: string, requestId?: string) {
    this.log(LogLevel.INFO, message, data, userId, requestId)
  }

  warn(message: string, data?: any, userId?: string, requestId?: string) {
    this.log(LogLevel.WARN, message, data, userId, requestId)
  }

  error(message: string, data?: any, userId?: string, requestId?: string) {
    this.log(LogLevel.ERROR, message, data, userId, requestId)
  }

  // Специальные методы для API логирования
  apiRequest(method: string, path: string, userId?: string, requestId?: string) {
    this.info(`API Request: ${method} ${path}`, { method, path }, userId, requestId)
  }

  apiResponse(method: string, path: string, statusCode: number, userId?: string, requestId?: string) {
    this.info(`API Response: ${method} ${path} - ${statusCode}`, { method, path, statusCode }, userId, requestId)
  }

  apiError(method: string, path: string, error: any, userId?: string, requestId?: string) {
    this.error(`API Error: ${method} ${path}`, { method, path, error: error.message || error }, userId, requestId)
  }

  // Методы для бизнес-логики
  userAction(action: string, userId: string, data?: any, requestId?: string) {
    this.info(`User Action: ${action}`, data, userId, requestId)
  }

  businessEvent(event: string, data?: any, userId?: string, requestId?: string) {
    this.info(`Business Event: ${event}`, data, userId, requestId)
  }
}

export const logger = new Logger() 