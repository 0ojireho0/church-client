'use client'
import React, { useState, useEffect } from 'react'

import { useChurch } from '@/app/hooks/church'
import InputSelect from '../../(admin)/components/InputSelect'
import AdminLayout from '@/app/components/Layout/AdminLayout'
import { useForm } from 'react-hook-form'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'
import { MoonLoader } from 'react-spinners'

function EventParishioner() {


  const [searchStatus, setSearchStatus] = useState(0)
  const [event, setEvent] = useState([])
  const checkRequestStatus = data => {
    setSearchStatus(data?.value)
  }

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm()


    const { church, events: eventChurches } = useChurch({
        searchStatus: searchStatus
    })

    const churchOptions = church?.map(church => ({
        label: church?.church_name.trim(), // remove trailing \n if present
        value: church?.id
    }));

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  useEffect(() => {
    if (!eventChurches) return

    const convertedEvents = eventChurches?.map((item, index) => {
      const start = moment(`${item.date} ${item.time_slot}`, 'YYYY-MM-DD HH:mm:ss').toISOString()
      const end = moment(start).add(1, 'hour').toISOString()

      return {
        id: index,
        title: `${capitalize(item?.event_name)}`,
        start,
        end,
      }
    })

    setEvent(convertedEvents)
  }, [eventChurches])

  if (!eventChurches) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MoonLoader />
      </div>
    )
  }

  return (
    <>
    <AdminLayout>
        <div className='p-4'>
            <h1 className='text-xl font-bold mb-4'>Events</h1>
            <div className='w-full my-3'>
                <h1 className='josefin-reguar font-bold'>Select Service Type</h1>
                <InputSelect
                    id="searchStatus"
                    label="Default = All Service Type"
                    onChange={e => checkRequestStatus(e)}
                    required={false}
                    register={{
                    ...register('searchStatus'),
                    }}
                    errors={errors?.searchStatus}
                    control={control}
                    option={churchOptions}
                />
            </div>
            <div>
                {eventChurches?.length >= 1 ? (
                    <>
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
                    events={event}
                    eventTimeFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        meridiem: 'short',
                        hour12: true,
                    }}
                    height="auto"
                    />
                    </>
                ): (
                    <>
                    <div>
                        No events
                    </div>
                    
                    </>
                )}
            </div>
        </div>


    </AdminLayout>
    
    </>
  )
}

export default EventParishioner
