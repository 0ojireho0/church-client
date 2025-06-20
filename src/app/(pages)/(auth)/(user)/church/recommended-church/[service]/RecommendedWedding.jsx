'use client'
import { useEffect, useState } from 'react';
import React from 'react'
import Image from 'next/image';

import Link from 'next/link';

import { useRouter, useParams } from 'next/navigation';

function RecommendedWedding() {

    const [getRecommendedChurches, setgetRecommendedChurches] = useState()
    const router = useRouter()
    const params = useParams()

    const { service } = params

    useEffect(() => {
         setgetRecommendedChurches(JSON.parse(localStorage.getItem('recommended_church')))
    }, [])

    // console.log(getRecommendedChurches)

  const handleRequestCertificate = (data) => {
    router.push(`/church/request-certificate/${data.id}`)
  }

  const handleBookService = (data) => {
    router.push(`/church/book-a-service/${data.id}/${service}`)
    localStorage.removeItem('recommended_church')
 
  }

  const handleBackToMenu = () => {
    router.push(`/church`)
    localStorage.removeItem('recommended_church')
    localStorage.removeItem('wedding_form')
  }

  return (
    <>
    <div className='p-2 md:px-14 lg:px-28 flex flex-col justify-center items-center gap-5'>
        <div className='bg-white rounded-lg border border-black/50 drop-shadow-lg p-5'>
            <h1 className='text-center josefin-regular font-bold mb-4'>Recommended Church</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {getRecommendedChurches?.map((item, i) => {
            return (
                <div className='flex flex-col justify-center items-center border border-black/50 rounded-md pb-2 gap-3 w-full' key={i}>
                    <p>
                      {i + 1}  
                    </p>
                <div className='relative w-full aspect-[4/3] overflow-hidden rounded'>
                    <Image
                    src={item.img_path}
                    alt={item.img}
                    fill
                    className='object-cover'
                    />
                </div>
                <p className='mt-2 text-center font-bold josefin-regular'>{item.church_name}</p>
                <div className='flex justify-start w-full px-2'>
                    <p className='text-justify josefin-regular'>{item.address}</p>
                </div>
                <div className='flex gap-3 justify-center items-center w-full px-2'>
                    <h1 className='bg-blue-300 p-2 w-full text-center rounded-lg border-2 border-black/50 cursor-pointer hover:bg-blue-400 text-sm ' onClick={() => handleRequestCertificate(item)}>Request Certificate</h1>
                    <h1 className='bg-gray-300 p-2 w-full text-center rounded-lg border-2 border-black/50 cursor-pointer hover:bg-gray-400' onClick={() => handleBookService(item)}>Book a Service</h1>
                </div>
                </div>
            )
            })}
        </div>
        <div className='mt-5'>
            <h1 onClick={handleBackToMenu} className=' bg-black/40 hover:bg-black/50 rounded-lg cursor-pointer text-white px-4 py-2 text-center'>Back</h1>
        </div>
        </div>
        
    </div>
    
    </>
  )
}

export default RecommendedWedding

