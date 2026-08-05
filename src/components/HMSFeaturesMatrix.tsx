import React, { useState } from 'react';
import { User, ShieldCheck, Check, Sparkles, LayoutDashboard, FileText, Pill, FlaskConical, CreditCard, Bell, Users, CalendarCheck, BarChart3, Settings } from 'lucide-react';

interface HMSFeaturesMatrixProps {
  onOpenPatientDemo: () => void;
  onOpenAdminDemo: () => void;
  onOpenBooking: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const HMSFeaturesMatrix: React.FC<HMSFeaturesMatrixProps> = ({
  onOpenPatientDemo,
  onOpenAdminDemo,
  onOpenBooking,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'patient' | 'admin'>('patient');

  const patientFeatures = [
    { name: 'Register Account', desc: 'Instant self-service patient onboarding with digital ID generation', icon: User, action: () => onOpenAuth('register') },
    { name: 'Patient Login', desc: 'Secure multi-factor portal access for personal health records', icon: User, action: () => onOpenAuth('login') },
    { name: 'Book Appointment', desc: 'Select doctors, preferred slots & visit types with instant confirmation', icon: CalendarCheck, action: onOpenBooking },
    { name: 'View Medical Records', desc: 'Encrypted timeline of clinical diagnosis, vitals & past hospital visits', icon: FileText, action: onOpenPatientDemo },
    { name: 'Download Prescriptions', desc: 'E-prescriptions with digital doctor signature & pharmacy refill requests', icon: Pill, action: onOpenPatientDemo },
    { name: 'View Lab Results', desc: 'Real-time diagnostic lab reports with normal reference range comparisons', icon: FlaskConical, action: onOpenPatientDemo },
    { name: 'Pay Bills Online', desc: 'Itemized invoices, insurance pre-auth checks & instant credit card checkout', icon: CreditCard, action: onOpenPatientDemo },
    { name: 'Receive Notifications', desc: 'Automated SMS, Email & Push alerts for appointments & medicine schedules', icon: Bell, action: onOpenPatientDemo },
    { name: 'Update Profile', desc: 'Manage emergency contacts, insurance info & family dependent accounts', icon: Settings, action: onOpenPatientDemo },
  ];

  const adminFeatures = [
    { name: 'HMS Control Dashboard', desc: 'Real-time hospital KPI overview: bed occupancy, OPD queue & daily revenue', icon: LayoutDashboard, action: onOpenAdminDemo },
    { name: 'Manage Patients', desc: 'Centralized patient EMR database, admission logs & discharge summaries', icon: Users, action: onOpenAdminDemo },
    { name: 'Manage Doctors', desc: 'Duty rosters, consultation hours, department allocations & performance stats', icon: ShieldCheck, action: onOpenAdminDemo },
    { name: 'Manage Hospital Staff', desc: 'Nursing staff schedules, paramedic assignments & shift management', icon: Users, action: onOpenAdminDemo },
    { name: 'Schedule Appointments', desc: 'Smart OPD queue balancer, emergency slot overrides & doctor reassignment', icon: CalendarCheck, action: onOpenAdminDemo },
    { name: 'Pharmacy Management', desc: 'Stock level tracking, automated re-order points & batch expiry monitor', icon: Pill, action: onOpenAdminDemo },
    { name: 'Laboratory System', desc: 'Sample barcode tracking, lab tech sign-off & critical value alerts', icon: FlaskConical, action: onOpenAdminDemo },
    { name: 'Billing & Accounting', desc: 'Automatic claim generation, tariff management & tax audit compliance', icon: CreditCard, action: onOpenAdminDemo },
    { name: 'Reports & Analytics', desc: 'Exportable financial statements, patient flow heatmaps & clinical metrics', icon: BarChart3, action: onOpenAdminDemo },
    { name: 'Inventory Management', desc: 'Medical supply chain tracking, surgical asset logs & vendor management', icon: Settings, action: onOpenAdminDemo },
    { name: 'Role-Based Access', desc: 'Fine-grained security permissions for Doctors, Nurses & Finance staff', icon: ShieldCheck, action: onOpenAdminDemo },
  ];

  return (
    <section id="hms-features" className="py-16 lg:py-24 bg-[#F5F9FF] dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300 uppercase tracking-widest">
            Dual Ecosystem Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            Designed for Patients & Hospital Administrators
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            MediCare HMS bridges patient convenience with high-throughput hospital management controls. Access live portal capabilities below!
          </p>
        </div>

        {/* Tab Switcher & Portal Launchers */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
          
          {/* Main Tabs */}
          <div className="flex p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('patient')}
              className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'patient'
                  ? 'bg-white dark:bg-slate-900 text-[#0B3D91] dark:text-blue-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient Features</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-white dark:bg-slate-900 text-[#0B3D91] dark:text-blue-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin & Staff Features</span>
            </button>
          </div>

          {/* Interactive Portal Launcher CTA */}
          <div>
            {activeTab === 'patient' ? (
              <button
                onClick={onOpenPatientDemo}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Open Patient Portal</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminDemo}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Open Admin Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Features Grid */}
        {activeTab === 'patient' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patientFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  onClick={feat.action}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-200 flex items-start gap-4 group cursor-pointer"
                >
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#0B3D91] dark:text-blue-400 group-hover:bg-[#0B3D91] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white font-heading text-base group-hover:text-[#0B3D91] dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      <span>{feat.name}</span>
                      <Check className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  onClick={feat.action}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-200 flex items-start gap-4 group cursor-pointer"
                >
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-900 group-hover:text-sky-300 dark:group-hover:bg-blue-600 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white font-heading text-base group-hover:text-[#0B3D91] dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      <span>{feat.name}</span>
                      <Check className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
