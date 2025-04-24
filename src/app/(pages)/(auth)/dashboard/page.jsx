'use client'
import React from 'react'

import { useAuth } from '@/app/hooks/auth'



export default function Dashboard() {

  const { user } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: '/dashboard'
  })

  return (
    <div>
      This is dashboard
    </div>
  )
}


