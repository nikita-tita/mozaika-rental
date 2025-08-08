'use client'

import dynamic from 'next/dynamic'

const RegisterForm = dynamic(() => import('@/components/auth/RegisterForm').then(mod => ({ default: mod.RegisterForm })), {
  ssr: false
})

export default function RegisterPage() {
  return <RegisterForm />
}