import React from 'react'

import { MoonLoader } from 'react-spinners'

import { useForm } from 'react-hook-form'

function Wedding({church}) {


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
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Wedding Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <div className='flex flex-col justify-center items-center gap-3'>
          <form>
            <div className='grid gap-3 md:grid-cols-3 items-start'>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>GROOM'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="groom_fullname" className='text-end'>Full Name: </label>
                  <input type="text" id='groom_fullname' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="groom_gender" className='text-end'>Gender: </label>
                  <input type="text" id='groom_gender' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="groom_dob" className='text-end'>Date of Birth: </label>
                  <input type="date" id='groom_dob' className='border rounded-md p-2 outline-none' />
     
                  <label htmlFor="groom_pob" className='text-end'>Place of Birth: </label>
                  <input type="text" id='groom_pob' className='border rounded-md p-2 outline-none' />
     
                  <label htmlFor="groom_age" className='text-end'>Age: </label>
                  <input type="number" id='groom_age' className='border rounded-md p-2 outline-none' />
     
                  <label htmlFor="groom_occupation" className='text-end'>Occupation: </label>
                  <input type="text" id='groom_occupation' className='border rounded-md p-2 outline-none' />
     
                  <label htmlFor="groom_religion" className='text-end'>Religion: </label>
                  <input type="text" id='groom_religion' className='border rounded-md p-2 outline-none' />

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>PARENT'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="groom_father_name" className='text-end'>Father's Name: </label>
                  <input type="text" id='groom_father_name' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="groom_mother_name" className='text-end'>Mother's Name: </label>
                  <input type="text" id='groom_mother_name' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="groom_parent_religion" className='text-end'>Religion: </label>
                  <input type="date" id='groom_parent_religion' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="groom_parent_address" className='text-end'>Address: </label>
                  <input type="date" id='groom_parent_address' className='border rounded-md p-2 outline-none' />
     
                  <label htmlFor="groom_parent_contact" className='text-end'>Contact No: </label>
                  <input type="text" id='groom_parent_contact' className='border rounded-md p-2 outline-none' />

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>WEDDING SCHEDULE</h1>
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
                <h1 className='font-bold josefin-regular text-center'>BRIDE'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="bride_fullname" className='text-end'>Full Name: </label>
                  <input type="text" id='bride_fullname' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="bride_gender" className='text-end'>Gender: </label>
                  <input type="text" id='bride_gender' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="bride_dob" className='text-end'>Date of Birth: </label>
                  <input type="date" id='bride_dob' className='border rounded-md p-2 outline-none' />
     
                  <label htmlFor="bride_pob" className='text-end'>Place of Birth: </label>
                  <input type="text" id='bride_pob' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="bride_age" className='text-end'>Age: </label>
                  <input type="number" id='bride_age' className='border rounded-md p-2 outline-none' />
     
                  <label htmlFor="bride_occupation" className='text-end'>Occupation: </label>
                  <input type="text" id='bride_occupation' className='border rounded-md p-2 outline-none' />
     
                  <label htmlFor="bride_religion" className='text-end'>Religion: </label>
                  <input type="text" id='bride_religion' className='border rounded-md p-2 outline-none' />
                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>PARENT'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>

                  <label htmlFor="bride_father_name" className='text-end'>Father's Name: </label>
                  <input type="text" id='bride_father_name' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="bride_mother_name" className='text-end'>Mother's Name: </label>
                  <input type="text" id='bride_mother_name' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="bride_parent_religion" className='text-end'>Religion: </label>
                  <input type="date" id='bride_parent_religion' className='border rounded-md p-2 outline-none' />

                  <label htmlFor="bride_parent_address" className='text-end'>Address: </label>
                  <input type="date" id='bride_parent_address' className='border rounded-md p-2 outline-none' />
     
                  <label htmlFor="bride_parent_contact" className='text-end'>Contact No: </label>
                  <input type="text" id='bride_parent_contact' className='border rounded-md p-2 outline-none' />

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS</h1>
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


            </div>

            <div className='my-5 flex justify-center items-center'>
              <button className='bg-green-400 hover:bg-green-500 py-2 px-4 text-white rounded-lg cursor-pointer'>Submit</button>
            </div>


          </form>
        </div>



      </div>
    </div>
    
    
    
    
    </>
  )
}

export default Wedding
