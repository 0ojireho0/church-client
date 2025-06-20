'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Logo
import Logo from "@/assets/logo.png"

// Icons
import { IoMenu } from "react-icons/io5"
import { FaFile } from "react-icons/fa";
import { FaCalculator } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { FaXmark } from "react-icons/fa6"
import { CgProfile } from "react-icons/cg";

// Components
import Dropdown from './Dropdown'

export default function Navbar() {

  const navItems = [
    {
      name: "File",
      path: "/dashboard-admin",
      icon: <FaFile />
    },
    {
      name: "Accounting",
      path: "/accounting",
      icon: <FaCalculator />
    },
    {
      name: "Church Management",
      path: "/church-management",
      icon: <MdManageAccounts />
    },
  ]

  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // Prevent scrolling when sidebar is shown
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [show])

  return (
    <>
      <div className='sticky top-0 bg-white drop-shadow-lg p-2 md:px-14 lg:px-28 z-[1000] '>
        <div className='flex justify-between md:hidden'>
          <IoMenu className={`text-3xl md:hidden`} onClick={() => setShow(true)} />
          <div className='flex justify-center items-center'>
            <CgProfile className='text-2xl' onClick={() => setShowProfile(!showProfile)} />
          </div>
        </div>

        <div className='hidden md:flex justify-between items-center md:p'>
          <Image src={Logo} alt='Logo' width={200} />
          <div className='flex gap-10'>
            {navItems.map((item, i) => {

              return (
                <Link
                  href={item.path}
                  key={i}
                  className={`font-bold ${pathname.startsWith(item.path) ? "text-[#1F2937] underline underline-offset-4" : ""}`}
                >
                  {item.name}
         
   
                </Link>
              )
            })}
              <div className='flex justify-center items-center'>
                <h1><CgProfile className='text-2xl cursor-pointer' onClick={() => setShowProfile(!showProfile)} /></h1>
              </div>
          </div>
        </div>
      </div>

      {/* Background Overlay */}
      {show && (
        <div className='fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 md:hidden' onClick={() => setShow(false)}></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-[99999] p-5 transform transition-transform duration-300 ease-in-out md:hidden
        ${show ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className='flex justify-end'>
          <FaXmark className='text-black text-3xl mb-6' onClick={() => setShow(false)} />
        </div>
        <div className='flex justify-center items-center'>
          <Image src={Logo} alt='Logo' width={250} />
        </div>
        <div className='flex flex-col gap-6 px-10 mt-10'>
          
          {navItems.map((item, i) => {
            const isActive = pathname === item.path

            return (
              <Link
                href={item.path}
                key={i}
                onClick={() => setShow(false)}
                className={`flex items-center gap-2 font-bold text-lg ${pathname.startsWith(item.path) && "text-[#1F2937] underline underline-offset-4"}`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>

      {showProfile && <Dropdown />}
    </>
  )
}
