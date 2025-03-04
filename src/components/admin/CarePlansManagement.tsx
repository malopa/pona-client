import React, { useState, useEffect } from 'react';
import { Shield, Star, ChevronRight, Plus, Trash2, Edit2, Phone, Video, Calendar, Heart, Activity, Droplet, Globe2, Users, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { countryPricing } from '../booking/pricingData';

// Reordered countries with flags
const countries = [
  { code: 'South Africa', name: 'South Africa', flag: '🇿🇦' },
  { code: 'Tanzania', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'Kenya', name: 'Kenya', flag: '🇰🇪' },
  { code: 'Rwanda', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'Uganda', name: 'Uganda', flag: '🇺🇬' },
  { code: 'Burundi', name: 'Burundi', flag: '🇧🇮' }
];

interface Doctor {
  id: string;
  profile: {
    full_name: string;
    avatar_url: string;
  };
  specialty: string;
}

interface DoctorAssignment {
  package_id: string;
  package_type: 'care_plan' | 'subscription';
  doctor_id: string;
}

export default function CarePlansManagement() {
  const [selectedCountry, setSelectedCountry] = useState('Tanzania');
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [doctorAssignments, setDoctorAssignments] = useState<DoctorAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, [selectedCountry]);

  const fetchDoctors = async () => {
    try {
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctors')
        .select(`
          id,
          specialty,
          profile:profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('is_verified', true)
        .eq('profiles.country', selectedCountry);

      if (doctorsError) throw doctorsError;
      setAvailableDoctors(doctors || []);

      // Fetch doctor assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('doctor_package_assignments')
        .select('*');

      if (assignmentsError) throw assignmentsError;
      setDoctorAssignments(assignments || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load doctors and assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAssignedDoctors = (planId: string) => {
    const assignments = doctorAssignments
      .filter(a => a.package_id === planId)
      .map(assignment => {
        const doctor = availableDoctors.find(d => d.id === assignment.doctor_id);
        return doctor ? (
          <div
            key={doctor.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg"
          >
            <img
              src={doctor.profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.profile.full_name)}`}
              alt={doctor.profile.full_name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-gray-700">{doctor.profile.full_name}</span>
            {doctor.specialty.toLowerCase().includes('specialist') && (
              <Shield className="w-4 h-4 text-purple-500" />
            )}
          </div>
        ) : null;
      });

    return (
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm font-medium text-gray-700 mb-2">Assigned Doctors</p>
        <div className="flex flex-wrap gap-2">
          {assignments}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const pricing = countryPricing[selectedCountry];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Care Plans Management</h2>
          <p className="text-gray-600">Manage care plans and subscriptions by country</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg">
          <Plus className="w-5 h-5" />
          Add Plan
        </button>
      </div>

      {/* Country Selection */}
      <div className="flex flex-wrap gap-3">
        {countries.map(({ code, name, flag }) => (
          <button
            key={code}
            onClick={() => setSelectedCountry(code)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Care Plans Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Care Plans</h2>
              <p className="text-emerald-50">Specialized healthcare packages</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Pregnancy Care Plan */}
              <div className="p-6 border border-emerald-100 rounded-xl hover:border-emerald-500 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-pink-100 rounded-xl">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Pregnancy Care Plan</h3>
                      <p className="text-gray-600">Comprehensive care throughout pregnancy</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Video className="w-4 h-4 text-emerald-500" />
                          <span>5 video calls</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-emerald-500" />
                          <span>Unlimited phone calls</span>
                        </div>
                      </div>
                      <div className="mt-2 text-lg font-bold text-emerald-600">
                        {pricing.symbol}39,000
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {renderAssignedDoctors('pregnancy')}
              </div>

              {/* Hypertension Care Plan */}
              <div className="p-6 border border-emerald-100 rounded-xl hover:border-emerald-500 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <Activity className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Hypertension Care</h3>
                      <p className="text-gray-600">Blood pressure management</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Video className="w-4 h-4 text-emerald-500" />
                          <span>5 video calls</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-emerald-500" />
                          <span>10 phone calls</span>
                        </div>
                      </div>
                      <div className="mt-2 text-lg font-bold text-emerald-600">
                        {pricing.symbol}32,500
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {renderAssignedDoctors('hypertension')}
              </div>

              {/* Diabetes Care Plan */}
              <div className="p-6 border border-emerald-100 rounded-xl hover:border-emerald-500 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Droplet className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Diabetes Care</h3>
                      <p className="text-gray-600">Comprehensive diabetes management</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Video className="w-4 h-4 text-emerald-500" />
                          <span>5 video calls</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-emerald-500" />
                          <span>10 phone calls</span>
                        </div>
                      </div>
                      <div className="mt-2 text-lg font-bold text-emerald-600">
                        {pricing.symbol}36,400
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {renderAssignedDoctors('diabetes')}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Subscription Plans</h2>
              <p className="text-purple-50">Regular consultation packages</p>
            </div>

            <div className="p-6 space-y-6">
              {/* General Practitioner Plans */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Practitioner</h3>
                <div className="space-y-4">
                  {/* 15 Calls Package */}
                  <div className="p-6 border border-purple-100 rounded-xl hover:border-purple-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">15 Calls Package</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-purple-500" />
                            <span>9 phone calls</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Video className="w-4 h-4 text-purple-500" />
                            <span>6 video calls</span>
                          </div>
                        </div>
                        <div className="mt-2 text-lg font-bold text-purple-600">
                          {pricing.symbol}{pricing.subscription15}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {renderAssignedDoctors('general_15')}
                  </div>

                  {/* 30 Calls Package */}
                  <div className="p-6 border border-purple-100 rounded-xl hover:border-purple-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">30 Calls Package</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-purple-500" />
                            <span>20 phone calls</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Video className="w-4 h-4 text-purple-500" />
                            <span>10 video calls</span>
                          </div>
                        </div>
                        <div className="mt-2 text-lg font-bold text-purple-600">
                          {pricing.symbol}{pricing.subscription30}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {renderAssignedDoctors('general_30')}
                  </div>
                </div>
              </div>

              {/* Specialist Plans */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialist Doctor</h3>
                <div className="space-y-4">
                  {/* 15 Calls Package */}
                  <div className="p-6 border border-purple-100 rounded-xl hover:border-purple-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">15 Calls Package</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-purple-500" />
                            <span>9 phone calls</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Video className="w-4 h-4 text-purple-500" />
                            <span>6 video calls</span>
                          </div>
                        </div>
                        <div className="mt-2 text-lg font-bold text-purple-600">
                          {pricing.symbol}{pricing.specialistSubscription15}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {renderAssignedDoctors('specialist_15')}
                  </div>

                  {/* 30 Calls Package */}
                  <div className="p-6 border border-purple-100 rounded-xl hover:border-purple-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">30 Calls Package</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-purple-500" />
                            <span>20 phone calls</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Video className="w-4 h-4 text-purple-500" />
                            <span>10 video calls</span>
                          </div>
                        </div>
                        <div className="mt-2 text-lg font-bold text-purple-600">
                          {pricing.symbol}{pricing.specialistSubscription30}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {renderAssignedDoctors('specialist_30')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}