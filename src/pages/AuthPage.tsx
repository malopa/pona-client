import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, UserPlus, Stethoscope, Shield } from 'lucide-react';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {getSpeciality,getCountry,addNewDoctor,getDoctors,deleteDoctor,login} from '../pages/api/api'


// const specialties = [
//   'General Practitioner',
//   'Cardiologist',
//   'Neurologist',
//   'Pediatrician',
//   'Gynecologist',
//   'Dermatologist',
//   'Orthopedic Surgeon',
//   'Oncologist',
//   'Endocrinologist',
//   'Psychiatrist',
//   'Pulmonologist',
//   'Gastroenterologist',
//   'Ophthalmologist',
//   'ENT Specialist',
//   'Urologist',
//   'Rheumatologist',
//   'Nephrologist',
//   'Hematologist',
//   'Family Medicine',
//   'Internal Medicine'
// ];

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDoctor = location.search.includes('role=doctor');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // alert(isDoctor)
  
    const {data:specialties} = useQuery({queryKey:['speciality'],queryFn:async ()=> getSpeciality()})
    // const {data:countries} = useQuery({queryKey:['countries'],queryFn:async ()=> getCountry()})
  

  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialty: '',
    experience: '',
    license: '',
    bio: '',
    role:isDoctor?'docotr':'patient'
  });



  const loginMutation = useMutation({
    mutationFn:login,onSuccess:(data)=>{
      // alert(JSON.stringify(data))
     

      if(data?.status){
          localStorage.setItem(isDoctor ? 'doctorAuth' : 'userAuth', 'true');
          localStorage.setItem('userAuth', 'true');
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem(isDoctor ? 'doctorAuth' : 'userAuth', 'true');
          navigate(isDoctor ? '/doctor/dashboard?tab=application' : '/');
        }

    }
  })


   const mutation = useMutation({
      mutationFn:addNewDoctor,onSuccess:(data)=>{
        if(data?.status){
          setIsLogin(true)
          // return;
        }
        // return;


      }
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {

        loginMutation.mutate({username:formData.email,password:formData.password})
        // Sign in
        // const { data, error: signInError } = await supabase.auth.signInWithPassword({
        //   email: formData.email,
        //   password: formData.password
        // });


        // if (signInError) throw signInError;

        // Verify if user is a doctor when logging into doctor portal
        // if (isDoctor) {
        //   const { data: doctorData, error: doctorError } = await supabase
        //     .from('doctors')
        //     .select('*')
        //     .eq('id', data.user.id)
        //     .single();

        //   if (doctorError || !doctorData) {
        //     throw new Error('Unauthorized access. Please sign in with a doctor account.');
        //   }
        // }
      } else {
        // Sign up
        mutation.mutate({...formData,year_of_experience:formData.experience})

        // const { data, error: signUpError } = await supabase.auth.signUp({
        //   email: formData.email,
        //   password: formData.password,
        //   options: {
        //     data: {
        //       full_name: formData.name,
        //       role: isDoctor ? 'doctor' : 'patient'
        //     }
        //   }
        // });

        // if (signUpError) throw signUpError;

        // if (isDoctor) {
          // Create doctor profile
          // const { error: doctorError } = await supabase
          //   .from('doctors')
          //   .insert([{
          //     id: data.user?.id,
          //     specialty: formData.specialty,
          //     experience_years: parseInt(formData.experience),
          //     license_number: formData.license,
          //     bio: formData.bio,
          //     is_verified: false
          //   }]);

          // if (doctorError) throw doctorError;

          // Create doctor application
        //   const { error: applicationError } = await supabase
        //     .from('doctor_applications')
        //     .insert([{
        //       doctor_id: data.user?.id,
        //       status: 'pending'
        //     }]);

        //   if (applicationError) throw applicationError;
        // }

        // localStorage.setItem(isDoctor ? 'doctorAuth' : 'userAuth', 'true');
        // navigate(isDoctor ? '/doctor/dashboard?tab=application' : '/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex">
      {/* Left Column - Welcome Message */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center">
        <Logo className="h-16 w-16 mb-8 text-emerald-500" />
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {isDoctor ? (
            "Join Our Network of Healthcare Professionals"
          ) : (
            "Your Health Journey Starts Here"
          )}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {isDoctor ? (
            "Make a difference in patients' lives through telemedicine. Join our platform to provide quality healthcare remotely."
          ) : (
            "Access quality healthcare from the comfort of your home. Connect with experienced doctors anytime, anywhere."
          )}
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Stethoscope className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              {isDoctor ? "Impact Lives" : "Quality Care"}
            </h3>
            <p className="text-gray-600">
              {isDoctor 
                ? "Reach more patients and provide care without geographical limitations."
                : "Connect with verified healthcare professionals for personalized care."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Shield className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              {isDoctor ? "Flexible Practice" : "Secure Platform"}
            </h3>
            <p className="text-gray-600">
              {isDoctor
                ? "Manage your practice with our easy-to-use platform and tools."
                : "Your health data is protected with industry-standard security."}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? `Sign in to continue to ${isDoctor ? 'Doctor Portal' : 'Pona Health'}`
                : `Join Pona Health as a ${isDoctor ? 'Doctor' : 'Patient'}`
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
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
            )}

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

            {!isLogin && isDoctor && (
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
                    {specialties?.map(specialty => (
                      <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
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
                  {isLogin ? 'Sign In' : 'Create Account'}
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