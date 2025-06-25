'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/hooks/auth'
import { useForm, Controller } from 'react-hook-form'
import Cleave from 'cleave.js/react'
import { MoonLoader } from 'react-spinners'
import Swal from 'sweetalert2'

export default function EditProfile() {

    const [cleaveKey, setCleaveKey] = useState(0)
    const [loading, setLoading] = useState(false)
    


  const { user, editProfile } = useAuth({
    middleware: 'auth',
    redirectIfAuthenticated: '/dashboard',
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch
  } = useForm({
        defaultValues: {
            contact: ''
        }
    })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        username: user.username,
        contact: user.contact,
        password: '',
      })
    }
  }, [user, reset])

  const onSubmit = (data) => {
    // Handle API update here
    // console.log('Submitted:', data)


    setLoading(true)
    editProfile({
        name: data.name,
        username: data.username,
        email: data.email,
        contact: data.contact,
        password: data.password,
        id: user.id,
        setCleaveKey,
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full border rounded-lg p-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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

        <div className='flex flex-col'>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact #</label>
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
            {errors.contact && <span className='text-[0.7rem] text-red-800 '>{errors.contact.message}</span>}
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
