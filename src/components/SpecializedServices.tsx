import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Activity, Droplet, Microscope, Clock, Shield, Phone, Video, Calendar, Users } from 'lucide-react';
import PaymentModal from './subscription/PaymentModal';
import { countryPricing } from './booking/pricingData';
import { doctorsData } from './FeaturedDoctors/doctorsData';
import { isSpecialist } from './utils/doctorUtils';
import { supabase } from '../lib/supabase';

const carePlans = [
  {
    id: 'family',
    title: 'Family Doctor Plan',
    icon: Users,
    colorFrom: 'from-emerald-500',
    colorTo: 'to-teal-600',
    colorBg: 'bg-emerald-400/30',
    description: 'Comprehensive healthcare for up to 5 family members',
    features: [
      'Coverage for up to 5 family members',
      'Shared pool of consultations',
      'Family health records',
      'Preventive care guidance',
      'Emergency support 24/7',
      'Regular health check-ups'
    ],
    includes: {
      video: 5,
      phone: 10
    },
    isFamily: true
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy Care Plan',
    icon: Heart,
    colorFrom: 'from-pink-500',
    colorTo: 'to-rose-500',
    colorBg: 'bg-pink-400/30',
    description: 'Comprehensive care throughout your pregnancy journey',
    features: [
      '5 scheduled video consultations',
      'Unlimited phone support',
      'Personalized pregnancy tracking',
      'Nutrition and exercise guidance',
      'Mental health support',
      'Birth plan assistance'
    ],
    includes: {
      video: 5,
      phone: 'Unlimited'
    }
  },
  {
    id: 'hypertension',
    title: 'Hypertension Care',
    icon: Activity,
    colorFrom: 'from-red-500',
    colorTo: 'to-rose-600',
    colorBg: 'bg-red-400/30',
    description: 'Dedicated support for blood pressure management',
    features: [
      'Weekly BP tracking & alerts',
      'Regular consultations',
      'Medication reminders',
      'Diet & lifestyle coaching',
      'Monthly progress reports'
    ],
    includes: {
      video: 5,
      phone: 10
    }
  },
  {
    id: 'diabetes',
    title: 'Diabetes Care',
    icon: Droplet,
    colorFrom: 'from-blue-500',
    colorTo: 'to-indigo-600',
    colorBg: 'bg-blue-400/30',
    description: 'Complete diabetes management support',
    features: [
      'Blood sugar monitoring',
      'Regular consultations',
      'Diabetes education program',
      'Diet planning assistance',
      'Exercise recommendations'
    ],
    includes: {
      video: 5,
      phone: 10
    }
  },
  {
    id: 'cancer',
    title: 'Cancer Care Support',
    icon: Microscope,
    colorFrom: 'from-purple-500',
    colorTo: 'to-indigo-600',
    colorBg: 'bg-purple-400/30',
    description: 'Supportive care for cancer patients',
    features: [
      'Regular oncologist consultations',
      'Treatment monitoring',
      'Pain management support',
      'Mental health counseling',
      'Nutrition guidance'
    ],
    includes: {
      video: 5,
      phone: 10
    }
  }
];

const countries = [
  { code: 'Tanzania', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'Kenya', name: 'Kenya', flag: '🇰🇪' },
  { code: 'Uganda', name: 'Uganda', flag: '🇺🇬' },
  { code: 'Rwanda', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'Burundi', name: 'Burundi', flag: '🇧🇮' },
  { code: 'South Africa', name: 'South Africa', flag: '🇿🇦' }
];

interface DoctorSelectionModalProps {
  country: string;
  plan: any;
  onClose: () => void;
}

