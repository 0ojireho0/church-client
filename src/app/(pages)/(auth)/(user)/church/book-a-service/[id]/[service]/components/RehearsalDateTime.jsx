import React, {useEffect, useState} from 'react'

import { FaX } from 'react-icons/fa6'
import CustomDateTimePicker from '@/app/components/CustomDateTimePicker'
import dayjs from 'dayjs'


function RehearsalDateTime({
        setShowRehearsalModal,
        rehearsalSelectedDate,
        setRehearsalSelectedDate,
        rehearsalSelectedTime,
        setRehearsalSelectedTime,
        setRehearsalFullyBooked,
        church_id
    }) {


    const [showBookError, setShowBookError] = useState(false)


    const handleSubmitRehearsalBook = () => {

        if(!rehearsalSelectedDate || !rehearsalSelectedTime ){
            setShowBookError(true)
            return
        }
        setShowBookError(false)
        setShowRehearsalModal(false)
        // console.log(dayjs(rehearsalSelectedDate).format('MMMM DD, YYYY'))
        // console.log(rehearsalSelectedTime)
    }



  return (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-center px-2 md:px-14 lg:px-28 overflow-auto '>
      <div className='bg-white w-full px-4 py-2 rounded-lg'>
        <div className='flex justify-end'>
            <FaX className='text-xl cursor-pointer ' onClick={() => setShowRehearsalModal(false)} />
        </div>
        <div className='text-center'>
            <h1 className='josefin-regular font-bold text-xl'>Rehearsal Date & Time</h1>
        </div>
        <div className='mt-5 flex justify-center items-center'>
            <CustomDateTimePicker 
              selectedDate={rehearsalSelectedDate} 
              setSelectedDate={setRehearsalSelectedDate} 
              selectedTime={rehearsalSelectedTime} 
              setSelectedTime={setRehearsalSelectedTime} 
              setFullyBooked={setRehearsalFullyBooked}
              church_id={church_id}
              />
        </div>
        <div className='flex flex-col justify-center items-center mt-5'>
            {showBookError && <h1 className='text-red-600 mb-3'>Select Booking Date</h1>}
            <button className='bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg' onClick={() => handleSubmitRehearsalBook()}>Book</button>
        </div>
      </div>    
    </div>
  )
}

export default RehearsalDateTime
