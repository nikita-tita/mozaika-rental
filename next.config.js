/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем кэширование страниц
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },

  // Настройки для динамических маршрутов
  experimental: {
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
  },

  // Отключаем ESLint и TypeScript проверки для деплоя
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Оптимизация изображений
  images: {
    domains: ['localhost', 'vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },

  // Принудительно отключаем кэширование
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig