import React from 'react';
import { ChevronLeft, Search, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doctorsData } from '../FeaturedDoctors/doctorsData';
import DoctorCard from './DoctorCard';
import { isSpecialist } from '../utils/doctorUtils';
import { useTranslation } from '../../hooks/useTranslation';
import { useQuery } from '@tanstack/react-query';
import {getSpeciality,getCountry,addNewDoctor,getDoctors,deleteDoctor,updateDoctorDetails} from '../../pages/api/api'

interface FeaturedDoctorsProps {
  country: string;
}

export default function FeaturedDoctors({ country }: FeaturedDoctorsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const countryDoctors = country ? doctorsData[country] || [] : [];
  const generalDoctors = countryDoctors.filter(doc => !isSpecialist(doc.specialty));
  const specialistDoctors = countryDoctors.filter(doc => isSpecialist(doc.specialty));

  const {data:doctors,isLoading:isDoctorLoading} = useQuery({queryKey:['doctors'],queryFn:async ()=> getDoctors({slug:"doctor",origin:''})})
  
  if (countryDoctors.length === 0) {
    return null;
  }
  // alert("hello")

  return (
    <div className="py-4">
      {/* General Doctors */}
      {/* {JSON.stringify(doctors)}---- */}
      {doctors?.filter(p=>p.specialist.name=='General Practitioner').length > 0 && (
        <div className="mb-6">
          <div className="px-4 flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 text-white p-2 rounded-lg">
                <Star className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                {t('specialty.generalDoctors')}
              </h2>
            </div>
            <button 
              onClick={() => navigate(`/doctors/${country}/general`)}
              className="text-emerald-500 text-sm font-medium flex items-center bg-emerald-50 px-3 py-1 rounded-full"
            >
              {t('specialty.viewAll')}
              <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
            </button>
          </div>

          <div className="overflow-x-auto px-4">
            <div className="grid grid-cols-2 gap-3 min-w-full">
              {doctors?.filter(p=>p.specialist.name=='General Practitioner')?.slice(0, 4).map((doctor) => (
                <DoctorCard 
                  key={doctor.id} 
                  {...doctor} 
                  country={country}
                  specialty={t(`specialty.${doctor?.specialist?.name.toLowerCase().replace(/\s+/g, '')}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Specialist Doctors */}
      {doctors?.filter(p=>p.specialist.name !== 'General Practitioner').length > 0 && (
        <div>
          <div className="px-4 flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-purple-500 text-white p-2 rounded-lg">
                <Shield className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                {t('specialty.specialists')}
              </h2>
            </div>
            <button 
              onClick={() => navigate(`/doctors/${country}/specialists`)}
              className="text-purple-500 text-sm font-medium flex items-center bg-purple-50 px-3 py-1 rounded-full"
            >
              {t('specialty.viewAll')}
              <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
            </button>
          </div>

          <div className="overflow-x-auto px-4">
            <div className="grid grid-cols-2 gap-3 min-w-full">
              {doctors?.filter(p=>p.specialist.name !== 'General Practitioner')?.slice(0, 4).map((doctor) => (
                <DoctorCard 
                  key={doctor.id} 
                  {...doctor} 
                  country={country}
                  specialty={t(`specialty.${doctor.specialist.name.toLowerCase().replace(/\s+/g, '')}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}