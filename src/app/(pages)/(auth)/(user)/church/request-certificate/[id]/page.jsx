'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'

function RequestCertificate() {


    const params = useParams()
    const router = useRouter()


  return (
    <div>
      this is request certificate {params.id}
    </div>
  )
}

export default RequestCertificate
