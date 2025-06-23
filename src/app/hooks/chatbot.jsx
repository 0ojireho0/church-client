import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'


export const useChatBot = ({} = {}) => {



    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const chatBot = async({setMessages, ...props}) => {
        await csrf()

        axios.post('api/chatbot', {
            message: props.chatInput
        })
        .then(res => {

            const botMessage = { sender: 'bot', text: (
                <>
                <div>
                    <h1>{res.data}</h1> {' '}

                </div>
                
            </>
            )  };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        })
        .catch(err => {
            console.log(err)
        })

    }


    return {
        chatBot
    }


}