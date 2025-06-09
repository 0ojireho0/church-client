'use client'
import React, { useState, useEffect } from 'react'

import { useAuthAdmin } from '@/app/hooks/authadmin'
import AdminLayout from '@/app/components/Layout/AdminLayout'
import { useForm } from 'react-hook-form'

import InputSelect from '../components/InputSelect'



import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import FileTable from '../components/DataTable'

export default function AdminDashboard() {

  const [searchStatus, setSearchStatus] = useState(0)

  const checkRequestStatus = data => {
    setSearchStatus(data?.value)
  }

  const {admin} = useAuthAdmin({
    middleware: "auth-admin",
    redirectIfAuthenticated: "/dashboard-admin"
  })
  

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm()

  const serviceOptions = [
    {
      label: "Baptism",
      value: 1
    },
    {
      label: "Wedding",
      value: 2
    },
    {
      label: "Memorial",
      value: 3
    },
    {
      label: "Confirmation",
      value: 4
    },
    {
      label: "Mass Scheduling",
      value: 5
    },
  ]





  return (
    <AdminLayout>

      <div className='flex flex-col gap-5'>
        <h1 className='josefin-regular font-bold text-center text-2xl'>FILE</h1>
         
        <div className='w-full '>
          <h1 className='josefin-regular font-bold '>Select Service Type</h1>
          <InputSelect
            id="searchStatus"
            label="Default = All Service Type"
            onChange={e => checkRequestStatus(e)}
            required={false}
            register={{
              ...register('searchStatus'),
            }}
            errors={errors?.searchStatus}
            control={control}
            option={serviceOptions}
          />
        </div>

        <div>
          <FileTable searchStatus={searchStatus} />
        </div>


      </div>
      

    </AdminLayout>
  )
}

