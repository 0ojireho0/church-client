'use client'
import React, {useState} from 'react'

import { useRouter } from 'next/navigation';


// Components
import Searchbar from '@/app/components/Searchbar'

// Icons
import { FaSearch } from "react-icons/fa";
import Table from './components/Table';

// Hooks
import { useChurch } from '@/app/hooks/church';



export default function Church() {

  const router = useRouter()

  const { church } = useChurch()



  const handleRequestCertificate = (data) => {
    router.push(`/church/request-certificate/${data.id}`)
  }

  const handleBookService = (data) => {
    console.log(data)
    router.push(`/church/book-a-service/${data.id}`)
  }


  return (
    <>
    <div className='p-2 md:px-14 lg:px-28 flex flex-col justify-center items-center gap-5'>
      {/* <Searchbar 
        placeholder={"Search"} 
        icon={<FaSearch />} 
        
        /> */}

      <div className='bg-white rounded-lg border border-black/50 drop-shadow-lg p-5 '>
        <Table 
          church={church}
          handleRequestCertificate={handleRequestCertificate}
          handleBookService={handleBookService}
        />
      </div>
    </div>


    
    
    
    
    </>
  )
}
