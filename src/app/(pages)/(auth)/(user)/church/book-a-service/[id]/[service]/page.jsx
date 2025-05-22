'use client'

import React, {useEffect, useState} from 'react'
import { useParams, useRouter } from 'next/navigation'


// Components
import Baptism from './Baptism'
import Wedding from './Wedding'
import Memorial from './Memorial'
import Confirmation from './Confirmation'
import Mass from './Mass'

// Hooks
import { useChurch } from '@/app/hooks/church'

function ApplicationForm() {

    const [getChurchInfo, setGetChurchInfo] = useState(null)

    const params = useParams()
    const { id, service } = params

    const { bookService } = useChurch()


    useEffect(() => {
      bookService({
        id: id,
        setGetChurchInfo
      })
    }, [id])


  return (
    <div>
        {service === "baptism" && <Baptism church={getChurchInfo} />}
        {service === "wedding" && <Wedding />}
        {service === "memorial" && <Memorial />}
        {service === "confirmation" && <Confirmation />}
        {service === "mass" && <Mass />}
    </div>
  )
}

export default ApplicationForm
