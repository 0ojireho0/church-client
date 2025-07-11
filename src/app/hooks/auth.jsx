import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, setLoading, reset, setCleaveKey, ...props }) => {

        setLoading(true)
        await csrf()

        setErrors([])

        axios
            .post('/register', props)
            .then((res) => {
                if(res.status === 204){
                    Swal.fire({
                        title: "Success",
                        text: "Created Successfully!! Email Verification Sent",
                        icon: "success"
                    })
                    reset({
                        contact: ''
                    })
                    setCleaveKey(prev => prev + 1)
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

    const login = async ({ setErrors, setStatus, setLoading, ...props }) => {
        setLoading(true)
        await csrf()

        setErrors("")
        setStatus(null)

        axios
            .post('/login', props)
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

    const forgotPassword = async ({ setErrors, setStatus, email, setLoading }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => {
                Swal.fire({
                    title: "Success",
                    text: `${response.data.message}`,
                    icon: "success"
                })
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, setLoading, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: props.token, ...props })
            .then(res => {
                router.push('/login')
                Swal.fire({
                    title: "Success",
                    text: `${res.data.status}`,
                    icon: "success"
                })
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async ({setLoading} = {}) => {
        if (!error) {
            await axios.post('/logout')
                       .then(() => mutate())
                       .finally(() => {
                        setLoading(false)
                       })
        }

        window.location.pathname = '/login'
    }

    const editProfile = async({setCleaveKey, setLoading, reset, ...props}) => {
        // console.log(props)
        await csrf()

        axios.put('/api/edit-profile', props)
            .then(res => {
                console.log(res)

                if(res.data.requireReLogin){
                    Swal.fire({
                        title: "Success",
                        text: "Change Password Success, you need to login again.",
                        icon: "success"
                    })
                    window.location.href = "/login"
                    return
                }

                Swal.fire({
                    title: "Success",
                    text: `${res.data.message}`,
                    icon: "success"
                })


                mutate()
                // setCleaveKey(prev => prev + 1)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
        
            })


    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && (user && !user.email_verified_at))
            router.push('/verify-email')
        
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
        editProfile,
    }
}