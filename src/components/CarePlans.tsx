import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Activity, Droplet, Microscope, Clock, Shield, Phone, Video, Calendar } from 'lucide-react';
import PaymentModal from './subscription/PaymentModal';

const carePlans = [
  {
    id: 'pregnancy',
    title: 'Pregnancy Care Plan',
    icon: Heart,
    colorFrom: 'from-pink-500',
    colorTo: 'to-rose-500',
    colorBg: 'bg-pink-400/30',
    description: 'Comprehensive care throughout your pregnancy journey',
    price: '39,000',  // Increased by 30%
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
    description: 'Dedicated support for blood pressure management',
    price: '32,500',  // Increased by 30%
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
    price: '36,400',  // Increased by 30%
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
    price: '45,500',  // Increased by 30%
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

export default function CarePlans() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carePlans.length) % carePlans.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carePlans.length);
  };

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan);
    setShowPayment(true);
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

        <div className="relative">
          {/* Navigation Buttons */}
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

          {/* Cards Container */}
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
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden
                                transform hover:scale-[1.02] transition-transform duration-300">
                      <div className={`bg-gradient-to-r ${plan.colorFrom} ${plan.colorTo} p-6 text-white`}>
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-3 ${plan.colorBg} rounded-xl`}>
                            <Icon className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{plan.title}</h3>
                            <p className="text-white/90">{plan.description}</p>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">TSh {plan.price}</span>
                          <span className="text-white/90">/month</span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-6">
                          <div className="text-sm font-medium text-gray-600 mb-3">Plan Includes:</div>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <Video className="w-5 h-5 text-emerald-500" />
                              <span>{plan.includes.video} video calls</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-5 h-5 text-emerald-500" />
                              <span>
                                {typeof plan.includes.phone === 'string' 
                                  ? plan.includes.phone 
                                  : `${plan.includes.phone} phone calls`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3 text-gray-600">
                              <Shield className="w-5 h-5 text-emerald-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => handleSubscribe(plan)}
                          className={`w-full bg-gradient-to-r ${plan.colorFrom} ${plan.colorTo}
                                   text-white py-3 rounded-xl shadow-lg hover:shadow-xl 
                                   transition-all transform hover:scale-[1.02] active:scale-98 
                                   flex items-center justify-center gap-2`}
                        >
                          <Calendar className="w-5 h-5" />
                          Subscribe Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicator */}
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

      {showPayment && selectedPlan && (
        <PaymentModal
          country="Tanzania"
          packageType="Special"
          doctorType="specialist"
          amount={selectedPlan.price}
          onClose={() => setShowPayment(false)}
        />
      )}
    </section>
  );
}