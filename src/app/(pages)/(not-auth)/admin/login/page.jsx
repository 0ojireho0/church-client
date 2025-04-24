import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Assets
import Bird from "../../../../../assets/bird.png"

// Components
import InputWithLogo from '@/app/components/InputWithLogo'

// Icons
import { FaAt } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";

export default function AdminLogin() {
  return (
    <div className='bg-[#FFE4A2] flex justify-center items-center px-2 py-10 '>
      <div className='border-2 border-black w-full rounded-lg flex flex-col justify-center items-center bg-white gap-5 py-5 md:w-[30rem] md:gap-7  '>
        <Image src={Bird} alt='bird' width={200} />

        <div className='text-center'>
          <h1 className='joan-regular font-extrabold'>ADMIN LOGIN</h1>
          <h1 className='joan-regular font-bold text-[0.7rem] '>Welcome</h1>
          <h1 className='joan-regular opacity-50 text-[0.7rem] '>Please sign in to your account</h1>
        </div>

       
        <form>
          <div className='flex flex-col gap-3'>
            <InputWithLogo 
              logo={<FaAt className='text-2xl text-black/50' />}
              placeholder={"Username"}
              type="text"
              />
            <InputWithLogo 
              logo={<MdOutlinePassword className='text-2xl text-black/50' />}
              placeholder={"Password"}
              type="password"
              />
            <div className='flex flex-col'>
              <button type='submit' className='bg-[#FFE4A2] py-2 font-semibold border-2 border-black/50 rounded-lg cursor-pointer hover:bg-yellow-200 hover:border-black/60'>Sign In</button>
            </div>
          
          
          </div>
        </form>
        



      </div>
    </div>
  )
}


