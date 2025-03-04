import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle, Shield, ChevronRight, Video, Phone, CreditCard } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { countryPricing } from '../../components/booking/pricingData';
import { isSpecialist } from '../../components/utils/doctorUtils';
import PaymentModal from '../../components/subscription/PaymentModal';
import { useTranslation } from '../../hooks/useTranslation';

// Swahili translations for days
const swahiliDays = {
  Monday: 'J.tatu',
  Tuesday: 'J.nne',
  Wednesday: 'J.tano',
  Thursday: 'Alhamis',
  Friday: 'Ijumaa',
  Saturday: 'J.mosi',
  Sunday: 'J.pili'
};

// Swahili translations for months
const swahiliMonths = {
  January: 'Mwezi-1',
  February: 'Mwezi-2',
  March: 'Mwezi-3',
  April: 'Mwezi-4',
  May: 'Mwezi-5',
  June: 'Mwezi-6',
  July: 'Mwezi-7',
  August: 'Mwezi-8',
  September: 'Mwezi-9',
  October: 'Mwezi-10',
  November: 'Mwezi-11',
  December: 'Mwezi-12'
};

// Swahili time slots
const swahiliTimeSlots = [
  { time: '3:00', period: 'Asubuhi' }, // 9:00 AM
  { time: '3:30', period: 'Asubuhi' }, // 9:30 AM
  { time: '4:00', period: 'Asubuhi' }, // 10:00 AM
  { time: '4:30', period: 'Asubuhi' }, // 10:30 AM
  { time: '5:00', period: 'Asubuhi' }, // 11:00 AM
  { time: '5:30', period: 'Asubuhi' }, // 11:30 AM
  { time: '8:00', period: 'Mchana' },  // 2:00 PM
  { time: '8:30', period: 'Mchana' },  // 2:30 PM
  { time: '9:00', period: 'Mchana' },  // 3:00 PM
  { time: '9:30', period: 'Mchana' },  // 3:30 PM
  { time: '10:00', period: 'Mchana' }, // 4:00 PM
  { time: '10:30', period: 'Mchana' }  // 4:30 PM
];

