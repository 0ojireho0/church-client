import React, {useEffect} from 'react'
import { FaX } from 'react-icons/fa6'

function ContactUs({showContactUs, setShowContactUs, contactData}) {


    useEffect(() => {
        if(showContactUs){
            document.body.style.overflow = 'hidden'
        }else{
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
          }
    },[showContactUs])


  return (
    <div className='fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center px-2 md:px-14 lg:px-28'>
      <div className='bg-white p-2 md:p-4 w-full rounded-lg border-2 border-black/50'>
        <div className='flex justify-end'>
          <FaX className='text-lg cursor-pointer' onClick={() => setShowContactUs(false)} />
        </div>
        <div className='flex flex-col gap-3'>
          <h1 className='text-center font-bold text-xl'>Contact Us</h1>
          <h1 className='text-center text-xl font-bold'>{contactData.church_name} </h1>
          <h1 className='text-center text-xl'>Address: {contactData.address} </h1>
          <h1 className='text-center text-xl'>Landline: {contactData.landline} </h1>
          <h1 className='text-center text-xl'>Phone: {contactData.phone} </h1>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
