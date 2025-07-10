import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export const useAdminBook = ({searchStatus, church_id} = {}) => {

    
    const { data: servicetype, error, mutate } = useSWR(`/admin/search-service/${searchStatus || 0}/${church_id || 0}`, () =>
        axios
            .get(`/admin/search-service/${searchStatus || 0}/${church_id || 0}`)
            .then(res => res.data)
            .catch(err => console.log(err)),
            {
                refreshInterval: 10000,
            }
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const changeStatus = async({setLoading, setShowEditModal, setRemarks, setSelectedIsPaid, ...props}) => {

        await csrf()

        axios.post('/admin/changeStatus', props)
            .then(res => {
                console.log(res)
                mutate()
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: "Success Change Status",
                        icon: 'success'
                    })
                    setRemarks("")
                    setSelectedIsPaid(null)
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