// English time slots
const englishTimeSlots = [
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

type ConsultationType = 'video' | 'phone' | null;
type PlanType = 'single' | 'subscription15' | 'subscription30' | null;

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, country } = location.state || {};
  const { t, currentLanguage } = useTranslation();

  const [step, setStep] = useState(1);
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState<ConsultationType>(null);
  const [planType, setPlanType] = useState<PlanType>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  const pricing = countryPricing[country];
  const isSpecialistDoctor = isSpecialist(doctor.specialty);
  const isSwahili = currentLanguage === 'sw';

  const getPrice = (type: ConsultationType, plan: PlanType): string => {
    if (isEmergency) {
      return isSpecialistDoctor ? pricing.specialistVideoCost : pricing.videoCost;
    }

    switch (plan) {
      case 'single':
        return type === 'video'
          ? isSpecialistDoctor ? pricing.specialistVideoCost : pricing.videoCost
          : isSpecialistDoctor ? pricing.specialistPhoneCost : pricing.phoneCost;
      case 'subscription15':
        return isSpecialistDoctor ? pricing.specialistSubscription15 : pricing.subscription15;
      case 'subscription30':
        return isSpecialistDoctor ? pricing.specialistSubscription30 : pricing.subscription30;
      default:
        return '0';
    }
  };

  const formatShortWeekday = (locale: string, date: Date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    return isSwahili ? swahiliDays[day as keyof typeof swahiliDays] : day.slice(0, 3);
  };

  const formatMonth = (locale: string, date: Date) => {
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    return isSwahili ? swahiliMonths[month as keyof typeof swahiliMonths] : month;
  };

  const handleTimeSelect = (time: string, period: string) => {
    const timeIndex = isSwahili ? swahiliTimeSlots.findIndex(t => t.time === time && t.period === period) : -1;
    const selectedTimeSlot = timeIndex !== -1 ? englishTimeSlots[timeIndex] : { time, period };
    setSelectedTime(`${selectedTimeSlot.time} ${selectedTimeSlot.period}`);
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

  const handleClosePayment = () => {
    setShowPayment(false);
    setConsultationType(null);
    setPlanType(null);
  };

  if (!doctor || !country) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14 px-4 py-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Invalid booking request</p>
            <p className="mt-1">Please select a doctor from the list.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-[60] border-b">
        <div className="flex items-center gap-3 p-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              {doctor.name}
              {isSpecialistDoctor && (
                <Shield className="w-4 h-4 text-purple-500" />
              )}
            </h1>
            <p className="text-sm text-gray-600">{doctor.specialty}</p>
          </div>
        </div>
      </div>

      <div className="pt-20 px-4 py-6">
        {/* Emergency Button */}
        <button
          onClick={handleEmergencyCall}
          className="w-full mb-6 flex items-center justify-center gap-2 bg-red-500 text-white 
                   py-3 rounded-lg hover:bg-red-600 transition-colors"
        >
          <AlertCircle className="w-5 h-5" />
          {isSwahili ? 'Dharura' : 'Emergency Consultation'}
        </button>

        {step === 1 ? (
          <>
            {/* Calendar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 relative z-[50]">
              <Calendar
                onChange={setDate}
                value={date}
                minDate={new Date()}
                className="w-full rounded-lg border-0 bg-transparent"
                tileClassName="rounded-lg hover:bg-emerald-100"
                prevLabel={<ChevronRight className="w-4 h-4 rotate-180" />}
                nextLabel={<ChevronRight className="w-4 h-4" />}
                formatShortWeekday={formatShortWeekday}
                formatMonthYear={(locale, date) => `${formatMonth(locale, date)} ${date.getFullYear()}`}
              />
            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-xl shadow-sm p-4 relative z-[40]">
              <h3 className="font-medium text-gray-900 mb-4">
                {isSwahili ? 'Nyakati Zilizopo' : 'Available Time Slots'}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(isSwahili ? swahiliTimeSlots : englishTimeSlots).map(({ time, period }) => (
                  <button
                    key={`${time}${period}`}
                    onClick={() => handleTimeSelect(time, period)}
                    className="p-2 text-sm border rounded-xl hover:border-emerald-500 
                             hover:bg-emerald-50 transition-all"
                  >
                    <span className="font-medium text-gray-900">{time}</span>
                    <span className="ml-1 text-gray-500">{period}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Single Consultation Options */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                {isSwahili ? 'Ushauri wa Mara Moja' : 'Single Consultation'}
              </h4>
              <div className="space-y-3">
                <div
                  onClick={() => handlePlanSelect('video', 'single')}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Video className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {isSwahili ? 'Simu ya Video' : 'Video Call'}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {isSwahili ? 'Ushauri wa video moja kwa moja' : 'Direct video consultation'}
                        </p>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-semibold">
                      {pricing.symbol}{getPrice('video', 'single')}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => handlePlanSelect('phone', 'single')}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {isSwahili ? 'Simu ya Kawaida' : 'Phone Call'}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {isSwahili ? 'Ushauri wa simu ya kawaida' : 'Voice consultation'}
                        </p>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-semibold">
                      {pricing.symbol}{getPrice('phone', 'single')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Options */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                {isSwahili ? 'Mpango wa Mwezi' : 'Monthly Subscription'}
              </h4>
              <div className="space-y-3">
                <div
                  onClick={() => handlePlanSelect('video', 'subscription15')}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {isSwahili ? 'Mpango wa Simu 15' : '15 Calls Package'}
                        </h5>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-emerald-500" />
                            <span>
                              {isSwahili ? 'Simu za kawaida 9' : '9 phone calls'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Video className="w-4 h-4 text-emerald-500" />
                            <span>
                              {isSwahili ? 'Simu za video 6' : '6 video calls'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-semibold">
                      {pricing.symbol}{getPrice('video', 'subscription15')}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => handlePlanSelect('video', 'subscription30')}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98] relative"
                >
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 
                                text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    {isSwahili ? 'Nafuu Zaidi' : 'Best Value'}
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {isSwahili ? 'Mpango wa Simu 30' : '30 Calls Package'}
                        </h5>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-emerald-500" />
                            <span>
                              {isSwahili ? 'Simu za kawaida 20' : '20 phone calls'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Video className="w-4 h-4 text-emerald-500" />
                            <span>
                              {isSwahili ? 'Simu za video 10' : '10 video calls'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-semibold">
                      {pricing.symbol}{getPrice('video', 'subscription30')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPayment && (
        <PaymentModal
          country={country}
          packageType={planType || 'single'}
          doctorType={isSpecialistDoctor ? 'specialist' : 'general'}
          amount={getPrice(consultationType!, planType!)}
          isEmergency={isEmergency}
          appointmentDetails={planType === 'single' ? {
            date,
            time: selectedTime,
            doctor
          } : undefined}
          onClose={handleClosePayment}
        />
      )}
    </div>
  );
}