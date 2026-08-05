import React, { useState, useEffect } from 'react';
import { Cross, Building2, Phone, Search, Moon, Sun, Menu, X, Calendar, UserPlus, LogIn, LogOut, User } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenSearch: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenEmergency: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  userSession?: { role: 'Patient' | 'Admin'; name: string } | null;
  onLogout?: () => void;
  onOpenDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenSearch,
  onOpenAuth,
  onOpenEmergency,
  darkMode,
  setDarkMode,
  userSession,
  onLogout,
  onOpenDashboard,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Departments', href: '#departments' },
    { name: 'Doctors', href: '#doctors' },
    { name: 'Patient & Admin Portal', href: '#auth-portal' },
    { name: 'Portal Features', href: '#hms-features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Top Announcement & Emergency Banner */}
      <div className="bg-[#0B3D91] text-white py-1.5 px-4 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-white uppercase tracking-wider">
              24/7 Active
            </span>
            <span>MediCare Emergency Care Hotline & Trauma Unit Ready</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 hover:text-sky-300 font-semibold transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Emergency: 1-800-MEDICARE</span>
            </button>
            <span className="hidden md:inline text-blue-300">|</span>
            <span className="hidden md:inline text-slate-200">📍 500 Healthcare Blvd, Suite 100</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'glass-nav shadow-md py-3'
            : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md py-4 border-b border-slate-100 dark:border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0B3D91] text-white shadow-md group-hover:bg-blue-600 transition-colors">
              <Cross className="w-6 h-6 text-sky-300 transform group-hover:scale-110 transition-transform" />
              <Building2 className="w-3.5 h-3.5 absolute bottom-1 right-1 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading text-[#0B3D91] dark:text-blue-400 tracking-tight leading-none block">
                MediCare
              </span>
              <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 tracking-widest uppercase block">
                Hospital System
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#0B3D91] dark:hover:text-blue-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#0B3D91] dark:after:bg-blue-400 hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions & Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              title="Search Doctors & Services"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Session / Auth Buttons */}
            {userSession ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenDashboard}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#0B3D91] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                  title="Open Dashboard"
                >
                  <User className="w-4 h-4 text-[#2563EB]" />
                  <span className="truncate max-w-[130px]">{userSession.name} ({userSession.role})</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                  title="Logout of session"
                >
                  <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                {/* Patient Register Button */}
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#0B3D91] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#2563EB]" />
                  <span>Register</span>
                </button>

                {/* Login Button */}
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Portal Login</span>
                </button>
              </>
            )}

            {/* Primary CTA - Book Appointment */}
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0B3D91] hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer ml-1"
            >
              <Calendar className="w-4 h-4 text-sky-300" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile menu toggle & actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end md:hidden">
          <div className="w-4/5 max-w-sm bg-white dark:bg-slate-900 h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#0B3D91] text-white rounded-lg">
                    <Cross className="w-5 h-5 text-sky-300" />
                  </div>
                  <span className="font-bold font-heading text-[#0B3D91] dark:text-blue-400">MediCare HMS</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile nav links */}
              <div className="py-6 space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-3 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#0B3D91] dark:hover:text-blue-400"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {userSession ? (
                <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Logged in as: <strong>{userSession.name}</strong> ({userSession.role})</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDashboard?.();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0B3D91] text-white font-bold text-xs shadow-md"
                  >
                    <span>Open {userSession.role} Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out ({userSession.role})</span>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2563EB] text-white font-bold shadow-md"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Patient Registration</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#0B3D91] dark:text-blue-300 font-semibold"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Portal Login (Patient/Admin)</span>
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0B3D91] text-white font-semibold shadow-lg"
              >
                <Calendar className="w-4 h-4 text-sky-300" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
