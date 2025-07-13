import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export const useChurch = ({searchStatus} = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: church, error, mutate } = useSWR('/api/get-church', () =>
        axios
            .get('/api/get-church')
            .then(res => res.data)
            // .catch(error => {
            //     if (error.response.status !== 409) throw error

            //     router.push('/verify-email')
            // }),
    )

    const { data: events} = useSWR(`/api/get-events/${searchStatus}`, () =>
        axios
            .get(`/api/get-events/${searchStatus}`)
            .then(res => res.data)
            // .catch(error => {
            //     if (error.response.status !== 409) throw error

            //     router.push('/verify-email')
            // }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const bookService = async({setGetChurchInfo, ...props}) => {
        await csrf()
        
        axios.get(`/api/book-a-service/${props.id}`)
            .then(res => setGetChurchInfo(res.data))
            .catch(err => console.log(err))

    }


    return{
        church,
        events,
        bookService
    }
} 