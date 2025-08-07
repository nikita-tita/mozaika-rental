import { NextRequest, NextResponse } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  
  return ApiErrorHandler.withErrorHandling(async () => {
    // Получаем токен из заголовка Authorization или cookie
    const authHeader = request.headers.get('authorization')
    let token = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      token = request.cookies.get('auth-token')?.value
    }
    
    if (!token) {
      throw new Error('Unauthorized: No token provided')
    }

    const user = verifyJWTToken(token)
    if (!user) {
      throw new Error('Unauthorized: Invalid token')
    }

    const body = await request.json()
    const { contractData, fileType = 'pdf' } = body

    logger.info('Generating contract download', { userId: user.userId, fileType }, user.userId, requestId)

    if (!contractData) {
      throw new Error('Данные договора обязательны')
    }

    // Генерируем HTML-содержимое договора
    const htmlContent = generateContractHTML(contractData)

    if (fileType === 'pdf') {
      // Для PDF используем простой HTML-ответ (в реальном проекте здесь был бы PDF-генератор)
      const response = new NextResponse(htmlContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="contract_${Date.now()}.html"`
        }
      })
      
      return response
    } else if (fileType === 'word') {
      // Для Word используем простой текстовый формат
      const textContent = generateContractText(contractData)
      
      const response = new NextResponse(textContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="contract_${Date.now()}.txt"`
        }
      })
      
      return response
    } else {
      throw new Error('Неподдерживаемый формат файла')
    }
  }, {
    method: 'POST',
    path: '/api/contracts/download',
    userId: undefined,
    requestId
  })
}

function generateContractHTML(contractData: any) {
  const startDate = new Date(contractData.startDate).toLocaleDateString('ru-RU')
  const endDate = new Date(contractData.endDate).toLocaleDateString('ru-RU')
  
  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Договор аренды</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 14px;
            line-height: 1.5;
            margin: 2cm;
            color: #000;
        }
        .header {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 30px;
        }
        .date {
            text-align: right;
            margin-bottom: 30px;
        }
        .parties {
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-weight: bold;
            margin-bottom: 10px;
        }
        .signatures {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-block {
            width: 45%;
        }
        .signature-line {
            border-bottom: 1px solid #000;
            margin-top: 30px;
            height: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        ДОГОВОР АРЕНДЫ НЕДВИЖИМОСТИ
    </div>
    
    <div class="date">
        г. Москва                                                                  ${startDate}
    </div>
    
    <div class="parties">
        ${contractData.landlordName}, именуемый в дальнейшем "Арендодатель", 
        в лице ${contractData.landlordName}, действующий на основании права собственности, 
        с одной стороны, и ${contractData.tenantName}, именуемый в дальнейшем "Арендатор", 
        с другой стороны, заключили настоящий договор о нижеследующем:
    </div>
    
    <div class="section">
        <div class="section-title">1. ПРЕДМЕТ ДОГОВОРА</div>
        1.1. Арендодатель обязуется предоставить Арендатору во временное владение и пользование 
        недвижимое имущество: ${contractData.propertyTitle}, расположенное по адресу: ${contractData.propertyAddress}.
    </div>
    
    <div class="section">
        <div class="section-title">2. СРОК ДЕЙСТВИЯ ДОГОВОРА</div>
        2.1. Договор вступает в силу с ${startDate} и действует до ${endDate}.
    </div>
    
    <div class="section">
        <div class="section-title">3. АРЕНДНАЯ ПЛАТА</div>
        3.1. Размер арендной платы составляет ${contractData.monthlyRent} рублей в месяц.
        3.2. Арендная плата вносится Арендатором ежемесячно не позднее 5-го числа каждого месяца.
    </div>
    
    <div class="section">
        <div class="section-title">4. ЗАЛОГ</div>
        4.1. При заключении договора Арендатор вносит залог в размере ${contractData.deposit} рублей.
    </div>
    
    <div class="section">
        <div class="section-title">5. ПРАВА И ОБЯЗАННОСТИ СТОРОН</div>
        5.1. Арендодатель обязуется:
        - Передать Арендатору имущество в состоянии, соответствующем условиям договора
        - Не вмешиваться в хозяйственную деятельность Арендатора
        
        5.2. Арендатор обязуется:
        - Использовать имущество в соответствии с его назначением
        - Поддерживать имущество в исправном состоянии
        - Своевременно вносить арендную плату
    </div>
    
    ${contractData.additionalTerms ? `
    <div class="section">
        <div class="section-title">6. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ</div>
        ${contractData.additionalTerms}
    </div>
    ` : ''}
    
    <div class="section">
        <div class="section-title">7. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</div>
        7.1. Договор составлен в двух экземплярах, имеющих равную юридическую силу.
        7.2. Все изменения и дополнения к договору действительны при письменном согласии сторон.
    </div>
    
    <div class="signatures">
        <div class="signature-block">
            <strong>Арендодатель:</strong><br>
            ${contractData.landlordName}<br>
            Паспорт: _________________<br>
            <div class="signature-line"></div>
            Подпись: _________________<br>
            Дата: _________________
        </div>
        <div class="signature-block">
            <strong>Арендатор:</strong><br>
            ${contractData.tenantName}<br>
            Паспорт: _________________<br>
            <div class="signature-line"></div>
            Подпись: _________________<br>
            Дата: _________________
        </div>
    </div>
</body>
</html>`
}

function generateContractText(contractData: any) {
  const startDate = new Date(contractData.startDate).toLocaleDateString('ru-RU')
  const endDate = new Date(contractData.endDate).toLocaleDateString('ru-RU')
  
  return `ДОГОВОР АРЕНДЫ НЕДВИЖИМОСТИ

г. Москва                                                                  ${startDate}

${contractData.landlordName}, именуемый в дальнейшем "Арендодатель", 
в лице ${contractData.landlordName}, действующий на основании права собственности, 
с одной стороны, и ${contractData.tenantName}, именуемый в дальнейшем "Арендатор", 
с другой стороны, заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА
1.1. Арендодатель обязуется предоставить Арендатору во временное владение и пользование 
недвижимое имущество: ${contractData.propertyTitle}, расположенное по адресу: ${contractData.propertyAddress}.

2. СРОК ДЕЙСТВИЯ ДОГОВОРА
2.1. Договор вступает в силу с ${startDate} и действует до ${endDate}.

3. АРЕНДНАЯ ПЛАТА
3.1. Размер арендной платы составляет ${contractData.monthlyRent} рублей в месяц.
3.2. Арендная плата вносится Арендатором ежемесячно не позднее 5-го числа каждого месяца.

4. ЗАЛОГ
4.1. При заключении договора Арендатор вносит залог в размере ${contractData.deposit} рублей.

5. ПРАВА И ОБЯЗАННОСТИ СТОРОН
5.1. Арендодатель обязуется:
- Передать Арендатору имущество в состоянии, соответствующем условиям договора
- Не вмешиваться в хозяйственную деятельность Арендатора

5.2. Арендатор обязуется:
- Использовать имущество в соответствии с его назначением
- Поддерживать имущество в исправном состоянии
- Своевременно вносить арендную плату

${contractData.additionalTerms ? `
6. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ
${contractData.additionalTerms}
` : ''}

7. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
7.1. Договор составлен в двух экземплярах, имеющих равную юридическую силу.
7.2. Все изменения и дополнения к договору действительны при письменном согласии сторон.

Арендодатель:                                    Арендатор:
${contractData.landlordName}                    ${contractData.tenantName}
Паспорт: _________________                      Паспорт: _________________
Подпись: _________________                      Подпись: _________________
Дата: _________________                         Дата: _________________`
} 