'use client'
import React, {useEffect, useState} from 'react'

import { useForm } from 'react-hook-form'
import BookingCalendar from '../../../../components/BookingCalendar'

import { MoonLoader } from 'react-spinners'



function Baptism({church}) {

  const { register, handleSubmit } = useForm()

  const [showDateModal, setShowDateModal] = useState(false)


  const handleChooseDate = (data) => {
    // console.log(data)

    setShowDateModal(true)
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
      <div className='bg-white w-full p-3 rounded-lg border border-black/30 shadow-md flex flex-col gap-3'>
        <div>
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Baptism Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <div className='flex justify-center items-center flex-col gap-3'>
          <form onSubmit={handleSubmit(handleChooseDate)}>

            <div className='grid gap-3 md:grid-cols-2 md:gap-10'>
              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>PERSONAL INFORMATION OF THE CHILD</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="fullname" className='text-end'>Full Name: </label>
                  <input type="text" id='fullname' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="gender" className='text-end'>Gender: </label>
                  <input type="text" id='gender' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="dob" className='text-end'>Date of Birth: </label>
                  <input type="date" id='dob' className='border rounded-md p-2 outline-none' />
     
                  <label htmlFor="pob" className='text-end'>Place of Birth: </label>
                  <input type="text" id='pob' className='border rounded-md p-2 outline-none' />

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>PARENT'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="father" className='text-end'>Father's Name: </label>
                  <input type="text" id='father' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="mother" className='text-end'>Mother's Name: </label>
                  <input type="text" id='mother' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="address" className='text-end'>Home Address: </label>
                  <input type="text" id='address' className='border rounded-md p-2 outline-none' />
     
                  <label htmlFor="contact" className='text-end'>Contact #: </label>
                  <input type="text" id='contact' className='border rounded-md p-2 outline-none' />

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>GODPARENT'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="godfather" className='text-end'>Godfather's Name: </label>
                  <textarea id="godfather" className='border rounded-md p-2 outline-none'></textarea>

                  <label htmlFor="godmother" className='text-end'>Godmother's Name: </label>
                  <textarea id="godmother" className='border rounded-md p-2 outline-none'></textarea>

                  {/* <label htmlFor="address" className='text-end'>Home Address: </label>
                  <input type="text" id='address' className='border rounded-md p-2 outline-none' /> */}
     
                  <label htmlFor="contact" className='text-end'>Contact #: </label>
                  <input type="text" id='contact' className='border rounded-md p-2 outline-none' />

                </div>
              </div>

              <div className=' p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS:</h1>
                <ul className='list-inside list-disc'>
                  <li>Birth Certificate from PSA (ORIGINAL AND PHOTOCOPY)</li>
                  <li>Marriage Contract</li>
                </ul>
              </div>

            </div>

            <div className='flex justify-center items-center py-2 '>
              <button type='submit' className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700'>Choose your date</button>
            </div>


          </form>




        </div>
        


      </div>
    </div>

    {showDateModal && <BookingCalendar showDateModal={showDateModal} setShowDateModal={setShowDateModal} />}
    
    
    </>
  )
}

export default Baptism
