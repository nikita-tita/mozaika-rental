/** @type {import('next').NextConfig} */
const nextConfig = {
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