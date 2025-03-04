import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, DollarSign, Settings, LogOut,
  Calendar, BarChart, TrendingUp, Activity, Phone, Video, Globe,
  Bell, AlertCircle, ChevronRight, PieChart, Image, CreditCard, Heart,
  Mail, MessageSquare
} from 'lucide-react';

// Import admin components
import DoctorManagement from '../components/admin/DoctorManagement';
import DoctorApplications from '../components/admin/DoctorApplications';
import PaymentManagement from '../components/admin/PaymentManagement';
import ProfileSettings from '../components/admin/ProfileSettings';
import RevenueManagement from '../components/admin/RevenueManagement';
import BannerManagement from '../components/admin/BannerManagement';
import ConsultationFees from '../components/admin/ConsultationFees';
import CarePlansManagement from '../components/admin/CarePlansManagement';
import AnnouncementsManagement from '../components/admin/AnnouncementsManagement';
import ComplaintsManagement from '../components/admin/ComplaintsManagement';
import HeroBannerManagement from '../components/admin/HeroBannerManagement';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'doctors', label: 'Doctors', icon: Users },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'revenue', label: 'Revenue', icon: PieChart },
  { id: 'fees', label: 'Consultation Fees', icon: CreditCard },
  { id: 'care-plans', label: 'Care Plans', icon: Heart },
  { id: 'banners', label: 'Mobile Banners', icon: Image },
  { id: 'hero-banner', label: 'Hero Banner', icon: Image },
  { id: 'announcements', label: 'Announcements', icon: Mail },
  { id: 'complaints', label: 'Complaints', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <RevenueManagement />;
      case 'doctors':
        return <DoctorManagement />;
      case 'applications':
        return <DoctorApplications />;
      case 'payments':
        return <PaymentManagement />;
      case 'revenue':
        return <RevenueManagement />;
      case 'fees':
        return <ConsultationFees />;
      case 'care-plans':
        return <CarePlansManagement />;
      case 'banners':
        return <BannerManagement />;
      case 'hero-banner':
        return <HeroBannerManagement />;
      case 'announcements':
        return <AnnouncementsManagement />;
      case 'complaints':
        return <ComplaintsManagement />;
      case 'settings':
        return <ProfileSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
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
        {/* Fixed Header */}
        <div className="fixed top-0 left-64 right-0 bg-white border-b z-10">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
          </div>
        </div>

        {/* Content Area with top padding to account for fixed header */}
        <div className="pt-24 p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}