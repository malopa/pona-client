import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useMediaQuery } from './hooks/useMediaQuery';

// Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import AllDoctorsPage from './pages/mobile/AllDoctorsPage';
import BookingPage from './pages/mobile/BookingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DoctorsPage from './pages/DoctorsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import ContactPage from './pages/ContactPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorApplicationForm from './components/doctor/DoctorApplicationForm';
import DoctorApplicationStatus from './components/doctor/DoctorApplicationStatus';

// Desktop Components
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SymptomChecker from './components/SymptomChecker';
import DoctorSearch from './components/DoctorSearch';
import FeaturedDoctors from './components/FeaturedDoctors';
import SpecializedServices from './components/SpecializedServices';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

// Mobile Components
import MobileHome from './components/mobile/MobileHome';
import MobileNav from './components/mobile/MobileNav';
import MobileSymptomChecker from './components/mobile/SymptomChecker';
import Appointments from './components/mobile/Appointments';
import More from './components/mobile/More';
import SplashScreen from './components/mobile/SplashScreen';
import Registration from './components/mobile/Registration';
import MobileDoctorDashboard from './components/mobile/DoctorDashboard';

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { getTodos, postTodo } from '../my-api'

// Create a client
const queryClient = new QueryClient()


function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showSplash, setShowSplash] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'home';
  });

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setIsRegistered(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleRegistrationComplete = (data: any) => {
    setIsRegistered(true);
    localStorage.setItem('userData', JSON.stringify(data));
  };

  return (
    <QueryClientProvider client={queryClient}>
    <Router>
    
      {isMobile ? (
        // Mobile Layout

        <>
          {showSplash ? (
            <SplashScreen onFinish={() => setShowSplash(false)} />
          ) : !isRegistered ? (
            <Registration onComplete={handleRegistrationComplete} />
          ) : (
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/doctors/:country/:type" element={<AllDoctorsPage />} />
                <Route path="/book/:doctorId" element={<BookingPage />} />
                <Route path="/doctor/mobile-dashboard" element={<MobileDoctorDashboard />} />
                <Route path="/doctor/apply" element={<DoctorApplicationForm />} />
                <Route path="/doctor/application-status" element={<DoctorApplicationStatus />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={
                  <>
                    {activeTab === 'home' && <MobileHome />}
                    {activeTab === 'diagnosis' && <MobileSymptomChecker />}
                    {activeTab === 'appointments' && <Appointments />}
                    {activeTab === 'more' && <More onLogout={() => setIsRegistered(false)} />}
                    <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
                  </>
                } />
              </Routes>
            </div>
          )}
        </>
      ) : (
        // Desktop Layout
        <>
          <Header />
          <Routes>
            <Route path="/" element={
              <main>
                <HeroSection />
                <SymptomChecker />
                <DoctorSearch />
                <FeaturedDoctors />
                <SpecializedServices />
                <Testimonials />
              </main>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/doctor/dashboard/*" element={<DoctorDashboard />} />
            <Route path="/doctor/apply" element={<DoctorApplicationForm />} />
            <Route path="/doctor/application-status" element={<DoctorApplicationStatus />} />
          </Routes>
          <Footer />
        </>
        
      )}
    </Router>
    </QueryClientProvider>
  );
}

export default App;