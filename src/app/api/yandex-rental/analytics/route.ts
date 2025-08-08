import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

// GET /api/yandex-rental/analytics - Получить аналитику
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get('period') || '365') // дни

    // Рассчитываем дату начала периода
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - period)

    // Получаем лиды за период
    const leads = await prisma.yandexRentalLead.findMany({
      where: {
        userId: user.userId,
        submittedAt: {
          gte: startDate
        }
      },
      orderBy: { submittedAt: 'desc' }
    })

    // Основная статистика
    const totalLeads = leads.length
    const completedDeals = leads.filter(lead => lead.status === 'OCCUPIED').length
    const totalEarnings = leads
      .filter(lead => lead.status === 'OCCUPIED' && lead.commission)
      .reduce((sum, lead) => sum + (lead.commission || 0), 0)
    
    const conversionRate = totalLeads > 0 
      ? (completedDeals / totalLeads) * 100 
      : 0

    // Среднее время до сдачи
    const avgTimeToRent = completedDeals > 0 
      ? leads
          .filter(lead => lead.status === 'OCCUPIED')
          .reduce((sum, lead) => {
            const submitted = new Date(lead.submittedAt)
            const updated = new Date(lead.updatedAt)
            return sum + (updated.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24)
          }, 0) / completedDeals
      : 0

    // Распределение по статусам
    const statusDistribution = [
      'SUBMITTED',
      'CALLED_OWNER', 
      'PHOTO_SCHEDULED',
      'PUBLISHED',
      'FIRST_SHOWING',
      'CONTRACT_SIGNED',
      'OCCUPIED',
      'FAILED'
    ].map(status => {
      const count = leads.filter(lead => lead.status === status).length
      return {
        status,
        count,
        percentage: totalLeads > 0 ? (count / totalLeads) * 100 : 0
      }
    })

    // Месячная статистика (последние 6 месяцев)
    const monthlyStats = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - i)
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)
      
      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      monthEnd.setDate(0)
      monthEnd.setHours(23, 59, 59, 999)

      const monthLeads = leads.filter(lead => {
        const leadDate = new Date(lead.submittedAt)
        return leadDate >= monthStart && leadDate <= monthEnd
      })

      const monthDeals = monthLeads.filter(lead => lead.status === 'OCCUPIED')
      const monthEarnings = monthDeals
        .filter(lead => lead.commission)
        .reduce((sum, lead) => sum + (lead.commission || 0), 0)

      monthlyStats.push({
        month: monthStart.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' }),
        leads: monthLeads.length,
        deals: monthDeals.length,
        earnings: monthEarnings
      })
    }

    return NextResponse.json({
      success: true,
      totalLeads,
      completedDeals,
      totalEarnings,
      conversionRate: Math.round(conversionRate * 10) / 10,
      avgTimeToRent: Math.round(avgTimeToRent),
      statusDistribution,
      monthlyStats
    })

  } catch (error) {
    console.error('Ошибка при получении аналитики:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 