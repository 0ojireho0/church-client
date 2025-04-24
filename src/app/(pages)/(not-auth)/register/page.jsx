'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Assets
import Bird from "../../../../assets/bird.png"
import { MoonLoader } from 'react-spinners'

// React Hook Form
import { useForm } from 'react-hook-form'

// Hooks
import { useAuth } from '@/app/hooks/auth'

export default function Register() {
    
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    
    const { register:registers, reset, formState: {errors: error}, handleSubmit } = useForm()

    const { register } = useAuth({
        middleware: "guest",
        redirectIfAuthenticated: "/dashboard",
        
    })



    const registerSubmit = (data) => {
        register({
            name: data.fullname,
            email: data.email,
            contact: data.contact,
            username: data.username,
            password: data.password,
            password_confirmation: data.confirm_password,
            setErrors,
            setLoading,
            reset
        })
    }



  return (
    <>
    <div className='bg-[#FFE4A2] flex justify-center items-center px-2 py-10 '>
      <div className='border-2 border-black w-full rounded-lg bg-white gap-5 flex flex-col py-5 md:w-[30rem] md:gap-7  '>
        <div className='flex justify-center items-center'>
            <Image src={Bird} alt='bird' width={200} />
        </div>

        <h1 className='text-center joan-regular font-extrabold'>PARISHIONER REGISTER</h1>

        <form onSubmit={handleSubmit(registerSubmit)}>
            <div className='grid grid-cols-1 justify-center items-center px-10 gap-5 md:grid-cols-2 mb-5'>
                <div className='flex flex-col'>
                    <input 
                        type="text" 
                        placeholder='Fullname' 
                        className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none'
                        {...registers('fullname', {
                            required: "Full name is required"
                        })} 
                    />
                    {error.fullname && <span className='text-[0.7rem] text-red-800 '>{error.fullname.message}</span>}
                </div>
                <div className='flex flex-col'>
                    <input 
                        type="text" 
                        placeholder='Username' 
                        className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none'
                        {...registers('username', {
                            required: "Username is required"
                        })}
                    />
                    {error.username && <span className='text-[0.7rem] text-red-800 '>{error.username.message}</span>}
                </div>
                <div className='flex flex-col'>
                    <input 
                        type="email" 
                        placeholder='Email' 
                        className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none' 
                        {...registers('email', {
                            required: "Email is required"
                        })}
                    />
                    {error.email && <span className='text-[0.7rem] text-red-800 '>{error.email.message}</span>}
                </div>
                <div className='flex flex-col'>
                    <input 
                        type="text" 
                        placeholder='Contact # (+63)' 
                        className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none'
                        {...registers('contact', {
                            required: "Contact # is required",
                            pattern: {
                                value: /^\+63\d{10}$/, // Must start with +63 and have exactly 10 digits after
                                message: "Mobile number must start with +63"
                              },
                        })} 
                    />
                    {error.contact && <span className='text-[0.7rem] text-red-800 '>{error.contact.message}</span>}
                </div>
                <div className='flex flex-col'>
                    <input 
                        type="password" 
                        placeholder='Password' 
                        className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none' 
                        {...registers('password', {
                            required: "Password is required",
                        })} 
                    />
                    {error.password && <span className='text-[0.7rem] text-red-800 '>{error.password.message}</span>}
                </div>
                <div className='flex flex-col'>
                    <input 
                        type="password" 
                        placeholder='Confirm Password' 
                        className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none'
                        {...registers('confirm_password', {
                            required: "Confirm Password is required"
                        })}  
                    />
                    {error.confirm_password && <span className='text-[0.7rem] text-red-800 '>{error.confirm_password.message}</span>}
                </div>
            </div>

            <div className='flex flex-col justify-center items-center px-10'>
                {loading ? (
                    <>
                    <h1 className='bg-[#FFE4A2] py-2 font-semibold border-2 border-black/50 rounded-lg cursor-pointer hover:bg-yellow-200 hover:border-black/60 w-full flex justify-center items-center'><MoonLoader size={25} /></h1>
                    </>
                ) : (
                    <>
                    <button type='submit' className='bg-[#FFE4A2] py-2 font-semibold border-2 border-black/50 rounded-lg cursor-pointer hover:bg-yellow-200 hover:border-black/60 w-full'>Sign In</button>
                    </>
                )}
                <div className='flex justify-end w-full'>
                    <Link href="/login" className='text-right text-[0.7rem] text-blue-950 hover:underline'>Already have an account?</Link>
                </div>
            </div>
        </form>
   
     
        

       
  
        



      </div>
    </div>
    </>
  )
}

