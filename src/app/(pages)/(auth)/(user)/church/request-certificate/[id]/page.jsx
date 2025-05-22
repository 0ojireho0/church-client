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

function RequestCertificate() {

    const [getChurchInfo, setGetChurchInfo] = useState(null)
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null)

    const { register, handleSubmit, reset } = useForm()

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

    const submitForm = () => {
        // console.log(selectedOptions, selectedPayment)
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
                        <input type="text" id="fullname" className="border border-black/50 bg-neutral-200 px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full" required  />
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="birthday" className="min-w-[120px]">DATE OF BIRTH:</label>
                        <input type="date" id="birthday" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full" required  />
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="place" className="min-w-[120px]">PLACE OF BIRTH:</label>
                        <input type="text" id="place" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full" required />
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="baptismDate" className="min-w-[120px]">DATE OF BAPTISM:</label>
                        <input type="text" id="baptismDate" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full" required />
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="father" className="min-w-[120px]">FATHER'S NAME:</label>
                        <input type="text" id="father" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full" required />
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="mother" className="min-w-[120px]">MOTHER'S NAME:</label>
                        <input type="text" id="mother" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full" required />
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="address" className="min-w-[120px]">ADDRESS:</label>
                        <input type="text" id="address" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full" required />
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="contact" className="min-w-[120px]">CONTACT NO:</label>
                        <input type="text" id="contact" className="border border-black/50 bg-neutral-200  px-2 py-1 flex-1 rounded-lg w-1/2 md:w-full" required />
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

                    <div className='flex justify-center items-center mt-5'>
                        <button type='submit' className='cursor-pointer bg-red-400 text-white py-2 px-4 rounded-lg '>Submit</button>
                    </div>
                </form>
            </div>

        </div>
    </div>
    
    
    </>
  )
}

export default RequestCertificate
