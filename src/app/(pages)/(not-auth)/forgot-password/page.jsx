'use client'
import React, { useState } from 'react'

import { useAuth } from '@/app/hooks/auth'
import InputError from '@/app/components/InputError'

import AdminLayout from '@/app/components/Layout/AdminLayout'
import { MoonLoader } from 'react-spinners'

function ForgotPassword() {

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)

    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard'
    })

    const submitForm = event => {
        event.preventDefault()
        setLoading(true)
        forgotPassword({ email, setErrors, setStatus, setLoading })
    }



  return (
    <>

    <AdminLayout>

    <div className="mb-4 text-sm text-gray-600 text-center mt-5">
        <h1>Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.</h1>
    </div>

    {status && (
        <div className='font-medium text-sm text-green-600 mb-4'>
            {status}
        </div>
    )}

    <form onSubmit={submitForm}>
        <div className='w-full flex justify-center items-center flex-col'>
            <div className='w-full md:w-[30rem] '>
                <label htmlFor="email" className='block font-medium text-sm text-gray-700'>Email</label>
                <input 
                    type="email" 
                    id='email' 
                    name='email' 
                    value={email} 
                    className='block mt-1 w-full rounded-md shadow-sm border-gray-700 py-1 px-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' 
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                    />
                <InputError messages={errors.email} className="mt-2" />
            </div>
        </div>

        <div className="flex items-center justify-end mt-4">
            {loading ? (
                <>
                <h1 className='inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150'><MoonLoader size={25} color='white' /></h1>
                </>
            ) : (
                <>
                <button 
                    type='submit' 
                    className='inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150'
                    
                    >
                    Email Password Reset Link
                </button>
                </>
            )}
        </div>


    </form>

    </AdminLayout>
    
    
    </>
  )
}

export default ForgotPassword
