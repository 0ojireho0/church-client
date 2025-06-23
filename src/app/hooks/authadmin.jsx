import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export const useAuthAdmin = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: admin, error, mutate } = useSWR('/api/admin/user-admin', () =>
        axios
            .get('/api/admin/user-admin')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const { data: allAdmin, error:errorAllAdmin, mutate: mutateAllAdmin } = useSWR('/api/admin/all-admin', () => 
        axios
            .get('api/admin/all-admin')
            .then(res => res.data)
            .catch(err => {
                console.log(err)
            })
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const registerAdmin = async ({ setErrors, setLoading, reset, ...props } = {}) => {

        setLoading(true)
        await csrf()

        setErrors([])

        axios
            .post('api/admin/register-admin', props)
            .then((res) => {
                if(res.status === 204){
                    Swal.fire({
                        title: "Success",
                        text: "Created Successfully",
                        icon: "success"
                    })
                    reset()
                    mutateAllAdmin()

                    return true
                }
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                Swal.fire({
                    title: "Failed",
                    text: error.response.data.message,
                    icon: "error"
                })
                setErrors(error.response.data.errors)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const loginAdmin = async ({ setErrors, setStatus, setLoading, ...props }) => {
        setLoading(true)
        await csrf()

        setErrors("")
        setStatus(null)

        axios
            .post('api/admin/login-admin', props)
            .then((res) => {
                if(res.status === 200){
                    window.location.href = res.data.redirect_to;
                    setLoading(false)
                }
                console.log(res)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setLoading(false)
                setErrors(error.response.data.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    // const forgotPassword = async ({ setErrors, setStatus, email }) => {
    //     await csrf()

    //     setErrors([])
    //     setStatus(null)

    //     axios
    //         .post('/forgot-password', { email })
    //         .then(response => setStatus(response.data.status))
    //         .catch(error => {
    //             if (error.response.status !== 422) throw error

    //             setErrors(error.response.data.errors)
    //         })
    // }

    // const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    //     await csrf()

    //     setErrors([])
    //     setStatus(null)

    //     axios
    //         .post('/reset-password', { token: params.token, ...props })
    //         .then(response =>
    //             router.push('/login?reset=' + btoa(response.data.status)),
    //         )
    //         .catch(error => {
    //             if (error.response.status !== 422) throw error

    //             setErrors(error.response.data.errors)
    //         })
    // }

    // const resendEmailVerification = ({ setStatus }) => {
    //     axios
    //         .post('/email/verification-notification')
    //         .then(response => setStatus(response.data.status))
    // }

    const logoutAdmin = async ({setLoading} = {}) => {
        if (!error) {
            await axios.post('api/admin/logout-admin')
                        .then(() => mutate())
                        .finally(() => {
                            setLoading(false)
                        })
        }

        window.location.pathname = '/admin/login'
    }


    const deleteAdmin = async({...props}) => {

        await csrf()

        axios
            .delete('api/admin/delete-admin', {
                data: props
            })
            .then(res => {
                console.log(res)
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: "Deleted Successfully",
                        icon: "success"
                    })
                    mutateAllAdmin()
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    const updateAdmin = async ({setEditUser, setLoading, ...props}) => {
        await csrf()

        axios
            .put('api/admin/update-admin', props)
            .then(res => {
                console.log(res)
                if(res.status === 200){
                    Swal.fire({
                        title: "Success",
                        text: "Updated Successfully",
                        icon: "success"
                    })
                    mutateAllAdmin()
                }
            })
            .catch(err => {
                if(err.response.status === 422){
                    Swal.fire({
                        title: "Failed",
                        text: `${err.response.data.message}`,
                        icon: 'error'
                    })
                }
            })
            .finally(() => {
                setEditUser(null)
                setLoading(false)
            })
    }

    useEffect(() => {
        // if (middleware === 'guest' && redirectIfAuthenticated && admin)
        //     router.push(redirectIfAuthenticated)

        // if (middleware === 'auth' && (user && !user.email_verified_at))
        //     router.push('/verify-email')
        
        // if (
        //     window.location.pathname === '/verify-email' &&
        //     user?.email_verified_at
        // )
        //     router.push(redirectIfAuthenticated)
        if (middleware === 'auth-admin' && error) logoutAdmin()
    }, [admin, error])

    return {
        admin,
        registerAdmin,
        loginAdmin,
        // forgotPassword,
        // resetPassword,
        // resendEmailVerification,
        logoutAdmin,
        allAdmin,
        deleteAdmin,
        updateAdmin
    }
}