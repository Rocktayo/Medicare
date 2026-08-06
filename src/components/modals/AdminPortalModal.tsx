import React, { useState, useEffect } from 'react';
import { ADMIN_STATS, DOCTORS } from '../../data/hospitalData';
import { X, LayoutDashboard, Users, Calendar, BedDouble, TrendingUp, CheckCircle2, UserCheck, Plus, AlertTriangle, ShieldCheck, Database, RefreshCw, User, LogOut, Trash2 } from 'lucide-react';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  userName?: string;
  onOpenFullDashboard?: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose, onLogout, userName, onOpenFullDashboard }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'mongodb_patients'>('queue');
  const [patientQueue, setPatientQueue] = useState([
    { id: 'Q-101', name: 'Michael Vance', doctor: 'Dr. Robert Chen', time: '10:00 AM', status: 'Checked In' },
    { id: 'Q-102', name: 'Emily Blunt', doctor: 'Dr. Sarah Jenkins', time: '10:15 AM', status: 'In Consultation' },
    { id: 'Q-103', name: 'David Miller', doctor: 'Dr. Marcus Vance', time: '10:30 AM', status: 'Waiting' },
    { id: 'Q-104', name: 'Sarah Parker', doctor: 'Dr. Elena Rostova', time: '10:45 AM', status: 'Waiting' },
  ]);

  const [mongoPatients, setMongoPatients] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [bedsAvailable, setBedsAvailable] = useState(42);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMongoPatients();
    }
  }, [isOpen]);

  const fetchMongoPatients = async () => {
    setLoadingPatients(true);
    try {
      const res = await fetch('/api/admin/patients');
      const data = await res.json();
      if (data.success && data.patients) {
        setMongoPatients(data.patients);
      }
    } catch (e) {
      console.error('Failed to fetch patients from MongoDB API', e);
    } finally {
      setLoadingPatients(false);
    }
  };

  if (!isOpen) return null;

  const handleCompleteConsultation = (id: string) => {
    setPatientQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Completed' } : item))
    );
    setNotification('Patient visit marked as Completed & EMR updated.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDischargeBed = () => {
    setBedsAvailable((prev) => prev + 1);
    setNotification('Bed #402 disinfected and released to available inventory.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteMongoPatient = async (patientId: string, patientName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete patient ${patientName} (${patientId})?`)) return;
    try {
      const res = await fetch(`/api/admin/patients/${patientId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMongoPatients(prev => prev.filter(p => (p.patientId || p.id) !== patientId));
        setNotification(`Patient ${patientName} deleted successfully.`);
        setTimeout(() => setNotification(null), 3000);
        window.dispatchEvent(new Event('medicare_patient_updated'));
      }
    } catch (err) {
      console.error('Failed to delete patient:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close & Logout Action Header */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          {onOpenFullDashboard && (
            <button
              onClick={() => {
                onClose();
                onOpenFullDashboard();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-200" />
              <span>Full Admin Workspace</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition-colors cursor-pointer"
              title="Logout of Admin HMS Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Logout Admin</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Title & Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800 pt-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  HMS Master Control Panel {userName ? `• ${userName}` : ''}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <h3 className="text-2xl font-bold font-heading">
                Hospital Operations Dashboard
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>MongoDB Connected</span>
            </span>
            <button
              onClick={handleDischargeBed}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold transition-colors cursor-pointer"
            >
              + Release Bed
            </button>
          </div>
        </div>

        {notification && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {ADMIN_STATS.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="text-xs text-slate-400 font-medium">{stat.title}</div>
              <div className="text-2xl font-extrabold font-heading text-white">
                {stat.title.includes('Bed') ? `${bedsAvailable} Available` : stat.value}
              </div>
              <div className="text-[11px] font-semibold text-emerald-400">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'queue'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Today's OPD Queue ({patientQueue.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mongodb_patients')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'mongodb_patients'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>MongoDB Registered Patients ({mongoPatients.length})</span>
          </button>
        </div>

        {/* TAB 1: OPD Queue */}
        {activeTab === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: OPD Real-Time Queue */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-bold font-heading flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>Today's Live OPD Queue</span>
                </h4>
                <span className="text-xs text-slate-400">4 Active Patients in OPD</span>
              </div>

              <div className="space-y-3">
                {patientQueue.map((pt) => (
                  <div
                    key={pt.id}
                    className="p-3.5 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{pt.name} <span className="font-mono text-slate-400 font-normal">({pt.id})</span></div>
                      <div className="text-slate-400">{pt.doctor} &bull; Time: {pt.time}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full font-semibold ${
                          pt.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-400'
                            : pt.status === 'In Consultation'
                            ? 'bg-blue-950 text-blue-400 animate-pulse'
                            : 'bg-amber-950 text-amber-400'
                        }`}
                      >
                        {pt.status}
                      </span>
                      {pt.status !== 'Completed' && (
                        <button
                          onClick={() => handleCompleteConsultation(pt.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white transition-colors cursor-pointer"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Active Doctor Status & System Alerts */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Doctors Status */}
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-4">
                <h4 className="text-base font-bold font-heading flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>On-Duty Consultants</span>
                </h4>

                <div className="space-y-2.5 text-xs">
                  {DOCTORS.slice(0, 4).map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="font-semibold">{doc.name}</span>
                      </div>
                      <span className="text-slate-400">{doc.departmentId.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory & Pharmacy Alert */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Pharmacy Automated Stock Alert</span>
                </div>
                <p className="text-slate-300">
                  Amoxicillin 500mg inventory is at 14% capacity. Automated re-order request sent to supplier.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MongoDB Registered Patients */}
        {activeTab === 'mongodb_patients' && (
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-base font-bold font-heading flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>MongoDB Live Registered Patient Collection</span>
                </h4>
                <p className="text-xs text-slate-400">Real-time registered users synced to the database backend.</p>
              </div>
              <button
                onClick={fetchMongoPatients}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingPatients ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="space-y-3">
              {mongoPatients.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No registered patients found in MongoDB database. Use the "Patient Register" modal to add new patients.
                </div>
              ) : (
                mongoPatients.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="font-bold text-sm text-white">{p.fullName}</span>
                        <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded text-sky-300">
                          {p.patientId}
                        </span>
                      </div>
                      <div className="text-slate-400">
                        Email: <strong className="text-slate-200">{p.email}</strong> &bull; Phone: {p.phone || 'N/A'}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-white">Age: {p.age} ({p.gender})</div>
                        <div className="text-rose-400 font-semibold">Blood: {p.bloodGroup}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        MongoDB Active
                      </span>
                      <button
                        onClick={() => handleDeleteMongoPatient(p.patientId || p.id, p.fullName)}
                        className="px-2.5 py-1 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-400 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Delete patient from system"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
