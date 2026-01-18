import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../api'; // Use this to fetch name

const Welcome = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("User");

  useEffect(() => {
    // Quick fetch to get user name for personalization
    getDashboard()
      .then(res => setName(res.data.user_name))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6 animate-bounce">Welcome, {name}!</h1>
        <p className="text-xl mb-8 text-blue-100">
          Your personal AI wellness journey begins now. We have analyzed your profile 
          and your AI coach is ready to help you achieve your goals.
        </p>
        
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 mb-8">
          <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
          <ul className="text-left space-y-2 text-sm">
            <li>✅ Profile Created</li>
            <li>✅ BMI Calculated</li>
            <li>✅ AI Context Initialized</li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Welcome;