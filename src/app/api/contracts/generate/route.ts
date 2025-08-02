import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || (user.role !== 'REALTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { contractData } = body

    // Генерируем реальный договор
    const contractContent = generateContractContent(contractData)
    
    // Создаем файл для скачивания
    const fileName = `Договор_аренды_${contractData.propertyTitle.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
    
    return NextResponse.json({
      success: true,
      data: {
        id: `contract_${Date.now()}`,
        title: `Договор аренды ${contractData.propertyTitle}`,
        content: contractContent,
        fileName: fileName,
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Ошибка генерации договора:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function generateContractContent(data: any): string {
  const today = new Date().toLocaleDateString('ru-RU')
  
  return `ДОГОВОР НАЙМА ЖИЛОГО ПОМЕЩЕНИЯ

г. Москва                                                                  ${today}

${data.landlordName}, именуемый в дальнейшем "Наймодатель", в лице ${data.landlordName}, действующий на основании права собственности, с одной стороны, и ${data.tenantName}, именуемый в дальнейшем "Наниматель", с другой стороны, заключили настоящий договор найма жилого помещения о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА
1.1. Наймодатель обязуется предоставить Нанимателю во временное владение и пользование жилое помещение по адресу: ${data.propertyAddress}, а Наниматель обязуется принять это помещение и уплачивать за него плату за наем в размере ${data.monthlyRent.toLocaleString()} рублей в месяц.

1.2. Характеристики объекта недвижимости:
   - Тип: ${data.propertyType}
   - Площадь: ${data.propertyArea} кв.м
   - Количество комнат: ${data.propertyRooms}
   - Этаж: ${data.propertyFloor} из ${data.propertyTotalFloors}
   - Кадастровый номер: ${data.propertyCadastralNumber || 'Не указан'}
   - Тип собственности: ${data.propertyOwnershipType}
   - Меблировка: ${data.propertyFurnished ? 'С мебелью' : 'Без мебели'}

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
4.1. Размер платы за наем составляет ${data.monthlyRent.toLocaleString()} рублей в месяц.
4.2. Плата за наем вносится ежемесячно не позднее ${data.paymentDay} числа каждого месяца.
4.3. График платежей: ${data.paymentSchedule === 'monthly' ? 'Ежемесячно' : data.paymentSchedule === 'quarterly' ? 'Ежеквартально' : 'Ежегодно'}

5. КОММУНАЛЬНЫЕ УСЛУГИ
5.1. Коммунальные услуги: ${data.utilities ? 'Включены в плату за наем' : 'Оплачиваются Нанимателем отдельно'}
5.2. Дополнительные коммунальные услуги: ${data.utilitiesIncluded ? 'Включены' : 'Не включены'}

6. ЗАЛОГ
6.1. При заключении договора Наниматель вносит залог в размере ${data.deposit.toLocaleString()} рублей.
6.2. Условия возврата залога: ${data.depositReturnConditions || 'Возвращается при расторжении договора при отсутствии претензий'}

7. ОТВЕТСТВЕННОСТЬ СТОРОН
7.1. За нарушение сроков внесения платы за наем Наниматель уплачивает пеню в размере ${(data.latePaymentPenalty * 100).toFixed(1)}% от суммы задолженности за каждый день просрочки.
7.2. За нарушение условий договора виновная сторона возмещает убытки другой стороне.

8. РАСТОРЖЕНИЕ ДОГОВОРА
8.1. Договор найма может быть расторгнут по соглашению сторон.
8.2. Каждая из сторон вправе расторгнуть договор найма в одностороннем порядке, предупредив другую сторону за 30 дней.
8.3. Условия досрочного расторжения: ${data.earlyTerminationConditions || 'Согласно законодательству РФ'}

9. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ
${data.additionalTerms ? data.additionalTerms : '9.1. Все споры решаются путем переговоров, а при невозможности достижения соглашения - в судебном порядке.'}

10. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
10.1. Договор найма составлен в двух экземплярах, имеющих равную юридическую силу.
10.2. Все изменения и дополнения к договору найма действительны только в письменной форме.
10.3. Договор найма вступает в силу с момента подписания.

Наймодатель: ${data.landlordName}
Паспорт: ${data.landlordPassport}
${data.landlordPassportIssuedBy ? `Кем выдан: ${data.landlordPassportIssuedBy}` : ''}
${data.landlordPassportIssuedDate ? `Дата выдачи: ${data.landlordPassportIssuedDate}` : ''}
${data.landlordSnils ? `СНИЛС: ${data.landlordSnils}` : ''}
${data.landlordInn ? `ИНН: ${data.landlordInn}` : ''}
Адрес: ${data.landlordAddress}
${data.landlordRegistrationAddress ? `Адрес регистрации: ${data.landlordRegistrationAddress}` : ''}

Наниматель: ${data.tenantName}
Паспорт: ${data.tenantPassport}
${data.tenantPassportIssuedBy ? `Кем выдан: ${data.tenantPassportIssuedBy}` : ''}
${data.tenantPassportIssuedDate ? `Дата выдачи: ${data.tenantPassportIssuedDate}` : ''}
${data.tenantBirthDate ? `Дата рождения: ${data.tenantBirthDate}` : ''}
Телефон: ${data.tenantPhone}
Email: ${data.tenantEmail}
${data.tenantRegistrationAddress ? `Адрес регистрации: ${data.tenantRegistrationAddress}` : ''}

Подписи сторон:
Наймодатель: _________________                               Наниматель: _________________
Дата: ${today}                                                Дата: ${today}

Договор найма составлен и подписан ${today} года в г. Москва.

Договор составлен с использованием системы М² для автоматизации документооборота.`
} 