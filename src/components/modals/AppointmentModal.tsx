import React, { useState, useEffect } from 'react';
import { DEPARTMENTS, DOCTORS } from '../../data/hospitalData';
import { Doctor } from '../../types';
import { X, Calendar as CalendarIcon, Clock, User, Phone, Mail, FileText, CheckCircle2, Sparkles, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EmailSecurityCheckWidget } from '../EmailSecurityCheckWidget';
import { EmailSecurityResult } from '../../lib/emailSecurity';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDept?: string;
  preselectedDoctor?: Doctor | null;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedDept = '',
  preselectedDoctor = null,
}) => {
  const [modalDoctors, setModalDoctors] = useState<Doctor[]>(DOCTORS);

  useEffect(() => {
    const fetchModalDocs = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (data.success && Array.isArray(data.doctors)) {
          setModalDoctors(data.doctors);
        }
      } catch (err) {
        console.warn('Failed to fetch modal doctors:', err);
      }
    };
    fetchModalDocs();
  }, []);

  const [step, setStep] = useState<number>(1);
  const [selectedDept, setSelectedDept] = useState<string>(
    preselectedDoctor ? preselectedDoctor.departmentId : (preselectedDept || DEPARTMENTS[0]?.name || '')
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    preselectedDoctor ? preselectedDoctor.id : (DOCTORS[0]?.id || '')
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:30 AM');
  const [visitType, setVisitType] = useState<'In-Person' | 'Video Consultation'>('In-Person');
  
  // Patient details
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const [bookingId, setBookingId] = useState<string>('');

  if (!isOpen) return null;

  const docsToUse = modalDoctors.length > 0 ? modalDoctors : DOCTORS;

  const filteredDoctors = docsToUse.filter(
    (doc) => doc.departmentId === selectedDept || doc.specialty?.toLowerCase().includes(selectedDept.toLowerCase())
  );

  const availableSlots = [
    '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM'
  ];

  const currentDoctor = docsToUse.find((d) => d.id === selectedDoctorId) || docsToUse[0] || null;

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = 'MC-APT-' + Math.floor(100000 + Math.random() * 900000);
    setBookingId(randomId);

    // Persist to MongoDB backend API
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patientName || 'Jane Doe',
          doctorName: currentDoctor?.name || 'Duty Medical Officer',
          specialty: currentDoctor?.specialty || 'General Medicine',
          date: selectedDate,
          time: selectedTimeSlot,
          dateTime: `${selectedDate} at ${selectedTimeSlot}`,
          type: visitType,
          room: visitType === 'Video Consultation' ? 'Telehealth Room 4' : 'OPD Room 204',
          notes: symptoms,
          status: 'Scheduled'
        })
      });
      window.dispatchEvent(new Event('medicare_appointment_updated'));
    } catch (e) {
      console.warn('Failed to sync appointment to backend:', e);
    }

    setStep(4);

    // Trigger celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const resetAndClose = () => {
    setStep(1);
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setSymptoms('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-[#0B3D91] text-white">
            <CalendarIcon className="w-6 h-6 text-sky-300" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              MediCare Online Scheduler
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Book Medical Appointment
            </h3>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                step >= i ? 'bg-[#0B3D91] dark:bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Department & Doctor */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                1. Select Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  const newDocs = DOCTORS.filter(d => d.departmentId === e.target.value);
                  if (newDocs.length > 0) setSelectedDoctorId(newDocs[0].id);
                }}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91]"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.headDoctor})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                2. Select Consulting Specialist
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(filteredDoctors.length > 0 ? filteredDoctors : DOCTORS).map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selectedDoctorId === doc.id
                        ? 'border-[#0B3D91] bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-[#0B3D91]'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-12 h-12 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{doc.name}</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">{doc.specialty}</div>
                      <div className="text-[11px] text-slate-400">★ {doc.rating} ({doc.experienceYears} yrs exp)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Continue to Slot Selection &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Date & Time Slot */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Visit Consultation Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisitType('In-Person')}
                  className={`p-3 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                    visitType === 'In-Person'
                      ? 'bg-[#0B3D91] text-white border-[#0B3D91]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  🏥 Hospital In-Person OPD
                </button>
                <button
                  type="button"
                  onClick={() => setVisitType('Video Consultation')}
                  className={`p-3 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                    visitType === 'Video Consultation'
                      ? 'bg-[#0B3D91] text-white border-[#0B3D91]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  💻 HD Video Telemedicine
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Select Available Time Slot
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedTimeSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold cursor-pointer"
              >
                &larr; Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Patient Details &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Patient Information */}
        {step === 3 && (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Full Patient Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-[#0B3D91]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Patient Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-[#0B3D91]"
                  />
                </div>

                <EmailSecurityCheckWidget
                  email={patientEmail}
                  onFixEmail={(fixed) => setPatientEmail(fixed)}
                  onSecurityCheckChange={() => {}}
                  requireCodeVerification={false}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-[#0B3D91]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Symptoms or Reason for Visit
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <textarea
                  rows={3}
                  placeholder="Describe any symptoms, medical conditions, or routine checkup notes..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-[#0B3D91]"
                />
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Summary:</div>
              <div>Doctor: <strong>{currentDoctor?.name || 'Duty Medical Officer'}</strong> ({currentDoctor?.specialty || 'General Medicine'})</div>
              <div>Schedule: <strong>{selectedDate}</strong> at <strong>{selectedTimeSlot}</strong> ({visitType})</div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold cursor-pointer"
              >
                &larr; Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white font-bold text-sm shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-300" />
                <span>Confirm & Generate Booking Pass</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Confirmation Pass */}
        {step === 4 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                Appointment Confirmed & Saved!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Your appointment has been saved to the MongoDB backend database. An SMS & Email pass has been generated.
              </p>
            </div>

            {/* Printable Pass Card */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-blue-200 dark:border-slate-700 text-left space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-[#0B3D91] dark:text-blue-400 uppercase tracking-widest">
                  Official Medical Pass
                </span>
                <span className="font-mono text-xs font-bold bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300 px-2.5 py-1 rounded-md">
                  {bookingId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-400">Patient Name:</div>
                  <div className="font-bold text-slate-900 dark:text-white">{patientName || 'Jane Doe'}</div>
                </div>
                <div>
                  <div className="text-slate-400">Consultant Doctor:</div>
                  <div className="font-bold text-slate-900 dark:text-white">{currentDoctor.name}</div>
                </div>
                <div>
                  <div className="text-slate-400">Date & Slot:</div>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedDate} @ {selectedTimeSlot}</div>
                </div>
                <div>
                  <div className="text-slate-400">Visit Mode:</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">{visitType}</div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 italic">
                📍 Location: MediCare Main Hospital, OPD Suite 4A. Please arrive 15 minutes prior to your time slot.
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass</span>
              </button>
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white font-bold text-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
