'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { useForm, Controller, get } from 'react-hook-form'
import { useRouter } from 'next/navigation'


// Components
import { MoonLoader } from 'react-spinners'
import RowRadioButtonsGroup from '@/app/components/RowRadioButtonsGroup'
import CustomDateTimePicker from '@/app/components/CustomDateTimePicker'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import CustomDatePicker from '@/app/components/CustomDatePicker'
import { useBook } from '@/app/hooks/book'

function Baptism({church}) {

  const { register, handleSubmit, reset, formState: {errors: error}, control, getValues } = useForm()

  const [selectedPayment, setSelectedPayment] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [fullyBooked, setFullyBooked] = useState(null)
  const [loading, setLoading] = useState(false)

  const { walkinBaptism } = useBook({})

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

  const submitBaptism = (data) => {
    if (!selectedDate || !selectedTime) {
      Swal.fire({
        title: "Error",
        text: "Select Booking Date",
        icon: "warning"
      })
      return
    }

    setLoading(true)
    walkinBaptism({
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
    })

  }
  
  return (
    <>
    <div className='flex justify-center items-center p-2 md:px-14 lg:px-28'>
      <div className='bg-white w-full p-3 rounded-lg border border-black/30 shadow-md flex flex-col gap-3'>
        <div>
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Baptism Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church?.church_name}</span></h1>
        </div>

        <div className='flex justify-center items-center flex-col gap-3'>
          <form onSubmit={handleSubmit(submitBaptism)}>
            <div className='flex justify-center items-center my-5'>
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

            <div className='grid gap-3 md:grid-cols-2 md:gap-10'>
              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>PERSONAL INFORMATION OF THE CHILD</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="fullname" className='text-end'>Full Name: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='fullname' className='border rounded-md p-2 outline-none' 
                      {...register('fullname', {
                        required: 'Fullname is required'
                      })}
                    />
                    {error.fullname && <span className='text-red-500 text-sm '>{error.fullname.message}</span>}
                  </div>

                  <label htmlFor="gender" className='text-end'>Gender: </label>
                  <div className='flex flex-col'>
                    <select 
                      name="gender" 
                      id="gender" 
                      className='border rounded-md p-2 outline-none'
                      {...register('gender', {
                        required: 'Gender is required'
                      })}
                      >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {error.gender && <span className='text-red-500 text-sm '>{error.gender.message}</span>}
                  </div>

                  <label htmlFor="dob" className='text-end'>Date of Birth: </label>
                  <div className='flex flex-col'>
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
     
                  <label htmlFor="pob" className='text-end'>Place of Birth: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='pob' className='border rounded-md p-2 outline-none' 
                      {...register('pob', {
                        required: 'Place of Birth is required'
                      })}
                    />
                    {error.pob && <span className='text-red-500 text-sm '>{error.pob.message}</span>}
                  </div>

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>PARENT'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="father" className='text-end'>Father's Name: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='father' className='border rounded-md p-2 outline-none' 
                      {...register('father', {
                        required: `Father's name is required`
                      })}
                    />
                    {error.father && <span className='text-red-500 text-sm '>{error.father.message}</span>}
                  </div>

                  <label htmlFor="mother" className='text-end'>Mother's Name: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='mother' className='border rounded-md p-2 outline-none' 
                      {...register('mother', {
                        required: `Mother's name is required`
                      })}
                    />
                    {error.mother && <span className='text-red-500 text-sm '>{error.mother.message}</span>}
                  </div>

                  <label htmlFor="address" className='text-end'>Home Address: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='address' className='border rounded-md p-2 outline-none' 
                      {...register('address', {
                        required: `Address's name is required`
                      })}
                    />
                    {error.address && <span className='text-red-500 text-sm '>{error.address.message}</span>}
                  </div>
     
                  <label htmlFor="contact" className='text-end'>Contact #: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='contact' className='border rounded-md p-2 outline-none' 
                      {...register('contact', {
                        required: `Contact's name is required`
                      })}
                    />
                    {error.contact && <span className='text-red-500 text-sm '>{error.contact.message}</span>}
                  </div>

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>GODPARENT'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="godfather" className='text-end'>Godfather's Name: </label>
                  <div className='flex flex-col'>
                    <textarea type="text" id='godfather' className='border rounded-md p-2 outline-none' 
                      {...register('godfather', {
                        required: `Godfather's name is required`
                      })}
                    />
                    {error.godfather && <span className='text-red-500 text-sm '>{error.godfather.message}</span>}
                  </div>

                  <label htmlFor="godmother" className='text-end'>Godmother's Name: </label>
                  <div className='flex flex-col'>
                    <textarea type="text" id='godmother' className='border rounded-md p-2 outline-none' 
                      {...register('godmother', {
                        required: `Godmother's name is required`
                      })}
                    />
                    {error.godmother && <span className='text-red-500 text-sm '>{error.godmother.message}</span>}
                  </div>

                </div>
              </div>

              <div className=' p-2 rounded-lg flex flex-col gap-2 '>
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
                    <Link href={`/dashboard-admin`} className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700'>Back</Link>
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

export default Baptism
