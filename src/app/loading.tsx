'use client'

import { TeamsLoadingOverlay } from '@/components/ui/teams'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <TeamsLoadingOverlay isLoading={true} />
    </div>
  )
} 