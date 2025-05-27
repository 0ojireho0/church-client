'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'

// Components
import { MoonLoader } from 'react-spinners'
import MemorialDateTime from './components/MemorialDateTime'
import dayjs from 'dayjs'
import CustomDatePicker from '@/app/components/CustomDatePicker'
import RowRadioButtonsGroup from '@/app/components/RowRadioButtonsGroup'
import Swal from 'sweetalert2'

import { useBook } from '@/app/hooks/book'

function Memorial({church, user}) {


  const [showMemorialDateModal, setShowMemorialDateModal] = useState(false)
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
  const { memorialBook } = useBook()

  if(!church){
    return(
       <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
    )
  }

  const handleSubmitMemorial = (data) => {


    if(!selectedDate || !selectedTime){
      Swal.fire({
        title: "Error",
        text: "Select Booking Date",
        icon: "warning"
      })
      return
    }


    const jsonData = JSON.stringify(data)

    // console.log(data)
    // console.log(dayjs(selectedDate).format('MMMM DD, YYYY'))
    // console.log(selectedTime)
    // console.log(selectedPayment)
    // console.log(church)
    // console.log(user)


    setLoading(true)
    memorialBook({
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
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Memorial Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <form onSubmit={handleSubmit(handleSubmitMemorial)}> 
          <div className='px-24 flex flex-col md:items-start '>
            <div className='md:grid grid-cols-2 gap-5 items-center'>
              <label className='text-end'>DATE OF REQUEST: </label>
              <h1 className='bg-blue-400 text-center text-white hover:bg-blue-500 rounded-lg py-2 px-4 cursor-pointer' onClick={() => setShowMemorialDateModal(true)}>{selectedDate && selectedTime ? `${dayjs(selectedDate).format('MMMM DD, YYYY')} ${dayjs(selectedTime, 'HH:mm:ss').format('hh:mm A')}` : "Select Date & Time"}</h1>
              <label className='text-end' htmlFor='funeral_home_name'>FUNERAL HOME NAME: </label>
              <div className='flex flex-col'>
                <input type="text" id='funeral_home_name' className='border w-full p-2 outline-none rounded-lg bg-neutral-200' 
                  {...register('funeral_home_name', {
                    required: `Funeral Home Name is required`
                  })}
                />
                {error.funeral_home_name && <span className='text-red-500 text-sm '>{error.funeral_home_name.message}</span>}
              </div>
              <label className='text-end' htmlFor='funeral_mailing_address'>FUNERAL MAILING ADDRESS: </label>
              <div className='flex flex-col'>
                <input type="text" id='funeral_mailing_address' className='border w-full p-2 outline-none rounded-lg bg-neutral-200' 
                  {...register('funeral_mailing_address', {
                    required: `Funeral Mailing Address is required`
                  })}
                />
                {error.funeral_mailing_address && <span className='text-red-500 text-sm '>{error.funeral_mailing_address.message}</span>}
              </div>
            </div>
          </div>

          <div className='px-24 grid md:grid-cols-2 lg:grid-cols-3 items-start justify-center my-10 gap-10'>
            <div className='border-2 border-black/30 p-2 rounded-lg '>
              <h1 className='font-bold josefin-regular text-center'>DECEASED INFORMATION</h1>
              
              <div className='grid md:grid-cols-2 items-center justify-center my-3 gap-3'>

                <div className='flex flex-col'>
                  <label htmlFor="deceased_fullname" className='text-start'>Full Name: </label>
                  <input type="text" id='deceased_fullname' className='border rounded-md p-2 outline-none' 
                    {...register('deceased_fullname', {
                      required: `Fullname is required`
                    })}
                  />
                  {error.deceased_fullname && <span className='text-red-500 text-sm '>{error.deceased_fullname.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="deceased_gender" className='text-start'>Gender: </label>
                  <input type="text" id='deceased_gender' className='border rounded-md p-2 outline-none' 
                    {...register('deceased_gender', {
                      required: `Gender is required`
                    })}
                  />
                  {error.deceased_gender && <span className='text-red-500 text-sm '>{error.deceased_gender.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="deceased_dod" className='text-start'>Date of Death: </label>
                    <Controller
                      name="deceased_dod"
                      control={control}
                      rules={{ required: 'Date of Death is required' }}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.deceased_dod && <span className='text-red-500 text-sm '>{error.deceased_dod.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="deceased_dob" className='text-start'>Date of Burial: </label>
                    <Controller
                      name="deceased_dob"
                      control={control}
                      rules={{ required: 'Date of Burial is required' }}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.deceased_dob && <span className='text-red-500 text-sm '>{error.deceased_dob.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="deceased_age" className='text-start'>Age: </label>
                  <input type="number" id='deceased_age' className='border rounded-md p-2 outline-none' 
                    {...register('deceased_age', {
                      required: `Age is required`
                    })}
                  />
                  {error.deceased_age && <span className='text-red-500 text-sm '>{error.deceased_age.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="plot" className='text-start'>Plot Reserved? </label>
                  <input type="text" id='plot' className='border rounded-md p-2 outline-none' 
                    {...register('plot', {
                      required: `Plot is required`
                    })}
                  />
                  {error.plot && <span className='text-red-500 text-sm '>{error.plot.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="loc_plot" className='text-start'>Location of Plot:  </label>
                  <input type="text" id='loc_plot' className='border rounded-md p-2 outline-none' 
                    {...register('loc_plot', {
                      required: `Location of Plot is required`
                    })}
                  />
                  {error.loc_plot && <span className='text-red-500 text-sm '>{error.loc_plot.message}</span>}
                </div>

              </div>
            </div>
            <div className='border-2 border-black/30 p-2 rounded-lg '>
              <h1 className='font-bold josefin-regular text-center'>SPOUSE INFORMATION</h1>
              <div className='grid grid-cols-2 items-center justify-center my-3 gap-3'>
                
                <div className='flex flex-col'>
                  <label htmlFor="spouse_fullname" className='text-start'>Full Name: </label>
                  <input type="text" id='spouse_fullname' className='border rounded-md p-2 outline-none' 
                    {...register('spouse_fullname', {
                      required: `Full Name is required`
                    })}
                  />
                  {error.spouse_fullname && <span className='text-red-500 text-sm '>{error.spouse_fullname.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="spouse_gender" className='text-start'>Gender: </label>
                  <input type="text" id='spouse_gender' className='border rounded-md p-2 outline-none' 
                    {...register('spouse_gender', {
                      required: `Gender is required`
                    })}
                  />
                  {error.spouse_gender && <span className='text-red-500 text-sm '>{error.spouse_gender.message}</span>}
                </div>

           
                  <label htmlFor="spouse_deceased" className='text-start'>Deceased? </label>
                    <Controller
                      name="spouse_deceased"
                      control={control}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.spouse_deceased && <span className='text-red-500 text-sm '>{error.spouse_deceased.message}</span>}
           

                <label htmlFor="losr" className='text-start'>Location of Spouse Remains: </label>
                <div className='flex flex-col'>
                  <input type="text" id='losr' className='border rounded-md p-2 outline-none' 
                    {...register('losr', {
                      required: `Location of Spouse Remains is required`
                    })}
                  />
                  {error.losr && <span className='text-red-500 text-sm '>{error.losr.message}</span>}
                </div>
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
            <div>
              <h1 className='josefin-regular font-bold'>It is the responsibility of the Funeral Director to:</h1>
              <ul className='list-disc'>
                <li className='text-justify'>Supply all burial permit copies and cremation certificates.</li>
                <li className='text-justify'>Ensure that all necessary documentation is properly completed and submitted to the parish office in a timely manner.</li>
                <li className='text-justify'>Coordinate with the parish regarding the schedule and logistics of the funeral service, if it is to be held within church premises.</li>
                <li className='text-justify'>Notify the parish if there are any changes or delays in document processing or scheduling.</li>
              </ul>
            </div>
          </div>

          <div className='flex justify-center items-center py-2 '>
              {loading ? (
                <div className='flex items-center gap-10'>
                  <Link href={"/church"} className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700'>Back</Link>
                  <div className='bg-blue-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-blue-700'>
                    <MoonLoader size={20} />
                  </div>
                </div>
              ) : (
                <>
                  <div className='flex items-center gap-10'>
                    <Link href={"/church"} className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700'>Back</Link>
                    <button type='submit' className='bg-blue-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-blue-700'>Submit</button>
                  </div>
                </>
              ) }
          </div>



        </form>

      </div>
    </div>
    
    {showMemorialDateModal && <MemorialDateTime 
                                setShowMemorialDateModal={setShowMemorialDateModal} 
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                selectedTime={selectedTime}
                                setSelectedTime={setSelectedTime}
                                setFullyBooked={setFullyBooked}
                                church_id={church?.id}
                                />
                                }
    
    
    </>
  )
}

export default Memorial
