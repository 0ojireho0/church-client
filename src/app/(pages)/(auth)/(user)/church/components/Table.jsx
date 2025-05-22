import React, { useEffect } from 'react'
import Image from 'next/image';
import { MoonLoader } from 'react-spinners';


function Table({church, handleRequestCertificate, handleBookService}) {

    // const churchExample = [
    //     {
    //       id: 1,
    //       name: "Quiapo Church",
    //       address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
    //       img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
    //       phone: "123",
    //       landline: "321"
    //     },
    //     {
    //       id: 2,
    //       name: "Quiapo Church",
    //       address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
    //       img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/sanagustin.jpg",
    //       phone: "123",
    //       landline: "321"
    //     },
    //     {
    //       id: 3,
    //       name: "Quiapo Church",
    //       address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
    //       img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/quiapochurch.jpg",
    //       phone: "123",
    //       landline: "321"
    //     },
    //     {
    //       id: 4,
    //       name: "Quiapo Church",
    //       address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
    //       img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
    //       phone: "123",
    //       landline: "321"
    //     },
    //     {
    //       id: 5,
    //       name: "Quiapo Church",
    //       address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
    //       img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
    //       phone: "123",
    //       landline: "321"
    //     },
    //     {
    //       id: 6,
    //       name: "Quiapo Church",
    //       address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
    //       img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
    //       phone: "123",
    //       landline: "321"
    //     },
    //     {
    //       id: 7,
    //       name: "Quiapo Church",
    //       address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
    //       img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
    //       phone: "123",
    //       landline: "321"
    //     },
    //     {
    //       id: 8,
    //       name: "Quiapo Church",
    //       address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
    //       img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
    //       phone: "123",
    //       landline: "321"
    //     },
    //   ]

    if(!church){
        return <MoonLoader />
    }



  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
    {church?.map((item, i) => {
      return (
        <div className='flex flex-col justify-center items-center border border-black/50 rounded-md pb-2 gap-3 w-full' key={i}>
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
  )
}

export default Table
