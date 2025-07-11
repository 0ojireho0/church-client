'use client'

import AdminLayout from '@/app/components/Layout/AdminLayout'
import { useAuth } from '@/app/hooks/auth'
import { useState } from 'react'

const VerifyEmail = () => {


    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null)


    const { logout, resendEmailVerification } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    



    return (
        <>
        <AdminLayout>
                <div className="mb-4 text-sm text-gray-600">
                    Thanks for signing up! Before getting started, could you verify
                    your email address by clicking on the link we just
                    emailed to you? If you didn't receive the email, we will gladly
                    send you another.
                </div>

                {status === 'custom-verification-link-sent' && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        A new verification link has been sent to the email address
                        you provided during registration.
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <button 
                        className='inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 cursor-pointer'
                        onClick={() => resendEmailVerification({ setStatus })}
                        >
                        Resend Verification Email
                    </button>

                    <button
                        type="button"
                        className="underline text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                        onClick={() => logout({setLoading})}>
                        Logout
                    </button>
                </div>


        </AdminLayout>


        </>
    )
}

export default VerifyEmail