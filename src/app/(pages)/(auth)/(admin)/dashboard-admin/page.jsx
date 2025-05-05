'use client'
import React from 'react'

import { useAuthAdmin } from '@/app/hooks/authadmin'

export default function AdminDashboard() {


  const {admin} = useAuthAdmin({
    middleware: "auth-admin",
    redirectIfAuthenticated: "/dashboard-admin"
  })


  return (
    <div>
      This is admin dashboard
    </div>
  )
}

