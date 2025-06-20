'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { MoonLoader } from 'react-spinners'

export const EditUserModal = ({ user, onClose, onSave, loading }) => {
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (user) {
      reset({
        fullname: user.fullname,
        email: user.email
      })
    }
  }, [user, reset])

  const onSubmit = (data) => {
    onSave(user.id, data)
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[9999] px-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fullname</label>
            <input
              {...register("fullname", { required: true })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>

            {loading ? (
                <>
                <h1 className='bg-blue-500 text-white px-4 py-2 rounded'>
                    <MoonLoader size={25} />
                </h1>
                </>
            ) : (
                <>
                <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                Save
                </button>
                </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
