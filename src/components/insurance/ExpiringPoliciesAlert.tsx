'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Clock, 
  Shield,
  ArrowRight,
  X
} from 'lucide-react'
import { 
  TeamsAlert, 
  TeamsButton,
  TeamsCard
} from '@/components/ui/teams'

export default function ExpiringPoliciesAlert() {
  const [expiringPolicies, setExpiringPolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetchExpiringPolicies()
  }, [])

  const fetchExpiringPolicies = async () => {
    try {
      const response = await fetch('/api/insurance/notifications/expiring')
      if (response.ok) {
        const data = await response.json()
        setExpiringPolicies(data)
      }
    } catch (error) {
      console.error('Error fetching expiring policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return 'error'
    if (days <= 14) return 'warning'
    return 'info'
  }

  const getUrgencyText = (days: number) => {
    if (days <= 7) return 'Критично'
    if (days <= 14) return 'Срочно'
    return 'Внимание'
  }

  if (loading) {
    return null
  }

  if (expiringPolicies.length === 0 || dismissed) {
    return null
  }

  return (
    <div className="mb-6">
      <TeamsAlert variant="warning">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-3 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-orange-800 mb-2">
                Полисы страхования истекают
              </h3>
              <div className="space-y-2">
                {expiringPolicies.slice(0, 3).map((policy) => {
                  const days = getDaysUntilExpiry(policy.endDate)
                  return (
                    <div key={policy.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-orange-600 mr-2" />
                        <span className="text-orange-700">
                          {policy.policyNumber} - истекает через {days} дней
                        </span>
                      </div>
                      <TeamsButton
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = '/insurance?tab=policies'}
                      >
                        Продлить
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </TeamsButton>
                    </div>
                  )
                })}
                {expiringPolicies.length > 3 && (
                  <div className="text-sm text-orange-700">
                    И еще {expiringPolicies.length - 3} полисов...
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-orange-600 hover:text-orange-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </TeamsAlert>
    </div>
  )
} 