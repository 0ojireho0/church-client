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

    const anotherBook = async({setLoading, setShowViewMass,setShowViewBaptism, setShowViewConfirmation, setShowViewMemorial ,setSelectedDate, setSelectedTime, setShowViewWedding, setFullyBooked, ...props}) => {
        await csrf()

        // console.log(props)
        
        axios.post('/api/submitAnotherBook', props)
            .then((res) => {
                // console.log(res)
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: "Submit Another Booking Successfully",
                        icon: "success"
                    })
                    mutate()
                    setSelectedDate(null)
                    setSelectedTime(null)
                    setFullyBooked(null)
                }
                
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
                setShowViewMass(false)
                setShowViewBaptism(false)
                setShowViewConfirmation(false)
                setShowViewMemorial(false)
                setShowViewWedding(false)
            })

    }

    return {
        myBooks,
        cancelBookingData,
        anotherBook
    }

}