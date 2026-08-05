import React, { useState } from 'react';
import { MOCK_PATIENT_RECORD } from '../../data/hospitalData';
import { X, UserCheck, Calendar, FileText, Pill, CreditCard, Download, CheckCircle2, ShieldCheck, Clock, RefreshCw, LogOut } from 'lucide-react';

interface PatientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  userName?: string;
}

export const PatientPortalModal: React.FC<PatientPortalModalProps> = ({ isOpen, onClose, onLogout, userName }) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'records' | 'prescriptions' | 'billing'>('appointments');
  const [record, setRecord] = useState(MOCK_PATIENT_RECORD);
  const [billPaid, setBillPaid] = useState(false);
  const [refillRequested, setRefillRequested] = useState<string | null>(null);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const displayName = userName || record.name;

  const mockLabs = [
    { id: 'LAB-901', name: 'Comprehensive Lipid Profile', date: 'Aug 01, 2026', doctor: 'Dr. Robert Chen', result: 'Cholesterol 185 mg/dL (Normal)', status: 'Completed' },
    { id: 'LAB-902', name: 'Complete Blood Count (CBC)', date: 'Jul 24, 2026', doctor: 'Dr. Sarah Jenkins', result: 'Hemoglobin 13.8 g/dL (Normal)', status: 'Completed' },
    { id: 'LAB-903', name: 'Serum Vitamin D3 Test', date: 'Jul 10, 2026', doctor: 'Dr. Robert Chen', result: '22 ng/mL (Mild Deficiency)', status: 'Completed' }
  ];

  const handleDownloadReport = (testName: string) => {
    setDownloadNotification(`Downloading PDF report for ${testName}...`);
    setTimeout(() => setDownloadNotification(null), 3000);
  };

  const handleRefill = (medName: string) => {
    setRefillRequested(medName);
    setTimeout(() => setRefillRequested(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close & Logout Action Header */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          {onLogout && (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-colors cursor-pointer"
              title="Logout of Patient Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Logout</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header & Patient Info Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800 pt-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0B3D91] text-white flex items-center justify-center font-bold text-xl font-heading shadow-md shrink-0">
              {displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                  {displayName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  Verified Patient
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Patient ID: <span className="font-mono text-slate-700 dark:text-slate-200">{record.patientId}</span> &bull; Age: {record.age} ({record.gender}) &bull; Blood Group: <strong className="text-rose-600">{record.bloodGroup}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-blue-50 dark:bg-slate-800 p-2.5 rounded-xl border border-blue-100 dark:border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit SSL Encrypted EMR</span>
          </div>
        </div>

        {/* Download notification Toast */}
        {downloadNotification && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{downloadNotification}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'appointments'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Appointments ({record.upcomingAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'records'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Lab Results & Medical Records</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'prescriptions'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Active E-Prescriptions ({record.prescriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'billing'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Bills & Online Payments</span>
          </button>
        </div>

        {/* TAB 1: Appointments */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {record.upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base font-heading">
                      {apt.doctorName}
                    </span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full">
                      {apt.specialty}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Schedule: <strong>{apt.dateTime}</strong></span>
                    <span>&bull;</span>
                    <span>Room: {apt.room}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRecord((prev) => ({
                        ...prev,
                        upcomingAppointments: prev.upcomingAppointments.filter((a) => a.id !== apt.id)
                      }));
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 cursor-pointer"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Lab Results & Records */}
        {activeTab === 'records' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#F5F9FF] dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">Known Patient Allergies:</div>
              <div className="flex gap-2">
                {record.allergies.map((alg, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-semibold">
                    ⚠️ {alg}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Validated Diagnostic Lab Reports</h4>
              {mockLabs.map((lab) => (
                <div
                  key={lab.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {lab.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Date: {lab.date} &bull; Ordered by: {lab.doctor}
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Result: {lab.result}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadReport(lab.name)}
                    className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 text-[#0B3D91] dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Report</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Active Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            {record.prescriptions.map((rx, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="font-bold text-[#0B3D91] dark:text-blue-400 text-base font-heading">
                    {rx.medication}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Dosage: <strong>{rx.dosage}</strong> &bull; Duration: {rx.frequency}
                  </div>
                  <div className="text-xs text-slate-400">Status: {rx.refillStatus}</div>
                </div>

                <button
                  onClick={() => handleRefill(rx.medication)}
                  className="px-4 py-2 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Request Pharmacy Refill</span>
                </button>
              </div>
            ))}

            {refillRequested && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold animate-in fade-in">
                ✅ Refill request sent to MediCare Central Pharmacy for {refillRequested}.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Bills & Payments */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-xs text-slate-400">Outstanding OPD Consultation Invoice</div>
                  <div className="font-bold text-slate-900 dark:text-white text-lg">INV-2026-9912</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Due</div>
                  <div className="font-bold text-xl text-[#0B3D91] dark:text-blue-400">$120.00</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>General OPD Consultation (Dr. Robert Chen)</span>
                  <span>$100.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Digital Diagnostic EMR Archival Fee</span>
                  <span>$20.00</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Insurance Pre-Authorization Coverage (80%)</span>
                  <span>-$96.00</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Patient Co-Pay Balance:</span>
                  <span>{billPaid ? '$0.00 (PAID)' : '$24.00'}</span>
                </div>
              </div>

              {!billPaid ? (
                <button
                  onClick={() => setBillPaid(true)}
                  className="w-full py-3 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-sky-300" />
                  <span>Pay $24.00 via Online Credit Card / Apple Pay</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500 text-white text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Invoice Paid in Full. Tax Receipt Sent to Email.</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
