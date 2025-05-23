'use client'
import React, {useEffect, useState} from 'react'

import { useForm } from 'react-hook-form'
import { MoonLoader } from 'react-spinners'

function Memorial({church}) {

  const { register, handleSubmit } = useForm()

  if(!church){
    return(
       <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
    )
  }

  const handleSubmitMemorial = (data) => {
    console.log(data)
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
          <div className='px-24 flex flex-col md:items-start'>
            <div className='md:grid grid-cols-2 gap-5'>
              <label className='text-end'>DATE OF REQUEST: </label>
              <h1 className='bg-blue-400 text-center text-white hover:bg-blue-500 rounded-lg py-2 px-4 cursor-pointer'>Select Date & Time</h1>
              <label className='text-end'>FUNERAL HOME NAME: </label>
              <input type="text" className='border w-full p-2 outline-none rounded-lg bg-neutral-200' />
              <label className='text-end'>FUNERAL MAILING ADDRESS: </label>
              <input type="text" className='border w-full p-2 outline-none rounded-lg bg-neutral-200' />
            </div>
          </div>

          <div className='px-24 grid md:grid-cols-2 lg:grid-cols-3 items-start justify-center my-10 gap-10'>
            <div>
              <h1 className='josefin-regular bg-red-300 py-2 px-4 text-white text-center rounded-lg'>DECEASED INFORMATION</h1>
              
              <div className='grid grid-cols-2 items-center justify-center my-3 gap-3'>
                <label htmlFor="fullname" className='text-start'>Full Name: </label>
                <input type="text" id='fullname' className='border rounded-md p-2 outline-none' />
                <label htmlFor="gender" className='text-start'>Gender: </label>
                <input type="text" id='gender' className='border rounded-md p-2 outline-none' />
                <label htmlFor="dod" className='text-start'>Date of Death: </label>
                <input type="date" id='dod' className='border rounded-md p-2 outline-none' />
                <label htmlFor="dob" className='text-start'>Date of Burial: </label>
                <input type="date" id='dob' className='border rounded-md p-2 outline-none' />
                <label htmlFor="age" className='text-start'>Age: </label>
                <input type="text" id='age' className='border rounded-md p-2 outline-none' />
                <label htmlFor="plot" className='text-start'>Plot Reserved? </label>
                <input type="text" id='plot' className='border rounded-md p-2 outline-none' />
                <label htmlFor="loc_plot" className='text-start'>Location of Plot:  </label>
                <input type="text" id='loc_plot' className='border rounded-md p-2 outline-none' />
              </div>
            </div>
            <div>
              <h1 className='josefin-regular bg-red-300 py-2 px-4 text-white text-center rounded-lg'>SPOUSE INFORMATION</h1>
              <div className='grid grid-cols-2 items-center justify-center my-3 gap-3'>
                <label htmlFor="spouse_fullname" className='text-start'>Full Name: </label>
                <input type="text" id='fullname' className='border rounded-md p-2 outline-none' />
                <label htmlFor="spouse_gender" className='text-start'>Gender: </label>
                <input type="text" id='gender' className='border rounded-md p-2 outline-none' />
                <label htmlFor="deceased" className='text-start'>Deceased? </label>
                <input type="date" id='deceased' className='border rounded-md p-2 outline-none' />
                <label htmlFor="losr" className='text-start'>Location of Spouse Remains: </label>
                <input type="text" id='losr' className='border rounded-md p-2 outline-none' />
              </div>
            </div>
            <div>
              <h1 className='josefin-regular font-bold'>It is the responsibility of the Funeral Director to:</h1>
              <ul className='list-disc'>
                <li>Supply all burial permit copies and cremation certificates.</li>
                <li>Ensure that all necessary documentation is properly completed and submitted to the parish office in a timely manner.</li>
                <li>Coordinate with the parish regarding the schedule and logistics of the funeral service, if it is to be held within church premises.</li>
                <li>Notify the parish if there are any changes or delays in document processing or scheduling.</li>
              </ul>
            </div>
          </div>

          <div className='flex justify-center items-center py-2 '>
            <button type='submit' className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700'>Submit</button>
          </div>



        </form>

      </div>
    </div>
    
    
    
    </>
  )
}

export default Memorial
