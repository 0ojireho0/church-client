import React from 'react'
import {PrimeReactProvider} from 'primereact/api'

function AdminLayout({children}) {
  return (
    <PrimeReactProvider>
        <div className='p-2 md:px-14 lg:px-28 flex flex-col justify-center items-center gap-5'>
            <div className='bg-white rounded-lg border border-black/50 drop-shadow-lg p-5 w-full md:w-3/4  '>
                {children}
            </div>
        </div>
    </PrimeReactProvider>
  )
}

export default AdminLayout
