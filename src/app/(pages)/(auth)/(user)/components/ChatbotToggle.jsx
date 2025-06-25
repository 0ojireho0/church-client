'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaXmark } from "react-icons/fa6";
import { SyncLoader } from 'react-spinners';
import { useChatBot } from '@/app/hooks/chatbot';

function ChatbotToggle() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome to ChurchConnect! ✟" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatError, setChatError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { chatBot } = useChatBot({});
  const messagesEndRef = useRef(null); // Ref to last message

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!chatInput) {
      setChatError(true);
      return;
    }

    setChatError(false);
    setIsLoading(true);

    const userMessage = { sender: "user", text: chatInput };
    const loadingMessage = {
      sender: "bot",
      text: (
        <div className="bg-red-100 p-2 rounded-lg inline-block">
          <SyncLoader size={8} color="#F88379" />
        </div>
      )
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setChatInput("");

    chatBot({
      chatInput,
      setMessages,
      setIsLoading
    });
  };

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
              onClick={() => setIsChatOpen(false)}
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
                {typeof msg.text === 'string' ? msg.text : <>{msg.text}</>}
              </div>
            ))}
            {/* Scroll target */}
            <div ref={messagesEndRef} />
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
              disabled={isLoading}
            />
            {chatError && (
              <h1 className="text-center text-sm text-red-600 font-bold">
                Please enter a message before sending.
              </h1>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotToggle;
