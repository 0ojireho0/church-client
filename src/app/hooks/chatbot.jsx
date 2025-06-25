import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'


export const useChatBot = () => {
  const csrf = () => axios.get('/sanctum/csrf-cookie');

  const chatBot = async ({ chatInput, setMessages, setIsLoading }) => {
    await csrf();

    axios.post('api/chatbot', { message: chatInput })
      .then(res => {
        setMessages(prev => {
          // Remove the loader
          const withoutLoader = prev.filter(msg =>
            !(msg.sender === 'bot' && typeof msg.text !== 'string')
          );
          return [...withoutLoader, { sender: 'bot', text: res.data }];
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMessages(prev => [
          ...prev.filter(msg =>
            !(msg.sender === 'bot' && typeof msg.text !== 'string')
          ),
          { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' }
        ]);
        setIsLoading(false);
      });
  };

  return { chatBot };
};