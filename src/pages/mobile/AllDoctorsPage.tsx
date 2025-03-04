import React from 'react';
import { ChevronLeft, Search, Shield } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { doctorsData } from '../../components/FeaturedDoctors/doctorsData';
import DoctorCard from '../../components/mobile/DoctorCard';
import { isSpecialist } from '../../components/utils/doctorUtils';
import { useTranslation } from '../../hooks/useTranslation';

export default function AllDoctorsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { country, type } = useParams();
  const [searchQuery, setSearchQuery] = React.useState('');

  const countryDoctors = country ? doctorsData[country] || [] : [];
  const doctors = type === 'specialists' 
    ? countryDoctors.filter(doc => isSpecialist(doc.specialty))
    : countryDoctors.filter(doc => !isSpecialist(doc.specialty));

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b">
        <div className="flex items-center gap-3 p-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">
            {type === 'specialists' ? t('specialty.specialists') : t('specialty.generalDoctors')}
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="p-4">
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.name}
                {...doctor}
                country={country || ''}
                specialty={t(`specialty.${doctor.specialty.toLowerCase().replace(/\s+/g, '')}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('search.noResults')}
            </h3>
            <p className="text-gray-600">
              {t('search.tryAdjusting')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}