'use client'

import React, {useEffect, useState} from 'react'
import { useParams, useRouter } from 'next/navigation'

import Baptism from './components/Baptism'
import Confirmation from './components/Confirmation'
import Mass from './components/Mass'
import Memorial from './components/Memorial'
import Wedding from './components/Wedding'

import { useAuthAdmin } from '@/app/hooks/authadmin'

function WalkInPage() {

    const params = useParams()
    const { service } = params

    const {admin} = useAuthAdmin({
        middleware: "auth-admin",
        redirectIfAuthenticated: "/dashboard-admin"
    })

    // console.log(admin)


  return (
    <div>
        {service === "Baptism" && <Baptism church={admin} />}
        {service === "Wedding" && <Wedding church={admin} />}
        {service === "Memorial" && <Memorial church={admin} />}
        {service === "Confirmation" && <Confirmation church={admin} />}
        {service === "Mass" && <Mass church={admin} />}
    </div>
  )
}

export default WalkInPage
