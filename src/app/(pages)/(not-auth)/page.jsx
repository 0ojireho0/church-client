import React from 'react'
import Image from 'next/image'

import Bird from "../../../assets/bird.png"

export default function Home() {
  return (
    <>
    <div className='bg-[#FFE4A2] p-2 md:py-10 md:px-14 lg:px-28 '>
      <div className='flex justify-center items-center flex-col gap-10'>
        <Image src={Bird} alt='bird' width={250} />
        <p className='joan-regular text-justify md:text-xl'>ChurchConnect was developed with a vision to simplify and unify the operations of 20 churches across Manila. We recognized the growing need for a centralized system that could help streamline daily transactions, improve coordination, and enhance transparency within and between church communities.</p>

        <div className='flex justify-center items-center flex-col gap-2'>
          <h1 className='font-bold joan-regular text-lg md:text-2xl'>ABOUT US</h1>
          <p className='joan-regular md:text-xl'>ChurchConnect serves as an all-in-one digital platform designed to support the mission and ministry of each church while promoting efficiency, accountability, and collaboration. This system was built not just to keep up with modern times, but to empower church leaders and staff with the right tools to serve their communities better — all in one place, all in real time.</p>
        </div>

      </div>
      

    </div>
    </>
  )
}


