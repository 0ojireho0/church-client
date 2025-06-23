'use client'
import React, {useState} from 'react'
import { FaXmark } from "react-icons/fa6";

import { useChatBot } from '@/app/hooks/chatbot';

function ChatbotToggle() {
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [messages, setMessages] = useState([{
        sender: "bot",
        text: "Hello"
    }]);
    const [chatInput, setChatInput] = useState("");

    const { chatBot } = useChatBot({})


    const sendMessage = async() => {
        const userMessage = { sender: "user", text: chatInput };
        setMessages((prev) => [...prev, userMessage]);

        setChatInput("")

        chatBot({
            chatInput,
            setMessages
        })
    }


  return (
    <>
    <button 
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 p-4 cursor-pointer"
        onClick={() => setIsChatOpen(!isChatOpen)}
        >
      💬
    </button>
    {isChatOpen && (
            <div className="fixed bottom-20 right-4 bg-white w-72 h-96 rounded-lg shadow-lg flex flex-col md:w-80">
                {/* Chat Header */}
                <div className="flex items-center justify-between bg-blue-600 text-white p-3 rounded-t-lg">
                    <h3 className="text-lg font-semibold">ChurchConnect ChatBot</h3>
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="text-white hover:text-gray-200 focus:outline-none cursor-pointer"
                    >
                        <FaXmark />
                    </button>
                </div>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded-lg ${
                                msg.sender === "user"
                                    ? "bg-blue-100 self-end text-right"
                                    : "bg-red-100 text-left"
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
                {/* Chat Input */}
                <div className="p-3 border-t">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
            </div>
        )}
    
    
    </>
  )
}

export default ChatbotToggle
