'use client'
import React from 'react'

import { useParams, useRouter } from 'next/navigation'

import RecommendedBaptism from './RecommendedBaptism'
import RecommendedWedding from './RecommendedWedding'
import RecommendedMemorial from './RecommendedMemorial'
import RecommendedConfirmation from './RecommendedConfirmation'
import RecommendedMass from './RecommendedMass'

function RecommendedChurches() {
    const params = useParams()
    const { service } = params

    console.log(service)

  return (
    <div>
      {service === "baptism" && <RecommendedBaptism />}
      {service === "wedding" && <RecommendedWedding />}
      {service === "memorial" && <RecommendedMemorial />}
      {service === "confirmation" && <RecommendedConfirmation />}
      {service === "mass" && <RecommendedMass />}
    </div>
  )
}

export default RecommendedChurches
