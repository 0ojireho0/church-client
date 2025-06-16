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
    <div className='p-2 md:px-14 lg:px-28 flex flex-col justify-center items-center gap-5'>
        <div className='bg-white rounded-lg border border-black/50 drop-shadow-lg p-5'>
            <h1 className='text-center font-bold josefin-regular lg:text-2xl'>My Bookings</h1>

            <div>
                <MyBookingsTable user_id={user?.id} />
            </div>
        </div>
    </div>
    
    
    
    </>
  )
}

export default MyBooking
