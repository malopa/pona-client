import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, UserPlus, Stethoscope, Phone } from 'lucide-react';
import Logo from '../Logo';
import { supabase } from '../../lib/supabase';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface AuthModalProps {
  onClose: () => void;
  onComplete: () => void;
  isDoctor?: boolean;
  redirectPath?: string;
}

const specialties = [
  'General Practitioner',
  'Cardiologist',
  'Neurologist',
  'Pediatrician',
  'Gynecologist',
  'Dermatologist',
  'Orthopedic Surgeon',
  'Oncologist',
  'Endocrinologist',
  'Psychiatrist',
  'Pulmonologist',
  'Gastroenterologist',
  'Ophthalmologist',
  'ENT Specialist',
  'Urologist',
  'Rheumatologist',
  'Nephrologist',
  'Hematologist',
  'Dentist'
];

export default function AuthModal({ onClose, onComplete, isDoctor = false, redirectPath }: AuthModalProps) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    license: '',
    bio: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isDoctor) {
        // For doctors, store their info and redirect to doctor dashboard
        const doctorData = {
          ...formData
        };
        localStorage.setItem('doctorData', JSON.stringify(doctorData));
        localStorage.setItem('doctorAuth', 'true');
        
        // Redirect to doctor dashboard based on platform
        if (isMobile) {
          window.location.href = '/doctor/mobile-dashboard';
        } else {
          navigate('/doctor/dashboard');
        }
      } else {
        // For patients, store basic info
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userData', JSON.stringify(formData));
        onComplete();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in relative">
        <div className="p-6">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          <div className="flex justify-center mb-6">
            <Logo className="h-12 w-12 text-emerald-500" />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isDoctor ? 'Join as a Doctor' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isDoctor 
                ? 'Fill in your details to join our medical network'
                : 'Join Pona Health and get access to quality healthcare'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {isDoctor && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your specialty</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white
                       py-2 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl
                       hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]
                       active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isDoctor ? 'Join as Doctor' : 'Create Account'}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-600 hover:text-emerald-500"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}