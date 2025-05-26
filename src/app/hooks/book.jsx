import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'


export const useBook = ({} = {}) => {


    const {data: book, error, mutate } = useSWR('/api/book-available', () => 
        axios
            .get('/api/book-available')
            .then(res => res.data)
            
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const baptismBook = async({reset, setLoading, setSelectedPayment, setSelectedDate, setSelectedTime, ...props}) => {
        await csrf()

        // console.log(props)
        axios.post('api/book-baptism', props)
            .then(res => {
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: "Submit Successfully",
                        icon: "success"
                    })
                    reset({
                        dob: null, // specifically reset the date of birth
                    });
                    setSelectedPayment(null)
                    setSelectedDate(null)
                    setSelectedTime(null)
                }
                mutate()
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
            })
    }

    const weddingBook = async({reset, setLoading, setSelectedPayment, setWeddingSelectedDate, setWeddingSelectedTime, setRehearsalSelectedDate, setRehearsalSelectedTime, ...props}) => {
        await csrf()

        axios.post('/api/book-wedding', props)
            .then(res => {
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: "Submit Successfully",
                        icon: "success"
                    })
                    reset({
                        groom_dob: null,
                        bride_dob: null
                    });
                    setSelectedPayment(null)
                    setWeddingSelectedDate(null)
                    setWeddingSelectedTime(null)
                    setRehearsalSelectedDate(null)
                    setRehearsalSelectedTime(null)
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
            })
            
    }

    return{
        book,
        baptismBook,
        weddingBook
    }

}