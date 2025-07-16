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
import Swal from 'sweetalert2'

function RequestCertificate() {

    const [getChurchInfo, setGetChurchInfo] = useState(null)
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null)

    const [showOnlinePaymentModal, setShowOnlinePaymentModal] = useState(false)
    const [passData, setPassData] = useState()
    const [loadingDone, setLoadingDone] = useState(false)

    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState([])

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

        if(files.length <= 0){
            Swal.fire({
                title: "Error",
                text: "Upload File is required",
                icon: "warning"
            })
            return
        }
        if(selectedOptions.length <= 0){
            Swal.fire({
                title: "Error",
                text: "Select Certificate Type",
                icon: "warning"
            })
            return
        }
        
        const formsData = {
            ...data,
            services: selectedOptions
        }

        const formData = new FormData()
        formData.append('jsonData', JSON.stringify(formsData))
        formData.append('selectedPayment', selectedPayment)
        formData.append('id', id)
        formData.append('user_id', user?.id)
        formData.append('mop', selectedPayment)
        files.forEach((file, index) => {
            formData.append(`files[]`, file)
        })

        if(selectedPayment === "online"){
            setShowOnlinePaymentModal(true)

            setPassData(formData)
            return
        }
        setLoading(true)
        requestCertificate({
            formData,
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
        formData: passData,
        setLoading,
        setLoadingDone,
        setSelectedOptions,
        setShowOnlinePaymentModal,
        setSelectedPayment,
        reset
    })
  }

    const handleFileChange = (e) => {
      const selectedFiles = Array.from(e.target.files)
  
      const filteredFiles = selectedFiles.filter(file => file.size <= 10 * 1024 * 1024)
  
      if (filteredFiles.length !== selectedFiles.length) {
        Swal.fire({
          title: "File Too Large",
          text: "One or more files exceed the 10MB limit.",
          icon: "error"
        })
      }
  
      setFiles(prev => [...prev, ...filteredFiles])
    }

    const handleFileDelete = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
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

                <div className='mt-5'>
                    <div className="flex flex-col items-center">
                    <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS & PROOF OF PAYMENT</h1>
                    <div className="w-full my-2 bg-yellow-100 border border-yellow-300 rounded-md p-4 text-sm text-black space-y-4">
                        <div>
                            <h2 className="font-bold text-red-700">BAPTISMAL CERTIFICATE:</h2>
                            <ul className="list-disc ml-5">
                            <li>Birth Certificate from PSA (original and photocopy)</li>
                            <li>Valid Government-Issued ID (of requester or parent/guardian if minor)</li>
                            <li>Authorization Letter (if requester is not the baptized person)</li>
                            <li>Proof of Payment (screenshot or scanned receipt)</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-bold text-red-700">CONFIRMATION CERTIFICATE:</h2>
                            <ul className="list-disc ml-5">
                            <li>Baptismal Certificate (with “For Confirmation” annotation)</li>
                            <li>Confirmation Stub or ID (if available)</li>
                            <li>Valid Government-Issued ID</li>
                            <li>Authorization Letter (if requester is not the confirmed person)</li>
                            <li>Proof of Payment (screenshot or scanned receipt)</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-bold text-red-700">MARRIAGE CERTIFICATE:</h2>
                            <ul className="list-disc ml-5">
                            <li>Marriage Contract from PSA (ORIGINAL AND PHOTOCOPY)</li>
                            <li>Canonical Interview Certificate (if available)</li>
                            <li>Valid Government-Issued ID of Both Spouses</li>
                            <li>Authorization Letter (if requester is not one of the spouses)</li>
                            <li>Proof of Payment (screenshot or scanned receipt)</li>
                            </ul>
                        </div>
                    </div>
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
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                    />
                    </div>
                {files.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <div className="text-sm truncate max-w-xs">{file.name}</div>
                        <button
                            type="button"
                            className="text-red-500 hover:underline text-xs"
                            onClick={() => handleFileDelete(index)}
                        >
                            Delete
                        </button>
                        </div>
                    ))}
                    </div>
                )}
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
            <h1 className='josefin-regular text-sm'>09950249111</h1>
            <h1 className='josefin-regular text-sm'>Shyanne Kylie Dela Rosa</h1>
          </div>
          <div className='flex flex-col items-center mt-3'>
            <h1 className='text-sm font-bold josefin-regular'>Bank Transfer</h1>
            <h1 className='josefin-regular text-sm'>Account #: 1234 567 890</h1>
            <h1 className='josefin-regular text-sm'>Account Name: Juan Dela Cruz</h1>
          </div>
          <h1 className='text-sm josefin-regular font-bold mt-3'>2. Upload your Proof of Payment under the 'Payment' section </h1>
          {/* <h1 className='text-sm josefin-regular text-center'>quiapochurch@gmail.com</h1> */}
          <h1 className='text-sm josefin-regular font-bold mt-3'>3. Wait for our confirmation email within 24 hours upon submitting your application/request form. (If you did not receive a confirmation email, please contact us at churchconnect05@gmail.com) </h1>
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
