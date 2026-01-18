import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: '', email: '', password: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(data);
      alert('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Join WellnessAI</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Full Name" onChange={(e) => setData({ ...data, name: e.target.value })} required />
          <input className="w-full border p-2 rounded" type="email" placeholder="Email" onChange={(e) => setData({ ...data, email: e.target.value })} required />
          <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={(e) => setData({ ...data, password: e.target.value })} required />
          <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Sign Up</button>
        </form>
        <div className="mt-4 text-center">
            <Link to="/" className="text-blue-500">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;