import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaCamera, FaSave, FaUserCircle } from 'react-icons/fa';
// Import the helper functions from your fixed api.js
import { getDashboard, saveProfile } from '../api';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    height_cm: '',
    weight_kg: '',
    gender: 'Not Specified',
    activity_level: 'Moderate',
    goal: 'General Wellness',
    name: 'User'
  });

  // Mock Profile Picture State
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    // 1. Fetch existing data using the API function
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        
        // Pre-fill form if data exists
        if (res.data.profile) {
          setFormData({
            ...res.data.profile,
            name: res.data.user_name
          });
        } else {
            setFormData(prev => ({...prev, name: res.data.user_name}));
        }
      } catch (err) {
        console.error("Error loading profile");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 2. Send the profile data using the API function
      // (This automatically handles the URL and Token)
      await saveProfile({
        age: parseInt(formData.age),
        height_cm: parseFloat(formData.height_cm),
        weight_kg: parseFloat(formData.weight_kg),
        gender: formData.gender,
        activity_level: formData.activity_level,
        goal: formData.goal
        // Note: 'name' is usually handled by the auth system, 
        // but if your backend supports updating it here, you can add it.
      });

      // Redirect to Dashboard after saving
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to save profile. Please check your numbers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <div className="flex-1 ml-20 md:ml-64 p-8 flex justify-center">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-lg p-8 h-fit">
          
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Profile</h2>

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-sm">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-300">
                    <FaUserCircle size={90} />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition">
                <FaCamera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
            <p className="text-gray-400 text-sm mt-2">Click camera to upload</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-600 text-sm font-bold mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  placeholder="Your Name"
                  required
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-gray-600 text-sm font-bold mb-2">Age</label>
                <input 
                  type="number" 
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="e.g. 25"
                  required
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-gray-600 text-sm font-bold mb-2">Height (cm)</label>
                <input 
                  type="number" 
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="e.g. 175"
                  required
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-gray-600 text-sm font-bold mb-2">Weight (kg)</label>
                <input 
                  type="number" 
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="e.g. 70"
                  required
                />
              </div>
            </div>

            {/* Gender Select */}
            <div>
              <label className="block text-gray-600 text-sm font-bold mb-2">Gender</label>
              <div className="flex space-x-4">
                {['Male', 'Female', 'Other'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({...formData, gender: g})}
                    className={`flex-1 py-3 rounded-xl font-medium transition ${
                      formData.gender === g 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <FaSave />
              {loading ? 'Saving Profile...' : 'Save & Update Dashboard'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;