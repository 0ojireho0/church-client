'use client'
import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { useAuthAdmin } from '@/app/hooks/authadmin'
import AdminLayout from '@/app/components/Layout/AdminLayout'

import { useBook } from '@/app/hooks/book'
import { MoonLoader } from 'react-spinners'

const localizer = momentLocalizer(moment)

function CalendarPage() {


  const { admin } = useAuthAdmin({
    middleware: 'auth-admin',
    redirectIfAuthenticated: '/dashboard-admin',
  })

  const { calendar } = useBook({
    church_id: admin?.church_id
  })



  const [events, setEvents] = useState([])

  useEffect(() => {
    // Example data, replace with API call if needed
    const dbData = [
      {
        title: 'Baptism Appointment',
        date: '2025-06-20',
        time_slot: '09:00:00',
      },
      {
        title: 'Wedding Appointment',
        date: '2025-06-20',
        time_slot: '14:30:00',
      },
    ]

    const convertedEvents = calendar?.map((item, index) => {
      const start = moment(
        `${item.date} ${item.time_slot}`,
        'YYYY-MM-DD HH:mm:ss'
      ).toDate()
      const end = moment(start).add(1, 'hour').toDate()
      const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

      return {
        id: index,
        title: `${capitalize(item.service_type)} - ${item.user.name}`,
        start,
        end,
      }
    })

    setEvents(convertedEvents)
  }, [calendar])

  if(!calendar){
      return (
        <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
      )
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Admin Calendar</h1>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          formats={{
            timeGutterFormat: (date, culture, localizer) =>
              localizer.format(date, 'hh:mm A', culture),
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
              `${localizer.format(start, 'hh:mm A', culture)} - ${localizer.format(
                end,
                'hh:mm A',
                culture
              )}`,
          }}
        />
      </div>
    </AdminLayout>
  )
}

export default CalendarPage