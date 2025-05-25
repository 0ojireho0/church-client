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
import { useAuth } from '@/app/hooks/auth'

function ApplicationForm() {

    const [getChurchInfo, setGetChurchInfo] = useState(null)

    const params = useParams()
    const { id, service } = params

    const { bookService } = useChurch()

    const { user } = useAuth()


    useEffect(() => {
      bookService({
        id: id,
        setGetChurchInfo
      })
    }, [id])


  return (
    <div>
        {service === "baptism" && <Baptism church={getChurchInfo} user={user} />}
        {service === "wedding" && <Wedding church={getChurchInfo} user={user} />}
        {service === "memorial" && <Memorial church={getChurchInfo} user={user} />}
        {service === "confirmation" && <Confirmation church={getChurchInfo} user={user} />}
        {service === "mass" && <Mass church={getChurchInfo} user={user} />}
    </div>
  )
}

export default ApplicationForm
