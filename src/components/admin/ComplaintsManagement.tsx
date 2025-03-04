import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Filter, Plus, Star, Shield, 
  Edit2, Trash2, Phone, Video, Calendar, Heart, ChevronRight,
  Loader2, AlertCircle, Check, Clock, Globe2, MessageCircle 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Complaint {
  id: string;
  patient_id: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  country: string;
  created_at: string;
  updated_at: string;
  patient: {
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string;
  };
  response?: string;
}

const countries = [
  { code: 'South Africa', name: 'South Africa', flag: '🇿🇦' },
  { code: 'Tanzania', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'Kenya', name: 'Kenya', flag: '🇰🇪' },
  { code: 'Rwanda', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'Uganda', name: 'Uganda', flag: '🇺🇬' },
  { code: 'Burundi', name: 'Burundi', flag: '🇧🇮' }
];

const priorities = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' }
];

const statuses = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' }
];

export default function ComplaintsManagement() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [selectedCountry]);

  const fetchComplaints = async () => {
    try {
      let query = supabase
        .from('complaints')
        .select(`
          *,
          patient:profiles (
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedCountry) {
        query = query.eq('country', selectedCountry);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setComplaints(data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId: string, status: string) => {
    try {
      const { error: updateError } = await supabase
        .from('complaints')
        .update({ status })
        .eq('id', complaintId);

      if (updateError) throw updateError;

      setSuccess('Complaint status updated successfully');
      await fetchComplaints();
    } catch (err) {
      console.error('Error updating complaint:', err);
      setError('Failed to update complaint status');
    }
  };

  const handleSubmitResponse = async () => {
    if (!selectedComplaint) return;

    try {
      const { error: updateError } = await supabase
        .from('complaints')
        .update({
          response,
          status: 'resolved',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedComplaint.id);

      if (updateError) throw updateError;

      setSuccess('Response submitted successfully');
      setSelectedComplaint(null);
      setResponse('');
      await fetchComplaints();
    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Failed to submit response');
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.patient.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = selectedPriority === 'all' || complaint.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || complaint.status === selectedStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Complaints</h2>
          <p className="text-gray-600">Manage and respond to customer complaints</p>
        </div>
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaints..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Country Filter */}
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       bg-white"
              >
                <option value="">All Countries</option>
                {countries.map(({ code, name, flag }) => (
                  <option key={code} value={code}>{flag} {name}</option>
                ))}
              </select>
              <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90" />
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       bg-white"
              >
                {priorities.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       bg-white"
              >
                {statuses.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <img
                src={complaint.patient.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(complaint.patient.full_name)}`}
                alt={complaint.patient.full_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{complaint.patient.full_name}</h3>
                    <p className="text-sm text-gray-600">{complaint.patient.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      complaint.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : complaint.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}>
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)} Priority
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      complaint.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : complaint.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}>
                      {complaint.status.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">{complaint.subject}</h4>
                  <p className="text-gray-600">{complaint.message}</p>
                </div>

                {complaint.response && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Response:</h5>
                    <p className="text-gray-600">{complaint.response}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(complaint.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {complaint.status !== 'resolved' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(complaint.id, 'in_progress')}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Mark In Progress
                        </button>
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg
                                 hover:bg-emerald-600 transition-colors"
                        >
                          Respond
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Complaints Found
            </h3>
            <p className="text-gray-600">
              There are no complaints matching your current filters.
            </p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Respond to Complaint</h3>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Original Complaint</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">{selectedComplaint.subject}</p>
                  <p className="text-gray-600">{selectedComplaint.message}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         resize-none"
                  placeholder="Type your response here..."
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setSelectedComplaint(null);
                    setResponse('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700
                         hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitResponse}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg
                         hover:bg-emerald-600 transition-colors"
                >
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}