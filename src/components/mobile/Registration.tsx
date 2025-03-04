import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, UserPlus, Stethoscope, Phone } from 'lucide-react';
import Logo from '../Logo';
import AuthService from '../../services/auth';

interface RegistrationProps {
  onComplete: (data: {
    name: string;
    email: string;
    phone: string;
    country: string;
    language: string;
  }) => void;
}

const countries = [
  { code: 'South Africa', name: 'South Africa', flag: '🇿🇦' },
  { code: 'Tanzania', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'Kenya', name: 'Kenya', flag: '🇰🇪' },
  { code: 'Uganda', name: 'Uganda', flag: '🇺🇬' },
  { code: 'Rwanda', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'Burundi', name: 'Burundi', flag: '🇧🇮' }
];

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' }
];

export default function Registration({ onComplete }: RegistrationProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('phone');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    language: '',
    password: '',
    specialty: '',
    experience: ''
  });

  useEffect(() => {
    const savedCredentials = AuthService.getSavedCredentials();
    if (savedCredentials) {
      setFormData(prev => ({
        ...prev,
        email: savedCredentials.email,
        password: savedCredentials.password
      }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!isLogin && !formData.phone) {
        throw new Error('Phone number is required');
      }

      if (!isLogin && signupMethod === 'email' && !formData.email) {
        throw new Error('Email is required when using email signup');
      }

      if ((loginMethod === 'phone' || signupMethod === 'phone') && !showVerification) {
        // Send verification code
        setShowVerification(true);
        // Simulate sending code
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      if (rememberMe) {
        AuthService.saveCredentials({
          email: formData.email,
          password: formData.password
        });
      } else {
        AuthService.removeSavedCredentials();
      }

      const token = 'dummy_jwt_token';
      AuthService.setToken(token);

      if (isDoctor) {
        localStorage.setItem('doctorAuth', 'true');
      } else {
        localStorage.setItem('userAuth', 'true');
      }

      // Store user data including country
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        language: formData.language
      };
      localStorage.setItem('userData', JSON.stringify(userData));

      onComplete(userData);
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginMethodToggle = () => (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setLoginMethod('phone')}
        className={`flex-1 py-2 rounded-lg transition-colors ${
          loginMethod === 'phone'
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <Phone className="w-4 h-4 inline-block mr-2" />
        Phone
      </button>
      <button
        onClick={() => setLoginMethod('email')}
        className={`flex-1 py-2 rounded-lg transition-colors ${
          loginMethod === 'email'
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <Mail className="w-4 h-4 inline-block mr-2" />
        Email
      </button>
    </div>
  );

  const renderSignupMethodToggle = () => (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setSignupMethod('phone')}
        className={`flex-1 py-2 rounded-lg transition-colors ${
          signupMethod === 'phone'
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <Phone className="w-4 h-4 inline-block mr-2" />
        Phone Only
      </button>
      <button
        onClick={() => setSignupMethod('email')}
        className={`flex-1 py-2 rounded-lg transition-colors ${
          signupMethod === 'email'
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <Mail className="w-4 h-4 inline-block mr-2" />
        With Email
      </button>
    </div>
  );

  const renderVerificationForm = () => (
    <div className="animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Enter Verification Code</h3>
      <p className="text-gray-600 mb-4">
        We've sent a verification code to your phone number
      </p>
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="Enter code"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
      />
      <button
        onClick={() => setShowVerification(false)}
        className="text-emerald-600 hover:text-emerald-700"
      >
        Resend Code
      </button>
    </div>
  );

  const renderAuthForm = () => (
    <div className="animate-fade-in">
      {/* Doctor/Patient Toggle */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setIsDoctor(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            !isDoctor 
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <UserPlus className="w-5 h-5" />
          I'm a Patient
        </button>
        <button
          onClick={() => setIsDoctor(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            isDoctor 
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Stethoscope className="w-5 h-5" />
          I'm a Doctor
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="text-gray-600">
          {isLogin 
            ? 'Sign in to continue to Pona Health'
            : `Join Pona Health as a ${isDoctor ? 'Doctor' : 'Patient'}`
          }
        </p>
      </div>

      {isLogin ? renderLoginMethodToggle() : renderSignupMethodToggle()}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!isLogin && (
          <>
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
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                  placeholder="+255 123 456 789"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </>
        )}

        {/* Show email field only if using email method */}
        {((loginMethod === 'email' && isLogin) || (signupMethod === 'email' && !isLogin)) && (
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
                required={loginMethod === 'email' || signupMethod === 'email'}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Show phone field for phone login */}
        {loginMethod === 'phone' && isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required={loginMethod === 'phone'}
                placeholder="+255 123 456 789"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {!isLogin && isDoctor && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required={isDoctor}
                placeholder="e.g., Cardiologist"
              />
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
                required={isDoctor}
                min="0"
              />
            </div>
          </>
        )}

        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Select a country</option>
                {countries.map(({ code, name, flag }) => (
                  <option key={code} value={code}>
                    {flag} {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Select a language</option>
                {languages.map(({ code, name, flag }) => (
                  <option key={code} value={code}>
                    {flag} {name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {!showVerification && (
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
        )}

        {isLogin && !showVerification && (
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-emerald-500 border-gray-300 rounded
                         focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-emerald-600 hover:text-emerald-500"
            >
              Forgot password?
            </button>
          </div>
        )}

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
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="flex justify-center mb-8">
          <Logo className="h-12 w-12 text-emerald-500" />
        </div>
        {showForgotPassword ? renderVerificationForm() : renderAuthForm()}
      </div>
    </div>
  );
}