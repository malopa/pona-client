import React, { useState } from 'react';
import { Shield, CreditCard, Check, Star, Video, Phone, Clock, Calendar } from 'lucide-react';
import { countryPricing } from '../components/booking/pricingData';
import PaymentModal from '../components/subscription/PaymentModal';

// Reordered countries with flags
const countries = [
  { code: 'South Africa', name: 'South Africa', flag: '🇿🇦' },
  { code: 'Tanzania', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'Kenya', name: 'Kenya', flag: '🇰🇪' },
  { code: 'Rwanda', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'Uganda', name: 'Uganda', flag: '🇺🇬' },
  { code: 'Burundi', name: 'Burundi', flag: '🇧🇮' },
  { code: 'USA', name: 'USA', flag: '🇺🇸' },
  { code: 'UK', name: 'UK', flag: '🇬🇧' },
  { code: 'Germany', name: 'Germany', flag: '🇩🇪' },
  { code: 'UAE', name: 'UAE', flag: '🇦🇪' }
];

// Coming soon countries
const comingSoonCountries = ['USA', 'UK', 'UAE', 'Germany'];

// Package details with call distribution
const packageDetails = {
  '15': {
    general: {
      phone: 9,
      video: 6,
      features: [
        'Access to General Practitioners',
        'Flexible scheduling',
        'Follow-up consultations',
        'Digital prescriptions',
        '24/7 emergency support'
      ]
    },
    specialist: {
      phone: 9,
      video: 6,
      features: [
        'Access to Specialist Doctors',
        'Priority scheduling',
        'Detailed medical reports',
        'Specialist referrals',
        'Complex case management'
      ]
    }
  },
  '30': {
    general: {
      phone: 20,
      video: 10,
      features: [
        'All features of 15-call package',
        'Family member coverage',
        'Health monitoring',
        'Preventive care advice',
        'Wellness programs'
      ]
    },
    specialist: {
      phone: 20,
      video: 10,
      features: [
        'All features of 15-call package',
        'Multi-specialty access',
        'Chronic disease management',
        'Regular health assessments',
        'Priority emergency care'
      ]
    }
  }
};

