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

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const cancelBookingData = async({setLoader,show, ...props}) => {
        // console.log(props)

        await csrf()

        axios.post('api/cancel-booking', props)
            .then((res) => {
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: "Cancellation of booking is successfully!",
                        icon: "success"
                    })
                    mutate()
                }
                console.log(res)
                
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                show(false)
                setLoader(false)
            })

    } 

    return {
        myBooks,
        cancelBookingData
    }

}