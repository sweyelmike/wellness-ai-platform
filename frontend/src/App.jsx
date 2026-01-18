import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <--- IMPORTED BACK

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot'; 
import ProfileSetup from './pages/ProfileSetup';
import Schedule from './pages/Schedule'; 

function App() {
  return (
    <AuthProvider> {/* <--- WRAPPED EVERYTHING HERE */}
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;