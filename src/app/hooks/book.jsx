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

    const {data: calendar, error: errorCalendar, mutate:mutateCalendar} = useSWR(`/api/show-all-book/${church_id || 0}`, () => 
        axios
            .get(`/admin/show-all-book/${church_id || 0}`)
            .then(res => res.data)
    )

    const {data: event, error: errorEvent, mutate:mutateEvent} = useSWR(`/api/show-all-event/${church_id || 0}`, () => 
        axios
            .get(`/admin/show-all-event/${church_id || 0}`)
            .then(res => res.data)
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const baptismBook = async({
        reset,
        setLoading,
        setSelectedPayment,
        setSelectedDate,
        setSelectedTime,
        setLoadingDone,
        setShowOnlinePaymentModal,
        setFiles,
        ...props
    }) => {
        await csrf()

        const isFormData = props?.formData instanceof FormData
        const dataToSend = isFormData ? props.formData : props

        axios.post('api/book-baptism', dataToSend, {
            headers: isFormData ? {
                'Content-Type': 'multipart/form-data'
            } : {}
        })
        .then(res => {
            Swal.fire({
                title: "Success",
                text: `Submit Successfully, your reference number is ${res.data.ref_num}`,
                icon: "success"
            })

            reset({ dob: null }) // reset specific fields
            localStorage.removeItem('baptism_form')
            setSelectedPayment(null)
            setSelectedDate(null)
            setSelectedTime(null)
            setFiles([])
        })
        .catch(err => {
            console.error(err)
            Swal.fire({
                title: "Error",
                text: err?.response?.data?.message || "Submission failed.",
                icon: "error"
            })
        })
        .finally(() => {
            setLoading(false)
            setLoadingDone(false)
            setShowOnlinePaymentModal(false)
        })
    }


    const weddingBook = async({reset, setLoading, setSelectedPayment, setWeddingSelectedDate, setWeddingSelectedTime, setRehearsalSelectedDate, setRehearsalSelectedTime, setLoadingDone, setShowOnlinePaymentModal, setFiles, ...props}) => {
        await csrf()

        const isFormData = props?.formData instanceof FormData
        const dataToSend = isFormData ? props.formData : props

        axios.post('/api/book-wedding', dataToSend, {
            headers: isFormData ? {
                'Content-Type': 'multipart/form-data'
            } : {}
        })
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
                    localStorage.removeItem('wedding_form')
                    setSelectedPayment(null)
                    setWeddingSelectedDate(null)
                    setWeddingSelectedTime(null)
                    setRehearsalSelectedDate(null)
                    setRehearsalSelectedTime(null)
                    setFiles([])
                }
                console.log(res)
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
                setLoadingDone(false)
                setShowOnlinePaymentModal(false)
            })
            
    }

    const memorialBook = async({reset, setLoading, setSelectedPayment, setSelectedDate, setSelectedTime, setLoadingDone, setShowOnlinePaymentModal, setFiles, ...props}) => {
        await csrf()

        const isFormData = props?.formData instanceof FormData
        const dataToSend = isFormData ? props.formData : props
        axios.post('api/book-memorial', dataToSend, {
            headers: isFormData ? {
                'Content-Type': 'multipart/form-data'
            } : {}
        })
            .then(res => {
                // console.log(res)
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
                    localStorage.removeItem('memorial_form')
                    setSelectedPayment(null)
                    setSelectedDate(null)
                    setSelectedTime(null)
                    setFiles([])
                }
                mutate()
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
                setLoadingDone(false)
                setShowOnlinePaymentModal(false)
            })
    }

    const confirmationBook = async({reset, setLoading, setSelectedPayment, setSelectedDate, setSelectedTime, setLoadingDone, setShowOnlinePaymentModal, setFiles, ...props}) => {
        await csrf()

        const isFormData = props?.formData instanceof FormData
        const dataToSend = isFormData ? props.formData : props
        axios.post('api/book-confirmation', dataToSend, {
            headers: isFormData ? {
                'Content-Type': 'multipart/form-data'
            } : {}
        })
            .then(res => {
                // console.log(res)
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: `Submit Successfully, your reference number is ${res.data.ref_num}`,
                        icon: "success"
                    })
                    reset({
                        dob: null, 

                    });
                    localStorage.removeItem('confirmation_form')
                    setSelectedPayment(null)
                    setSelectedDate(null)
                    setSelectedTime(null)
                    setFiles([])
                }
                mutate()
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
                setLoadingDone(false)
                setShowOnlinePaymentModal(false)
            })
    }

    const massBook = async({reset, setLoading, setSelectedPayment, setSelectedDate, setSelectedTime, setSelectService, setLoadingDone, setShowOnlinePaymentModal, setFiles, ...props}) => {
        await csrf()

        const isFormData = props?.formData instanceof FormData
        const dataToSend = isFormData ? props.formData : props
        axios.post('api/book-mass', dataToSend, {
            headers: isFormData ? {
                'Content-Type': 'multipart/form-data'
            } : {}
        })
            .then(res => {
                // console.log(res)
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: `Submit Successfully, your reference number is ${res.data.ref_num}`,
                        icon: "success"
                    })
                    localStorage.removeItem('mass_form')
                    reset();
                    setSelectedPayment(null)
                    setSelectedDate(null)
                    setSelectedTime(null)
                    setSelectService(null)
                    setFiles([])
                }
                mutate()
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
                setLoadingDone(false)
                setShowOnlinePaymentModal(false)
            })
    }

    const requestCertificate = async({setLoading, setLoadingDone, reset, setShowOnlinePaymentModal, setSelectedPayment, setSelectedOptions, ...props}) => {

        const isFormData = props?.formData instanceof FormData
        const dataToSend = isFormData ? props.formData : props
        
        await csrf()

        axios.post('api/request-certificate', dataToSend, {
            headers: isFormData ? {
                'Content-Type' : 'multipart/form-data'
            } : {}
        })
        .then(res => {
             if(res.status === 200){
                 console.log(res)
                 Swal.fire({
                     title: "Success",
                     text: `Submit Successfully, your reference number is ${res.data.ref_num}`,
                     icon: "success"
                 })
                 setSelectedPayment(null)
                 setSelectedOptions([])
                 reset()
             }
            // console.log(res)
         })
         .catch(err => {
             // console.log(err)
         })
         .finally(() => {
             setLoading(false)
             setLoadingDone(false)
             setShowOnlinePaymentModal(false)
         })




        // axios.post('api/request-certificate', props)
        //     .then(res => {
        //         if(res.status === 200){
        //             console.log(res)
        //             Swal.fire({
        //                 title: "Success",
        //                 text: `Submit Successfully, your reference number is ${res.data.ref_num}`,
        //                 icon: "success"
        //             })
        //             setSelectedPayment(null)
        //             setSelectedOptions([])
        //             reset()
        //         }
        //     })
        //     .catch(err => {
        //         // console.log(err)
        //     })
        //     .finally(() => {
        //         setLoading(false)
        //         setLoadingDone(false)
        //         setShowOnlinePaymentModal(false)
        //     })
    }

    const walkinMass = async({setLoading, reset, setSelectedPayment, setSelectedDate, setSelectedTime, setSelectService, ...props}) => {
        await csrf()

        axios.post('admin/walkin-mass', props)
            .then(res => {
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: `Submit Successfully, your reference number is ${res.data.result.reference_num}`,
                        icon: "success"
                    })
                    reset();
                    setSelectedPayment(null)
                    setSelectedDate(null)
                    setSelectedTime(null)
                    setSelectService(null)
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const walkinBaptism = async({setLoading, reset, setSelectedPayment, setSelectedDate, setSelectedTime, ...props}) => {
        await csrf()

        axios.post('admin/walkin-baptism', props)
            .then(res => {
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: `Submit Successfully, your reference number is ${res.data.result.reference_num}`,
                        icon: "success"
                    })
                    reset();
                    setSelectedPayment(null)
                    setSelectedDate(null)
                    setSelectedTime(null)
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    const walkinWedding = async({reset, setLoading, setSelectedPayment, setWeddingSelectedDate, setWeddingSelectedTime, setRehearsalSelectedDate, setRehearsalSelectedTime, ...props}) => {
        await csrf()

        axios.post('admin/walkin-wedding', props)
            .then(res => {
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: `Submit Successfully, your reference number is ${res.data.result.reference_num}`,
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
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const walkinMemorial = async({setLoading, reset, setSelectedPayment, setSelectedDate, setSelectedTime, ...props}) => {
        await csrf()

        axios.post('admin/walkin-memorial', props)
            .then(res => {
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: `Submit Successfully, your reference number is ${res.data.result.reference_num}`,
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
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const walkinConfirmation = async({setLoading, reset, setSelectedPayment, setSelectedDate, setSelectedTime, ...props}) => {
        await csrf()

        axios.post('admin/walkin-confirmation', props)
            .then(res => {
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: `Submit Successfully, your reference number is ${res.data.result.reference_num}`,
                        icon: "success"
                    })
                    reset({
                        dob: null, 
                    });
                    setSelectedPayment(null)
                    setSelectedDate(null)
                    setSelectedTime(null)
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return{
        book,
        calendar,
        event,
        baptismBook,
        weddingBook,
        memorialBook,
        confirmationBook,
        massBook,
        requestCertificate,
        walkinMass,
        walkinBaptism,
        walkinWedding,
        walkinMemorial,
        walkinConfirmation
    }

}