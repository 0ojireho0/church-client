'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

// Icons
import { IoMenu } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { FaUser } from "react-icons/fa";

// Images
import Logo from "../../assets/logo.png"



export const Navbar = ({children}) => {

  const pathname = usePathname()
  const [showNavbar, setShowNavbar] = useState(false)

  
  const navLinks = [
    {
      name: "Home",
      url: "/",
      icon: FaHome
    },
    {
      name: "Admin",
      url: "admin/login",
      icon: GrUserAdmin
    },
    {
      name: "Parishioner",
      url: "/login",
      icon: FaUser
    }
  ]


  return (
    <>


    {/* DESKTOP */}
    <div className='hidden md:block'>
      <div className=' w-full'>
        <div className='py-3 md:px-10 lg:px-28 flex justify-between items-center'>
          <div>
            <Image src={Logo} alt='Logo' width={180} />
          </div>

          <div className='flex md:gap-10 lg:gap-14'>
            {navLinks.map((item, i) => {

              const isActive = pathname === item.url

              return(
                <div key={i} className=''>
                  <Link href={item.url} className={`text-lg font-bold ${isActive && "text-[#1F2937] underline underline-offset-5"}`}>{item.name}</Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>



      <div>
        {children}
      </div>
    </div>


    {/* MOBILE */}
    {showNavbar ? (
      <>
      <div className='relative'>
        <div className='sticky top-0'>
          <div className='h-screen fixed w-full flex'>
            <div className='bg-white p-3 w-4/5  md:hidden '>
              <div className='flex justify-end'>
                <FaXmark className='text-3xl md:hidden' onClick={() => setShowNavbar(false)} />
              </div>
              <div className='flex flex-col gap-10 py-10 justify-center items-center'>
                <div>
                  <Image src={Logo} alt='Logo' width={400} />
                </div>

                <div className=''>
                  {navLinks.map((item, i)=>{

                    const isActive = pathname === item.url 

                    return(
                        
                      <div key={i} className={`flex my-5 gap-5 px-6 py-2 rounded-lg ${isActive && "bg-[#1F2937] "}`}>
                        <item.icon className={`text-2xl ${isActive && "text-white"}`} />
                        <Link 
                          href={item.url} 
                          onClick={() => setShowNavbar(false)}
                          className={`text-lg ${isActive && "text-white"}`}
                          >{item.name}</Link>
                      </div>
                      
     
                    )
                  })}
                </div>

              </div>
            </div>
            <div className='bg-black/50 backdrop-blur-sm w-1/3 md:hidden' onClick={() => setShowNavbar(false)}></div>
          </div>
      
        </div>


        <div className='z-0 md:hidden'>
          {children}
        </div>

      </div>

      </>
    ) : (
      <>
    <div className='relative'>
      <div className='sticky top-0'>
        <div className='fixed p-3 bg-white w-full'>
          <IoMenu className='text-3xl md:hidden' onClick={() => setShowNavbar(true)}/>
        </div>
      </div>

      <div className='py-14 px-3 md:hidden'>
        {children}
      </div>
          
    </div>
      </>
    )}


    
    
    
    </>
  )
}


