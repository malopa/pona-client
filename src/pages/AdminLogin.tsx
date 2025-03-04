import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import {login} from './api/api'

export default function AdminLogin() {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // alert(JSON.stringify({username:credentials.username,password:credentials.password}))
    const responses = await login({username:credentials.username,password:credentials.password})
    // alert(JSON.stringify(responses))

    if (responses.status) {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('access', `${responses.access}`);
      localStorage.setItem('refresh', `${responses.refresh}`);
      localStorage.setItem('user_id', `${responses.user_id}`);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-fade-in">
        <div className="text-center mb-8">
          <Logo className="h-12 w-12 mx-auto mb-4 text-emerald-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white
                     py-2 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl
                     hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]
                     active:scale-98"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}