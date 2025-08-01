#!/usr/bin/env node

import { validateSystemComponents, getSystemValidationReport } from '../src/lib/component-validator'
import { logger } from '../src/lib/logger'

async function main() {
  console.log('🔍 Starting M² System Validation...\n')
  
  try {
    // Валидируем компоненты системы
    const results = validateSystemComponents()
    
    // Выводим отчет
    const report = getSystemValidationReport()
    console.log(report)
    
    // Проверяем общий статус
    const allValid = results.every(result => result.isValid)
    
    if (allValid) {
      console.log('✅ All system components are properly connected!')
      process.exit(0)
    } else {
      console.log('❌ Some system components have issues. Please fix them before deployment.')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ System validation failed:', error)
    logger.error('System validation failed', { error: error instanceof Error ? error.message : String(error) })
    process.exit(1)
  }
}

// Запускаем валидацию
main().catch(error => {
  console.error('❌ Unexpected error during validation:', error)
  process.exit(1)
}) 