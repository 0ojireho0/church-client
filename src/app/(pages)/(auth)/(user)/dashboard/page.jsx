'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { useAuth } from '@/app/hooks/auth'

// Images
import HomeImage from "../../../../../assets/home-image.png"




export default function Dashboard() {

  const { user } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: '/dashboard'
  })

  return (
    <div className='bg-[#FFE4A2] py-3 md:py-5'>
      <div className='px-2 py-5 flex justify-center items-center flex-col gap-4 md:grid md:grid-cols-2 md:items-center md:justify-start xl:gap-2 md:px-14 lg:px-28 md:flex-col-reverse bottom-0'>
        <Image src={HomeImage} className=' w-[40rem] xl:w-[37rem] ' alt='Home' />
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold md:text-5xl josefin-regular text-center'>Welcome to ChurchConnect!</h1>
          <h1 className='joan-regular text-xl text-center'>Bringing the church closer to you, wherever you are,</h1>
          <h1 className='joan-regular text-xl text-center'>Honoring life’s sacred milestones through meaningful church services.</h1>
          <h1 className='joan-regular text-center'>Gathering - Services - Liturgy</h1>
          <div className='flex justify-center'>
            <Link href={"/church"} className='joan-regular bg-white w-40 text-center py-1 px-4 border-2 border-black/50 rounded-xl cursor-pointer '>Select a Church</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


