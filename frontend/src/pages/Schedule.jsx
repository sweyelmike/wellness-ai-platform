import React from 'react';
import Sidebar from '../components/Sidebar';

const Schedule = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-20 md:ml-64 p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Calendar & Appointments</h1>
        <p className="text-gray-500 text-lg">This feature is coming soon!</p>
        <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <p>📅 You will be able to mark healthcare dates here.</p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;