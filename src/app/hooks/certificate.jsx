import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'


export const useCertificate = ({searchStatus} = {}) => {


    const {data: certificate, error, mutate} = useSWR(`/admin/show-certificate/${searchStatus || 0}`, () => 
        axios
            .get(`/admin/show-certificate/${searchStatus || 0}`)
            .then(res => res.data),
            {
                refreshInterval: 10000
            }
    )


    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const addNewCertificate = async({setFiles, setShowCertModal, setLoading, reset, ...props}) => {

        const isFormData = props?.formData instanceof FormData
        const dataToSend = isFormData ? props.formData : props

        await csrf()

        axios.post('admin/add-new-cert', dataToSend, {
            headers: isFormData ? {
                'Content-Type' : 'multipart/form-data'
            } : {}
        })
        .then(res => {
            if(res.status){
                Swal.fire({
                    title: "Success",
                    text: "Added Certificate Successfully",
                    icon: "success"
                })
                reset()
                setFiles([])
                mutate()
            }
            // console.log(res)
        })
        .catch(err => {
            if(err.status == 422){
                Swal.fire({
                    title: "Failed",
                    text: `${err.response.data.message}`,
                    icon: "error"
                })
            }
        })
        .finally(() => {
            setLoading(false)
            setShowCertModal(false)
        })

    }

    return {
        certificate,
        addNewCertificate
    }
}