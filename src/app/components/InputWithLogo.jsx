import React from 'react'



export default function InputWithLogo({logo, placeholder, type}) {
  return (
    <div className='flex border-2 border-black/50 gap-5 py-2 px-4 justify-center items-center rounded-xl'>
      <h1>{logo}</h1>
      <div className='flex gap-2'>
        <div className='border border-black/50'></div>
        <input type={type} className='outline-none joan-regular text-black/80' placeholder={placeholder} />
      </div>
    </div>
  )
}