const DoctorSelectionModal = ({ country, plan, onClose }: DoctorSelectionModalProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data: assignments } = await supabase
        .from('doctor_package_assignments')
        .select('doctor_id')
        .eq('package_id', plan.id)
        .eq('package_type', 'care_plan');

      if (assignments && assignments.length > 0) {
        const doctorIds = assignments.map(a => a.doctor_id);
        const { data: doctorsData } = await supabase
          .from('doctors')
          .select(`
            id,
            specialty,
            profile:profiles (
              full_name,
              avatar_url
            )
          `)
          .in('id', doctorIds)
          .eq('is_verified', true);

        setDoctors(doctorsData || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowPayment(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select Your Doctor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No doctors available for this plan.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => handleDoctorSelect(doctor)}
                  className="w-full p-6 border rounded-xl hover:border-emerald-500 transition-all
                           flex items-center gap-4 group"
                >
                  <img
                    src={doctor.profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.profile.full_name)}`}
                    alt={doctor.profile.full_name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {doctor.profile.full_name}
                    </h3>
                    <p className="text-gray-600">{doctor.specialty}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4 text-emerald-500" />
                        <span>{plan.includes.video} video calls</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <span>
                          {typeof plan.includes.phone === 'string' 
                            ? plan.includes.phone 
                            : `${plan.includes.phone} phone calls`}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showPayment && selectedDoctor && (
        <PaymentModal
          country={country}
          packageType={plan.id}
          doctorType="specialist"
          amount={plan.price}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default function SpecializedServices() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('Tanzania');
  const [showDoctorSelection, setShowDoctorSelection] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carePlans.length) % carePlans.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carePlans.length);
  };

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan);
    setShowDoctorSelection(true);
  };

  const pricing = countryPricing[selectedCountry];

  const getPrice = (plan: any, pricing: any) => {
    if (plan.isFamily) {
      const baseVideoPrice = plan.includes.video * parseInt(pricing.videoCost);
      const basePhonePrice = plan.includes.phone * parseInt(pricing.phoneCost);
      const baseTotal = baseVideoPrice + basePhonePrice;
      const totalWithIncrease = baseTotal * 1.2;
      return Math.round(totalWithIncrease).toLocaleString();
    }
    return pricing.subscription15;
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Specialized Care Plans
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare plans designed for specific conditions with dedicated support
            and monitoring
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {countries.map(({ code, name, flag }) => (
            <button
              key={code}
              onClick={() => setSelectedCountry(code)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all
                ${selectedCountry === code
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
                }`}
            >
              <span>{flag}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
                     bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all
                     transform hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
                     bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all
                     transform hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          <div className="overflow-hidden px-4">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {carePlans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div
                    key={plan.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden
                                transform hover:scale-[1.02] transition-transform duration-300">
                      <div className={`bg-gradient-to-r ${plan.colorFrom} ${plan.colorTo} p-5 text-white`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 ${plan.colorBg} rounded-xl`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{plan.title}</h3>
                            <p className="text-white/90 text-sm">{plan.description}</p>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">
                            {pricing.symbol}{getPrice(plan, pricing)}
                          </span>
                          <span className="text-white/90 text-sm">/month</span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-600 mb-2">Plan Includes:</div>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                              <Video className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm">{plan.includes.video} video calls</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm">
                                {typeof plan.includes.phone === 'string' 
                                  ? plan.includes.phone 
                                  : `${plan.includes.phone} phone calls`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <ul className="space-y-2 mb-4">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                              <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => handleSubscribe(plan)}
                          className={`w-full bg-gradient-to-r ${plan.colorFrom} ${plan.colorTo}
                                   text-white py-2.5 rounded-lg shadow-lg hover:shadow-xl 
                                   transition-all transform hover:scale-[1.02] active:scale-98 
                                   flex items-center justify-center gap-2 text-sm`}
                        >
                          <Calendar className="w-4 h-4" />
                          Subscribe Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {carePlans.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {showDoctorSelection && selectedPlan && (
        <DoctorSelectionModal
          country={selectedCountry}
          plan={selectedPlan}
          onClose={() => setShowDoctorSelection(false)}
        />
      )}
    </section>
  );
}