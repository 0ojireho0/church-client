import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Assets
import Bird from "../../../../assets/bird.png"

export default function Register() {
  return (
    <>
    <div className='bg-[#FFE4A2] flex justify-center items-center px-2 py-10 '>
      <div className='border-2 border-black w-full rounded-lg bg-white gap-5 flex flex-col py-5 md:w-[30rem] md:gap-7  '>
        <div className='flex justify-center items-center'>
            <Image src={Bird} alt='bird' width={200} />
        </div>

        <h1 className='text-center joan-regular font-extrabold'>PARISHIONER REGISTER</h1>

        <div className='grid grid-cols-1 justify-center items-center px-10 gap-5 md:grid-cols-2 '>
            <input 
                type="text" 
                placeholder='Fullname' 
                className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none' 
            />
            <input 
                type="text" 
                placeholder='Username' 
                className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none' 
            />
            <input 
                type="email" 
                placeholder='Email' 
                className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none' 
            />
            <input 
                type="text" 
                placeholder='Contact #' 
                className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none' 
            />
            <input 
                type="password" 
                placeholder='Password' 
                className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none' 
            />
            <input 
                type="password" 
                placeholder='Confirm Password' 
                className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none' 
            />
        </div>

        <div className='flex flex-col justify-center items-center px-10'>
            <button type='submit' className='bg-[#FFE4A2] py-2 font-semibold border-2 border-black/50 rounded-lg cursor-pointer hover:bg-yellow-200 hover:border-black/60 w-full'>Sign In</button>
            <Link href="/login" className='text-right text-[0.7rem] text-blue-950 w-full hover:underline'>Already have an account?</Link>
        </div>
   
     
        

       
  
        



      </div>
    </div>
    </>
  )
}

