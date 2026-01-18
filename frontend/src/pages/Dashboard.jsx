import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaFire, FaHeart, FaMoon, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock Calendar Data for the "Calendar" requirement
  const upcomingAppointments = [
    { date: "Jan 20", title: "General Checkup", time: "10:00 AM" },
    { date: "Jan 24", title: "Dentist", time: "2:30 PM" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Safe data access
  const userName = data?.user_name || "User";
  const steps = data?.metrics?.steps || 0;
  const heartRate = data?.metrics?.heart_rate || 0;
  const sleep = data?.metrics?.sleep_hours || 0;

  // Chart Configuration (Matches the blue line graph in image)
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Heart Rate',
      data: [70, 72, 68, 74, 71, 75, heartRate], // Uses real heart rate as last point
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4, // Makes the line curved/smooth
      fill: true,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { display: false }, x: { grid: { display: false } } }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50">Loading WellnessAI...</div>;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-20 md:ml-64 p-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white p-2 rounded-full shadow-sm flex items-center w-64">
            <FaSearch className="text-gray-400 ml-2" />
            <input type="text" placeholder="Search anything..." className="ml-2 outline-none w-full text-sm" />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 bg-white rounded-full shadow-sm text-gray-500 relative">
              <FaBell />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/profile-setup')}>
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Metrics) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Welcome Banner */}
            <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden flex items-center justify-between shadow-lg shadow-blue-200">
              <div className="relative z-10">
                <div className="text-yellow-300 text-3xl mb-2">☀️</div>
                <h2 className="text-3xl font-bold mb-2">Hello, {userName}!</h2>
                <p className="text-blue-100 mb-6">It's time for your daily wellness checkup.</p>
                <button onClick={() => navigate('/chat')} className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition">Check Now</button>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-blue-500 rounded-full opacity-50"></div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Steps Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FaFire size={20}/></div>
                </div>
                <h3 className="text-gray-500 text-sm">Steps Taken</h3>
                <p className="text-2xl font-bold">{steps}</p>
              </div>

              {/* Heart Rate Card */}
              <div className="bg-blue-500 p-6 rounded-2xl shadow-lg shadow-blue-200 text-white">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-white/20 rounded-xl"><FaHeart size={20}/></div>
                </div>
                <h3 className="text-blue-100 text-sm">Heart Rate</h3>
                <p className="text-2xl font-bold">{heartRate} BPM</p>
              </div>

               {/* Sleep Card */}
               <div className="bg-teal-400 p-6 rounded-2xl shadow-lg shadow-teal-200 text-white">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-white/20 rounded-xl"><FaMoon size={20}/></div>
                </div>
                <h3 className="text-teal-100 text-sm">Sleep</h3>
                <p className="text-2xl font-bold">{sleep} hrs</p>
              </div>
            </div>

            {/* Graph Area */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Activity Trend</h3>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Right Column (Side Widgets) */}
          <div className="space-y-6">
            
            {/* Calendar / Appointments Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-4">Appointments</h3>
              <div className="space-y-4">
                {upcomingAppointments.map((appt, idx) => (
                  <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition">
                    <div className="bg-white text-center px-3 py-1 rounded-lg shadow-sm mr-3">
                      <div className="text-xs text-gray-500 uppercase">{appt.date.split(' ')[0]}</div>
                      <div className="font-bold text-blue-600">{appt.date.split(' ')[1]}</div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{appt.title}</div>
                      <div className="text-xs text-gray-400">{appt.time}</div>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-2 py-2 text-blue-500 text-sm font-medium hover:bg-blue-50 rounded-lg">
                  + Add New
                </button>
              </div>
            </div>

            {/* AI Teaser Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
              <div className="flex items-center mb-3">
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">🤖</div>
                 <div>
                   <h3 className="font-bold">Wellness AI</h3>
                   <p className="text-xs text-green-500">Online</p>
                 </div>
              </div>
              <div className="bg-gray-100 p-3 rounded-xl rounded-tl-none text-sm text-gray-600 mb-3">
                Need a quick wellness tip? I'm here!
              </div>
              <button 
                onClick={() => navigate('/chat')}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium shadow-md shadow-blue-200 hover:bg-blue-700 transition"
              >
                Chat Now
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;