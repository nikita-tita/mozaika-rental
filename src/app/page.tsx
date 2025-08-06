export const dynamic = 'force-dynamic'
export const revalidate = 0

console.log('🏠 HomePage: Рендер, isAuthenticated:', false)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1">
        <div className="relative isolate">
          {/* Hero section */}
          <div className="relative isolate -z-10">
            <div className="overflow-hidden">
              <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
                <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                  <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                      Управление недвижимостью
                    </h1>
                    <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                      Профессиональная платформа для риелторов и агентств недвижимости
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}