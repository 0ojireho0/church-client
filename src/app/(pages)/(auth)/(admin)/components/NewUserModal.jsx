'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuthAdmin } from '@/app/hooks/authadmin'
import { MoonLoader } from 'react-spinners';

export function NewUserModal({ churches, setShowNewUserModal }) {


  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors: error }, reset } = useForm();

  const { registerAdmin } = useAuthAdmin({})


  const handleFormSubmit = (data) => {
        registerAdmin({
            name: data.fullname,
            email: data.email,
            username: data.username,
            password: data.password,
            password_confirmation: data.confirm_password,
            admin_type: "Admin",
            church_id: data.church_id,
            setErrors,
            setLoading,
            reset, 
        }).finally(() => {
            setShowNewUserModal(false)
        })
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex justify-center items-center px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4 text-center">Add New User</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          
          <div>
            <label className="block mb-1 font-medium">Church</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register("church_id", { required: "Church is required" })}
            >
              <option value="">-- Select Church --</option>
              {churches?.map(church => (
                <option key={church.id} value={church.id}>{church.church_name}</option>
              ))}
            </select>
            {error.church_id && <p className="text-sm text-red-500">{error.church_id.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Fullname</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register("fullname", { required: "Fullname is required" })}
            />
            {error.fullname && <p className="text-sm text-red-500">{error.fullname.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register("username", { required: "Username is required" })}
            />
            {error.username && <p className="text-sm text-red-500">{error.username.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register("email", { required: "Email is required" })}
            />
            {error.email && <p className="text-sm text-red-500">{error.email.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register("password", { required: "Password is required" })}
            />
            {error.password && <p className="text-sm text-red-500">{error.password.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register("confirm_password", { required: "Confirm Password is required" })}
            />
            {error.confirm_password && <p className="text-sm text-red-500">{error.confirm_password.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer" onClick={() => setShowNewUserModal(false)}>
              Cancel
            </button>
            {loading ? (
                <>
                <h1 className='px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white'><MoonLoader color='white' size={25} /></h1>
                </>
            ) : (
                <>
                <button type="submit" className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white">
                Submit
                </button>
                </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
