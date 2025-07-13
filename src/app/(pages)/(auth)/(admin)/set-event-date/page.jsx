'use client'
import AdminLayout from '@/app/components/Layout/AdminLayout'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { DateRangePicker, Tooltip, Whisper } from 'rsuite'
import { MoonLoader } from 'react-spinners'
import Link from 'next/link'
import { useAuthAdmin } from '@/app/hooks/authadmin'
import 'rsuite/DateRangePicker/styles/index.css'

import dayjs from 'dayjs'

function SetEventDate() {
  const [loading, setLoading] = useState(false)
  const [bookedDates, setBookedDates] = useState({})

  const { admin, selectEvent, findEventAdded } = useAuthAdmin({
    middleware: 'auth-admin',
    redirectIfAuthenticated: '/dashboard-admin',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm()

  useEffect(() => {
    // console.log(admin)
    const fetchEvents = async () => {
    
      if (admin) {
        const response = await findEventAdded({ admin })
        if (response?.data) {
          const mapped = {}
          response.data.forEach(item => {
            mapped[item.date] = item.event_name ?? 'Unavailable'
          })
          setBookedDates(mapped)
        }else{
            return(
                <>
                <div className='flex justify-center items-center '>
                    <MoonLoader size={30} />
                </div>
                </>
            )
        }
      }
    }

    fetchEvents()
  }, [admin, findEventAdded])


  const disableDates = (date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD')
    const today = dayjs().startOf('day')
    return dayjs(date).isBefore(today) || bookedDates[dateStr]
  }

  const handleSubmitEventDate = (data) => {
    const [startDate, endDate] = data.event_date_range
    const fullDates = []

    const current = new Date(startDate)

    while (current <= endDate) {
      const date = new Date(current)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      fullDates.push(`${year}-${month}-${day}`)
      current.setDate(current.getDate() + 1)
    }

    setLoading(true)
    selectEvent({
      fulldates: fullDates,
      event_name: data?.name_of_event,
      church_id: admin?.church_id,
      setLoading,
      reset
    })
  }
  

  return (
    <AdminLayout>
      <h1 className="josefin-sans font-bold text-center">Set Event Date</h1>
      <form onSubmit={handleSubmit(handleSubmitEventDate)}>
        {/* Name of Event */}
        <div className="flex justify-center items-center gap-5 my-5">
          <label htmlFor="name_event" className="whitespace-nowrap">
            Name of Event:
          </label>
          <div>
            <input
              type="text"
              id="name_event"
              className="border-2 p-2 rounded-lg"
              {...register('name_of_event', {
                required: 'Name of event is required',
              })}
            />
            {errors?.name_of_event && (
              <p className="text-red-700 text-sm josefin-regular mt-1">
                {errors.name_of_event.message}
              </p>
            )}
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="flex justify-center items-center gap-5 my-5">
          <label htmlFor="event_date_range" className="whitespace-nowrap">
            Select Range of Events:
          </label>
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-wd">
            <Controller
              control={control}
              name="event_date_range"
              rules={{ required: 'Date range is required' }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <div>
                  <DateRangePicker
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value || null}
                    format="MMMM dd, yyyy"
                    placeholder="Select date range"
                    placement="bottomStart"
                    size="lg"
                    showOneCalendar
                    shouldDisableDate={disableDates}
                  />
                  {error && (
                    <p className="text-red-700 text-sm josefin-regular mt-1">
                      {error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center items-center py-2">
          {loading ? (
            <div className="flex items-center gap-10">
              <Link
                href={`/dashboard-admin`}
                className="bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700"
              >
                Back
              </Link>
              <div className="bg-blue-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-blue-700">
                <MoonLoader size={20} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-10">
              <Link
                href={`/dashboard-admin`}
                className="bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700"
              >
                Back
              </Link>
              <button
                type="submit"
                className="bg-blue-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </form>
    </AdminLayout>
  )
}

export default SetEventDate
