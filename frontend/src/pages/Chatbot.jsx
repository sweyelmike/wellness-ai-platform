import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaMagic, FaHeartbeat, FaUtensils } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
// Import the helper functions from your fixed api.js
import { getChatHistory, getDashboard, chatWithAI } from '../api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("User");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      // 1. Fetch History using the API function
      const res = await getChatHistory();
      setMessages(res.data);
      
      // 2. Fetch Profile Name using the API function
      const profRes = await getDashboard();
      setUserName(profRes.data.user_name);

    } catch (err) {
      console.error("Failed to load data");
      // Optional: if token is invalid, redirect to login
      // navigate('/'); 
    }
  };

  const sendMessage = async (e, customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    // Add User Message to UI instantly
    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 3. Send Message using the API function
      const res = await chatWithAI(textToSend);
      
      const aiMsg = { role: 'model', content: res.data.response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "I'm having trouble connecting right now." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex bg-gray-50 h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 ml-20 md:ml-64 flex flex-col h-screen relative bg-white">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          
          {messages.length === 0 ? (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center text-center opacity-0 animate-fade-in" style={{animation: 'fadeIn 0.5s forwards', opacity: 1}}>
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                 <FaRobot className="text-white text-4xl" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Hi {userName},</h1>
              <h2 className="text-2xl md:text-3xl text-gray-500 font-light mb-8">Ready to achieve wellness?</h2>
              
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => sendMessage(null, "I need a motivation boost")} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition flex items-center gap-2">
                  <FaMagic /> Need a boost?
                </button>
                <button onClick={() => sendMessage(null, "Give me a healthy dinner idea")} className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition flex items-center gap-2">
                  <FaUtensils /> Healthy Recipes
                </button>
                <button onClick={() => sendMessage(null, "How to reduce stress?")} className="px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-100 transition flex items-center gap-2">
                  <FaHeartbeat /> Reduce Stress
                </button>
              </div>
            </div>
          ) : (
            // Message List
            <div className="max-w-3xl mx-auto space-y-6 pb-24">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && <div className="text-gray-400 text-sm italic ml-4">AI is typing...</div>}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center">
          <form onSubmit={sendMessage} className="w-full max-w-3xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full p-2 flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your health..."
              className="flex-1 bg-transparent border-none outline-none px-6 text-gray-700 placeholder-gray-400"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              <FaPaperPlane className="ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;