/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['localhost', 'vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '**.reg.ru',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Настройки для продакшена
  output: 'standalone',
  generateEtags: false,
  poweredByHeader: false,
  // Оптимизация для VPS деплоя
  distDir: '.next',
  cleanDistDir: true,
}

module.exports = nextConfig