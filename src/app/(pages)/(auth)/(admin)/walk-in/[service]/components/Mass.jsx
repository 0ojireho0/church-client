'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'

// Components
import { MoonLoader } from 'react-spinners'
import CustomDateTimePicker from '@/app/components/CustomDateTimePicker'
import RowRadioButtonsGroup from '@/app/components/RowRadioButtonsGroup'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'

import { useBook } from '@/app/hooks/book'


function Mass({church}) {

  const [selectedPayment, setSelectedPayment] = useState(null)
  const [selectService, setSelectService] = useState()
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [fullyBooked, setFullyBooked] = useState(null)

  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: {errors: error}, setValue, getValues } = useForm()
  const { walkinMass } = useBook({})

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
  
  const services = [
    {
      value: "thanksgiving",
      label: "Thanksgiving"
    },
    {
      value: "special",
      label: "Special Intentions / Good Health / Safe Travel etc."
    },
    {
      value: "pass",
      label: "To Pass the exam / Interview etc."
    },
    {
      value: "healing",
      label: "Healing / Fast Recovery"
    },
    {
      value: "all",
      label: "All for the souls"
    }
  ]

  useEffect(() => {
    if(selectService){
      setValue('service', selectService)
    }
  }, [selectService])

  const massSubmit = (data) => {
    // console.log(data, selectedDate, selectedTime, selectedPayment, church?.church_id, fullyBooked)
    if(!selectedDate || !selectedTime ){
      Swal.fire({
        title: "Error",
        text: "Select Booking Date",
        icon: "warning"
      })
      return
    }


    setLoading(true)
    walkinMass({
      jsonData: JSON.stringify(data),
      reserved_by: data.reserved_by,
      date: dayjs(selectedDate).format('YYYY-MM-DD'),
      selectedTime: selectedTime,
      selectedPayment: selectedPayment,
      church_id: church?.church_id,
      fullyBooked: fullyBooked,
      setLoading,
      reset,
      setSelectedPayment,
      setSelectedDate,
      setSelectedTime,
      setSelectService,
    })

  }


  if(!church){
    return(
       <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
    )
  }

  return (
    <>
    <div className='flex justify-center items-center p-2 md:px-14 lg:px-28'>
      <div className='bg-white w-full p-3 rounded-lg border border-black/30 shadow-md flex flex-col gap-3 '>
        <div>
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Mass Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church?.church_name}</span></h1>
        </div>

        <form onSubmit={handleSubmit(massSubmit)}>
          <div className='flex justify-center items-center my-2'>
            <CustomDateTimePicker 
              selectedDate={selectedDate} 
              setSelectedDate={setSelectedDate} 
              selectedTime={selectedTime} 
              setSelectedTime={setSelectedTime} 
              setFullyBooked={setFullyBooked}
              church_id={church?.church_id}
              />
          </div>

          <div className='flex justify-center items-center gap-3 mb-3'>
            <h1 className='font-bold josefin-regular'>Reserved By: </h1>
            <div>
              <input 
                type="text" 
                placeholder='Full Name' 
                className='p-2 border rounded-lg' 
                {...register('reserved_by' , {
                  required: "Reservation Name is Required"
                })}
                />
                {error?.reserved_by && <h1 className='text-red-700 font-semibold text-sm'>{error?.reserved_by?.message}</h1>}
            </div>
          </div>

          <div className='flex flex-col md:flex-row justify-between gap-3 md:px-10 lg:px-24 xl:px-42 pb-5'>
            <div className='border p-2 rounded-lg'>
              <h1 className='font-bold josefin-regular text-center'>PERSONAL INFORMATION</h1>
              <div className='grid md:grid-cols-2 gap-3 items-center'>
                  <label htmlFor="fullname" className='md:text-end'>Full Name: </label>
                  <div>
                    <input type="text" 
                      id='fullname'
                      className='border outline-none p-2 w-full rounded-lg '
                      {...register('fullname', {
                        required: "Fullname is required",
                      })} 
                      />
                    {error?.fullname && <h1 className='text-red-700 font-semibold text-sm'>{error?.fullname?.message}</h1>}
                  </div>
              </div>
              <div className='mt-5'>
                <h1 className='font-bold josefin-regular text-center'>DONATION METHOD</h1>
                <div className='flex justify-center items-center'>
                  <RowRadioButtonsGroup 
                      label={"Select a payment method"}
                      name="payment"
                      value={selectedPayment}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      options={payment}
                  
                  />
                </div>
              </div>
            </div>
            <div className='border p-2 rounded-lg'>
              <h1 className='font-bold josefin-regular text-center'>SERVICES</h1>
              <div className='flex flex-col gap-2'>
                <RowRadioButtonsGroup 
                    name="services"
                    value={selectService}
                    onChange={(e) => setSelectService(e.target.value)}
                    options={services}
                    row={false}
                />

              </div>
            </div>
          </div>

          <div className='flex justify-center items-center py-2 '>
            
            {loading ? (
              <div className='flex items-center gap-10'>
                <Link href={`/dashboard-admin`} className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700'>Back</Link>
                <div className='bg-blue-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-blue-700'>
                  <MoonLoader size={20} />
                </div>  
              </div>
            ) : (
              <>
                <div className='flex items-center gap-10'>
                  <Link href={`/dashboard-admin`} className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700' >Back</Link>
                  <button type='submit' className='bg-blue-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-blue-700'>Submit</button>
                </div>
              </>
            ) }
          </div>

        </form>


      </div>
    </div>
    
    
    
    </>
  )
}

export default Mass
