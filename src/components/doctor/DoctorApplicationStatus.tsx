import React, { useState, useEffect } from 'react';
import { Shield, Clock, FileText, Check, X, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useQuery } from '@tanstack/react-query';
import {getSpeciality,getCountry,addNewDoctor,getDoctors,getDoctorApplication,updateDoctorDetails} from '../../pages/api/api'


// interface Application {
//   id: string;
//   status: 'pending' | 'in_review' | 'approved' | 'rejected';
//   submitted_at: string;
//   notes?: string;
//   documents: Record<string, string>;
// }

export default function DoctorApplicationStatus() {
  const navigate = useNavigate();
  // const [application, setApplication] = useState<Application | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  let user_id = localStorage.getItem("user_id")

  // alert(user_id)

    const {data,isLoading} = useQuery({queryKey:['application',user_id],queryFn:async ()=> getDoctorApplication(+user_id)})
    // alert(JSON.stringify(application))

  

  useEffect(() => {
    // fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('doctor_applications')
        .select('*')
        .eq('doctor_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      // setApplication(data);
    } catch (err) {
      console.error('Error fetching application:', err);
      setError('Failed to load application status');
    } finally {
      // setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-emerald-500 bg-emerald-50';
      case 'rejected':
        return 'text-red-500 bg-red-50';
      case 'in_review':
        return 'text-blue-500 bg-blue-50';
      default:
        return 'text-amber-500 bg-amber-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-5 h-5" />;
      case 'rejected':
        return <X className="w-5 h-5" />;
      case 'pending':
        return <FileText className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'approved':
        return '100%';
      case 'rejected':
        return '100%';
      case 'pending':
        return '75%';
      default:
        return '25%';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>{error}</p>
      </div>
    );
  }

  if (data.length == 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Application Found
        </h3>
        <p className="text-gray-600 mb-6">
          You haven't submitted a doctor application yet.
        </p>
        <button
          onClick={() => navigate('/doctor/apply')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 
                   to-teal-600 text-white rounded-lg shadow-lg shadow-emerald-500/20 
                   hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform 
                   hover:scale-105 active:scale-95"
        >
          Apply Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">



{/* {JSON.stringify(data)} */}
{data?.map(application=>{

  return <>
<div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
<div className="flex items-center gap-4 mb-6">

  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
    <Shield className="w-8 h-8" />
  </div>

  
  
  <div>
    <h2 className="text-2xl font-bold mb-1">Application Status</h2>
    <p className="text-emerald-100">
      Submitted on {new Date(application?.created_at).toLocaleDateString()}
    </p>
  </div>
</div>

{/* Progress Bar */}
<div className="bg-white/20 h-2 rounded-full overflow-hidden">
  <div 
    className="h-full bg-white rounded-full transition-all duration-1000"
    style={{ width: getProgressPercentage(application?.status) }}
  />
</div>
</div>

<div className="p-6">
{/* Current Status */}
<div className="flex items-center gap-3 mb-6">
  <div className={`p-2 rounded-lg ${getStatusColor(application?.status)}`}>
    {getStatusIcon(application?.status)}
  </div>
  <div>
    <h3 className="font-semibold text-gray-900 capitalize">
      {application?.status?.replace('_', ' ')}
    </h3>
    <p className="text-gray-600 text-sm">
      {application?.status === 'pending' && 'Your application is being processed'}
      {application?.status === 'pending' && 'Our team is reviewing your application'}
      {application?.status === 'approved' && 'Congratulations! Your application has been approved'}
      {application?.status === 'rejected' && 'Unfortunately, your application was not approved'}
    </p>
  </div>
</div>

{/* Application Notes */}
{application?.notes && (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
    <p className="text-gray-600">{application?.notes}</p>
  </div>
)}

{/* Submitted Documents */}
<div className="mt-6">
  <h4 className="font-medium text-gray-900 mb-4">Submitted Documents</h4>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {JSON.parse(application?.documents)?.map(p => (
      <div
        key={p.document}
        className="p-4 border rounded-lg hover:border-emerald-500 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">{p.document}</span>
          {/*  */}
          <a href={`${p.url}`} target='_blank'><FileText className="w-5 h-5 text-gray-400" /></a>
        </div>
        <p className="text-sm text-gray-600 mt-1">Document submitted</p>
      </div>
    ))}
  </div>  
</div>


</div>
  </>
})}
        

      </div>
    </div>
  );
}