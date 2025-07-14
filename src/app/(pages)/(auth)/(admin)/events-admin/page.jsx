'use client'
import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'

import { useAuthAdmin } from '@/app/hooks/authadmin'
import AdminLayout from '@/app/components/Layout/AdminLayout'
import { useBook } from '@/app/hooks/book'
import { MoonLoader } from 'react-spinners'
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';



function Events() {


  const router = useRouter()

  const { admin } = useAuthAdmin({
    middleware: 'auth-admin',
    redirectIfAuthenticated: '/dashboard-admin',
  })

  const { event } = useBook({
    church_id: admin?.church_id,
  })

  const [events, setEvents] = useState([])

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  useEffect(() => {
    if (!event) return

    const convertedEvents = event.map((item, index) => {
      const start = moment(`${item.date} ${item.time_slot}`, 'YYYY-MM-DD HH:mm:ss').toISOString()
      const end = moment(start).add(1, 'hour').toISOString()

      return {
        id: index,
        title: `${capitalize(item?.event_name)}`,
        start,
        end,
      }
    })

    setEvents(convertedEvents)
  }, [event])

    const handleSetDateEvent = () => {
        router.push('/set-event-date')
    }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MoonLoader />
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Events</h1>
        <div className='mb-3'>
          <Button onClick={handleSetDateEvent} icon="pi pi-calendar" label="Set Date Event" />
        </div>
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth',
          }}
          allDaySlot={false}
          slotMinTime="07:00:00"
          slotMaxTime="19:00:00"
          events={events}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
            hour12: true,
          }}
          height="auto"
        />
      </div>
    </AdminLayout>
  )
}

export default Events
