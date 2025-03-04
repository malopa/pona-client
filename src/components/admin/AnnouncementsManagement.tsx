import React, { useState, useEffect } from 'react';
import { Send, Search, Globe2, Users, Mail, AlertCircle, Loader2, Check, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
    email: string;
    avatar_url: string;
    country: string;
  };
  specialty: string;
}

export default function AnnouncementsManagement() {
  const [recipients, setRecipients] = useState<'all' | 'country' | 'specific'>('all');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctors, setSelectedDoctors] = useState<Doctor[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);

  useEffect(() => {
    if (recipients === 'specific') {
      fetchDoctors();
    }
  }, [recipients]);

  const fetchDoctors = async () => {
    try {
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctors')
        .select(`
          id,
          specialty,
          profile:profiles (
            full_name,
            email,
            avatar_url,
            country
          )
        `)
        .eq('is_verified', true);

      if (doctorsError) throw doctorsError;
      setAvailableDoctors(doctors || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors');
    }
  };

  const handleSendAnnouncement = async () => {
    if (!subject || !message) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate sending announcement
      await new Promise(resolve => setTimeout(resolve, 1500));

      let targetDoctors: Doctor[] = [];
      if (recipients === 'all') {
        targetDoctors = availableDoctors;
      } else if (recipients === 'country') {
        targetDoctors = availableDoctors.filter(
          doctor => doctor.profile.country === selectedCountry
        );
      } else {
        targetDoctors = selectedDoctors;
      }

      // In a real application, you would send the announcement through your email service
      // For now, we'll just log the details
      console.log('Sending announcement to:', {
        recipients: targetDoctors.map(d => d.profile.email),
        subject,
        message
      });

      setSuccess('Announcement sent successfully!');
      setSubject('');
      setMessage('');
      setSelectedDoctors([]);
    } catch (err) {
      console.error('Error sending announcement:', err);
      setError('Failed to send announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = availableDoctors.filter(doctor =>
    doctor.profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
          <p className="text-gray-600">Send announcements to doctors</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="space-y-6">
            {/* Recipients Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send To
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setRecipients('all')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${recipients === 'all'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Users className="w-5 h-5" />
                  All Doctors
                </button>
                <button
                  onClick={() => setRecipients('country')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${recipients === 'country'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Globe2 className="w-5 h-5" />
                  By Country
                </button>
                <button
                  onClick={() => setRecipients('specific')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${recipients === 'specific'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Mail className="w-5 h-5" />
                  Specific Doctors
                </button>
              </div>
            </div>

            {/* Country Selection */}
            {recipients === 'country' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Country
                </label>
                <div className="flex flex-wrap gap-3">
                  {countries.map(({ code, name, flag }) => (
                    <button
                      key={code}
                      onClick={() => setSelectedCountry(code)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
                        ${selectedCountry === code
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      <span>{flag}</span>
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Doctor Selection */}
            {recipients === 'specific' && (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search doctors by name or specialty..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDoctorSearch(true);
                    }}
                    onFocus={() => setShowDoctorSearch(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {showDoctorSearch && filteredDoctors.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white rounded-lg shadow-lg border">
                    {filteredDoctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => {
                          if (!selectedDoctors.find(d => d.id === doctor.id)) {
                            setSelectedDoctors([...selectedDoctors, doctor]);
                          }
                          setSearchQuery('');
                          setShowDoctorSearch(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                      >
                        <img
                          src={doctor.profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.profile.full_name)}`}
                          alt={doctor.profile.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{doctor.profile.full_name}</div>
                          <div className="text-sm text-gray-600">{doctor.specialty}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {selectedDoctors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full"
                      >
                        <img
                          src={doctor.profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.profile.full_name)}`}
                          alt={doctor.profile.full_name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-700">{doctor.profile.full_name}</span>
                        <button
                          onClick={() => setSelectedDoctors(selectedDoctors.filter(d => d.id !== doctor.id))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter announcement subject"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       resize-none"
                placeholder="Enter your announcement message..."
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-lg flex items-start gap-2">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSendAnnouncement}
                disabled={isLoading || !subject || !message || (recipients === 'country' && !selectedCountry)}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-lg
                       shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30
                       transition-all transform hover:scale-[1.02] active:scale-98
                       disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Announcement
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}