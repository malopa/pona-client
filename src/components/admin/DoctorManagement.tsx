import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, FileText, Search, Filter, Plus, Star, Shield, 
  Edit2, Trash2, Phone, Video, Calendar, Heart, ChevronRight,
  Loader2, AlertCircle, Check, ArrowUpRight, Globe2, DollarSign,
  ChevronDown, SortAsc, SortDesc
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AddDoctorForm from './AddDoctorForm';
import { doctorsData } from '../FeaturedDoctors/doctorsData';
import { isSpecialist } from '../utils/doctorUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {getSpeciality,getCountry,addNewDoctor,getDoctors,deleteDoctor,updateDoctorDetails} from '../../pages/api/api'

// const countries = [
//   { code: 'South Africa', name: 'South Africa', flag: '🇿🇦' },
//   { code: 'Tanzania', name: 'Tanzania', flag: '🇹🇿' },
//   { code: 'Kenya', name: 'Kenya', flag: '🇰🇪' },
//   { code: 'Rwanda', name: 'Rwanda', flag: '🇷🇼' },
//   { code: 'Uganda', name: 'Uganda', flag: '🇺🇬' },
//   { code: 'Burundi', name: 'Burundi', flag: '🇧🇮' }
// ];

const specialties = [
  'All Specialties',
  'General Practitioner',
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

const ratings = [
  { value: 0, label: 'All Ratings' },
  { value: 5, label: '5 Stars' },
  { value: 4, label: '4+ Stars' },
  { value: 3, label: '3+ Stars' }
];

const earningsRanges = [
  { value: 'all', label: 'All Earnings' },
  { value: 'highest', label: 'Highest to Lowest' },
  { value: 'lowest', label: 'Lowest to Highest' }
];

export default function DoctorManagement() {
  const navigate = useNavigate();

  const queryClient = useQueryClient()
  // const [doctors, setDoctors] = useState<any[]>([]);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // New filter states
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedEarnings, setSelectedEarnings] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'earnings' | 'consultations'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');


  const {data} = useQuery({queryKey:['speciality'],queryFn:async ()=> getSpeciality()})
  const {data:countries} = useQuery({queryKey:['countries'],queryFn:async ()=> getCountry()})
  const {data:doctors,isLoading:isDoctorLoading} = useQuery({queryKey:['doctors'],queryFn:async ()=> getDoctors("doctor")})

  // alert(JSON.stringify(countries))
  useEffect(() => {
    fetchDoctors();
  }, [selectedCountry]);

  const fetchDoctors = async () => {
    try {
      // First try to get doctors from Supabase
      const { data: dbDoctors, error } = await supabase
        .from('doctors')
        .select(`
          id,
          specialty,
          experience_years,
          bio,
          is_verified,
          is_featured,
          phone_consultation_fee,
          video_consultation_fee,
          rating,
          total_consultations,
          profile:profiles (
            full_name,
            email,
            phone,
            country,
            avatar_url
          )
        `);

      if (error) throw error;

      // If no doctors in database or if specific country is selected, use mock data
      let finalDoctors;
      if (dbDoctors && dbDoctors.length > 0 && !selectedCountry) {
        finalDoctors = dbDoctors;
      } else {
        // Use mock data for selected country or all countries if none selected
        const mockDoctors = selectedCountry 
          ? doctorsData[selectedCountry] || []
          : Object.values(doctorsData).flat();
          
        finalDoctors = mockDoctors.map(doc => ({
          id: doc.id,
          specialty: doc.specialty,
          experience_years: Math.floor(Math.random() * 20) + 5,
          is_verified: true,
          is_featured: true,
          total_consultations: Math.floor(Math.random() * 500) + 100,
          rating: doc.rating,
          profile: {
            full_name: doc.name,
            email: `${doc.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            phone: '+' + Math.floor(Math.random() * 1000000000),
            country: selectedCountry || 'Tanzania',
            avatar_url: doc.image
          }
        }));
      }

      // setDoctors(finalDoctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (doctorId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ is_verified: verified })
        .eq('id', doctorId);

      if (error) throw error;

      // setDoctors(doctors.map(doc => 
      //   doc.id === doctorId ? { ...doc, is_verified: verified } : doc
      // ));
    } catch (err) {
      console.error('Error updating doctor:', err);
      setError('Failed to update doctor verification status');
    }
  };

  const handleFeature = async (doctorId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ is_featured: featured })
        .eq('id', doctorId);

      if (error) throw error;

      // setDoctors(doctors.map(doc => 
      //   doc.id === doctorId ? { ...doc, is_featured: featured } : doc
      // ));
    } catch (err) {
      console.error('Error updating doctor:', err);
      setError('Failed to update doctor featured status');
    }
  };

  const delMutation = useMutation({
    mutationFn:deleteDoctor,onSuccess:(data)=>{
      queryClient.invalidateQueries('doctors')
      // setError(`${JSON.stringify(data)}`);

    }
  })

  const handleDelete = async (doctorId: string) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;

    try {
      // const { error } = await supabase.auth.admin.deleteUser(doctorId);
      // if (error) throw error;

      alert(doctorId)
      delMutation.mutate(+doctorId)

      // setDoctors(doctors.filter(doc => doc.id !== doctorId));
    } catch (err) {
      console.error('Error deleting doctor:', err);
      setError('Failed to delete doctor');
    }
  };

  const calculateEarnings = (doctor: any) => {
    return doctor.paid_consultations * 50; // $50 per consultation
  };

  const filteredDoctors = doctors
    ?.filter(doctor => {
      const matchesSearch = 
        doctor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor?.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor?.profile?.country?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty = 
        selectedSpecialty === 'All Specialties' || 
        doctor.specialty === selectedSpecialty;

      const matchesRating = doctor.rating >= selectedRating;

      return matchesSearch && matchesSpecialty && matchesRating;
    })
    .sort((a, b) => {
      const aEarnings = calculateEarnings(a);
      const bEarnings = calculateEarnings(b);
      
      if (selectedEarnings === 'highest') {
        return bEarnings - aEarnings;
      } else if (selectedEarnings === 'lowest') {
        return aEarnings - bEarnings;
      }
      
      // Default sorting by rating if no earnings filter
      return b.rating - a.rating;
    });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };




  const updateMutation = useMutation({
    mutationFn:updateDoctorDetails,onSuccess:(data)=>{
      queryClient.invalidateQueries("doctors")
    }
  })

  const mutation = useMutation({
    mutationFn:addNewDoctor,onSuccess:(data)=>{
      alert(JSON.stringify(data))
      queryClient.invalidateQueries("doctors")
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Specialty Filter */}
          <div className="relative"> 
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     bg-white"
            >
              {data?.map(specialty => (
                <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
              ))}
            </select>
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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

          {/* Earnings Filter */}
          <div className="relative">
            <select
              value={selectedEarnings}
              onChange={(e) => setSelectedEarnings(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     bg-white"
            >
              {earningsRanges.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'earnings' | 'consultations')}
              className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     bg-white"
            >
              <option value="rating">Sort by Rating</option>
              <option value="earnings">Sort by Earnings</option>
              <option value="consultations">Sort by Consultations</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'desc' ? (
                <SortDesc className="w-5 h-5 text-gray-400" />
              ) : (
                <SortAsc className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Country Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCountry('')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !selectedCountry
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Countries
          </button>
          {countries?.map(({ id,code, name, flag }) => (
            <button
              key={id}
              onClick={() => setSelectedCountry(id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                selectedCountry === code
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span><img src={flag} width={30} /></span>
              <span>{name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setEditingDoctor(null);
            setShowAddDoctor(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white
                   rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Doctor
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Doctors Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white
                    shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium">Total Doctors</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">
              {filteredDoctors.length}
              <span className="text-sm font-normal text-emerald-100 ml-2">
                of {doctors?.length || 0} total
              </span>
            </p>
          </div>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white
                    shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium">Total Earnings</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">
              ${filteredDoctors.reduce((sum, doc) => sum + calculateEarnings(doc), 0).toLocaleString()}
            </p>
            <p className="text-blue-100 text-sm mt-1">
              Average: ${Math.round(filteredDoctors.reduce((sum, doc) => sum + calculateEarnings(doc), 0) / filteredDoctors.length).toLocaleString()} per doctor
            </p>
          </div>
        </div>

        {/* Total Patients Card */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white
                    shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium">Total Patients--</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">
              {filteredDoctors.reduce((sum, doc) => sum + Math.floor(doc.total_patients * 0.8), 0).toLocaleString()}
            </p>
            <p className="text-purple-100 text-sm mt-1">
              Average: {Math.round(filteredDoctors.reduce((sum, doc) => sum + Math.floor(doc.total_patients * 0.8), 0) / filteredDoctors.length)} per doctor
            </p>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all"
          >
            <div className="relative">
              <img
                src={doctor?.profile_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name)}&background=random`}
                alt={doctor?.name}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleVerify(doctor.id, !doctor.is_verified)}
                  className={`p-2 rounded-lg transition-colors ${
                    doctor.is_verified
                      ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={doctor.is_verified ? 'Verified' : 'Not Verified'}
                >
                  {doctor.is_verified ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleFeature(doctor.id, !doctor.is_featured)}
                  className={`p-2 rounded-lg transition-colors ${
                    doctor.is_featured
                      ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={doctor.is_featured ? 'Featured' : 'Not Featured'}
                >
                  <Star className={`w-5 h-5 ${doctor.is_featured ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {doctor?.name}
                    {isSpecialist(doctor?.specialist?.name) && (
                      <Shield className="w-4 h-4 text-purple-500" />
                    )}
                  </h3>
                  <p className="text-emerald-600">{doctor?.specialist.name}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{doctor?.rating}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Patients</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.floor(doctor.total_patients * 0.8)}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Consultations</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {doctor.paid_consultations}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Video className="w-4 h-4" />
                    <span className="text-sm">Video Calls</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.floor(doctor.video_appointments * 0.6)}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Phone Calls</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.floor(doctor.phone_appointments * 0.4)}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe2 className="w-4 h-4" />
                  <span>{doctor?.country?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>Total Earnings: ${calculateEarnings(doctor).toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingDoctor(doctor);
                    setShowAddDoctor(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                         bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 
                         transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doctor.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                         bg-red-50 text-red-600 rounded-lg hover:bg-red-100 
                         transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Doctor Modal */}
      {showAddDoctor && (
        <AddDoctorForm
          onClose={() => {
            setShowAddDoctor(false);
            setEditingDoctor(null);
          }}
          onSubmit={async (formData) => {
            try {

              if(editingDoctor){
                updateMutation.mutate({formData,editingDoctor})
              }else{
                mutation.mutate(formData)
              }
            
            } catch (err) {
              console.error('Error adding doctor:', err);
              throw err;
            }
          }}
          editData={editingDoctor}
        />
      )}
    </div>
  );
}