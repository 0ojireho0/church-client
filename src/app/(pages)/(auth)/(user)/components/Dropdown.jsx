'use client'
import React, { useState } from 'react'
import Link from 'next/link'

// Hooks
import { useAuth } from '@/app/hooks/auth'

// Loader
import { MoonLoader } from 'react-spinners'


export default function Dropdown({showProfile, setShowProfile}) {

    const { user, logout } = useAuth({
        middleware: "auth",
    })

    const [loading, setLoading] = useState(false)

    const handleLogout = () => {
        setLoading(true)
        logout({
            setLoading
        })
    }

  return (
    <>
    <div className='inset-0 top-0 bottom-0 w-full fixed z-[9999]' onClick={() => setShowProfile(!showProfile)}></div>
    <div className='p-2 md:px-14 lg:px-28 fixed flex justify-end w-full top-[2.8rem] md:top-[4.4rem] z-[9999] '>
        <div className='bg-white w-full md:w-[15rem] border-2 rounded-lg p-2 text-center flex flex-col gap-2'>
        <h1 className='josefin-regular font-bold cursor-pointer'>{user?.name}</h1>
        <Link href={"/edit-profile"} onClick={() => setShowProfile(!showProfile)} className='josefin-regular cursor-pointer hover:bg-black/60 hover:text-white hover:rounded-lg'>Edit Profile</Link>
        <Link href={"/my-booking"} className='josefin-regular cursor-pointer hover:bg-black/60 hover:text-white hover:rounded-lg'>My Bookings</Link>
        {loading ? (
            <>
            <h1 className='flex justify-center items-center'><MoonLoader size={30} /></h1>
            </>
        ) : (
            <>
            <h1 className='josefin-regular cursor-pointer hover:bg-black/60 hover:text-white hover:rounded-lg' onClick={() => handleLogout()}>Logout</h1>
            </>
        )}
        </div>
    </div>
    
    
    
    </>
  )
}


