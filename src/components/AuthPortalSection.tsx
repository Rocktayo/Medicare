import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, CheckCircle2, AlertCircle, Phone, Database, ShieldCheck, Building2, Sparkles, ArrowRight, LogOut, UserCheck } from 'lucide-react';
import { MongoDbStatus } from './MongoDbStatus';

interface AuthPortalSectionProps {
  onLoginSuccess: (userType: 'Patient' | 'Admin', name: string) => void;
  userSession?: { role: 'Patient' | 'Admin'; name: string } | null;
  onLogout?: () => void;
  onOpenDashboard?: () => void;
}

export const AuthPortalSection: React.FC<AuthPortalSectionProps> = ({
  onLoginSuccess,
  userSession,
  onLogout,
  onOpenDashboard,
}) => {
  const [activeRole, setActiveRole] = useState<'Patient' | 'Admin'>('Patient');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [age, setAge] = useState<number | string>(30);
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Submit Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          role: activeRole,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      setSuccessMessage(`Success! Welcome back, ${data.user.fullName}. Logging into ${activeRole} Portal...`);
      setTimeout(() => {
        onLoginSuccess(data.user.role || activeRole, data.user.fullName);
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email: regEmail,
          password: regPassword,
          role: activeRole,
          phone,
          adminKey: activeRole === 'Admin' ? adminKey : undefined,
          age: activeRole === 'Patient' ? age : undefined,
          gender: activeRole === 'Patient' ? gender : undefined,
          bloodGroup: activeRole === 'Patient' ? bloodGroup : undefined,
          allergies: activeRole === 'Patient' && allergies ? allergies.split(',').map((s) => s.trim()) : [],
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Registration failed.');
      }

      setSuccessMessage(`Account created successfully for ${data.user.fullName}! Saved to MongoDB.`);
      setTimeout(() => {
        onLoginSuccess(data.user.role || activeRole, data.user.fullName);
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="auth-portal" className="py-20 bg-gradient-to-b from-blue-50/60 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-[#0B3D91] dark:text-blue-300 mb-3 border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Standalone Patient & Admin Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            Patient & Admin Authentication Center
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Access your medical records, doctor appointments, or administrative dashboard using our secure MongoDB powered portal.
          </p>
        </div>

        {/* Portal Standalone Card */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 relative overflow-hidden">
          
          {/* Active Session Notification & Logout Card */}
          {userSession && (
            <div className="mb-8 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-emerald-900 dark:text-emerald-200">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                    Active Session Authenticated
                  </span>
                  <p className="text-sm font-semibold">
                    Logged in as <strong>{userSession.name}</strong> ({userSession.role} Access)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onOpenDashboard && (
                  <button
                    type="button"
                    onClick={onOpenDashboard}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    Open Dashboard &rarr;
                  </button>
                )}
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Top Role Selector Tabs */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              1. Choose Portal Access Level
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setActiveRole('Patient');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                  activeRole === 'Patient'
                    ? 'bg-[#0B3D91] text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Patient Portal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveRole('Admin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                  activeRole === 'Admin'
                    ? 'bg-[#0B3D91] text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Staff Portal</span>
              </button>
            </div>
          </div>

          {/* Form Type Tabs: Login vs Register */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 justify-center gap-8">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`pb-3.5 text-sm sm:text-base font-bold transition-all relative cursor-pointer flex items-center gap-2 ${
                activeTab === 'login'
                  ? 'text-[#0B3D91] dark:text-blue-400 border-b-2 border-[#0B3D91] dark:border-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{activeRole} Login Form</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`pb-3.5 text-sm sm:text-base font-bold transition-all relative cursor-pointer flex items-center gap-2 ${
                activeTab === 'register'
                  ? 'text-[#0B3D91] dark:text-blue-400 border-b-2 border-[#0B3D91] dark:border-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{activeRole} Registration Form</span>
            </button>
          </div>

          {/* Error & Success Feedback Banners */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 animate-bounce" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="text-center pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {activeRole === 'Patient' ? '👤 Patient EMR Sign In' : '🛡️ Hospital Administrator Sign In'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder={activeRole === 'Patient' ? 'patient@example.com' : 'admin@example.com'}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LogIn className="w-5 h-5 text-sky-300" />
                <span>{loading ? 'Authenticating with MongoDB...' : `Log In to ${activeRole} Portal`}</span>
              </button>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="text-center pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {activeRole === 'Patient' ? '👤 Register New Patient Record' : '🛡️ Register New Admin Staff Member'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder={activeRole === 'Patient' ? 'e.g. Jane Doe' : 'e.g. Sarah Jenkins (Admin)'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder={activeRole === 'Patient' ? 'jane@example.com' : 'admin@example.com'}
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91]"
                    />
                  </div>
                </div>
              </div>

              {/* Patient Fields */}
              {activeRole === 'Patient' ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                      >
                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Medical Notes / Allergies
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Penicillin Allergy, Mild Asthma"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </>
              ) : (
                /* Admin Fields */
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Hospital Staff PIN / Authorization Key
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. ADM-KEY-2026"
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#0B3D91] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Saving to MongoDB...' : `Register ${activeRole} Account`}</span>
              </button>
            </form>
          )}

          {/* Database Footer Status */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <MongoDbStatus variant="badge" />
            <span>HIPAA Compliant Security</span>
          </div>

        </div>

      </div>
    </section>
  );
};
