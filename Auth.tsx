import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Mail, Phone, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

import { STATES, DISTRICTS } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('farmer');
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
    name: '',
    village: '',
    district: '',
    state: '',
    cropType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple user simulation using local storage
    const users = JSON.parse(localStorage.getItem('drought_pulse_users') || '[]');
    
    // Find user based on role: email for researcher, mobile for farmer
    const existingUser = users.find((u: any) => 
      role === 'researcher' ? u.email === formData.email : u.mobile === formData.mobile
    );

    if (isLogin) {
      if (existingUser) {
        onLogin(existingUser);
      } else {
        // For demo: create user if login fails (optional)
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: role === 'researcher' ? formData.email : undefined,
          mobile: role === 'farmer' ? formData.mobile : undefined,
          role: role,
          name: formData.name || 'User',
          location: role === 'farmer' ? {
            village: formData.village || 'Demo Village',
            district: formData.district || 'Demo District',
            state: formData.state || 'Rajasthan'
          } : undefined,
        };
        const updatedUsers = [...users, newUser];
        localStorage.setItem('drought_pulse_users', JSON.stringify(updatedUsers));
        onLogin(newUser);
      }
    } else {
      if (existingUser) {
        alert(`This ${role === 'researcher' ? 'email' : 'mobile'} is already registered. Please sign in.`);
        setIsLogin(true);
        return;
      }
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: role === 'researcher' ? formData.email : undefined,
        mobile: role === 'farmer' ? formData.mobile : undefined,
        role: role,
        name: formData.name,
        location: role === 'farmer' ? {
          village: formData.village || 'Demo Village',
          district: formData.district || 'Demo District',
          state: formData.state || 'Rajasthan'
        } : undefined,
        cropType: role === 'farmer' ? formData.cropType : undefined
      };
      
      const updatedUsers = [...users, newUser];
      localStorage.setItem('drought_pulse_users', JSON.stringify(updatedUsers));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 mt-2">
            Join the Pulse for drought monitoring & alerts
          </p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
          <button
            onClick={() => setRole('farmer')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              role === 'farmer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            I am a Farmer
          </button>
          <button
            onClick={() => setRole('researcher')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              role === 'researcher' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            I am a Researcher
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {role === 'researcher' && (
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          )}

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              required
              placeholder="Mobile Number"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={formData.mobile}
              onChange={e => setFormData({ ...formData, mobile: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {role === 'farmer' && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Village"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition col-span-2"
                value={formData.village}
                onChange={e => setFormData({ ...formData, village: e.target.value })}
              />
              <select
                required
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value, district: '' })}
              >
                <option value="">Select State</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                required
                disabled={!formData.state}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:opacity-50"
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
              >
                <option value="">Select District</option>
                {(DISTRICTS[formData.state] || []).map(d => <option key={d} value={d}>{d}</option>)}
                {!DISTRICTS[formData.state] && formData.state && <option value="Other">Other</option>}
              </select>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Crop Type"
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition col-span-2"
                  value={formData.cropType}
                  onChange={e => setFormData({ ...formData, cropType: e.target.value })}
                />
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center group"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-medium hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
