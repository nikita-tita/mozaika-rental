import { useI18n, useScopedI18n } from './index'

// Хук для получения общих переводов
export const useTranslations = () => {
  const t = useI18n()
  return t
}

// Хук для получения переводов конкретной области
export const useScopedTranslations = (scope: string) => {
  const t = useScopedI18n(scope)
  return t
}

// Хуки для конкретных областей
export const useAuthTranslations = () => useScopedTranslations('auth')
export const useNavigationTranslations = () => useScopedTranslations('navigation')
export const useDashboardTranslations = () => useScopedTranslations('dashboard')
export const usePropertiesTranslations = () => useScopedTranslations('properties')
export const useClientsTranslations = () => useScopedTranslations('clients')
export const useContractsTranslations = () => useScopedTranslations('contracts')
export const useBookingsTranslations = () => useScopedTranslations('bookings')
export const usePaymentsTranslations = () => useScopedTranslations('payments')
export const useDealsTranslations = () => useScopedTranslations('deals')
export const useScoringTranslations = () => useScopedTranslations('scoring')
export const useMultilistingTranslations = () => useScopedTranslations('multilisting')
export const useSettingsTranslations = () => useScopedTranslations('settings')
export const useNotificationsTranslations = () => useScopedTranslations('notifications')
export const useErrorsTranslations = () => useScopedTranslations('errors')
export const useValidationTranslations = () => useScopedTranslations('validation')
export const useCommonTranslations = () => useScopedTranslations('common') 