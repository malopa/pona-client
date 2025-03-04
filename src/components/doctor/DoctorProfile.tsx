import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Stethoscope, Clock, Save, Loader2, Camera, AlertCircle, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AvailabilityCalendar from './AvailabilityCalendar';

const specialties = [
  'General Practitioner',
  'Cardiologist',
  'Neurologist',
  'Pediatrician',
  'Gynecologist',
  'Dermatologist',
  'Orthopedic Surgeon',
  'Oncologist',
  'Endocrinologist',
  'Psychiatrist',
  'Pulmonologist',
  'Gastroenterologist',
  'Ophthalmologist',
  'ENT Specialist',
  'Urologist',
  'Rheumatologist',
  'Nephrologist',
  'Hematologist',
  'Family Medicine',
  'Internal Medicine'
];

export default function DoctorProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState<'profile' | 'availability'>('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    location: '',
    bio: '',
    consultationFees: {
      video: 60,
      phone: 45
    },
    availability: {
      monday: ['09:00-17:00'],
      tuesday: ['09:00-17:00'],
      wednesday: ['09:00-17:00'],
      thursday: ['09:00-17:00'],
      friday: ['09:00-17:00']
    },
    languages: ['English', 'Swahili']
  });

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profile:profiles (
            full_name,
            email,
            phone,
            country,
            language,
            avatar_url
          )
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.profile.full_name,
          email: data.profile.email,
          phone: data.profile.phone || '',
          specialty: data.specialty,
          experience: data.experience_years.toString(),
          location: data.profile.country,
          bio: data.bio || '',
          consultationFees: {
            video: data.video_consultation_fee,
            phone: data.phone_consultation_fee
          },
          availability: data.availability || formData.availability,
          languages: data.profile.language ? data.profile.language.split(',') : ['English']
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.location,
          language: formData.languages.join(',')
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update doctor info
      const { error: doctorError } = await supabase
        .from('doctors')
        .update({
          specialty: formData.specialty,
          experience_years: parseInt(formData.experience),
          bio: formData.bio,
          video_consultation_fee: formData.consultationFees.video,
          phone_consultation_fee: formData.consultationFees.phone
        })
        .eq('id', user.id);

      if (doctorError) throw doctorError;

      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveSection('profile')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all
              ${activeSection === 'profile'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-emerald-600'
              }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveSection('availability')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all
              ${activeSection === 'availability'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-emerald-600'
              }`}
          >
            Availability Schedule
          </button>
        </div>
      </div>

      {activeSection === 'profile' ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-teal-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`}
                  alt="Profile"
                  className="w-32 h-32 rounded-xl border-4 border-white object-cover"
                />
                <button className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-lg
                             hover:bg-gray-50 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-20 p-8">
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-emerald-50 text-emerald-600 p-4 rounded-lg flex items-start gap-2">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialty
                    </label>
                    <div className="relative">
                      <select
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Select a specialty</option>
                        {specialties.map(specialty => (
                          <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                      </select>
                      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         resize-none"
                />
              </div>

              {/* Consultation Fees */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Call (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.consultationFees.video}
                      onChange={(e) => setFormData({
                        ...formData,
                        consultationFees: {
                          ...formData.consultationFees,
                          video: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Call (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.consultationFees.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        consultationFees: {
                          ...formData.consultationFees,
                          phone: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((language) => (
                    <span
                      key={language}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                  <button
                    type="button"
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm
                           hover:border-emerald-500 hover:text-emerald-500 transition-colors"
                  >
                    Add Language
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6
                         py-2 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl
                         hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]
                         active:scale-98 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <AvailabilityCalendar />
      )}
    </div>
  );
}