import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export const useAdminBook = ({searchStatus} = {}) => {

    
    const { data: servicetype, error, mutate } = useSWR(`api/admin/search-service/${searchStatus || 0}`, () =>
        axios
            .get(`api/admin/search-service/${searchStatus || 0}`)
            .then(res => res.data)
            .catch(err => console.log(err)),
            {
                refreshInterval: 10000,
            }
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const changeStatus = ({setLoading, setShowEditModal, ...props}) => {

        csrf()

        axios.post('/api/admin/changeStatus', props)
            .then(res => {
                console.log(res)
                mutate()
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: "Success text",
                        icon: 'success'
                    })
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
                setShowEditModal(false)
            })
    }

    return {
        servicetype,
        changeStatus
    }

}