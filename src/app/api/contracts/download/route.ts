import { NextRequest, NextResponse } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'
import { createReport } from 'docx-templates'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    // Простая реализация - возвращаем текстовый файл
    const content = `ДОГОВОР АРЕНДЫ

Тестовый договор аренды

Содержание договора

Дата: ${new Date().toLocaleDateString('ru-RU')}
Подпись: _________________`

    const fileBuffer = Buffer.from(content, 'utf-8')
    const fileName = `Договор_аренды_${new Date().toISOString().split('T')[0]}.txt`

    // Создаем ответ с файлом
    const response = new NextResponse(fileBuffer)
    response.headers.set('Content-Type', 'text/plain')
    response.headers.set('Content-Disposition', `attachment; filename="${fileName}"`)

    return response
  } catch (error) {
    console.error('Ошибка скачивания договора:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function prepareTemplateData(data: any) {
  const today = new Date().toLocaleDateString('ru-RU')
  
  return {
    // Основная информация
    contractDate: today,
    contractCity: 'г. Москва',
    
    // Наймодатель
    landlordName: data.landlordName || 'Не указано',
    landlordPassport: data.landlordPassport || 'Не указано',
    landlordPassportIssuedBy: data.landlordPassportIssuedBy || 'Не указано',
    landlordPassportIssuedDate: data.landlordPassportIssuedDate || 'Не указано',
    landlordSnils: data.landlordSnils || 'Не указано',
    landlordInn: data.landlordInn || 'Не указано',
    landlordAddress: data.landlordAddress || 'Не указано',
    landlordRegistrationAddress: data.landlordRegistrationAddress || 'Не указано',
    
    // Наниматель
    tenantName: data.tenantName || 'Не указано',
    tenantPassport: data.tenantPassport || 'Не указано',
    tenantPassportIssuedBy: data.tenantPassportIssuedBy || 'Не указано',
    tenantPassportIssuedDate: data.tenantPassportIssuedDate || 'Не указано',
    tenantBirthDate: data.tenantBirthDate || 'Не указано',
    tenantPhone: data.tenantPhone || 'Не указано',
    tenantEmail: data.tenantEmail || 'Не указано',
    tenantRegistrationAddress: data.tenantRegistrationAddress || 'Не указано',
    
    // Объект недвижимости
    propertyAddress: data.propertyAddress || 'Не указано',
    propertyType: data.propertyType || 'Квартира',
    propertyArea: data.propertyArea || 'Не указано',
    propertyRooms: data.propertyRooms || 'Не указано',
    propertyFloor: data.propertyFloor || 'Не указано',
    propertyTotalFloors: data.propertyTotalFloors || 'Не указано',
    propertyCadastralNumber: data.propertyCadastralNumber || 'Не указано',
    propertyOwnershipType: data.propertyOwnershipType || 'Частная собственность',
    propertyFurnished: data.propertyFurnished ? 'С мебелью' : 'Без мебели',
    
    // Условия договора
    startDate: data.startDate || 'Не указано',
    endDate: data.endDate || 'Не указано',
    monthlyRent: data.monthlyRent ? data.monthlyRent.toLocaleString() : 'Не указано',
    paymentDay: data.paymentDay || '5',
    paymentSchedule: data.paymentSchedule === 'monthly' ? 'Ежемесячно' : 
                    data.paymentSchedule === 'quarterly' ? 'Ежеквартально' : 
                    data.paymentSchedule === 'yearly' ? 'Ежегодно' : 'Ежемесячно',
    
    // Коммунальные услуги
    utilities: data.utilities ? 'Включены в плату за наем' : 'Оплачиваются Нанимателем отдельно',
    utilitiesIncluded: data.utilitiesIncluded ? 'Включены' : 'Не включены',
    
    // Залог
    deposit: data.deposit ? data.deposit.toLocaleString() : 'Не указано',
    depositReturnConditions: data.depositReturnConditions || 'Возвращается при расторжении договора при отсутствии претензий',
    
    // Штрафы
    latePaymentPenalty: data.latePaymentPenalty ? (data.latePaymentPenalty * 100).toFixed(1) : '0.1',
    
    // Дополнительные условия
    earlyTerminationConditions: data.earlyTerminationConditions || 'Согласно законодательству РФ',
    additionalTerms: data.additionalTerms || 'Все споры решаются путем переговоров, а при невозможности достижения соглашения - в судебном порядке.',
    
    // Системная информация
    generatedBy: 'Система М² для автоматизации документооборота',
    generationDate: new Date().toLocaleString('ru-RU')
  }
}

async function generateWordDocument(data: any): Promise<Buffer> {
  try {
    // Читаем шаблон
    const templatePath = join(process.cwd(), 'Договор найма жилого помещения.docx')
    
    if (!existsSync(templatePath)) {
      console.log('Шаблон не найден, создаем простой документ')
      return generateSimpleWordDocument(data)
    }
    
    const template = readFileSync(templatePath)
    
    // Генерируем документ с данными
    const buffer = await createReport({
      template,
      data,
      cmdDelimiter: ['{', '}']
    })
    
    return Buffer.from(buffer)
  } catch (error) {
    console.error('Ошибка генерации Word документа:', error)
    // Если не удалось сгенерировать из шаблона, создаем простой текстовый документ
    return generateSimpleWordDocument(data)
  }
}

function generateSimpleWordDocument(data: any): Buffer {
  // Создаем простой Word документ как fallback
  const content = generateContractContent(data)
  
  // Простая реализация создания Word документа
  // В реальном проекте здесь можно использовать библиотеку docx
  const docxContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>${content.replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>')}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`
  
  return Buffer.from(docxContent, 'utf-8')
}

async function generatePDFDocument(data: any): Promise<Buffer> {
  try {
    // Создаем PDF документ
    const pdfDoc = await PDFDocument.create()
    let page = pdfDoc.addPage([595.28, 841.89]) // A4 размер
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    
    const content = generateContractContent(data)
    const lines = content.split('\n')
    
    let y = page.getHeight() - 50
    const lineHeight = 14
    const margin = 50
    
    for (const line of lines) {
      if (y < margin) {
        page = pdfDoc.addPage([595.28, 841.89])
        y = page.getHeight() - 50
      }
      
      page.drawText(line.trim(), {
        x: margin,
        y: y,
        size: 10,
        font: font,
        color: rgb(0, 0, 0)
      })
      
      y -= lineHeight
    }
    
    const pdfBytes = await pdfDoc.save()
    return Buffer.from(pdfBytes)
  } catch (error) {
    console.error('Ошибка генерации PDF документа:', error)
    // Fallback - создаем простой PDF
    return generateSimplePDFDocument(data)
  }
}

function generateSimplePDFDocument(data: any): Buffer {
  // Простая реализация PDF как fallback
  const content = generateContractContent(data)
  
  // Возвращаем простой текстовый файл как fallback
  return Buffer.from(content, 'utf-8')
}

function generateContractContent(data: any): string {
  const today = new Date().toLocaleDateString('ru-RU')
  
  return `ДОГОВОР НАЙМА ЖИЛОГО ПОМЕЩЕНИЯ

г. Москва                                                                  ${today}

${data.landlordName}, именуемый в дальнейшем "Наймодатель", в лице ${data.landlordName}, действующий на основании права собственности, с одной стороны, и ${data.tenantName}, именуемый в дальнейшем "Наниматель", с другой стороны, заключили настоящий договор найма жилого помещения о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА
1.1. Наймодатель обязуется предоставить Нанимателю во временное владение и пользование жилое помещение по адресу: ${data.propertyAddress}, а Наниматель обязуется принять это помещение и уплачивать за него плату за наем в размере ${data.monthlyRent} рублей в месяц.

1.2. Характеристики объекта недвижимости:
   - Тип: ${data.propertyType}
   - Площадь: ${data.propertyArea} кв.м
   - Количество комнат: ${data.propertyRooms}
   - Этаж: ${data.propertyFloor} из ${data.propertyTotalFloors}
   - Кадастровый номер: ${data.propertyCadastralNumber}
   - Тип собственности: ${data.propertyOwnershipType}
   - Меблировка: ${data.propertyFurnished}

2. СРОК ДЕЙСТВИЯ ДОГОВОРА
2.1. Договор найма заключен на срок с ${data.startDate} по ${data.endDate}.

3. ПРАВА И ОБЯЗАННОСТИ СТОРОН
3.1. Наймодатель обязуется:
   - Предоставить помещение в состоянии, пригодном для проживания
   - Обеспечить бесперебойное предоставление коммунальных услуг
   - Своевременно производить капитальный ремонт помещения
   - Не чинить препятствий в пользовании помещением

3.2. Наниматель обязуется:
   - Использовать помещение только для проживания
   - Своевременно вносить плату за наем
   - Бережно относиться к имуществу
   - Не производить переустройство и перепланировку помещения без согласия Наймодателя
   - Поддерживать помещение в надлежащем состоянии

4. ПЛАТА ЗА НАЕМ
4.1. Размер платы за наем составляет ${data.monthlyRent} рублей в месяц.
4.2. Плата за наем вносится ежемесячно не позднее ${data.paymentDay} числа каждого месяца.
4.3. График платежей: ${data.paymentSchedule}

5. КОММУНАЛЬНЫЕ УСЛУГИ
5.1. Коммунальные услуги: ${data.utilities}
5.2. Дополнительные коммунальные услуги: ${data.utilitiesIncluded}

6. ЗАЛОГ
6.1. При заключении договора Наниматель вносит залог в размере ${data.deposit} рублей.
6.2. Условия возврата залога: ${data.depositReturnConditions}

7. ОТВЕТСТВЕННОСТЬ СТОРОН
7.1. За нарушение сроков внесения платы за наем Наниматель уплачивает пеню в размере ${data.latePaymentPenalty}% от суммы задолженности за каждый день просрочки.
7.2. За нарушение условий договора виновная сторона возмещает убытки другой стороне.

8. РАСТОРЖЕНИЕ ДОГОВОРА
8.1. Договор найма может быть расторгнут по соглашению сторон.
8.2. Каждая из сторон вправе расторгнуть договор найма в одностороннем порядке, предупредив другую сторону за 30 дней.
8.3. Условия досрочного расторжения: ${data.earlyTerminationConditions}

9. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ
9.1. ${data.additionalTerms}

10. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
10.1. Договор найма составлен в двух экземплярах, имеющих равную юридическую силу.
10.2. Все изменения и дополнения к договору найма действительны только в письменной форме.
10.3. Договор найма вступает в силу с момента подписания.

Наймодатель: ${data.landlordName}
Паспорт: ${data.landlordPassport}
Кем выдан: ${data.landlordPassportIssuedBy}
Дата выдачи: ${data.landlordPassportIssuedDate}
СНИЛС: ${data.landlordSnils}
ИНН: ${data.landlordInn}
Адрес: ${data.landlordAddress}
Адрес регистрации: ${data.landlordRegistrationAddress}

Наниматель: ${data.tenantName}
Паспорт: ${data.tenantPassport}
Кем выдан: ${data.tenantPassportIssuedBy}
Дата выдачи: ${data.tenantPassportIssuedDate}
Дата рождения: ${data.tenantBirthDate}
Телефон: ${data.tenantPhone}
Email: ${data.tenantEmail}
Адрес регистрации: ${data.tenantRegistrationAddress}

Подписи сторон:
Наймодатель: _________________                               Наниматель: _________________
Дата: ${today}                                                Дата: ${today}

Договор найма составлен и подписан ${today} года в г. Москва.

Договор составлен с использованием ${data.generatedBy}.`
} 