export default function SubscriptionsPage() {
  const [selectedCountry, setSelectedCountry] = useState('Tanzania');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ type: '', doctorType: '', amount: '' });

  const pricing = countryPricing[selectedCountry];
  const isComingSoon = comingSoonCountries.includes(selectedCountry);

  const handleSubscribe = (type: string, doctorType: string) => {
    const amount = doctorType === 'specialist' 
      ? (type === '15' ? pricing.specialistSubscription15 : pricing.specialistSubscription30)
      : (type === '15' ? pricing.subscription15 : pricing.subscription30);

    setSelectedPlan({ type, doctorType, amount });
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Healthcare Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to quality healthcare with our flexible subscription plans
          </p>
        </div>

        {/* Country Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {countries.map(({ code, name, flag }) => (
            <button
              key={code}
              onClick={() => setSelectedCountry(code)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300
                transform hover:scale-105 active:scale-95
                ${selectedCountry === code
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
                }`}
            >
              <span className="text-xl">{flag}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>

        {isComingSoon ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto
                       animate-fade-in overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
            <div className="relative">
              <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 
                           bg-clip-text text-transparent mb-4">
                Coming Soon to {selectedCountry}!
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                We're expanding our healthcare network to bring you the best medical care in {selectedCountry}. 
                Stay tuned for updates!
              </p>
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 
                             rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl 
                             hover:shadow-emerald-500/30 transition-all transform hover:scale-105">
                Notify Me When Available
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* General Practitioner Plans */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">General Practitioner</h2>
                  <p className="text-emerald-50">Quality care from experienced doctors</p>
                </div>

                {/* 15 Calls Package */}
                <div className="p-6 space-y-6">
                  <div className="space-y-6">
                    <div className="p-6 border border-emerald-100 rounded-xl hover:border-emerald-500 
                                transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">15 Calls Package</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-emerald-500" />
                              <span>{packageDetails['15'].general.phone} phone calls</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Video className="w-4 h-4 text-emerald-500" />
                              <span>{packageDetails['15'].general.video} video calls</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600 group-hover:scale-110 
                                      transition-transform">
                            {pricing.symbol}{pricing.subscription15}
                          </div>
                          <div className="text-sm text-gray-500">per month</div>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {packageDetails['15'].general.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600">
                            <Check className="w-5 h-5 text-emerald-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleSubscribe('15', 'general')}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white 
                               py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl 
                               hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]
                               active:scale-98"
                      >
                        Subscribe Now
                      </button>
                    </div>

                    {/* 30 Calls Package */}
                    <div className="p-6 border border-emerald-100 rounded-xl hover:border-emerald-500 
                                transition-colors group relative overflow-hidden">
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 
                                  text-white px-3 py-1 rounded-full text-xs font-medium">
                        Best Value
                      </div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">30 Calls Package</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-emerald-500" />
                              <span>{packageDetails['30'].general.phone} phone calls</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Video className="w-4 h-4 text-emerald-500" />
                              <span>{packageDetails['30'].general.video} video calls</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600 group-hover:scale-110 
                                      transition-transform">
                            {pricing.symbol}{pricing.subscription30}
                          </div>
                          <div className="text-sm text-gray-500">per month</div>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {packageDetails['30'].general.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600">
                            <Check className="w-5 h-5 text-emerald-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleSubscribe('30', 'general')}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white 
                               py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl 
                               hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]
                               active:scale-98"
                      >
                        Subscribe Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialist Plans */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-6 h-6 text-yellow-300 fill-current" />
                    <h2 className="text-2xl font-bold">Specialist Doctor</h2>
                  </div>
                  <p className="text-purple-50">Premium care from certified specialists</p>
                </div>

                {/* 15 Calls Package */}
                <div className="p-6 space-y-6">
                  <div className="space-y-6">
                    <div className="p-6 border border-purple-100 rounded-xl hover:border-purple-500 
                                transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">15 Calls Package</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-purple-500" />
                              <span>{packageDetails['15'].specialist.phone} phone calls</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Video className="w-4 h-4 text-purple-500" />
                              <span>{packageDetails['15'].specialist.video} video calls</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600 group-hover:scale-110 
                                      transition-transform">
                            {pricing.symbol}{pricing.specialistSubscription15}
                          </div>
                          <div className="text-sm text-gray-500">per month</div>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {packageDetails['15'].specialist.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600">
                            <Check className="w-5 h-5 text-purple-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleSubscribe('15', 'specialist')}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white 
                               py-3 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-xl 
                               hover:shadow-purple-500/30 transition-all transform hover:scale-[1.02]
                               active:scale-98"
                      >
                        Subscribe Now
                      </button>
                    </div>

                    {/* 30 Calls Package */}
                    <div className="p-6 border border-purple-100 rounded-xl hover:border-purple-500 
                                transition-colors group relative overflow-hidden">
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 
                                  text-white px-3 py-1 rounded-full text-xs font-medium">
                        Best Value
                      </div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">30 Calls Package</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-purple-500" />
                              <span>{packageDetails['30'].specialist.phone} phone calls</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Video className="w-4 h-4 text-purple-500" />
                              <span>{packageDetails['30'].specialist.video} video calls</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600 group-hover:scale-110 
                                      transition-transform">
                            {pricing.symbol}{pricing.specialistSubscription30}
                          </div>
                          <div className="text-sm text-gray-500">per month</div>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {packageDetails['30'].specialist.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600">
                            <Check className="w-5 h-5 text-purple-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleSubscribe('30', 'specialist')}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white 
                               py-3 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-xl 
                               hover:shadow-purple-500/30 transition-all transform hover:scale-[1.02]
                               active:scale-98"
                      >
                        Subscribe Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPayment && (
          <PaymentModal
            country={selectedCountry}
            packageType={selectedPlan.type}
            doctorType={selectedPlan.doctorType}
            amount={selectedPlan.amount}
            onClose={() => setShowPayment(false)}
          />
        )}
      </div>
    </div>
  );
}