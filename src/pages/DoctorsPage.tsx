import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, Award, Search, Filter, Star, MapPin, Stethoscope, 
  ChevronDown, X, Clock, Phone, Video, Shield, ArrowRight
} from 'lucide-react';
import { doctorsData } from '../components/FeaturedDoctors/doctorsData';
import DoctorCard from '../components/FeaturedDoctors/DoctorCard';
import { isSpecialist } from '../components/utils/doctorUtils';
import AuthModal from '../components/auth/AuthModal';
import { useQuery } from '@tanstack/react-query';
import {getCountry,getDoctors,getConsultationTypes,getSpeciality} from '../pages/api/api'


// Reordered countries with flags
// const countries = [
//   { code: 'South Africa', name: 'South Africa', flag: '🇿🇦' },
//   { code: 'Tanzania', name: 'Tanzania', flag: '🇹🇿' },
//   { code: 'Kenya', name: 'Kenya', flag: '🇰🇪' },
//   { code: 'Rwanda', name: 'Rwanda', flag: '🇷🇼' },
//   { code: 'Uganda', name: 'Uganda', flag: '🇺🇬' },
//   { code: 'Burundi', name: 'Burundi', flag: '🇧🇮' },
//   { code: 'USA', name: 'USA', flag: '🇺🇸' },
//   { code: 'UK', name: 'UK', flag: '🇬🇧' },
//   { code: 'Germany', name: 'Germany', flag: '🇩🇪' },
//   { code: 'UAE', name: 'UAE', flag: '🇦🇪' }
// ];

// const specialties = [
//   'All Specialties',
//   'General Practitioner',
//   'Cardiologist',
//   'Neurologist',
//   'Pediatrician',
//   'Gynecologist',
//   'Dermatologist',
//   'Orthopedic Surgeon',
//   'Oncologist',
//   'Endocrinologist',
//   'Psychiatrist'
// ];

const ratings = [
  { value: 0, label: 'All Ratings' },
  { value: 5, label: '5 Stars' },
  { value: 4, label: '4+ Stars' },
  { value: 3, label: '3+ Stars' }
];

// const consultationTypes = [
//   { value: 'all', label: 'All Types' },
//   { value: 'video', label: 'Video Call' },
//   { value: 'phone', label: 'Phone Call' }
// ];

// Coming soon countries
const comingSoonCountries = ['USA', 'UK', 'UAE', 'Germany'];

export default function DoctorsPage() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDoctorAuth, setShowDoctorAuth] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const isComingSoon = comingSoonCountries.includes(selectedCountry);

  const {data:doctors,isLoading:isDoctorLoading} = useQuery({queryKey:['doctors',selectedCountry],queryFn:async ()=> getDoctors({slug:"doctor",origin:selectedCountry})})
  const {data:countries} = useQuery({queryKey:['countries'],queryFn:async ()=> getCountry()})
  const {data:specialties} = useQuery({queryKey:['specialties'],queryFn:async ()=> getSpeciality()})
  const {data:consultationTypes} = useQuery({queryKey:['consultation-types'],queryFn:async ()=> getConsultationTypes()})
  
  

  const handleDoctorLogin = () => {
    navigate('/auth?role=doctor');
  };

  const handleApplyNow = () => {
    navigate('/doctor/apply');
  };

  // Get doctors for selected country
  const countryDoctors = selectedCountry ? doctorsData[selectedCountry] || [] : [];

  // Apply filters
  const filteredDoctors = doctors?.filter(doctor => {
    const matchesSearch = doctor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor?.specialist.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || doctor?.specialist?.id === selectedSpecialty;
    const matchesRating = doctor.rating >= selectedRating;
    return matchesSearch && matchesSpecialty && matchesRating;
  });

  // Sort doctors
  const sortedDoctors = [...doctors?doctors:[]].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const clearFilters = () => {
    setSelectedSpecialty('All Specialties');
    setSelectedRating(0);
    setSelectedType('all');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Doctor</h1>
            <p className="text-gray-600">Connect with qualified healthcare professionals</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleDoctorLogin}
              className="flex items-center gap-2 bg-white text-emerald-600 border-2 border-emerald-500 
                       px-6 py-2.5 rounded-lg hover:bg-emerald-50 transition-all transform 
                       hover:scale-105 active:scale-95"
            >
              <Shield className="w-5 h-5" />
              Apply as Doctor
            </button>
            <button 
              onClick={handleDoctorLogin}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 
                       text-white px-6 py-2.5 rounded-lg shadow-lg shadow-emerald-500/20
                       hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform 
                       hover:scale-105 active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              Doctor Login
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-start">
            {/* Search Bar */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors by name or specialty..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Country Selection */}
            <div className="flex flex-wrap gap-2">
              {countries?.map(({ id,code, name, flag }) => (
                <button
                  key={id}
                  onClick={() => setSelectedCountry(id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
                    ${selectedCountry === id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                >
                  <span><img src={flag}  width={30} /></span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {/* Specialty Filter */}
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         bg-white"
              >
                {specialties?.map(specialty => (
                  <option key={specialty.id} value={specialty.id}>{specialty?.name}</option>
                ))}
              </select>
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         bg-white"
              >
                {ratings.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Consultation Type Filter */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         bg-white"
              >
                {consultationTypes?.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         bg-white"
              >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        {isComingSoon ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 
                              rounded-full blur-xl opacity-20 animate-pulse" />
                <Shield className="w-20 h-20 mx-auto text-emerald-500 relative" />
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 
                           bg-clip-text text-transparent mb-4">
                Coming Soon to {selectedCountry}!
              </h2>
              
              <p className="text-gray-600 mb-8 text-lg">
                We're expanding our healthcare network to {selectedCountry}! Our team is working 
                diligently to bring you access to top-quality healthcare professionals in your region.
              </p>

              <button 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 
                             rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl 
                             hover:shadow-emerald-500/30 transition-all transform hover:scale-105 
                             active:scale-95">
                Get Notified When We Launch
              </button>
            </div>
          </div>
        ) : (
          <>
            {filteredDoctors?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredDoctors?.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    {...doctor}
                    country={selectedCountry}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Doctors Found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or selecting a different country.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}