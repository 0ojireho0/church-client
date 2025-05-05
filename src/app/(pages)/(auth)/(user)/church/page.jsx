'use client'
import React, {useState} from 'react'

import { useRouter } from 'next/navigation';


// Components
import Searchbar from '@/app/components/Searchbar'

// Icons
import { FaSearch } from "react-icons/fa";
import ContactUs from './ContactUs';
import Table from './components/Table';

// Hooks
import { useChurch } from '@/app/hooks/church';



export default function Church() {

  const [showContactUs, setShowContactUs] = useState(false)
  const [contactData, setContactData] = useState([])

  const router = useRouter()

  const { church } = useChurch()



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
        <Table 
          church={church}
          handleShowContact={handleShowContact}
          handleBookService={handleBookService}
        />
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
