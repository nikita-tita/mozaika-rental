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
        ],
      },
    ]
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
  
  // Экспериментальные функции
  experimental: {
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
  },
}

module.exports = nextConfig