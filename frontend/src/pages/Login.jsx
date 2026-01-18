import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(data);
      loginUser(res.data.access_token);
      navigate('/dashboard'); // Or profile-setup if first time logic added
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full border p-2 rounded" type="email" placeholder="Email" onChange={(e) => setData({ ...data, email: e.target.value })} required />
          <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={(e) => setData({ ...data, password: e.target.value })} required />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        </form>
        <div className="mt-4 text-center">
            <Link to="/register" className="text-blue-500">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;