'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'


// Components
import { MoonLoader } from 'react-spinners'
import RowRadioButtonsGroup from '@/app/components/RowRadioButtonsGroup'
import CustomDateTimePicker from '@/app/components/CustomDateTimePicker'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import CustomDatePicker from '@/app/components/CustomDatePicker'


// Hooks
import { useBook } from '@/app/hooks/book'

function Mass({church, user}) {

  const { register, handleSubmit, reset, formState: {errors: error}, control } = useForm()

  const [selectedPayment, setSelectedPayment] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [fullyBooked, setFullyBooked] = useState(null)
  

  const [loading, setLoading] = useState(false)

    const payment = [
        {
            value: "cash",
            label: "Cash",
          
        },
        {
            value: "online",
            label: "Online Payment",

        },
    ]

  if(!church){
    return(
       <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
    )
  }

  return (
    <div>
      This is mass
    </div>
  )
}

export default Mass
