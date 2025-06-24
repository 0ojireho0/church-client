import Axios from "axios";
const isProd = process.env.NODE_ENV === 'production'

const axios = Axios.create({
    baseURL: isProd ? process.env.NEXT_PUBLIC_PROD_API_KEY : process.env.NEXT_PUBLIC_API_KEY,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

export default axios