import React, { useState } from 'react';
import { Calendar, Clock, Video, Phone, Search, Filter, ChevronRight, AlertCircle } from 'lucide-react';

const tabs = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' }
];

const appointments = {
  upcoming: [
    {
      id: 1,
      patient: "Sarah Johnson",
      date: "2024-03-20",
      time: "10:00 AM",
      type: "Video Call",
      status: "Confirmed",
      symptoms: "Headache, Fever",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150"
    },
    {
      id: 2,
      patient: "Michael Brown",
      date: "2024-03-20",
      time: "11:30 AM",
      type: "Phone Call",
      status: "Pending",
      symptoms: "Back Pain",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150"
    }
  ],
  completed: [
    {
      id: 3,
      patient: "Emily Wilson",
      date: "2024-03-19",
      time: "2:30 PM",
      type: "Video Call",
      status: "Completed",
      symptoms: "Allergies",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150"
    }
  ],
  cancelled: [
    {
      id: 4,
      patient: "John Davis",
      date: "2024-03-18",
      time: "3:00 PM",
      type: "Phone Call",
      status: "Cancelled",
      reason: "Patient requested reschedule",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"
    }
  ]
};

export default function DoctorAppointments() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAppointments = appointments[activeTab as keyof typeof appointments].filter(
    appointment => 
      appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.symptoms?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border
                         border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6 p-1">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-emerald-600'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all
                     transform hover:-translate-y-1 duration-300"
          >
            <div className="flex items-start gap-4">
              <img
                src={appointment.image}
                alt={appointment.patient}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.patient}
                    </h3>
                    {appointment.symptoms && (
                      <p className="text-emerald-600">{appointment.symptoms}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                      ${appointment.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : appointment.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : appointment.status === 'Completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>{new Date(appointment.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    {appointment.type === 'Video Call' ? (
                      <Video className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Phone className="w-5 h-5 text-gray-400" />
                    )}
                    <span>{appointment.type}</span>
                  </div>
                </div>

                {activeTab === 'upcoming' && (
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 
                                   text-white py-2 rounded-lg shadow-lg shadow-emerald-500/20 
                                   hover:shadow-xl hover:shadow-emerald-500/30 transition-all 
                                   transform hover:scale-[1.02] active:scale-98">
                      Start Consultation
                    </button>
                    <button className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg
                                   hover:bg-red-50 transition-all transform hover:scale-[1.02] 
                                   active:scale-98">
                      Cancel
                    </button>
                  </div>
                )}

                {appointment.reason && (
                  <div className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{appointment.reason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab} appointments
            </h3>
            <p className="text-gray-600">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming appointments."
                : `You don't have any ${activeTab} appointments.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}