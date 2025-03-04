import React, { useState, useEffect } from 'react';
import { Clock, Check, X, User, MapPin, Stethoscope, Mail, Phone, FileText, Shield, Download, Eye, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DoctorApplication {
  id: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  doctor: {
    id: string;
    specialty: string;
    experience_years: number;
    license_number: string;
    bio: string;
    profile: {
      full_name: string;
      email: string;
      phone: string;
      country: string;
      avatar_url: string;
    };
  };
  documents: Record<string, string>;
  submitted_at: string;
  notes?: string;
}

export default function DoctorApplications() {
  const [applications, setApplications] = useState<DoctorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<DoctorApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_applications')
        .select(`
          *,
          doctor:doctors (
            id,
            specialty,
            experience_years,
            license_number,
            bio,
            profile:profiles (
              full_name,
              email,
              phone,
              country,
              avatar_url
            )
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (application: DoctorApplication) => {
    setIsProcessing(true);
    try {
      // Update application status
      const { error: applicationError } = await supabase
        .from('doctor_applications')
        .update({
          status: 'approved',
          notes: reviewNotes
        })
        .eq('id', application.id);

      if (applicationError) throw applicationError;

      // Update doctor verification status
      const { error: doctorError } = await supabase
        .from('doctors')
        .update({ is_verified: true })
        .eq('id', application.doctor.id);

      if (doctorError) throw doctorError;

      // Refresh applications list
      await fetchApplications();
      setSelectedApplication(null);
    } catch (err) {
      console.error('Error approving application:', err);
      setError('Failed to approve application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (application: DoctorApplication) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('doctor_applications')
        .update({
          status: 'rejected',
          notes: reviewNotes
        })
        .eq('id', application.id);

      if (error) throw error;

      await fetchApplications();
      setSelectedApplication(null);
    } catch (err) {
      console.error('Error rejecting application:', err);
      setError('Failed to reject application');
    } finally {
      setIsProcessing(false);
    }
  };

  const viewDocument = async (url: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('doctor-documents')
        .download(url);

      if (error) throw error;

      // Create and click a temporary download link
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = url.split('/').pop() || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error downloading document:', err);
      setError('Failed to download document');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (selectedApplication) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setSelectedApplication(null)}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Applications
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => handleReject(selectedApplication)}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100
                     transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Reject
            </button>
            <button
              onClick={() => handleApprove(selectedApplication)}
              disabled={isProcessing}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600
                     transition-colors flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Approve
            </button>
          </div>
        </div>

        {/* Application Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-6">
            <img
              src={selectedApplication.doctor.profile.avatar_url || 
                   `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApplication.doctor.profile.full_name)}`}
              alt={selectedApplication.doctor.profile.full_name}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedApplication.doctor.profile.full_name}
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  {selectedApplication.doctor.profile.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {selectedApplication.doctor.profile.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {selectedApplication.doctor.profile.country}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Stethoscope className="w-4 h-4" />
                  {selectedApplication.doctor.specialty}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Professional Experience</h3>
              <p className="text-gray-600">
                {selectedApplication.doctor.experience_years} years of experience
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Medical License</h3>
              <p className="text-gray-600">{selectedApplication.doctor.license_number}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Professional Bio</h3>
              <p className="text-gray-600">{selectedApplication.doctor.bio}</p>
            </div>
          </div>

          {/* Documents */}
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-4">Submitted Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(selectedApplication.documents).map(([name, url]) => (
                <div
                  key={name}
                  className="p-4 border rounded-lg hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{name}</span>
                    <button
                      onClick={() => viewDocument(url)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg
                             transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>View Document</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Notes */}
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Review Notes</h3>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add notes about this application..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     resize-none"
              rows={4}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Doctor Applications
        </h2>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          {applications.filter(app => app.status === 'pending').length} Pending
        </span>
      </div>

      <div className="grid gap-6">
        {applications.map((application) => (
          <div
            key={application.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={application.doctor.profile.avatar_url || 
                         `https://ui-avatars.com/api/?name=${encodeURIComponent(application.doctor.profile.full_name)}`}
                    alt={application.doctor.profile.full_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.doctor.profile.full_name}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {application.doctor.profile.country}
                      </div>
                      <div className="flex items-center gap-1">
                        <Stethoscope className="w-4 h-4" />
                        {application.doctor.specialty}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {application.doctor.experience_years} years
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {application.doctor.profile.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {application.doctor.profile.phone}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSelectedApplication(application)}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-emerald-500 
                           text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  Review
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t text-sm text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Applied {new Date(application.submitted_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}

        {applications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Applications
            </h3>
            <p className="text-gray-600">
              There are no pending doctor applications at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}