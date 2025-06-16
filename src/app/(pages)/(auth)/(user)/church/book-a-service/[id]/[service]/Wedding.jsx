import React, { useState } from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'

// Components
import { MoonLoader } from 'react-spinners'
import CustomDatePicker from '@/app/components/CustomDatePicker'
import RowRadioButtonsGroup from '@/app/components/RowRadioButtonsGroup'
import RehearsalDateTime from './components/RehearsalDateTime'
import dayjs from 'dayjs'
import WeddingDateTime from './components/WeddingDateTime'
import Swal from 'sweetalert2'

import { useBook } from '@/app/hooks/book'


function Wedding({church, user}) {


  const [showRehearsalModal, setShowRehearsalModal] = useState(false)
  const [rehearsalSelectedDate, setRehearsalSelectedDate] = useState(null);
  const [rehearsalSelectedTime, setRehearsalSelectedTime] = useState(null);
  const [rehearsalFullyBooked, setRehearsalFullyBooked] = useState(null)

  const [showWeddingModal, setShowWeddingModal] = useState(false)
  const [weddingSelectedDate, setWeddingSelectedDate] = useState(null);
  const [weddingSelectedTime, setWeddingSelectedTime] = useState(null);
  const [weddingFullyBooked, setWeddingFullyBooked] = useState(null)

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

  const { weddingBook } = useBook({})


  const { register, handleSubmit, reset, formState: {errors: error}, control } = useForm()

  if(!church){
    return(
       <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
    )
  }

  const handleSubmitWedding = (data) => {

    if(!rehearsalSelectedDate || !rehearsalSelectedTime || !weddingSelectedDate || !weddingSelectedTime){
      Swal.fire({
        title: "Error",
        text: "Select Booking Date",
        icon: "warning"
      })
      return
    }

    const jsonData = JSON.stringify(data)
    setLoading(true)

    weddingBook({
      jsonData,
      rehearsal_date: dayjs(rehearsalSelectedDate).format('YYYY-MM-DD'),
      rehearsal_time: rehearsalSelectedTime,
      wedding_date: dayjs(weddingSelectedDate).format('YYYY-MM-DD'),
      wedding_time: weddingSelectedTime,
      user,
      selectedPayment,
      church_id: church?.id,
      rehearsalFullyBooked,
      weddingFullyBooked,
      reset,
      setLoading,
      setSelectedPayment,
      setWeddingSelectedDate,
      setWeddingSelectedTime,
      setRehearsalSelectedDate,
      setRehearsalSelectedTime,
    })

  }




  return (
    <>
    <div className='flex justify-center items-center p-2 md:px-14 lg:px-28'>
      <div className='bg-white w-full p-3 rounded-lg border border-black/30 shadow-md flex flex-col gap-3'>
        <div>
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Wedding Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <div className='flex flex-col justify-center items-center gap-3'>
          <form onSubmit={handleSubmit(handleSubmitWedding)}>
            <div className='grid gap-3 md:grid-cols-2 items-start'>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>GROOM'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_fullname" className='text-start'>Full Name: </label>
                    <input type="text" id='groom_fullname' className='border rounded-md p-2 outline-none' 
                      {...register('groom_fullname', {
                        required: 'Fullname is required'
                      })}
                    />
                    {error.groom_fullname && <span className='text-red-500 text-sm '>{error.groom_fullname.message}</span>}
                  </div>

                 
                  <div className='flex flex-col'>
                    <label htmlFor="groom_gender" className='text-start'>Gender: </label>
                    <input type="text" id='groom_gender' className='border rounded-md p-2 outline-none' 
                      {...register('groom_gender', {
                        required: 'Gender is required'
                      })}
                    />
                    {error.groom_gender && <span className='text-red-500 text-sm '>{error.groom_gender.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_dob" className='text-start'>Date of Birth: </label>
                    <Controller
                      name="groom_dob"
                      control={control}
                      rules={{ required: 'Date of birth is required' }}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.groom_dob && <span className='text-red-500 text-sm '>{error.groom_dob.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_pob" className='text-start'>Place of Birth: </label>
                    <input type="text" id='groom_pob' className='border rounded-md p-2 outline-none' 
                      {...register('groom_pob', {
                        required: 'Place of birth is required'
                      })}
                    />
                    {error.groom_pob && <span className='text-red-500 text-sm '>{error.groom_pob.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_age" className='text-start'>Age: </label>
                    <input type="number" id='groom_age' className='border rounded-md p-2 outline-none' 
                      {...register('groom_age', {
                        required: 'Age is required'
                      })}
                    />
                    {error.groom_age && <span className='text-red-500 text-sm '>{error.groom_age.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_occupation" className='text-start'>Occupation: </label>
                    <input type="text" id='groom_occupation' className='border rounded-md p-2 outline-none' 
                      {...register('groom_occupation', {
                        required: 'Occupation is required'
                      })}
                    />
                    {error.groom_occupation && <span className='text-red-500 text-sm '>{error.groom_occupation.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_religion" className='text-start'>Religion: </label>
                    <input type="text" id='groom_religion' className='border rounded-md p-2 outline-none' 
                      {...register('groom_religion', {
                        required: 'Religion is required'
                      })}
                    />
                    {error.groom_religion && <span className='text-red-500 text-sm '>{error.groom_religion.message}</span>}
                  </div>

                </div>
              </div>
              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>BRIDE'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_fullname" className='text-start'>Full Name: </label>
                    <input type="text" id='bride_fullname' className='border rounded-md p-2 outline-none' 
                      {...register('bride_fullname', {
                        required: `Full name is required`
                      })}
                    />
                    {error.bride_fullname && <span className='text-red-500 text-sm '>{error.bride_fullname.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_gender" className='text-start'>Gender: </label>
                    <input type="text" id='bride_gender' className='border rounded-md p-2 outline-none' 
                      {...register('bride_gender', {
                        required: `Gender is required`
                      })}
                    />
                    {error.bride_gender && <span className='text-red-500 text-sm '>{error.bride_gender.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_dob" className='text-start'>Date of Birth: </label>
                    <Controller
                      name="bride_dob"
                      control={control}
                      rules={{ required: 'Date of birth is required' }}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.bride_dob && <span className='text-red-500 text-sm '>{error.bride_dob.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_pob" className='text-start'>Place of Birth: </label>
                    <input type="text" id='bride_pob' className='border rounded-md p-2 outline-none' 
                      {...register('bride_pob', {
                        required: `Place of birth is required`
                      })}
                    />
                    {error.bride_pob && <span className='text-red-500 text-sm '>{error.bride_pob.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_age" className='text-start'>Age: </label>
                    <input type="number" id='bride_age' className='border rounded-md p-2 outline-none' 
                      {...register('bride_age', {
                        required: `Age is required`
                      })}
                    />
                    {error.bride_age && <span className='text-red-500 text-sm '>{error.bride_age.message}</span>}
                  </div>
     
                 
                  <div className='flex flex-col'>
                    <label htmlFor="bride_occupation" className='text-start'>Occupation: </label>
                    <input type="text" id='bride_occupation' className='border rounded-md p-2 outline-none' 
                      {...register('bride_occupation', {
                        required: `Occupation is required`
                      })}
                    />
                    {error.bride_occupation && <span className='text-red-500 text-sm '>{error.bride_occupation.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_religion" className='text-start'>Religion: </label>
                    <input type="text" id='bride_religion' className='border rounded-md p-2 outline-none' 
                      {...register('bride_religion', {
                        required: `Religion is required`
                      })}
                    />
                    {error.bride_religion && <span className='text-red-500 text-sm '>{error.bride_religion.message}</span>}
                  </div>
                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>GROOM'S PARENT INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>

                  <div className='flex flex-col'>
                    <label htmlFor="groom_father_name" className='text-start'>Father's Name: </label>
                    <input type="text" id='groom_father_name' className='border rounded-md p-2 outline-none' 
                      {...register('groom_father_name', {
                        required: `Father's name is required`
                      })}
                    />
                    {error.groom_father_name && <span className='text-red-500 text-sm '>{error.groom_father_name.message}</span>}
                  </div>


                  <div className='flex flex-col'>
                    <label htmlFor="groom_mother_name" className='text-start'>Mother's Name: </label>
                    <input type="text" id='groom_mother_name' className='border rounded-md p-2 outline-none' 
                      {...register('groom_mother_name', {
                        required: `Mother's name is required`
                      })}
                    />
                    {error.groom_mother_name && <span className='text-red-500 text-sm '>{error.groom_mother_name.message}</span>}
                  </div>


                  <div className='flex flex-col'>
                    <label htmlFor="groom_parent_religion" className='text-start'>Religion: </label>
                    <input type="text" id='groom_parent_religion' className='border rounded-md p-2 outline-none' 
                      {...register('groom_parent_religion', {
                        required: `Religion is required`
                      })}
                    />
                    {error.groom_parent_religion && <span className='text-red-500 text-sm '>{error.groom_parent_religion.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_parent_address" className='text-start'>Address: </label>
                    <input type="text" id='groom_parent_address' className='border rounded-md p-2 outline-none' 
                      {...register('groom_parent_address', {
                        required: `Religion is required`
                      })}
                    />
                    {error.groom_parent_address && <span className='text-red-500 text-sm '>{error.groom_parent_address.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_parent_contact" className='text-start'>Contact No: </label>
                    <input type="text" id='groom_parent_contact' className='border rounded-md p-2 outline-none' 
                      {...register('groom_parent_contact', {
                        required: `Contact is required`
                      })}
                    />
                    {error.groom_parent_contact && <span className='text-red-500 text-sm '>{error.groom_parent_contact.message}</span>}
                  </div>

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>BRIDE'S PARENTS INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_father_name" className='text-start'>Father's Name: </label>
                    <input type="text" id='bride_father_name' className='border rounded-md p-2 outline-none' 
                      {...register('bride_father_name', {
                        required: `Father's Name is required`
                      })}
                    />
                    {error.bride_father_name && <span className='text-red-500 text-sm '>{error.bride_father_name.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_mother_name" className='text-start'>Mother's Name: </label>
                    <input type="text" id='bride_mother_name' className='border rounded-md p-2 outline-none' 
                      {...register('bride_mother_name', {
                        required: `Mother's Name is required`
                      })}
                    />
                    {error.bride_mother_name && <span className='text-red-500 text-sm '>{error.bride_mother_name.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_parent_religion" className='text-start'>Religion: </label>
                    <input type="text" id='bride_parent_religion' className='border rounded-md p-2 outline-none' 
                      {...register('bride_parent_religion', {
                        required: `Religion is required`
                      })}
                    />
                    {error.bride_parent_religion && <span className='text-red-500 text-sm '>{error.bride_parent_religion.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_parent_address" className='text-start'>Address: </label>
                    <input type="text" id='bride_parent_address' className='border rounded-md p-2 outline-none' 
                      {...register('bride_parent_address', {
                        required: `Religion is required`
                      })}
                    />
                    {error.bride_parent_address && <span className='text-red-500 text-sm '>{error.bride_parent_address.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_parent_contact" className='text-start'>Contact No: </label>
                    <input type="text" id='bride_parent_contact' className='border rounded-md p-2 outline-none' 
                      {...register('bride_parent_contact', {
                        required: `Contact No is required`
                      })}
                    />
                    {error.bride_parent_contact && <span className='text-red-500 text-sm '>{error.bride_parent_contact.message}</span>}
                  </div>

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>

                  <div className='flex flex-col'>
                    <label htmlFor="banns" className='text-start'>Banns: </label>
                    <input type="text" id='banns' className='border rounded-md p-2 outline-none' />
                  </div>
                  
                  <div className='flex flex-col'>
                    <label htmlFor="license" className='text-start'>License: </label>
                    <input type="text" id='license' className='border rounded-md p-2 outline-none' />
                  </div>

                  <div className='flex flex-col'>
                    <label htmlFor="organist" className='text-start'>Organist: </label>
                    <input type="text" id='organist' className='border rounded-md p-2 outline-none' />
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="flowers" className='text-start'>Flowers: </label>
                    <input type="text" id='flowers' className='border rounded-md p-2 outline-none' />
                  </div>

                </div>
              </div>
        
              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>WEDDING SCHEDULE</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label className='text-end'>REHEARSAL DATE & TIME: </label>
                  <h1 className='bg-blue-400 text-center text-white hover:bg-blue-500 rounded-lg py-2 px-4 cursor-pointer' onClick={() => setShowRehearsalModal(true)}>{rehearsalSelectedDate && rehearsalSelectedTime ? `${dayjs(rehearsalSelectedDate).format('MMMM DD, YYYY')} ${dayjs(rehearsalSelectedTime, 'HH:mm:ss').format('hh:mm A')}` : "Select Date & Time"}</h1>
                  <label className='text-end'>WEDDING DATE & TIME: </label>
                  <h1 className='bg-blue-400 text-center text-white hover:bg-blue-500 rounded-lg py-2 px-4 cursor-pointer' onClick={() => setShowWeddingModal(true)}>{weddingSelectedDate && weddingSelectedTime ? `${dayjs(weddingSelectedDate).format('MMMM DD, YYYY')} ${dayjs(weddingSelectedTime, 'HH:mm:ss').format('hh:mm A')}` : "Select Date & Time"}</h1>

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

            <div className='my-5 flex justify-center items-center'>
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

    {showRehearsalModal && <RehearsalDateTime 
                                  setShowRehearsalModal={setShowRehearsalModal} 
                                  rehearsalSelectedDate={rehearsalSelectedDate}
                                  setRehearsalSelectedDate={setRehearsalSelectedDate}
                                  rehearsalSelectedTime={rehearsalSelectedTime}
                                  setRehearsalSelectedTime={setRehearsalSelectedTime}
                                  setRehearsalFullyBooked={setRehearsalFullyBooked}
                                  church_id={church?.id}
                                  />}

    {showWeddingModal && <WeddingDateTime 
                                  setShowWeddingModal={setShowWeddingModal} 
                                  weddingSelectedDate={weddingSelectedDate}
                                  setWeddingSelectedDate={setWeddingSelectedDate}
                                  weddingSelectedTime={weddingSelectedTime}
                                  setWeddingSelectedTime={setWeddingSelectedTime}
                                  setWeddingFullyBooked={setWeddingFullyBooked}
                                  church_id={church?.id}
                                  />}
    
    
    
    </>
  )
}

export default Wedding
