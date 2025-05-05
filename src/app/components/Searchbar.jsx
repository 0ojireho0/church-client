import React from 'react'


function Searchbar({placeholder, icon}) {
  return (
    <div className='bg-white border-2 border-black/50 rounded-xl py-2 px-4 flex items-center gap-4 w-full md:w-[30rem] '>
      {/* <FaSearch className='text-xl text-black/50' /> */}
      <h1 className='text-xl text-black/50'>{icon}</h1>
      <div className='flex gap-2 w-full'>
        <div className='border border-black/50'></div>
        <input type="text" placeholder={placeholder} className='p-2 outline-none w-full' />
      </div>
    </div>
  )
}

export default Searchbar
