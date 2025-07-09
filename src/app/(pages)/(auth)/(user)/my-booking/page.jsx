'use client'
import React from 'react'

import { useAuth } from '@/app/hooks/auth'
import MyBookingsTable from '../components/MyBookingsTable'

function MyBooking() {

  const { user } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: '/dashboard'
  })
  

  return (
    <>
      <div className='px-2'>
            <div>
                <MyBookingsTable user_id={user?.id} />
            </div>
      </div>
    
    
    
    </>
  )
}

export default MyBooking
