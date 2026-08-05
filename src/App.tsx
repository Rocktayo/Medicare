import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickFeatures } from './components/QuickFeatures';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Departments } from './components/Departments';
import { Doctors } from './components/Doctors';
import { HMSFeaturesMatrix } from './components/HMSFeaturesMatrix';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { FAQAccordion } from './components/FAQAccordion';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';

// Modals & Widgets
import { AppointmentModal } from './components/modals/AppointmentModal';
import { PatientPortalModal } from './components/modals/PatientPortalModal';
import { AdminPortalModal } from './components/modals/AdminPortalModal';
import { SearchModal } from './components/modals/SearchModal';
import { AuthModal } from './components/modals/AuthModal';
import { AuthPortalSection } from './components/AuthPortalSection';
import { EmergencyModal } from './components/modals/EmergencyModal';
import { PatientDashboard } from './components/PatientDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LiveChatWidget } from './components/LiveChatWidget';
import { FloatingControls } from './components/FloatingControls';
import { Doctor } from './types';
import { UserCheck, ShieldCheck, LogOut } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('medicare_theme') === 'dark';
  });

  // Navigation view state
  const [currentView, setCurrentView] = useState<'home' | 'patient-dashboard' | 'admin-dashboard'>('home');

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedDept, setPreselectedDept] = useState('');
  const [preselectedDoctor, setPreselectedDoctor] = useState<Doctor | null>(null);

  const [patientDemoOpen, setPatientDemoOpen] = useState(false);
  const [adminDemoOpen, setAdminDemoOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  // User session state
  const [userSession, setUserSession] = useState<{ role: 'Patient' | 'Admin'; name: string } | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('medicare_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('medicare_theme', 'light');
    }
  }, [darkMode]);

  const handleOpenBooking = () => {
    setPreselectedDept('');
    setPreselectedDoctor(null);
    setBookingModalOpen(true);
  };

  const handleSelectDepartmentForBooking = (deptName: string) => {
    setPreselectedDept(deptName);
    setPreselectedDoctor(null);
    setBookingModalOpen(true);
  };

  const handleSelectDoctorForBooking = (doc: Doctor) => {
    setPreselectedDoctor(doc);
    setPreselectedDept(doc.departmentId);
    setBookingModalOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (role: 'Patient' | 'Admin', name: string) => {
    setUserSession({ role, name });
    if (role === 'Patient') {
      setCurrentView('patient-dashboard');
      setPatientDemoOpen(false);
    } else {
      setCurrentView('admin-dashboard');
      setAdminDemoOpen(false);
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    setCurrentView('home');
    setPatientDemoOpen(false);
    setAdminDemoOpen(false);
    setAuthModalOpen(false);
  };

  const handleOpenDashboard = () => {
    if (userSession?.role === 'Patient') {
      setCurrentView('patient-dashboard');
    } else if (userSession?.role === 'Admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('admin-dashboard');
    }
  };

  if (currentView === 'patient-dashboard') {
    return (
      <PatientDashboard
        userName={userSession?.name}
        onLogout={handleLogout}
        onGoHome={() => setCurrentView('home')}
        onOpenBookingModal={handleOpenBooking}
      />
    );
  }

  if (currentView === 'admin-dashboard') {
    return (
      <AdminDashboard
        userName={userSession?.name}
        onLogout={handleLogout}
        onGoHome={() => setCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F9FF] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Logged in notification bar if active */}
      {userSession && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 flex items-center justify-between font-semibold shadow-inner">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <UserCheck className="w-4 h-4" />
            <span>
              Welcome back, <strong>{userSession.name}</strong> ({userSession.role} Access Active)
            </span>
            <button
              onClick={handleOpenDashboard}
              className="ml-4 underline hover:text-emerald-200 cursor-pointer font-bold"
            >
              Open My Portal Dashboard &rarr;
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 hover:text-emerald-200 cursor-pointer text-xs font-bold bg-emerald-700 hover:bg-emerald-800 px-2.5 py-1 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onOpenBooking={handleOpenBooking}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        userSession={userSession}
        onLogout={handleLogout}
        onOpenDashboard={handleOpenDashboard}
      />

      {/* Main Page Sections */}
      <main>
        <Hero
          onOpenBooking={handleOpenBooking}
          onExploreFeatures={() => {
            const elem = document.getElementById('services');
            elem?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <QuickFeatures />

        <WhyChooseUs />

        <Departments onSelectDepartmentForBooking={handleSelectDepartmentForBooking} />

        <Doctors onSelectDoctorForBooking={handleSelectDoctorForBooking} />

        <AuthPortalSection
          onLoginSuccess={handleLoginSuccess}
          userSession={userSession}
          onLogout={handleLogout}
          onOpenDashboard={handleOpenDashboard}
        />

        <HMSFeaturesMatrix
          onOpenPatientDemo={() => setCurrentView('patient-dashboard')}
          onOpenAdminDemo={() => setCurrentView('admin-dashboard')}
          onOpenBooking={handleOpenBooking}
          onOpenAuth={handleOpenAuth}
        />

        <HowItWorks
          onOpenBooking={handleOpenBooking}
          onOpenAuth={handleOpenAuth}
        />

        <Testimonials />

        <FAQAccordion />

        <CallToAction
          onOpenBooking={handleOpenBooking}
          onOpenEmergency={() => setEmergencyModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      <AppointmentModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedDept={preselectedDept}
        preselectedDoctor={preselectedDoctor}
      />

      <PatientPortalModal
        isOpen={patientDemoOpen}
        onClose={() => setPatientDemoOpen(false)}
        onLogout={handleLogout}
        userName={userSession?.role === 'Patient' ? userSession.name : undefined}
      />

      <AdminPortalModal
        isOpen={adminDemoOpen}
        onClose={() => setAdminDemoOpen(false)}
        onLogout={handleLogout}
        userName={userSession?.role === 'Admin' ? userSession.name : undefined}
        onOpenFullDashboard={() => setCurrentView('admin-dashboard')}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectDoctor={handleSelectDoctorForBooking}
        onSelectDept={handleSelectDepartmentForBooking}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
        userSession={userSession}
        onLogout={handleLogout}
      />

      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      {/* Live AI Chatbot Widget */}
      <LiveChatWidget />

      {/* Scroll to top & floating appointment pill */}
      <FloatingControls onOpenBooking={handleOpenBooking} />

    </div>
  );
}
