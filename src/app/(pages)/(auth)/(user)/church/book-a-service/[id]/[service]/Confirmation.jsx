'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'

// Components
import { MoonLoader } from 'react-spinners'
import dayjs from 'dayjs'
import CustomDateTimePicker from '@/app/components/CustomDateTimePicker'
import RowRadioButtonsGroup from '@/app/components/RowRadioButtonsGroup'
import CustomDatePicker from '@/app/components/CustomDatePicker'
import Swal from 'sweetalert2'

import { useBook } from '@/app/hooks/book'


function Confirmation({church, user}) {




  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [fullyBooked, setFullyBooked] = useState(null)

  const [selectedPayment, setSelectedPayment] = useState(null)
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
  const { register, handleSubmit, reset, formState: {errors: error}, control } = useForm()
  const { confirmationBook } = useBook({})


  if(!church){
    return(
       <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
    )
  }

  const handleSubmitConfirmation = (data) => {
    if(!selectedDate || !selectedTime ){
      Swal.fire({
        title: "Error",
        text: "Select Booking Date",
        icon: "warning"
      })
      return
    }

    const jsonData = JSON.stringify(data)

    setLoading(true)
    confirmationBook({
      date: dayjs(selectedDate).format('YYYY-MM-DD'), 
      selectedTime,
      jsonData,
      user,
      selectedPayment,
      fullyBooked,
      church_id:church?.id,
      reset,
      setLoading,
      setSelectedPayment,
      setSelectedDate,
      setSelectedTime
    })
    
  }


  return (
    <>
    <div className='flex justify-center items-center p-2 md:px-14 lg:px-28'>
      <div className='bg-white w-full p-3 rounded-lg border border-black/30 shadow-md flex flex-col gap-3'>
        <div>
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Confirmation Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <div className='flex flex-col justify-center items-center gap-3'>
          <form onSubmit={handleSubmit(handleSubmitConfirmation)}>
            <div className='grid gap-3 md:grid-cols-2 items-start'> 
              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>

                  <div className='flex flex-col'>
                    <label htmlFor="fullname" className='text-start'>Full Name: </label>
                    <input type="text" id='fullname' className='border rounded-md p-2 outline-none'  
                      {...register('fullname', {
                        required: "Fullname is required"
                      })}
                    />
                    {error.fullname && <span className='text-red-500 text-sm '>{error.fullname.message}</span>}
                  </div>

                  <div className='flex flex-col'>
                    <label htmlFor="dob" className='text-start'>Date of Birth: </label>
                    <Controller
                      name="dob"
                      control={control}
                      rules={{ required: 'Date of birth is required' }}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.dob && <span className='text-red-500 text-sm '>{error.dob.message}</span>}
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="pob" className='text-start'>Place of Birth: </label>
                    <input type="text" id='pob' className='border rounded-md p-2 outline-none' 
                    {...register('pob', {
                        required: "Place of birth is required"
                      })}
                    />
                    {error.pob && <span className='text-red-500 text-sm '>{error.pob.message}</span>}
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="father_name" className='text-start'>Father's Name: </label>
                    <input type="text" id='father_name' className='border rounded-md p-2 outline-none' 
                    {...register('father_name', {
                        required: "Father's name is required"
                      })}
                    />
                    {error.father_name && <span className='text-red-500 text-sm '>{error.father_name.message}</span>}
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="mother_name" className='text-start'>Mother's Name: </label>
                    <input type="text" id='mother_name' className='border rounded-md p-2 outline-none' 
                    {...register('mother_name', {
                        required: "Mother's name is required"
                      })}
                    />
                    {error.mother_name && <span className='text-red-500 text-sm '>{error.mother_name.message}</span>}
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="purpose" className='text-start'>Purpose: </label>
                    <input type="text" id='purpose' className='border rounded-md p-2 outline-none' 
                    {...register('purpose', {
                        required: "Purpose is required"
                      })}
                    />
                    {error.purpose && <span className='text-red-500 text-sm '>{error.purpose.message}</span>}
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="contact" className='text-start'>Contact No: </label>
                    <input type="text" id='contact' className='border rounded-md p-2 outline-none' 
                    {...register('contact', {
                        required: "Contact is required"
                      })}
                    />
                    {error.contact && <span className='text-red-500 text-sm '>{error.contact.message}</span>}
                  </div>

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS</h1>
                  <ul className='list-inside list-disc'>
                    <li>Baptismal Certificate</li>
                    <li>Valid ID</li>
                    <li>Authorization Letter (if someone else is claiming the certificate)</li>
                  </ul>
                  <div className="flex items-center justify-center">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Upload File
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                    />
                  </div>

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

            <div className='flex justify-center items-center my-5'>
              <CustomDateTimePicker 
                selectedDate={selectedDate} 
                setSelectedDate={setSelectedDate} 
                selectedTime={selectedTime} 
                setSelectedTime={setSelectedTime} 
                setFullyBooked={setFullyBooked}
                church_id={church?.id}
                />

            </div>

            <div className='flex justify-center items-center py-2 '>
                {loading ? (
                  <div className='flex items-center gap-10'>
                    <Link href={`/church/book-a-service/${church.id}`} className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700'>Back</Link>
                    <div className='bg-blue-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-blue-700'>
                      <MoonLoader size={20} />
                    </div>
                  </div>
                ) : (
                <>
                  <div className='flex items-center gap-10'>
                    <Link href={`/church/book-a-service/${church.id}`} className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700'>Back</Link>
                    <button type='submit' className='bg-blue-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-blue-700'>Submit</button>
                  </div>
                </>
                ) }
            </div>
          </form>
        </div>
      </div>
    </div>
    
    
    
    </>
  )
}

export default Confirmation
