'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { useAuth } from '@/app/hooks/auth'

export default function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const { resetPassword } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    // try {
    //   const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password`, {
    //     email,
    //     token,
    //     password,
    //     password_confirmation: confirmPassword,
    //   })
    //   setMessage(res.data.message || 'Password reset successful.')
    // } catch (err) {
    //   setError(err.response?.data?.message || 'Something went wrong.')
    // } finally {
    //   setLoading(false)
    // }

    resetPassword({
        email,
        token,
        password,
        password_confirmation: confirmPassword,
        setErrors: setError,
        setStatus: setMessage,
        setLoading
    })
    
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 px-4">
      <div className=" w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>

        {message && <div className="mb-4 text-green-600">{message}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="email" value={email} />

          <div>
            <label className="block mb-1 text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
