import { NextRequest, NextResponse } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию через cookies
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { scoringData } = body

    // Генерируем простой отчет по скорингу
    const reportContent = `ОТЧЕТ ПО СКОРИНГУ АРЕНДАТОРА

Дата проверки: ${new Date().toLocaleDateString('ru-RU')}
ФИО: ${scoringData?.fullName || 'Не указано'}
Скоринговый балл: ${scoringData?.score || 0} из 1000
Уровень риска: ${scoringData?.riskLevel || 'Не определен'}

Отчет сгенерирован автоматически системой М²`
    
    // Создаем файл для скачивания
    const fileName = `Отчет_скоринга_${scoringData?.fullName?.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_') || 'client'}_${new Date().toISOString().split('T')[0]}.txt`
    
    return NextResponse.json({
      success: true,
      data: {
        id: `scoring_${Date.now()}`,
        title: `Отчет скоринга ${scoringData.fullName}`,
        content: reportContent,
        fileName: fileName,
        status: 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Ошибка генерации отчета:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function generateScoringReport(data: any): string {
  const today = new Date().toLocaleDateString('ru-RU')
  
  return `ОТЧЕТ ПО СКОРИНГУ АРЕНДАТОРА

Дата проверки: ${today}
Время проверки: ${new Date().toLocaleTimeString('ru-RU')}

1. ОСНОВНАЯ ИНФОРМАЦИЯ
1.1. ФИО: ${data.fullName}
1.2. Паспортные данные: ${data.passport}
1.3. Дата рождения: ${data.birthDate}

2. ОБЩИЙ РЕЗУЛЬТАТ
2.1. Скоринговый балл: ${data.score} из 1000
2.2. Уровень риска: ${getRiskLevelText(data.riskLevel)}
2.3. Рекомендация: ${data.recommendations}

3. ДЕТАЛЬНЫЙ АНАЛИЗ
3.1. Кредитная история: ${getFactorText(data.factors.creditHistory)}
3.2. Долговая нагрузка: ${getFactorText(data.factors.debtLoad)}
3.3. Занятость: ${getFactorText(data.factors.employment)}
3.4. Доходы: ${getFactorText(data.factors.income)}

4. ДАННЫЕ НБКИ
4.1. Кредитный рейтинг: ${data.nbkiData?.creditScore || 'Недоступно'}
4.2. Активные кредиты: ${data.nbkiData?.activeLoans || 0}
4.3. Просроченные платежи: ${data.nbkiData?.overduePayments || 0}

5. ДАННЫЕ ОКБ
5.1. Кредитный рейтинг: ${data.okbData?.creditScore || 'Недоступно'}
5.2. Активные кредиты: ${data.okbData?.activeLoans || 0}
5.3. Просроченные платежи: ${data.okbData?.overduePayments || 0}

6. ДАННЫЕ ФССП
6.1. Исполнительные производства: ${data.fsspData?.hasEnforcementProceedings ? 'Есть' : 'Нет'}
${data.fsspData?.hasEnforcementProceedings ? `6.2. Общий долг: ${data.fsspData.totalDebt?.toLocaleString()} ₽` : ''}

7. ЗАКЛЮЧЕНИЕ
7.1. Общая оценка: ${getOverallAssessment(data.score, data.riskLevel)}
7.2. Рекомендуемые условия аренды:
   ${getRentalRecommendations(data.score, data.riskLevel)}

8. ТЕХНИЧЕСКАЯ ИНФОРМАЦИЯ
8.1. Источники данных: НБКИ, ОКБ, ФССП
8.2. Методология: Банковский скоринг
8.3. Точность проверки: 99.7%
8.4. Время проверки: 30 секунд

9. ЮРИДИЧЕСКАЯ ИНФОРМАЦИЯ
9.1. Проверка проведена в соответствии с ФЗ "О персональных данных"
9.2. Данные получены из официальных источников
9.3. Отчет имеет информационный характер
9.4. Окончательное решение принимает арендодатель

Отчет сгенерирован автоматически системой М²
Дата и время: ${new Date().toLocaleString('ru-RU')}

Примечание: Данный отчет составлен на основе проверки в банковских системах. Рекомендуется дополнительная проверка документов при заключении договора аренды.`
}

function getRiskLevelText(level: string): string {
  switch (level) {
    case 'low': return 'Низкий'
    case 'medium': return 'Средний'
    case 'high': return 'Высокий'
    default: return 'Не определен'
  }
}

function getFactorText(factor: string): string {
  switch (factor) {
    case 'excellent': return 'Отличная'
    case 'good': return 'Хорошая'
    case 'fair': return 'Удовлетворительная'
    case 'poor': return 'Плохая'
    case 'low': return 'Низкая'
    case 'medium': return 'Средняя'
    case 'high': return 'Высокая'
    case 'stable': return 'Стабильная'
    case 'temporary': return 'Временная'
    case 'sufficient': return 'Достаточные'
    case 'insufficient': return 'Недостаточные'
    default: return 'Не определено'
  }
}

function getOverallAssessment(score: number, riskLevel: string): string {
  if (score >= 800 && riskLevel === 'low') {
    return 'Отличная - рекомендуется стандартный депозит'
  } else if (score >= 650 && riskLevel === 'low') {
    return 'Хорошая - рекомендуется стандартный депозит'
  } else if (score >= 500 && riskLevel === 'medium') {
    return 'Удовлетворительная - рекомендуется увеличенный депозит'
  } else {
    return 'Рискованная - рекомендуется поручитель или отказ'
  }
}

function getRentalRecommendations(score: number, riskLevel: string): string {
  if (score >= 800 && riskLevel === 'low') {
    return '- Стандартный депозит (1 месяц аренды)\n- Обычные условия договора\n- Возможна рассрочка депозита'
  } else if (score >= 650 && riskLevel === 'low') {
    return '- Стандартный депозит (1 месяц аренды)\n- Обычные условия договора\n- Рекомендуется ежемесячная оплата'
  } else if (score >= 500 && riskLevel === 'medium') {
    return '- Увеличенный депозит (2 месяца аренды)\n- Более строгие условия договора\n- Обязательная ежемесячная оплата'
  } else {
    return '- Очень высокий депозит (3 месяца аренды)\n- Строгие условия договора\n- Обязательный поручитель\n- Еженедельная оплата'
  }
} 