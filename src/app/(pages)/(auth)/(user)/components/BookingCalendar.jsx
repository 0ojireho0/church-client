'use client'
import React, {useEffect} from 'react'

import { FaX } from 'react-icons/fa6'

function BookingCalendar({showDateModal, setShowDateModal}) {

    useEffect(() => {
        if(showDateModal){
            document.body.style.overflow = 'hidden'
        }else{
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
          }
    },[showDateModal])


  return (
    <div className='fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center px-2 md:px-14 lg:px-28'>
      <div className='bg-white p-2 md:p-4 w-full rounded-lg border-2 border-black/50'>
        <div className='flex justify-end'>
          <FaX className='text-lg cursor-pointer' onClick={() => setShowDateModal(false)} />
        </div>
        <div>
            
        </div>
      </div>
    </div>
  )
}

export default BookingCalendar
