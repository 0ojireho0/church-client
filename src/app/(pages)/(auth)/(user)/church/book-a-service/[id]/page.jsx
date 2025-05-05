'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'


// Hooks
import { useChurch } from '@/app/hooks/church'



function ChurchName() {

    const [getChurchInfo, setGetChurchInfo] = useState(null)
    const params = useParams()

    const id = params.id

    const { bookService } = useChurch()
    
    useEffect(() => {
      bookService({
        id: id,
        setGetChurchInfo
      })
    }, [id])


    if(getChurchInfo == null){
      return "Loading"
    }



  return (
    <div className=" flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl">
        <h2 className="text-center text-xl font-bold mb-4 border-b pb-2">
          Selected Church: {getChurchInfo.church_name}
        </h2>

        <div className="grid grid-cols-2 gap-4 divide-x">
          {/* Services */}
          <div className="pr-4">
            <h3 className="font-bold text-center mb-2">Services</h3>
            <form className="space-y-2">
              <div>
                <input type="radio" id="baptism" name="service" className="mr-2" />
                <label htmlFor="baptism">Baptism</label>
              </div>
              <div>
                <input type="radio" id="wedding" name="service" className="mr-2" />
                <label htmlFor="wedding">Wedding</label>
              </div>
              <div>
                <input type="radio" id="memorial" name="service" className="mr-2" />
                <label htmlFor="memorial">Memorial</label>
              </div>
              <div>
                <input type="radio" id="confirmation" name="service" className="mr-2" />
                <label htmlFor="confirmation">Confirmation</label>
              </div>
              <div>
                <input type="radio" id="mass" name="service" className="mr-2" />
                <label htmlFor="mass">Mass Scheduling</label>
              </div>
            </form>
          </div>

          {/* Office Info */}
          <div className="pl-4">
            <h3 className="font-bold text-center mb-2">Office Hours</h3>
            <p className="text-center mb-4">Monday - Sunday 10:00am - 5:00pm</p>
            <h3 className="font-bold text-center mb-2">Address</h3>
            <p className="text-center">{getChurchInfo.address}</p>
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full bg-[#FFE4A2] text-black font-bold py-2 rounded-lg shadow hover:bg-yellow-200">
            Complete the form
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChurchName
