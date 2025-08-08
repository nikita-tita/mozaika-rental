/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем ESLint и TypeScript проверки для деплоя
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Настройка для статической генерации
  output: 'export',
  trailingSlash: true,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
  // Статическая генерация
  distDir: 'out',
  
  // Экспериментальные функции
  experimental: {
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
  },
  
  // Оптимизация изображений
  images: {
    domains: ['localhost', 'vercel.app', 'netlify.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '**.netlify.app',
      },
    ],
  },
  
  // Конфигурация CORS и безопасности
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig