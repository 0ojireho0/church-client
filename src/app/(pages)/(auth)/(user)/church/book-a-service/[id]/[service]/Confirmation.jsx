import React from 'react'
import { MoonLoader } from 'react-spinners'

import { useForm } from 'react-hook-form'


function Confirmation({church}) {

  const { register, handleSubmit } = useForm()


  if(!church){
    return(
       <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
    )
  }

  const handleSubmitConfirmation = (data) => {
    console.log(data)
  }


  return (
    <>
    <div className='flex justify-center items-center p-2 md:px-14 lg:px-28'>
      <div className='bg-white w-full p-3 rounded-lg border border-black/30 shadow-md flex flex-col gap-3'>
        <div>
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Confirmation Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <div className='flex flex-col justify-center items-center gap-3'>
          <form onSubmit={handleSubmit(handleSubmitConfirmation)}>
            <div className='grid gap-3 md:grid-cols-2 items-start'> 
              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>

                  <div className='flex flex-col'>
                    <label htmlFor="fullname" className='text-start'>Full Name: </label>
                    <input type="text" id='fullname' className='border rounded-md p-2 outline-none' />
                  </div>

                  <div className='flex flex-col'>
                    <label htmlFor="dob" className='text-start'>Date of Birth: </label>
                    <input type="date" id='dob' className='border rounded-md p-2 outline-none' />
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="pob" className='text-start'>Place of Birth: </label>
                    <input type="text" id='pob' className='border rounded-md p-2 outline-none' />
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="father_name" className='text-start'>Father's Name: </label>
                    <input type="number" id='father_name' className='border rounded-md p-2 outline-none' />
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="mother_name" className='text-start'>Mother's Name: </label>
                    <input type="text" id='mother_name' className='border rounded-md p-2 outline-none' />
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="purpose" className='text-start'>Purpose: </label>
                    <input type="text" id='purpose' className='border rounded-md p-2 outline-none' />
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="contact" className='text-start'>Contact No: </label>
                    <input type="text" id='contact' className='border rounded-md p-2 outline-none' />
                  </div>

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS</h1>
                  <ul className='list-inside list-disc'>
                    <li>Baptismal Certificate</li>
                    <li>Valid ID</li>
                    <li>Authorization Letter (if someone else is claiming the certificate)</li>
                  </ul>
                  <div className="flex items-center justify-center">
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
                    />
                  </div>

              </div>
            </div>
            <div className='flex justify-center items-center my-5'>
              <button type='submit' className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700'>Choose your date</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    
    
    </>
  )
}

export default Confirmation
