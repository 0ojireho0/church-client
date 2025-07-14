'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Assets
import Bird from "../../../../assets/bird.png"
import { MoonLoader } from 'react-spinners'

// React Hook Form
import { useForm, Controller } from 'react-hook-form';

// Hooks
import { useAuth } from '@/app/hooks/auth'
import Cleave from 'cleave.js/react'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'


export default function Register() {
    
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const [cleaveKey, setCleaveKey] = useState(0)
    const [showPrivacy, setShowPrivacy] = useState(true)
    const [agreed, setAgreed] = useState(false)


    useEffect(() => {
        // Show the privacy agreement on first mount
        setShowPrivacy(true)
    }, [])
    
    const { register:registers, reset, formState: {errors: error}, handleSubmit, control } = useForm({
        defaultValues: {
            contact: ''
        }
    })

    const { register } = useAuth({
        middleware: "guest",
        redirectIfAuthenticated: "/dashboard",
        
    })



    const registerSubmit = (data) => {

    
        const clearAll = data.contact.replace(/[()\-\s]/g, '');
        // console.log(data)

        register({
            name: data.fullname,
            email: data.email,
            contact: clearAll,
            username: data.username,
            password: data.password,
            password_confirmation: data.confirm_password,
            address: data.address,
            setErrors,
            setLoading,
            reset,
            setCleaveKey
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
                        type="address" 
                        placeholder='Address' 
                        className='border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none' 
                        {...registers('address', {
                            required: "Address is required"
                        })}
                    />
                    {error.address && <span className='text-[0.7rem] text-red-800 '>{error.address.message}</span>}
                </div>
                <div className='flex flex-col'>
                    <Controller
                    name="contact"
                    control={control}
                    rules={{
                        required: "Contact # is required",
                        validate: value => {
                        const digits = value.replace(/\D/g, '');
                        if (!/^639\d{9}$/.test(digits)) {
                            return "Mobile number must start with +63 and have 10 digits";
                        }
                        return true;
                        }
                    }}
                    render={({ field, fieldState }) => (
                        <Cleave
                        key={cleaveKey}
                        {...field}
                        htmlRef={field.ref}
                        options={{
                            prefix: '+63',
                            delimiters: [' (', ')-', '-', ''],
                            blocks: [3, 3, 3, 4],
                            numericOnly: true
                        }}
                        value={field.value || ''}
                        className="border-2 border-black/50 py-2 px-4 rounded-lg joan-regular outline-none w-full"
                        placeholder="Contact # (+63)"
                        />
                    )}
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


    <Dialog
    header="Privacy Agreement"
    visible={showPrivacy}
    modal
    closable={false}
    style={{ width: '90vw', maxWidth: '800px' }}
    footer={
        <div className="flex justify-end gap-2">
        <Button
            label="I Agree and Consent"
            icon="pi pi-check"
            onClick={() => {
            setAgreed(true)
            setShowPrivacy(false)
            }}
            className="p-button-success"
        />
        </div>
    }
    >
    <div className="text-sm text-gray-800 overflow-y-auto max-h-[60vh] josefin-regular space-y-3 px-1">
        <p>
        In compliance with the Data Privacy Act of 2012 (Republic Act No. 10173), the Church Connect System values your right to privacy. We are committed to safeguarding your personal data and ensuring that your information is processed in accordance with the law.
        </p>

        <p><strong>1. Collection of Personal Information</strong></p>
        <ul className="list-disc ml-5">
        <li>Full Name</li>
        <li>Email Address</li>
        <li>Contact Number</li>
        <li>Address</li>
        <li>Religious information (e.g., sacraments received, service participation)</li>
        </ul>

        <p><strong>2. Purpose of Data Collection</strong></p>
        <ul className="list-disc ml-5">
        <li>Registration and identity verification</li>
        <li>Access to parish services and events</li>
        <li>Document request processing</li>
        <li>Notifications and updates</li>
        <li>Service analytics</li>
        </ul>

        <p><strong>3. Data Sharing and Storage</strong></p>
        <p>Your data will only be accessed by authorized Church personnel. It will not be shared without your consent unless required by law.</p>

        <p><strong>4. Retention and Disposal</strong></p>
        <p>We will store your data only as long as needed, and dispose of it securely after.</p>

        <p><strong>5. Your Rights Under the Law</strong></p>
        <ul className="list-disc ml-5">
        <li>Be informed about data usage</li>
        <li>Access your data</li>
        <li>Correct or update data</li>
        <li>Withdraw consent</li>
        <li>File a complaint</li>
        </ul>

        <p><strong>Consent Declaration</strong></p>
        <p>By registering, you consent to our use of your data as outlined above under Republic Act No. 10173.</p>
    </div>
    </Dialog>



    </>
  )
}

