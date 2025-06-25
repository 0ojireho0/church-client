'use client'
import React, { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { MoonLoader } from 'react-spinners'


import { useAuthAdmin } from '@/app/hooks/authadmin'

export default function AdminEditProfile() {

    const [loading, setLoading] = useState(false)
    
    const {admin, editProfileAdmin} = useAuthAdmin({
        middleware: "auth-admin",
        redirectIfAuthenticated: "/dashboard-admin"
    })
  


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (admin) {
      reset({
        fullname: admin.fullname || '',
        email: admin.email || '',
        username: admin.username,
        password: '',
      })
    }
  }, [admin, reset])

  const onSubmit = (data) => {
    // Handle API update here
    // console.log('Submitted:', data)


    setLoading(true)
    editProfileAdmin({
        email: data.email,
        fullname: data.fullname,
        password: data.password,
        username: data.username,
        id: admin.id,
        setLoading,
        reset
    })
    
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fullname</label>
          <input
            type="text"
            {...register('fullname', { required: 'Name is required' })}
            className="w-full border rounded-lg p-2"
          />
          {errors.fullname && (
            <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            {...register('username', { required: 'Username is required' })}
            className="w-full border rounded-lg p-2"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full border rounded-lg p-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>


        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            {...register('password')}
            placeholder="Leave blank to keep current password"
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
            {loading ? (
                <>
                <div className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700'>
                    <MoonLoader size={20} color='white' />
                </div>
                </>
            ) : (
                <>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                    Save Changes
                </button>
                </>
            )}
        </div>
      </form>
    </div>
  )
}
