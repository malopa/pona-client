import React, { useState, useEffect } from 'react';
import { 
  Calendar, DollarSign, TrendingUp, Download, Filter, PieChart, Users, Phone, Video, Globe2, 
  ArrowUpRight, Clock, Shield, Star, ChevronRight, AlertCircle, Heart, Stethoscope 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ConsultationFee {
  general_video_fee: number;
  general_phone_fee: number;
  specialist_video_fee: number;
  specialist_phone_fee: number;
  currency: string;
  currency_symbol: string;
}

const earningsData = {
  totalEarnings: 3580,
  thisMonth: 1250,
  lastMonth: 980,
  growth: 28,
  consultations: {
    video: 45,
    phone: 32
  },
  patients: 78,
  withdrawals: [
    {
      id: 1,
      amount: 1200,
      status: 'Completed',
      date: '2024-03-15',
      method: 'Bank Transfer'
    },
    {
      id: 2,
      amount: 850,
      status: 'Pending',
      date: '2024-03-18',
      method: 'M-Pesa'
    }
  ],
  recentTransactions: [
    {
      id: 1,
      patient: 'Sarah Johnson',
      amount: 60,
      type: 'Video Call',
      date: '2024-03-19'
    },
    {
      id: 2,
      patient: 'Michael Brown',
      amount: 45,
      type: 'Phone Call',
      date: '2024-03-18'
    },
    {
      id: 3,
      patient: 'Emily Wilson',
      amount: 60,
      type: 'Video Call',
      date: '2024-03-17'
    }
  ]
};

export default function DoctorEarnings() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Month');
  const [consultationFees, setConsultationFees] = useState<ConsultationFee | null>(null);
  const [isSpecialist, setIsSpecialist] = useState(false);
  const [doctorCountry, setDoctorCountry] = useState('');

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  const fetchDoctorInfo = async () => {
    try {
      // Get doctor's profile and country
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select(`
          specialty,
          profiles (country)
        `)
        .eq('id', user.id)
        .single();

      if (doctorError) throw doctorError;

      const country = doctorData.profiles.country;
      setDoctorCountry(country);
      
      // Check if doctor is a specialist
      setIsSpecialist(isSpecialistDoctor(doctorData.specialty));

      // Get consultation fees for the country
      const { data: feeData, error: feeError } = await supabase
        .from('consultation_fees')
        .select('*')
        .eq('country', country)
        .single();

      if (feeError) throw feeError;
      setConsultationFees(feeData);
    } catch (err) {
      console.error('Error fetching doctor info:', err);
    }
  };

  const isSpecialistDoctor = (specialty: string) => {
    const specialistSpecialties = [
      'Cardiologist',
      'Neurologist',
      'Pediatrician',
      'Gynecologist',
      'Dermatologist',
      'Orthopedic Surgeon',
      'Oncologist',
      'Endocrinologist',
      'Psychiatrist'
    ];
    return specialistSpecialties.includes(specialty);
  };

  const renderConsultationFees = () => {
    if (!consultationFees) return null;

    const fees = isSpecialist ? {
      video: consultationFees.specialist_video_fee,
      phone: consultationFees.specialist_phone_fee
    } : {
      video: consultationFees.general_video_fee,
      phone: consultationFees.general_phone_fee
    };

    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white
                     transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Video className="w-5 h-5" />
            </div>
            <span className="font-medium">Video Consultation</span>
          </div>
          <p className="text-2xl font-bold">
            {consultationFees.currency_symbol}{fees.video}
          </p>
          <p className="text-blue-100 text-sm">per session</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white
                     transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-purple-500/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Phone className="w-5 h-5" />
            </div>
            <span className="font-medium">Phone Consultation</span>
          </div>
          <p className="text-2xl font-bold">
            {consultationFees.currency_symbol}{fees.phone}
          </p>
          <p className="text-purple-100 text-sm">per session</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 
                      bg-clip-text text-transparent">
            Earnings Overview
          </h2>
          <p className="text-gray-600">Track your earnings and withdrawals</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 
                         rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-300
                         transform hover:scale-105 active:scale-95">
            <Filter className="w-5 h-5" />
            Filter
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 
                         rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-300
                         transform hover:scale-105 active:scale-95">
            <Download className="w-5 h-5" />
            Export
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 
                         to-teal-600 text-white rounded-lg shadow-lg shadow-emerald-500/20
                         hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300
                         transform hover:scale-105 active:scale-95">
            <Calendar className="w-5 h-5" />
            {selectedTimeframe}
          </button>
        </div>
      </div>

      {renderConsultationFees()}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white
                     transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-emerald-100">
              <TrendingUp className="w-4 h-4" />
              <span>+{earningsData.growth}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            ${earningsData.totalEarnings}
          </h3>
          <p className="text-emerald-100">Total Earnings</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300
                     transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-emerald-600 text-sm font-medium">
              This Month
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {earningsData.patients}
          </h3>
          <p className="text-gray-600">Total Patients</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300
                     transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Video className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-emerald-600 text-sm font-medium">
              This Month
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {earningsData.consultations.video}
          </h3>
          <p className="text-gray-600">Video Consultations</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300
                     transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Phone className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-emerald-600 text-sm font-medium">
              This Month
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {earningsData.consultations.phone}
          </h3>
          <p className="text-gray-600">Phone Consultations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {earningsData.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg
                         hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'Video Call'
                        ? 'bg-blue-100'
                        : 'bg-amber-100'
                    }`}>
                      {transaction.type === 'Video Call' ? (
                        <Video className={`w-4 h-4 ${
                          transaction.type === 'Video Call'
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        }`} />
                      ) : (
                        <Phone className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.patient}</p>
                      <p className="text-sm text-gray-600">{transaction.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${transaction.amount}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Withdrawals */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Recent Withdrawals</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {earningsData.withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg
                         hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div>
                    <p className="font-medium text-gray-900">${withdrawal.amount}</p>
                    <p className="text-sm text-gray-600">{withdrawal.method}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                        ${withdrawal.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                        }`}
                    >
                      {withdrawal.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(withdrawal.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 
                           text-white py-3 rounded-lg shadow-lg shadow-emerald-500/20 
                           hover:shadow-xl hover:shadow-emerald-500/30 transition-all 
                           transform hover:scale-[1.02] active:scale-98">
              Request Withdrawal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}