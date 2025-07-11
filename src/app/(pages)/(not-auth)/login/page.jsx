'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Assets
import Bird from "../../../../assets/bird.png"

// Components
import InputWithLogo from '@/app/components/InputWithLogo'
import { MoonLoader } from 'react-spinners'

// Icons
import { FaAt } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";

// React Hook Form
import { useForm } from 'react-hook-form'

// Hooks
import { useAuth } from '@/app/hooks/auth'
import { useSearchParams } from 'next/navigation'
import Swal from 'sweetalert2'

export default function Login() {

  const [errors, setErrors] = useState("")
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified') 

  useEffect(() => {

    if(verified === "success"){
      Swal.fire({
        title: "Successfully",
        text: "Verfication Successfully",
        icon: "success"
      })
    }

  }, [verified])


  const { register, handleSubmit, watch, formState: { errors: error } } = useForm();
  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: '/dashboard'
  })

  const loginSubmit = (data) =>{
    login({
      username: data.username,
      password: data.password,
      setErrors,
      setStatus,
      setLoading
    })
  }


  return (
    <div className='bg-[#FFE4A2] flex justify-center items-center px-2 py-10 '>
      <div className='border-2 border-black w-full rounded-lg flex flex-col justify-center items-center bg-white gap-5 py-5 md:w-[30rem] md:gap-7  '>
        <Image src={Bird} alt='bird' width={200} />

        <div className='text-center'>
          <h1 className='joan-regular font-extrabold'>PARISHIONER LOGIN</h1>
          <h1 className='joan-regular font-bold text-[0.7rem] '>Welcome</h1>
          <h1 className='joan-regular opacity-50 text-[0.7rem] '>Please sign in to your account</h1>
        </div>

       
        <form onSubmit={handleSubmit(loginSubmit)}>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col'>
              <InputWithLogo 
                logo={<FaAt className='text-2xl text-black/50' />}
                placeholder={"Username"}
                type="text"
                register={register('username', {
                  required: "Username is required"
                })}
                />
                {error.username && <span className='text-[0.7rem] text-red-800'>{error.username.message}</span>}
            </div>
            <div className='flex flex-col'>
              <InputWithLogo 
                logo={<MdOutlinePassword className='text-2xl text-black/50' />}
                placeholder={"Password"}
                type="password"
                register={register('password', {
                  required: "Password is required"
                })}
                />
                {error.password && <span className='text-[0.7rem] text-red-800'>{error.password.message}</span>}
                {errors && <span className='text-[0.7rem] text-red-800'>{errors}</span>}
            </div>
            <div className='flex flex-col'>

              {loading ? (
                <>
                  <h1 className='bg-[#FFE4A2] py-2 font-semibold border-2 border-black/50 rounded-lg cursor-pointer hover:bg-yellow-200 hover:border-black/60 w-full flex justify-center items-center'><MoonLoader size={25} /></h1>
                </>
              ) : (
                <>
                  <button type='submit' className='bg-[#FFE4A2] py-2 font-semibold border-2 border-black/50 rounded-lg cursor-pointer hover:bg-yellow-200 hover:border-black/60'>Sign In</button>
                </>
              )}
              
              <div className='flex justify-between w-full'>
                <Link href="/register" className='text-right text-[0.7rem] text-blue-950 hover:underline'>Don't have an Account?</Link>
                <Link href="/forgot-password" className='text-right text-[0.7rem] text-blue-950 hover:underline'>Forgot your password?</Link>
              </div>
            </div>
          
          
          </div>
        </form>
        



      </div>
    </div>
  )
}


