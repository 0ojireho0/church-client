'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'



// Hooks
import { useChurch } from '@/app/hooks/church'

import { MoonLoader } from 'react-spinners'
import Link from 'next/link'

function ChurchName() {

    const [getChurchInfo, setGetChurchInfo] = useState(null)
    const [getService, setGetService] = useState("")
    const params = useParams()
    const router = useRouter()

    const id = params.id

    const { bookService } = useChurch()
    
    useEffect(() => {
      bookService({
        id: id,
        setGetChurchInfo
      })
    }, [id])



    if(getChurchInfo == null){
      return (
        <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
      )
    }

    const handleCompleteForm = () => {
      // console.log(getService)
      router.push(`/church/book-a-service/${id}/${getService}`)
    }



  return (
    <div className=" flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl">
        <h2 className="text-center text-xl font-bold mb-4 border-b pb-2 josefin-regular">
          Selected Church: {getChurchInfo.church_name}
        </h2>

        <div className="grid grid-cols-2 gap-4 divide-x">
          {/* Services */}
          <div className="pr-4">
            <h3 className="font-bold text-center mb-2">Services</h3>
            <form className="space-y-2">
              <div>
                <input type="radio" id="baptism" name="service" className="mr-2" onChange={(e) => setGetService(e.target.value)} value={"baptism"} />
                <label htmlFor="baptism">Baptism</label>
              </div>
              <div>
                <input type="radio" id="wedding" name="service" className="mr-2" onChange={(e) => setGetService(e.target.value)} value={"wedding"} />
                <label htmlFor="wedding">Wedding</label>
              </div>
              <div>
                <input type="radio" id="memorial" name="service" className="mr-2" onChange={(e) => setGetService(e.target.value)} value={"memorial"}  />
                <label htmlFor="memorial">Memorial</label>
              </div>
              <div>
                <input type="radio" id="confirmation" name="service" className="mr-2" onChange={(e) => setGetService(e.target.value)} value={"confirmation"}  />
                <label htmlFor="confirmation">Confirmation</label>
              </div>
              <div>
                <input type="radio" id="mass" name="service" className="mr-2" onChange={(e) => setGetService(e.target.value)} value={"mass"} />
                <label htmlFor="mass">Mass Scheduling</label>
              </div>
            </form>
          </div>

          {/* Office Info */}
          <div className="pl-4">
            <h3 className="font-bold text-center mb-2">Office Hours</h3>
            <p className="text-center mb-4">{getChurchInfo.office_hours}</p>
            <h3 className="font-bold text-center mb-2">Address</h3>
            <p className="text-center">{getChurchInfo.address}</p>
            <h3 className="font-bold text-center mb-2">Contact Us</h3>
            <p className="text-center">Phone: {getChurchInfo.phone}</p>
            <p className="text-center">Landline: {getChurchInfo.landline}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 ">
          <button onClick={handleCompleteForm} className="w-full bg-[#FFE4A2] text-black font-bold py-2 rounded-lg shadow hover:bg-yellow-200 cursor-pointer">
            Next
          </button>
          <Link href={"/church"} className='bg-black/70 hover:bg-black text-white py-2 px-4 rounded-lg text-center'>Back</Link>
        </div>
      </div>
    </div>
  )
}

export default ChurchName
