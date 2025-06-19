'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

// Hooks
import { useChurch } from '@/app/hooks/church'


// Components
import RowCheckboxGroup from '@/app/components/RowCheckboxGroup'
import { MoonLoader } from 'react-spinners'

import { useForm } from 'react-hook-form'
import RowRadioButtonsGroup from '@/app/components/RowRadioButtonsGroup'
import Link from 'next/link'
import { useBook } from '@/app/hooks/book'
import { useAuth } from '@/app/hooks/auth'

function RequestCertificate() {

    const [getChurchInfo, setGetChurchInfo] = useState(null)
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null)

    const [showOnlinePaymentModal, setShowOnlinePaymentModal] = useState(false)
    const [passData, setPassData] = useState()
    const [loadingDone, setLoadingDone] = useState(false)

    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, reset, formState: {errors} } = useForm()

    const service = [
        {
            value: "baptismal",
            label: "Baptismal",
          
        },
        {
            value: "confirmation",
            label: "Confirmation",

        },
        {
            value: "marriage",
            label: "Marriage",
     
        }
    ]
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

    const params = useParams()
    const id = params.id

    const { bookService } = useChurch()
    const { requestCertificate } = useBook({})
    const { user } = useAuth()

    useEffect(() => {
      bookService({
        id: id,
        setGetChurchInfo
      })
    }, [id])

    // if(getChurchInfo == null){
    //   return (
    //     <div className='flex justify-center items-center'>
    //         <MoonLoader />
    //     </div>
    //   )
    // }

    const submitForm = (data) => {
        const formData = {
            ...data,
            services: selectedOptions
        }
        const jsonData = JSON.stringify(formData)


        if(selectedPayment === "online"){
            setShowOnlinePaymentModal(true)

            setPassData(jsonData)
            return
        }
        setLoading(true)
        requestCertificate({
            jsonData,
            selectedPayment,
            id,
            user,
            setLoading,
            setLoadingDone,
            setSelectedOptions,
            setShowOnlinePaymentModal,
            setSelectedPayment,
            reset
        })
  
    }

  const handleDoneSubmit = () => {
    setLoadingDone(true)
        requestCertificate({
            jsonData: passData,
            selectedPayment,
            id,
            user,
            setLoading,
            setLoadingDone,
            setSelectedOptions,
            setShowOnlinePaymentModal,
            setSelectedPayment,
            reset
        })
  }

 


  return (
    <>
    <div className='flex justify-center items-center px-2 py-4'>
        <div className='bg-white rounded-lg shadow-md p-6 w-full max-w-xl gap-4 '>
            <div className='flex flex-col gap-3'>
                <h1 className='text-center josefin-regular text-xl font-bold'>Request Form Certificate</h1>
                <h1 className='text-center josefin-regular text-xl font-bold mb-4 border-b pb-2'>Selected Church: {getChurchInfo?.church_name} </h1>
            </div>
            <div className='flex justify-center items-center'>
                <RowCheckboxGroup 
                label="Select a service"
                name="service"
                values={selectedOptions}
                onChange={setSelectedOptions}
                options={service}
                />
            </div>
            <div className='mt-5'>
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="fullname" className="min-w-[120px]">FULLNAME:</label>
                        <div className='w-full'>
                            <input type="text" id="fullname" className="border border-black/50 bg-neutral-200 px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full"   
                                {...register('fullname', {
                                    required: "Fullname is required"
                                })}
                                />
                            {errors.fullname && <h1 className='text-sm text-red-500'>{errors.fullname.message}</h1>}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="birthday" className="min-w-[120px]">DATE OF BIRTH:</label>
                        <div className='w-full'>
                            <input type="date" id="birthday" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full"   
                                {...register('birthday', {
                                    required: "Birthday is required"
                                })}
                                />
                            {errors.birthday && <h1 className='text-sm text-red-500'>{errors.birthday.message}</h1>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="place" className="min-w-[120px]">PLACE OF BIRTH:</label>
                        <div className='w-full'>
                            <input type="text" id="place" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full"   
                                {...register('place', {
                                    required: "Place is required"
                                })}
                                />
                            {errors.place && <h1 className='text-sm text-red-500'>{errors.place.message}</h1>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="baptismDate" className="min-w-[120px]">DATE OF BAPTISM:</label>
                        <div className='w-full'>
                            <input type="text" id="baptismDate" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full"  
                                {...register('baptismDate', {
                                    required: "Date of Baptism is required"
                                })}
                                />
                            {errors.baptismDate && <h1 className='text-sm text-red-500'>{errors.baptismDate.message}</h1>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="father" className="min-w-[120px]">FATHER'S NAME:</label>
                        <div className='w-full'>
                            <input type="text" id="father" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full"  
                                {...register('father', {
                                    required: "Father's Name is required"
                                })}
                                />
                            {errors.father && <h1 className='text-sm text-red-500'>{errors.father.message}</h1>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="mother" className="min-w-[120px]">MOTHER'S NAME:</label>
                       <div className='w-full'>
                            <input type="text" id="mother" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full" 
                                {...register('mother', {
                                    required: "Mother's Name is required"
                                })}
                                />
                            {errors.mother && <h1 className='text-sm text-red-500'>{errors.mother.message}</h1>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="address" className="min-w-[120px]">ADDRESS:</label>
                       <div className='w-full'>
                            <input type="text" id="address" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full"  
                                {...register('address', {
                                    required: "Address is required"
                                })}
                                />
                            {errors.address && <h1 className='text-sm text-red-500'>{errors.address.message}</h1>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="contact" className="min-w-[120px]">CONTACT NO:</label>
                       <div className='w-full'>
                            <input type="text" id="contact" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full"  
                                {...register('contact', {
                                    required: "Contact is required"
                                })}
                                />
                            {errors.contact && <h1 className='text-sm text-red-500'>{errors.contact.message}</h1>}
                        </div>
                    </div>

                    <div className='flex flex-col justify-center items-center'>
                        <h1 className='bg-[#ff6467] text-white px-4 py-2 rounded-lg josefin-regular '>PAYMENT METHOD</h1>

                        <RowRadioButtonsGroup 
                            label={"Select a payment method"}
                            name="payment"
                            value={selectedPayment}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            options={payment}
                        
                        />
                        
                    </div>

                    <div className='flex justify-center items-center mt-5 gap-3'>
                        {loading ? (
                            <div className='flex items-center gap-10'>
                                <Link href={"/dashboard"} className='bg-black text-white py-2 px-4 rounded-lg'>Back</Link>
                            <div className='bg-red-400 text-white py-2 px-4 rounded-lg'>
                                <MoonLoader size={20} />
                            </div>
                            </div>
                        ) : (
                            <>
                            <div className='flex items-center gap-10'>
                                <Link href={"/dashboard"} className='bg-black text-white py-2 px-4 rounded-lg'>Back</Link>
                                <button type='submit' className='cursor-pointer bg-red-400 text-white py-2 px-4 rounded-lg '>Submit</button>
                            </div>
                            </>
                        ) }
                    </div>
                </form>
            </div>

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

export default RequestCertificate
