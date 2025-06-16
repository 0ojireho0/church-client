import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'


export const useUser = ({user_id} = { }) => {


    const {data: myBooks, error, mutate} = useSWR(`/api/my-booking/${user_id}`, () => 
        axios
            .get(`/api/my-booking/${user_id}`)
            .then(res => res.data)
    )

    return {
        myBooks
    }

}