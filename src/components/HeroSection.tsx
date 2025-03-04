import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Shield, Clock, Star, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-24 md:pt-28 md:pb-32">
          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Health Journey <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Connect with qualified healthcare professionals anytime, anywhere. 
                Get expert medical advice from the comfort of your home.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  onClick={() => navigate('/doctors')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white 
                           rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl 
                           hover:shadow-emerald-500/30 transition-all transform hover:scale-105 
                           active:scale-95 flex items-center gap-2"
                >
                  Find a Doctor
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/subscriptions')}
                  className="px-8 py-4 bg-white text-gray-700 rounded-xl shadow-lg hover:shadow-xl 
                           transition-all transform hover:scale-105 active:scale-95 
                           flex items-center gap-2"
                >
                  View Plans
                  <Shield className="w-5 h-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900">100+</div>
                  <div className="text-sm text-gray-600">Expert Doctors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                  <div className="text-sm text-gray-600">User Rating</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                           rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=800&h=600"
                alt="Doctor with patient"
                className="relative rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 
                         transition-transform duration-500"
              />

              {/* Feature Cards */}
              <div className="absolute -right-8 top-8 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Expert Care</div>
                    <div className="text-sm text-gray-600">Verified Doctors</div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-8 bottom-8 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">24/7 Access</div>
                    <div className="text-sm text-gray-600">Always Available</div>
                  </div>
                </div>
              </div>

              {/* Rating Card */}
              <div className="absolute -bottom-4 right-12 bg-white px-4 py-2 rounded-full shadow-lg 
                           flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="font-medium text-gray-900">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}