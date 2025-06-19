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

  const { register, handleSubmit, reset, formState: {errors: error}, setValue } = useForm()
  const { massBook } = useBook({})

  const [selectedPayment, setSelectedPayment] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [fullyBooked, setFullyBooked] = useState(null)
  const [selectService, setSelectService] = useState()

  const [loading, setLoading] = useState(false)

  const [showOnlinePaymentModal, setShowOnlinePaymentModal] = useState(false)
  const [passData, setPassData] = useState()
  const [loadingDone, setLoadingDone] = useState(false)

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

  if(!church){
    return(
       <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
    )
  }


  const handleSubmitMass = (data) => {

    const jsonData = JSON.stringify(data)
    if(!selectedDate || !selectedTime ){
      Swal.fire({
        title: "Error",
        text: "Select Booking Date",
        icon: "warning"
      })
      return
    }

    if(selectedPayment === "online"){
      setShowOnlinePaymentModal(true)

      setPassData(jsonData)
      return
    }
    setLoading(true)

    massBook({
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
      setSelectedTime,
      setSelectService,
      setShowOnlinePaymentModal,
      setLoadingDone
    })
  }

  const handleDoneSubmit = () => {
    setLoadingDone(true)
    massBook({
      date: dayjs(selectedDate).format('YYYY-MM-DD'), 
      selectedTime,
      jsonData: passData,
      user,
      selectedPayment,
      fullyBooked,
      church_id:church?.id,
      reset,
      setLoading,
      setSelectedPayment,
      setSelectedDate,
      setSelectedTime,
      setSelectService,
      setShowOnlinePaymentModal,
      setLoadingDone
    })
  }

  return (
    <>
    <div className='flex justify-center items-center p-2 md:px-14 lg:px-28'>
      <div className='bg-white w-full p-3 rounded-lg border border-black/30 shadow-md flex flex-col gap-3 '>
        <div>
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Mass Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <form onSubmit={handleSubmit(handleSubmitMass)}>
          <div className='flex flex-col md:flex-row justify-between gap-3 md:px-10 lg:px-24 xl:px-42'>
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
                        value: user?.name
                      })} 
                      // value={user?.name}
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

    {showOnlinePaymentModal && (
      <>
      <div className='fixed inset-0 bg-black/50 flex justify-center items-center px-2'>
        <div className='bg-white w-full md:w-1/2 py-2 px-4 rounded-lg'>
          <h1 className='josefin-regular font-bold text-sm text-center'>Here are the steps for confirmation of your booking!</h1>
          <h1 className='text-sm josefin-regular font-bold mt-3'>1. Send the full payment amount to GCASH/Bank Transfer:</h1>
          <div className='flex flex-col items-center'>
            <h1 className='text-sm font-bold josefin-regular'>GCASH</h1>
            <h1 className='josefin-regular text-sm'>09123456789</h1>
            <h1 className='josefin-regular text-sm'>Juan Dela Cruz</h1>
          </div>
          <div className='flex flex-col items-center mt-3'>
            <h1 className='text-sm font-bold josefin-regular'>Bank Transfer</h1>
            <h1 className='josefin-regular text-sm'>Account #: 1234 567 890</h1>
            <h1 className='josefin-regular text-sm'>Account Name: Juan Dela Cruz</h1>
          </div>
          <h1 className='text-sm josefin-regular font-bold mt-3'>2. Send Proof of payment to our email: </h1>
          <h1 className='text-sm josefin-regular text-center'>quiapochurch@gmail.com</h1>
          <h1 className='text-sm josefin-regular font-bold mt-3'>3. Wait for our confirmation email within 24 hours upon sending your proof of payment via Email. (If you did not receive a confirmation email, please contact us.) </h1>
          <div className='mt-3 flex justify-center items-center gap-5'>
            {loadingDone ? (
              <>
              <div className='bg-red-600 py-1 px-6 rounded-lg'>
                <MoonLoader size={30} color='white' />
              </div>
              </>
            ) : (
              <>
              <h1 className='bg-red-600 hover:bg-red-700 text-white py-1 px-6 rounded-lg cursor-pointer' onClick={() => handleDoneSubmit()}>Done</h1>
              </>
            )}
            <h1 className='bg-blue-600 hover:bg-blue-700 text-white py-1 px-6 rounded-lg cursor-pointer' onClick={() => setShowOnlinePaymentModal(false)}>Cancel</h1>
          </div>

        </div>
      </div>


      </>
    )}
    
    
    </>
  )
}

export default Mass
