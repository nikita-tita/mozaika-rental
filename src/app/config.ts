export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export const runtime = 'nodejs'

// Добавляем временную метку для принудительного обновления
export const FORCE_REFRESH_KEY = process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString()

// Конфигурация для отключения кэширования
export const CACHE_CONTROL_HEADERS = {
  'Cache-Control': 'no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
}