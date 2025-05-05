'use client'
import React, {useState} from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';


// Components
import Searchbar from '@/app/components/Searchbar'

// Icons
import { FaSearch } from "react-icons/fa";
import ContactUs from './ContactUs';



export default function Church() {

  const [showContactUs, setShowContactUs] = useState(false)
  const [contactData, setContactData] = useState([])

  const router = useRouter()

  const churchExample = [
    {
      id: 1,
      name: "Quiapo Church",
      address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
      img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
      phone: "123",
      landline: "321"
    },
    {
      id: 2,
      name: "Quiapo Church",
      address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
      img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/sanagustin.jpg",
      phone: "123",
      landline: "321"
    },
    {
      id: 3,
      name: "Quiapo Church",
      address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
      img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/quiapochurch.jpg",
      phone: "123",
      landline: "321"
    },
    {
      id: 4,
      name: "Quiapo Church",
      address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
      img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
      phone: "123",
      landline: "321"
    },
    {
      id: 5,
      name: "Quiapo Church",
      address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
      img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
      phone: "123",
      landline: "321"
    },
    {
      id: 6,
      name: "Quiapo Church",
      address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
      img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
      phone: "123",
      landline: "321"
    },
    {
      id: 7,
      name: "Quiapo Church",
      address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
      img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
      phone: "123",
      landline: "321"
    },
    {
      id: 8,
      name: "Quiapo Church",
      address: "910 Plaza Miranda, Quiapo, Manila, 1001 Metro Manila",
      img_path: "https://llibi-dms.sgp1.cdn.digitaloceanspaces.com/church/tondochurch.jpg",
      phone: "123",
      landline: "321"
    },
  ]

  const handleShowContact = (data) => {
    console.log(data)
    setShowContactUs(true)
    setContactData(data)
  }

  const handleBookService = (data) => {
    console.log(data)
    router.push(`/church/book-a-service/${data.id}`)
  }


  return (
    <>
    <div className='p-2 md:px-14 lg:px-28 flex flex-col justify-center items-center gap-5'>
      <Searchbar 
        placeholder={"Search"} 
        icon={<FaSearch />} 
        
        />

      <div className='bg-white rounded-lg border border-black/50 drop-shadow-lg p-5 '>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {churchExample.map((item, i) => {
            return (
              <div className='flex flex-col justify-center items-center border border-black/50 rounded-md pb-2 gap-3 w-full' key={i}>
                <div className='relative w-full aspect-[4/3] overflow-hidden rounded'>
                  <Image
                    src={item.img_path}
                    alt={item.name}
                    fill
                    className='object-cover'
                  />
                </div>
                <p className='mt-2 text-center font-bold josefin-regular'>{item.name}</p>
                <div className='flex justify-start w-full px-2'>
                  <p className='text-justify josefin-regular'>{item.address}</p>
                </div>
                <div className='flex gap-3 justify-center items-center w-full px-2'>
                  <h1 className='bg-blue-300 p-2 w-full text-center rounded-lg border-2 border-black/50 cursor-pointer hover:bg-blue-400' onClick={() => handleShowContact(item)}>Contact Us</h1>
                  <h1 className='bg-gray-300 p-2 w-full text-center rounded-lg border-2 border-black/50 cursor-pointer hover:bg-gray-400' onClick={() => handleBookService(item)}>Book a Service</h1>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>

    {showContactUs && 
    <ContactUs 
      showContactUs={showContactUs} 
      setShowContactUs={setShowContactUs}  
      contactData={contactData}
      />}
    
    
    
    
    </>
  )
}
