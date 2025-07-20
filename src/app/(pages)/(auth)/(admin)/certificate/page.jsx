'use client'
import React, {useState, useEffect} from 'react'

import InputSelect from '../components/InputSelect'
import AdminLayout from '@/app/components/Layout/AdminLayout'
import { useForm } from 'react-hook-form'
import CertificateTable from '../components/CertificateTable'
import { useAuthAdmin } from '@/app/hooks/authadmin'



function Certificate() {

  const [searchStatus, setSearchStatus] = useState(0)
  const checkRequestStatus = data => {
    console.log(data)
    setSearchStatus(data?.value)
  }


  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm()

  const { admin } = useAuthAdmin({
    middleware: "auth-admin",
    redirectIfAuthenticated: "/dashboard-admin"
  })


  const certificateOptions = [
    {
      label: "Baptism",
      value: 1
    },
    {
      label: "Wedding",
      value: 2
    },
    {
      label: "Confirmation",
      value: 3
    },
  ]


  return (
    <>
    <AdminLayout>
        <h1 className='text-center font-bold md:text-2xl josefin-regular'>Certificate Records</h1>    
        
        <h1 className='josefin-reguar font-bold'>Select Type of Certificate</h1>

        <InputSelect
            id="searchStatus"
            label="Default = All Type of Certificate"
            onChange={e => checkRequestStatus(e)}
            required={false}
            register={{
            ...register('searchStatus'),
            }}
            errors={errors?.searchStatus}
            control={control}
            option={certificateOptions}
        />

        <CertificateTable searchStatus={searchStatus} church_id={admin?.church_id} />
        
        
    </AdminLayout>    
    
    
    
    </>
  )
}

export default Certificate
