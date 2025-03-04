import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Activity, Droplet, Microscope, Clock, Shield, Phone, Video, Calendar, Users } from 'lucide-react';
import PaymentModal from '../subscription/PaymentModal';
import { countryPricing } from '../booking/pricingData';
import { useTranslation } from '../../hooks/useTranslation';
import { supabase } from '../../lib/supabase';

// Define care plans data structure
const carePlans = [
  {
    id: 'family',
    title: 'Family Doctor Plan',
    icon: Users,
    colorFrom: 'from-emerald-500',
    colorTo: 'to-teal-600',
    colorBg: 'bg-emerald-400/30',
    description: 'Comprehensive healthcare for up to 5 family members',
    price: '60000',
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
    description: 'Comprehensive care throughout pregnancy',
    price: '39000',
    features: [
      '5 video consultations',
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
    description: 'Blood pressure management',
    price: '32500',
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
    description: 'Diabetes management support',
    price: '36400',
    features: [
      'Blood sugar monitoring',
      'Regular consultations',
      'Diet planning assistance',
      'Exercise recommendations',
      'Medication management'
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
    description: 'Support for cancer patients',
    price: '45500',
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
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Select Your Doctor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-8">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No doctors available for this plan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => handleDoctorSelect(doctor)}
                  className="w-full p-4 border rounded-xl hover:border-emerald-500 transition-all
                           flex items-center gap-4 group"
                >
                  <img
                    src={doctor.profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.profile.full_name)}`}
                    alt={doctor.profile.full_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {doctor.profile.full_name}
                    </h3>
                    <p className="text-gray-600">{doctor.specialty}</p>
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

export default function CarePlans({ country = 'Tanzania' }: { country: string }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDoctorSelection, setShowDoctorSelection] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoSlideRef = useRef<NodeJS.Timeout>();

  // Auto slide functionality
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % carePlans.length);
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
  };

  // Handle touch events
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    stopAutoSlide();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentIndex(prev => (prev + 1) % carePlans.length);
    } else if (isRightSwipe) {
      setCurrentIndex(prev => (prev - 1 + carePlans.length) % carePlans.length);
    }

    startAutoSlide();
  };

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan);
    setShowDoctorSelection(true);
  };

  return (
    <div className="py-4">
      <div className="px-4 flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 text-white p-2 rounded-lg">
            <Shield className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            {t('carePlans.title')}
          </h2>
        </div>
      </div>

      <div 
        className="relative overflow-hidden px-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carePlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className="w-full flex-shrink-0 pr-3"
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className={`bg-gradient-to-r ${plan.colorFrom} ${plan.colorTo} p-4 text-white`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 ${plan.colorBg} rounded-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold">{plan.title}</h3>
                        <p className="text-white/90 text-sm">{plan.description}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold">
                        {countryPricing[country].symbol}{plan.price}
                      </span>
                      <span className="text-white/90 text-sm">/month</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-600 mb-2">{t('carePlans.includes')}:</div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg">
                          <Video className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-medium text-emerald-700">
                            {plan.includes.video} {t('carePlans.videoCalls')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg">
                          <Phone className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-medium text-emerald-700">
                            {typeof plan.includes.phone === 'string' 
                              ? t('carePlans.unlimitedCalls')
                              : `${plan.includes.phone} ${t('carePlans.phoneCalls')}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <Shield className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan)}
                      className={`w-full bg-gradient-to-r ${plan.colorFrom} ${plan.colorTo}
                             text-white py-2 rounded-lg shadow-lg hover:shadow-xl 
                             transition-all transform hover:scale-[1.02] active:scale-98 
                             flex items-center justify-center gap-2 text-sm`}
                    >
                      <Calendar className="w-4 h-4" />
                      {t('carePlans.subscribe')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-4 gap-1">
          {carePlans.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                currentIndex === index ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {showDoctorSelection && selectedPlan && (
        <DoctorSelectionModal
          country={country}
          plan={selectedPlan}
          onClose={() => setShowDoctorSelection(false)}
        />
      )}
    </div>
  );
}