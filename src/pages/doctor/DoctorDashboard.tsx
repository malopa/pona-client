import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, DollarSign, Settings, LogOut,
  Clock, TrendingUp, Activity, Phone, Video, Users, FileText,
  ChevronRight, AlertCircle, Star, Shield, Bell
} from 'lucide-react';

// Import doctor dashboard components
import DoctorAppointments from '../../components/doctor/DoctorAppointments';
import DoctorEarnings from '../../components/doctor/DoctorEarnings';
import DoctorProfile from '../../components/doctor/DoctorProfile';
import DoctorApplicationStatus from '../../components/doctor/DoctorApplicationStatus';
import DoctorNotifications from '../../components/doctor/DoctorNotifications';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'application', label: 'Application', icon: FileText },
  { id: 'profile', label: 'Profile', icon: Settings }
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('doctorAuth');
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DoctorOverview />;
      case 'appointments':
        return <DoctorAppointments />;
      case 'earnings':
        return <DoctorEarnings />;
      case 'notifications':
        return <DoctorNotifications />;
      case 'application':
        return <DoctorApplicationStatus />;
      case 'profile':
        return <DoctorProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Doctor Dashboard</h1>
        </div>

        <nav className="px-3 py-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1
                       transition-colors ${
                         activeTab === id
                           ? 'bg-emerald-50 text-emerald-600'
                           : 'text-gray-600 hover:bg-gray-50'
                       }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1
                     text-red-600 hover:bg-red-50 transition-colors mt-4"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Overview component with stats and recent activity
function DoctorOverview() {
  const stats = [
    {
      label: "Today's Appointments",
      value: '8',
      icon: Clock,
      color: 'emerald'
    },
    {
      label: 'Total Patients',
      value: '245',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Total Earnings',
      value: '$3,580',
      icon: DollarSign,
      color: 'purple'
    },
    {
      label: 'Rating',
      value: '4.8',
      icon: Star,
      color: 'amber'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      time: '10:00 AM',
      type: 'Video Call',
      status: 'Confirmed'
    },
    {
      id: 2,
      patient: 'Michael Brown',
      time: '11:30 AM',
      type: 'Phone Call',
      status: 'Pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`text-${color}-500 bg-${color}-50 w-12 h-12 rounded-lg
                         flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6" />
            </div>
            <p className="text-gray-600 text-sm">{label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{appointment.patient}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {appointment.time}
                    </div>
                    <div className="flex items-center gap-1">
                      {appointment.type === 'Video Call' ? (
                        <Video className="w-4 h-4" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                      {appointment.type}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                    ${appointment.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                    }`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Video className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-gray-900">Video consultation completed</p>
                <p className="text-sm text-gray-600">with John Doe • 2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-900">New 5-star review received</p>
                <p className="text-sm text-gray-600">from Sarah M. • 4 hours ago</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-900">Payment received</p>
                <p className="text-sm text-gray-600">$150.00 • 5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Status */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Application Status: Under Review</h3>
            <p className="text-emerald-100 mb-4">
              Your application is being reviewed by our team. We'll notify you once the verification
              process is complete.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-white rounded-full" />
              </div>
              <span className="text-sm">75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}