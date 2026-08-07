import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User, CheckCircle2, AlertCircle, Phone, Database, ShieldCheck, Building2, LogOut, UserCheck } from 'lucide-react';
import { MongoDbStatus } from '../MongoDbStatus';
import { EmailSecurityCheckWidget } from '../EmailSecurityCheckWidget';
import { EmailSecurityResult } from '../../lib/emailSecurity';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onLoginSuccess: (userType: 'Patient' | 'Admin', name: string) => void;
  userSession?: { role: 'Patient' | 'Admin'; name: string } | null;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess,
  userSession,
  onLogout,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [userRole, setUserRole] = useState<'Patient' | 'Admin'>('Patient');
  const [regRole, setRegRole] = useState<'Patient' | 'Admin'>('Patient');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration Form State
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

  // Email Security Check States
  const [emailSecurityResult, setEmailSecurityResult] = useState<EmailSecurityResult | null>(null);
  const [isEmailSecurityPassed, setIsEmailSecurityPassed] = useState<boolean>(false);

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Submit Registration to MongoDB API
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Security Check Enforcement
    if (emailSecurityResult && emailSecurityResult.status === 'rejected') {
      setErrorMessage(emailSecurityResult.message || 'Email address failed security audit.');
      return;
    }

    if (emailSecurityResult && emailSecurityResult.hasTypoWarning) {
      setErrorMessage(emailSecurityResult.message || 'Please fix the domain typo in your email.');
      return;
    }

    if (!isEmailSecurityPassed) {
      setErrorMessage('Please complete the 6-digit email security passcode verification step.');
      return;
    }

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
          role: regRole,
          phone,
          adminKey: regRole === 'Admin' ? adminKey : undefined,
          age: regRole === 'Patient' ? age : undefined,
          gender: regRole === 'Patient' ? gender : undefined,
          bloodGroup: regRole === 'Patient' ? bloodGroup : undefined,
          allergies: regRole === 'Patient' && allergies ? allergies.split(',').map((s) => s.trim()) : []
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete registration.');
      }

      setIsSuccess(true);
      setSuccessMsg(`${regRole} account created for ${data.user.fullName}! Saved to MongoDB database.`);
      
      setTimeout(() => {
        setIsSuccess(false);
        onLoginSuccess(data.user.role || regRole, data.user.fullName);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to registration backend.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Login to MongoDB API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          role: userRole
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials or role selection.');
      }

      setIsSuccess(true);
      setSuccessMsg(`Welcome back, ${data.user.fullName}! Authenticated via MongoDB.`);

      setTimeout(() => {
        setIsSuccess(false);
        onLoginSuccess(data.user.role || userRole, data.user.fullName);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-[#0B3D91] text-white shadow-md">
            <ShieldCheck className="w-6 h-6 text-sky-300" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              MediCare EMR Authentication Portal
            </span>
            <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              {mode === 'login' ? 'Portal Login' : `New ${regRole} Registration`}
            </h3>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Login Portal</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Registration</span>
          </button>
        </div>

        {/* Active Session Notification */}
        {userSession && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Active Session: <strong>{userSession.name}</strong> ({userSession.role})</span>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <div className="font-bold text-xl text-slate-900 dark:text-white">
              {successMsg}
            </div>
            <div className="text-xs text-slate-500">Connecting to secure session...</div>
          </div>
        ) : mode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Portal Access Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Patient', 'Admin'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setUserRole(role)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                      userRole === role
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {role === 'Patient' ? '👤 Patient Login' : '🛡️ Admin Login'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Email Address or Health ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder={userRole === 'Patient' ? 'patient@example.com' : 'admin@example.com'}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-[#0B3D91] text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-[#0B3D91] text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating MongoDB...' : `Login to ${userRole} Portal`}</span>
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM (PATIENT & ADMIN) */
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Account Type Selector for Registration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Account Registration Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRegRole('Patient')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    regRole === 'Patient'
                      ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  👤 Patient Account
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('Admin')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    regRole === 'Admin'
                      ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  🛡️ Admin Staff Account
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder={regRole === 'Patient' ? 'e.g. Jane Miller' : 'e.g. Sarah Jenkins (Admin)'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-[#0B3D91] text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder={regRole === 'Patient' ? 'jane@example.com' : 'apataomotayo@gmail.com'}
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-[#0B3D91] text-slate-900 dark:text-white"
                  />
                </div>

                {/* Email Security Audit Widget */}
                <EmailSecurityCheckWidget
                  email={regEmail}
                  onFixEmail={(fixed) => setRegEmail(fixed)}
                  onSecurityCheckChange={(res, verified) => {
                    setEmailSecurityResult(res);
                    setIsEmailSecurityPassed(verified);
                  }}
                  requireCodeVerification={true}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-[#0B3D91] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Patient Specific Fields */}
            {regRole === 'Patient' ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Known Allergies or Medical Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Latex, Asthma"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </>
            ) : (
              /* Admin Specific Field */
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Hospital Admin Passcode / Security PIN (Optional)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. ADMIN-2026-KEY"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-[#0B3D91] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-[#0B3D91] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#0B3D91] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Account in MongoDB...' : `Complete ${regRole} Registration`}</span>
            </button>
          </form>
        )}

        {/* Database Footer Status */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <MongoDbStatus variant="badge" />
          <span>256-Bit SSL Secured</span>
        </div>

      </div>
    </div>
  );
};
