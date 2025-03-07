import React, { useState } from 'react';
import { X, Video, Phone, Clock, CreditCard, Calendar as CalendarIcon, AlertCircle, ChevronRight, Shield, Star } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { countryPricing } from './pricingData';
import { isSpecialist } from '../utils/doctorUtils';
import { useTranslation } from '../../hooks/useTranslation';
import PaymentModal from '../subscription/PaymentModal';

interface BookingModalProps {
  doctor: {
    name: string;
    specialty: string;
    image: string;
  };
  country: string;
  onClose: () => void;
}

type ConsultationType = 'video' | 'phone' | null;
type PlanType = 'single' | 'subscription15' | 'subscription30' | null;

const timeSlots = [
  { time: '09:00', period: 'AM' },
  { time: '09:30', period: 'AM' },
  { time: '10:00', period: 'AM' },
  { time: '10:30', period: 'AM' },
  { time: '11:00', period: 'AM' },
  { time: '11:30', period: 'AM' },
  { time: '02:00', period: 'PM' },
  { time: '02:30', period: 'PM' },
  { time: '03:00', period: 'PM' },
  { time: '03:30', period: 'PM' },
  { time: '04:00', period: 'PM' },
  { time: '04:30', period: 'PM' }
];

export default function BookingModal({ doctor, country, onClose }: BookingModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<ConsultationType>(null);
  const [planType, setPlanType] = useState<PlanType>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  const pricing = countryPricing[country];
  const isSpecialistDoctor = isSpecialist(doctor.specialty);

  const handleTimeSelect = (time: string, period: string) => {
    setSelectedTime(`${time} ${period}`);
    setStep(2);
  };

  const handlePlanSelect = (type: ConsultationType, plan: PlanType) => {
    setConsultationType(type);
    setPlanType(plan);
    setShowPayment(true);
  };

  const handleEmergencyCall = () => {
    setIsEmergency(true);
    setShowPayment(true);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2].map((s) => (
        <div
          key={s}
          className={`flex items-center ${s !== 1 ? 'ml-10 sm:ml-16' : ''}`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
            ${step === s
              ? 'bg-emerald-500 text-white'
              : step > s
                ? 'bg-emerald-100 text-emerald-500'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {s}
          </div>
          <span className={`ml-2 text-sm ${
            step === s ? 'text-gray-900 font-medium' : 'text-gray-500'
          }`}>
            {s === 1 ? t('booking.selectDate') : t('booking.selectPlan')}
          </span>
          {s === 1 && (
            <div className={`ml-4 h-0.5 w-16 sm:w-24 ${
              step > 1 ? 'bg-emerald-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b sticky top-0 bg-white z-[99] flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                {doctor.name}
                {isSpecialistDoctor && (
                  <Shield className="w-4 h-4 text-purple-500" />
                )}
              </h3>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Emergency Button */}
          <div className="relative z-[98] mb-6">
            <button
              onClick={handleEmergencyCall}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white 
                     py-3 px-4 rounded-lg hover:bg-red-600 transition-colors transform 
                     hover:scale-[1.02] active:scale-98"
            >
              <AlertCircle className="w-5 h-5" />
              {t('booking.emergency')}
            </button>
          </div>

          {/* Step Indicator */}
          <div className="relative z-[98]">
            {renderStepIndicator()}
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              {/* Calendar Section */}
              <div className="relative z-[97]">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <Calendar
                    onChange={setDate}
                    value={date}
                    minDate={new Date()}
                    className="w-full rounded-lg border-0 bg-transparent text-sm"
                    tileClassName="rounded-lg hover:bg-emerald-100 text-sm py-1"
                    prevLabel={<ChevronRight className="w-4 h-4 rotate-180" />}
                    nextLabel={<ChevronRight className="w-4 h-4" />}
                    tileSize={32}
                  />
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="relative z-[96]">
                <h4 className="font-medium text-gray-900 mb-4">{t('booking.availableSlots')}</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map(({ time, period }) => (
                    <button
                      key={`${time}${period}`}
                      onClick={() => handleTimeSelect(time, period)}
                      className="p-2 text-sm border rounded-xl hover:border-emerald-500 
                             hover:bg-emerald-50 transition-all group"
                    >
                      <span className="font-medium text-gray-900 group-hover:text-emerald-600">
                        {time}
                      </span>
                      <span className="ml-1 text-gray-500 group-hover:text-emerald-500">
                        {period}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 relative z-[96]">
              {/* Single Consultation Options */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Single Consultation</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-xl hover:border-emerald-500 transition-all cursor-pointer"
                       onClick={() => handlePlanSelect('video', 'single')}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Video className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Video Consultation</span>
                          <p className="text-sm text-gray-600">High-quality video call with your doctor</p>
                        </div>
                      </div>
                      <span className="text-emerald-600 font-semibold">
                        {pricing?.symbol}{isSpecialistDoctor ? pricing?.specialistVideoCost : pricing?.videoCost}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-xl hover:border-emerald-500 transition-all cursor-pointer"
                       onClick={() => handlePlanSelect('phone', 'single')}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Phone className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Phone Consultation</span>
                          <p className="text-sm text-gray-600">Voice consultation at your convenience</p>
                        </div>
                      </div>
                      <span className="text-emerald-600 font-semibold">
                        {pricing?.symbol}{isSpecialistDoctor ? pricing?.specialistPhoneCost : pricing?.phoneCost}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Options */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Monthly Subscription</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-xl hover:border-emerald-500 transition-all cursor-pointer"
                       onClick={() => handlePlanSelect('video', 'subscription15')}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <CreditCard className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">15 Calls Package</span>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-emerald-500" />
                              <span>9 phone calls</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Video className="w-4 h-4 text-emerald-500" />
                              <span>6 video calls</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-emerald-600 font-semibold">
                        {pricing?.symbol}{isSpecialistDoctor ? pricing?.specialistSubscription15 : pricing?.subscription15}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-xl hover:border-emerald-500 transition-all cursor-pointer relative overflow-hidden"
                       onClick={() => handlePlanSelect('video', 'subscription30')}>
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 
                                text-white px-2 py-0.5 rounded-full text-xs font-medium">
                      Best Value
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <CreditCard className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">30 Calls Package</span>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-emerald-500" />
                              <span>20 phone calls</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Video className="w-4 h-4 text-emerald-500" />
                              <span>10 video calls</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-emerald-600 font-semibold">
                        {pricing?.symbol}{isSpecialistDoctor ? pricing?.specialistSubscription30 : pricing?.subscription30}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          country={country}
          packageType={planType || 'single'}
          doctorType={isSpecialistDoctor ? 'specialist' : 'general'}
          amount={isSpecialistDoctor ? pricing?.specialistVideoCost : pricing?.videoCost}
          isEmergency={isEmergency}
          appointmentDetails={planType === 'single' ? {
            date,
            time: selectedTime,
            doctor
          } : undefined}
          onClose={() => {
            setShowPayment(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}