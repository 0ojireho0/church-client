import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'


export const useBook = ({church_id} = {}) => {


    const {data: book, error, mutate } = useSWR(`/api/book-available/${church_id}`, () => 
        axios
            .get(`/api/book-available/${church_id}`)
            .then(res => res.data)
        ,{
            refreshInterval: 10000
        }
            
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
                        text: `Submit Successfully, your reference number is ${res.data.ref_num}`,
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
                        text: `Submit Successfully, your reference number is ${res.data.ref_num}`,
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

    const memorialBook = async({reset, setLoading, setSelectedPayment, setSelectedDate, setSelectedTime, ...props}) => {
        await csrf()

        // console.log(props)
        axios.post('api/book-memorial', props)
            .then(res => {
                console.log(res)
                if(res.status === 200){
                     Swal.fire({
                        title: "Success",
                        text: `Submit Successfully, your reference number is ${res.data.ref_num}`,
                        icon: "success"
                    })
                    reset({
                        deceased_dob: null, 
                        deceased_dod: null,
                        spouse_deceased: null
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

    const confirmationBook = async({reset, setLoading, setSelectedPayment, setSelectedDate, setSelectedTime, ...props}) => {
        await csrf()

        // console.log(props)
        axios.post('api/book-confirmation', props)
            .then(res => {
                console.log(res)
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: `Submit Successfully, your reference number is ${res.data.ref_num}`,
                        icon: "success"
                    })
                    reset({
                        dob: null, 

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

    const massBook = async({reset, setLoading, setSelectedPayment, setSelectedDate, setSelectedTime, setSelectService, ...props}) => {
        await csrf()

        // console.log(props)
        axios.post('api/book-mass', props)
            .then(res => {
                console.log(res)
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: `Submit Successfully, your reference number is ${res.data.ref_num}`,
                        icon: "success"
                    })
                    reset();
                    setSelectedPayment(null)
                    setSelectedDate(null)
                    setSelectedTime(null)
                    setSelectService(null)
                }
                mutate()
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
            })
    }

    return{
        book,
        baptismBook,
        weddingBook,
        memorialBook,
        confirmationBook,
        massBook
    }

}