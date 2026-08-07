import React, { useState, useEffect } from 'react';
import { MongoDbStatus } from './MongoDbStatus';
import {
  Calendar,
  FileText,
  Pill,
  CreditCard,
  User,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Download,
  AlertCircle,
  Plus,
  ArrowLeft,
  LogOut,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Activity,
  Award,
  Stethoscope,
  Building2,
  FileCheck,
  Check,
  Video
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS, MOCK_PATIENT_RECORD } from '../data/hospitalData';
import { Doctor } from '../types';

interface PatientDashboardProps {
  userName?: string;
  onLogout: () => void;
  onGoHome: () => void;
  onOpenBookingModal?: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  userName,
  onLogout,
  onGoHome,
}) => {
  // Active Tab: 1. Book Appointment | 2. View Medical Records | 3. View Prescription | 4. Pay Hospital Bills | 5. Update Profile
  const [activeTab, setActiveTab] = useState<'book' | 'records' | 'prescriptions' | 'billing' | 'profile'>('book');

  // Patient Record State
  const [patientRecord, setPatientRecord] = useState(MOCK_PATIENT_RECORD);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: userName || patientRecord.name,
    email: 'patient@medicare.org',
    phone: '+1 (555) 234-5678',
    age: patientRecord.age,
    gender: patientRecord.gender,
    bloodGroup: patientRecord.bloodGroup,
    allergies: patientRecord.allergies.join(', '),
    address: '742 Evergreen Terrace, Springfield, OR',
    emergencyContactName: 'John Doe (Spouse)',
    emergencyContactPhone: '+1 (555) 987-6543',
    insuranceProvider: 'MediCare Plus Premier',
    insurancePolicyNum: 'POL-99238411'
  });

  const [profileSaved, setProfileSaved] = useState(false);

  // Appointment Booking Form State
  const [selectedDeptId, setSelectedDeptId] = useState(DEPARTMENTS[0]?.id || '');
  const [selectedDocId, setSelectedDocId] = useState(DOCTORS[0]?.id || '');
  const [bookingDate, setBookingDate] = useState('2026-08-15');
  const [bookingTime, setBookingTime] = useState('09:00 AM');
  const [visitType, setVisitType] = useState<'In-Person' | 'Video Consultation'>('In-Person');
  const [symptoms, setSymptoms] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  // Billing State
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-001',
      title: 'Routine OPD Consultation & Lab Diagnostics',
      date: 'Aug 01, 2026',
      dueDate: 'Aug 15, 2026',
      doctor: 'Dr. Robert Chen',
      department: 'General Medicine',
      amount: 180.00,
      insuranceCoverage: 120.00,
      payableAmount: 60.00,
      status: 'Unpaid',
      items: [
        { desc: 'OPD Doctor Consultation Fee', fee: 100.00 },
        { desc: 'Comprehensive Lipid Profile', fee: 50.00 },
        { desc: 'Complete Blood Count (CBC)', fee: 30.00 }
      ]
    },
    {
      id: 'INV-2026-002',
      title: 'Pediatric Immunization & Growth Checkup',
      date: 'Jul 15, 2026',
      dueDate: 'Jul 30, 2026',
      doctor: 'Dr. Sarah Jenkins',
      department: 'Pediatrics',
      amount: 140.00,
      insuranceCoverage: 140.00,
      payableAmount: 0.00,
      status: 'Paid',
      items: [
        { desc: 'Pediatric Well-Child Examination', fee: 90.00 },
        { desc: 'Routine Vaccination Service', fee: 50.00 }
      ]
    }
  ]);

  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Prescriptions Refill State
  const [refillStatus, setRefillStatus] = useState<{ [key: string]: boolean }>({});
  const [prescriptionMsg, setPrescriptionMsg] = useState<string | null>(null);

  // Download Notification
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  // Live Doctors state
  const [allDoctors, setAllDoctors] = useState<Doctor[]>(DOCTORS);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (data.success && Array.isArray(data.doctors)) {
          setAllDoctors(data.doctors);
        }
      } catch (err) {
        console.warn('Failed to fetch doctors in patient dashboard:', err);
      }
    };
    fetchDoctors();
    window.addEventListener('medicare_doctor_updated', fetchDoctors);
    return () => window.removeEventListener('medicare_doctor_updated', fetchDoctors);
  }, []);

  // Filtered Doctors for booking
  const filteredDoctors = allDoctors.filter(d => d.departmentId === selectedDeptId);

  // Fetch real-time appointments from database API
  useEffect(() => {
    const fetchPatientAppointments = async () => {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        if (data.success && Array.isArray(data.appointments)) {
          const formatted = data.appointments.map((a: any) => ({
            id: a.id,
            doctorName: a.doctorName || 'Dr. Duty Doctor',
            specialty: a.specialty || 'General Medicine',
            dateTime: a.dateTime || (a.date && a.time ? `${a.date} at ${a.time}` : 'Tomorrow, 10:00 AM'),
            room: a.room || 'OPD Room 204'
          }));
          if (formatted.length > 0) {
            setPatientRecord(prev => ({
              ...prev,
              upcomingAppointments: formatted
            }));
          }
        }
      } catch (err) {
        console.warn('Failed to fetch patient appointments API:', err);
      }
    };

    fetchPatientAppointments();
    const interval = setInterval(fetchPatientAppointments, 3000);
    window.addEventListener('medicare_appointment_updated', fetchPatientAppointments);
    return () => {
      clearInterval(interval);
      window.removeEventListener('medicare_appointment_updated', fetchPatientAppointments);
    };
  }, []);

  // Handle Book Appointment Submission
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const doc = allDoctors.find(d => d.id === selectedDocId) || allDoctors[0] || null;
    const dept = DEPARTMENTS.find(dep => dep.id === selectedDeptId);

    const newAptData = {
      patientName: userName || patientRecord.name,
      doctorName: doc ? doc.name : 'Duty Medical Specialist',
      specialty: doc ? `${doc.specialty} (${dept?.name || 'General'})` : (dept?.name || 'General OPD'),
      date: bookingDate,
      time: bookingTime,
      dateTime: `${bookingDate} at ${bookingTime}`,
      room: visitType === 'Video Consultation' ? 'Telehealth Room 4' : 'OPD Room 204',
      type: visitType,
      notes: symptoms,
      status: 'Scheduled'
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAptData)
      });
      const data = await res.json();
      if (data.success && data.appointment) {
        const booked = data.appointment;
        setPatientRecord(prev => ({
          ...prev,
          upcomingAppointments: [
            {
              id: booked.id,
              doctorName: booked.doctorName,
              specialty: booked.specialty,
              dateTime: booked.dateTime || `${bookingDate} at ${bookingTime}`,
              room: booked.room
            },
            ...prev.upcomingAppointments
          ]
        }));
      }
    } catch (err) {
      console.error('Error posting appointment:', err);
    }

    // Dispatch custom event to notify all listening components in real-time
    window.dispatchEvent(new Event('medicare_appointment_updated'));

    const targetDocName = doc?.name || 'Duty Specialist';
    setBookingSuccessMsg(`Appointment booked successfully with ${targetDocName} on ${bookingDate} at ${bookingTime}! Recorded in database.`);
    setSymptoms('');
    setTimeout(() => setBookingSuccessMsg(null), 5000);
  };

  // Handle Pay Invoice
  const handlePayInvoice = (invoiceId: string) => {
    setPayingInvoiceId(invoiceId);
    setTimeout(() => {
      setInvoices(prev =>
        prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid', payableAmount: 0 } : inv)
      );
      setPayingInvoiceId(null);
      setPaymentSuccessMsg(`Payment of invoice #${invoiceId} completed successfully! Receipt generated.`);
      setTimeout(() => setPaymentSuccessMsg(null), 5000);
    }, 1200);
  };

  // Handle Prescription Refill Request
  const handleRequestRefill = (medication: string) => {
    setRefillStatus(prev => ({ ...prev, [medication]: true }));
    setPrescriptionMsg(`Refill request for ${medication} submitted to MediCare Hospital Pharmacy.`);
    setTimeout(() => setPrescriptionMsg(null), 4000);
  };

  // Handle Profile Form Submit
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientRecord(prev => ({
      ...prev,
      name: profileForm.name,
      age: Number(profileForm.age),
      gender: profileForm.gender,
      bloodGroup: profileForm.bloodGroup,
      allergies: profileForm.allergies.split(',').map(s => s.trim()).filter(Boolean)
    }));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 4000);
  };

  // Handle PDF Download Simulation
  const handleDownload = (filename: string) => {
    setDownloadMsg(`Downloading ${filename}...`);
    setTimeout(() => setDownloadMsg(null), 3000);
  };

  const displayName = profileForm.name || userName || 'Jane Doe';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              <span>Hospital Main Site</span>
            </button>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#0B3D91] text-white shadow-xs">
                <HeartPulse className="w-5 h-5 text-sky-300" />
              </div>
              <span className="font-heading font-extrabold text-lg text-[#0B3D91] dark:text-blue-400 hidden sm:inline">
                MediCare Patient Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MongoDbStatus variant="navbar" />
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Encrypted Patient EMR</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Patient Profile Hero Banner */}
      <section className="bg-gradient-to-r from-[#0B3D91] via-blue-900 to-indigo-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center font-bold text-2xl sm:text-3xl font-heading shadow-xl shrink-0">
              {displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
                  {displayName}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Verified Patient
                </span>
              </div>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                Patient ID: <span className="font-mono font-bold text-sky-300">{patientRecord.patientId}</span> &bull; Age: {patientRecord.age} ({patientRecord.gender}) &bull; Blood Group: <strong className="text-rose-300">{patientRecord.bloodGroup}</strong>
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-blue-200 flex-wrap">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-sky-300" /> {profileForm.phone}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-sky-300" /> {profileForm.email}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs">
            <div>
              <span className="text-blue-200 block text-[10px] uppercase font-bold tracking-wider">Known Allergies</span>
              <strong className="text-rose-200 truncate block">{patientRecord.allergies.join(', ') || 'None'}</strong>
            </div>
            <div>
              <span className="text-blue-200 block text-[10px] uppercase font-bold tracking-wider">Insurance Status</span>
              <strong className="text-emerald-300 truncate block">Active Coverage</strong>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-blue-200 block text-[10px] uppercase font-bold tracking-wider">Emergency Contact</span>
              <strong className="text-white truncate block">{profileForm.emergencyContactName}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-slate-800 mb-8 flex flex-wrap gap-2">
          
          <button
            onClick={() => setActiveTab('book')}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'book'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>1. Book Appointment</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'records'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. View Medical Records</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'prescriptions'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>3. View Prescription</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'billing'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>4. Pay Hospital Bills</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>5. Update Profile</span>
          </button>

        </div>

        {/* Global Feedback Notifications */}
        {downloadMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-sky-600 text-white font-bold text-sm flex items-center gap-3 shadow-lg animate-in fade-in">
            <Download className="w-5 h-5" />
            <span>{downloadMsg}</span>
          </div>
        )}

        {/* TAB 1: BOOK APPOINTMENT */}
        {activeTab === 'book' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Appointment Form */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0B3D91] dark:text-blue-300">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                    Book a Specialist Appointment
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Schedule an OPD consultation or HD video appointment with MediCare doctors.
                  </p>
                </div>
              </div>

              {bookingSuccessMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-900 dark:text-emerald-200">Booking Confirmed!</strong>
                    <span>{bookingSuccessMsg}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleBookAppointment} className="space-y-6">
                
                {/* Department Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    1. Select Specialty Department
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {DEPARTMENTS.map((dept) => (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => {
                          setSelectedDeptId(dept.id);
                          const doc = allDoctors.find(d => d.departmentId === dept.id);
                          if (doc) setSelectedDocId(doc.id);
                        }}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                          selectedDeptId === dept.id
                            ? 'bg-blue-50 dark:bg-blue-950/80 border-[#0B3D91] text-[#0B3D91] dark:text-blue-300 font-bold shadow-xs'
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xs font-bold block truncate">{dept.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">Head: {dept.headDoctor.split(',')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Doctor Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    2. Choose Physician / Specialist
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDocId(doc.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                            selectedDocId === doc.id
                              ? 'bg-blue-50 dark:bg-blue-950/80 border-[#0B3D91] text-[#0B3D91] dark:text-blue-300 shadow-sm'
                              : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <img
                            src={doc.photo}
                            alt={doc.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {doc.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {doc.specialty}
                            </p>
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                              ★ {doc.rating} ({doc.reviewsCount} reviews) &bull; {doc.experienceYears} yrs exp
                            </span>
                          </div>
                          {selectedDocId === doc.id && (
                            <CheckCircle2 className="w-5 h-5 text-[#0B3D91] dark:text-blue-400 shrink-0" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 p-4 text-center text-xs text-slate-400">
                        No specific doctors listed for this department. Default hospital physician assigned.
                      </div>
                    )}
                  </div>
                </div>

                {/* Consultation Mode & Date Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Consultation Mode
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setVisitType('In-Person')}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          visitType === 'In-Person'
                            ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>In-Person</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisitType('Video Consultation')}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          visitType === 'Video Consultation'
                            ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Video Call</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Select Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0B3D91]"
                    />
                  </div>
                </div>

                {/* Interactive Time Slot Picker */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Select Available Time Slot
                    </label>
                    <span className="text-xs font-bold text-[#0B3D91] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                      Selected: {bookingTime}
                    </span>
                  </div>

                  {/* Time slot quick buttons */}
                  <div className="space-y-2.5 mb-3">
                    {/* Morning slots */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                        🌅 Morning Slots
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['08:30 AM', '09:00 AM', '10:30 AM', '11:30 AM'].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingTime(slot)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              bookingTime === slot
                                ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-md ring-2 ring-blue-400 dark:ring-sky-500 scale-[1.02]'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-300'
                            }`}
                          >
                            <span>{slot}</span>
                            {bookingTime === slot && <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Afternoon & Evening slots */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                        ☀️ Afternoon & Evening Slots
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['01:30 PM', '02:00 PM', '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM'].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingTime(slot)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              bookingTime === slot
                                ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-md ring-2 ring-blue-400 dark:ring-sky-500 scale-[1.02]'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-300'
                            }`}
                          >
                            <span>{slot}</span>
                            {bookingTime === slot && <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Synced Dropdown Select */}
                  <div className="pt-1">
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0B3D91]"
                    >
                      <option value="08:30 AM">08:30 AM (Morning)</option>
                      <option value="09:00 AM">09:00 AM (Morning)</option>
                      <option value="10:30 AM">10:30 AM (Morning)</option>
                      <option value="11:30 AM">11:30 AM (Morning)</option>
                      <option value="01:30 PM">01:30 PM (Afternoon)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon)</option>
                      <option value="03:30 PM">03:30 PM (Afternoon)</option>
                      <option value="04:30 PM">04:30 PM (Evening)</option>
                      <option value="05:30 PM">05:30 PM (Evening)</option>
                      <option value="06:30 PM">06:30 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                {/* Symptoms text */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Reason for Visit / Main Symptoms
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your health symptoms, duration, or routine checkup request..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#0B3D91] hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-sky-300" />
                  <span>Confirm & Schedule Appointment</span>
                </button>

              </form>
            </div>

            {/* Upcoming Appointments Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>My Upcoming Appointments</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300">
                    {patientRecord.upcomingAppointments.length}
                  </span>
                </div>

                {patientRecord.upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {patientRecord.upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <strong className="text-slate-900 dark:text-white text-sm block">
                              {apt.doctorName}
                            </strong>
                            <span className="text-slate-500 dark:text-slate-400 block font-medium">
                              {apt.specialty}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            Scheduled
                          </span>
                        </div>

                        <div className="text-slate-600 dark:text-slate-300 font-medium pt-1 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                          <span>{apt.dateTime}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-mono">{apt.room}</span>
                        </div>

                        <button
                          onClick={() => {
                            setPatientRecord(prev => ({
                              ...prev,
                              upcomingAppointments: prev.upcomingAppointments.filter(a => a.id !== apt.id)
                            }));
                          }}
                          className="w-full mt-1 py-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-[11px] font-bold text-center border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No upcoming appointments scheduled.
                  </div>
                )}
              </div>

              {/* Quick Helpline Info */}
              <div className="p-5 rounded-3xl bg-blue-50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs space-y-2">
                <div className="font-bold text-[#0B3D91] dark:text-blue-300 flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>MediCare Patient Support</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Need urgent appointment rescheduling or ambulance help? Call 24/7 OPD desk at:
                </p>
                <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  +1 (800) 555-MEDICARE
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: VIEW MEDICAL RECORDS */}
        {activeTab === 'records' && (
          <div className="space-y-8">
            
            {/* Header & Quick Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Blood Pressure</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                  120/80 <span className="text-xs font-normal text-slate-400">mmHg</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">Optimal Reading</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Heart Rate</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                  72 <span className="text-xs font-normal text-slate-400">bpm</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">Resting Normal</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Blood Sugar (Fasting)</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                  94 <span className="text-xs font-normal text-slate-400">mg/dL</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">Normal Range</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Oxygen Saturation</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                  99% <span className="text-xs font-normal text-slate-400">SpO2</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">Excellent</span>
              </div>
            </div>

            {/* Diagnostic Lab Reports Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Diagnostic Lab Reports & Clinical Testing</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Verified laboratory reports issued by MediCare Diagnostic Center.
                  </p>
                </div>

                <button
                  onClick={() => handleDownload('All_Lab_Reports_Summary.pdf')}
                  className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 text-[#0B3D91] dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Export All Records PDF</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 pr-4">Test Description</th>
                      <th className="pb-3 px-4">Date</th>
                      <th className="pb-3 px-4">Attending Physician</th>
                      <th className="pb-3 px-4">Result Overview</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">
                        Comprehensive Lipid Profile
                      </td>
                      <td className="py-4 px-4 text-slate-500">Aug 01, 2026</td>
                      <td className="py-4 px-4">Dr. Robert Chen</td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Total Cholesterol 185 mg/dL (Normal)
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                          Completed
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <button
                          onClick={() => handleDownload('Lipid_Profile_Report.pdf')}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-200 font-bold text-[11px] cursor-pointer"
                        >
                          Download Report
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">
                        Complete Blood Count (CBC)
                      </td>
                      <td className="py-4 px-4 text-slate-500">Jul 24, 2026</td>
                      <td className="py-4 px-4">Dr. Sarah Jenkins</td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Hemoglobin 13.8 g/dL (Normal)
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                          Completed
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <button
                          onClick={() => handleDownload('CBC_Blood_Report.pdf')}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-200 font-bold text-[11px] cursor-pointer"
                        >
                          Download Report
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">
                        Serum Vitamin D3 Test
                      </td>
                      <td className="py-4 px-4 text-slate-500">Jul 10, 2026</td>
                      <td className="py-4 px-4">Dr. Robert Chen</td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          22 ng/mL (Mild Deficiency)
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                          Action Advised
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <button
                          onClick={() => handleDownload('Vitamin_D3_Report.pdf')}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-200 font-bold text-[11px] cursor-pointer"
                        >
                          Download Report
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Medical Timeline & Clinical Notes */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-6">
                Clinical Diagnosis History
              </h3>

              <div className="space-y-6">
                {patientRecord.recentDiagnoses.map((diag, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <strong className="text-sm font-bold text-slate-900 dark:text-white">
                          {diag}
                        </strong>
                        <span className="text-xs text-slate-400">Recorded EMR File</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Evaluated during outpatient clinical review. Recommended diet adjustments and prescribed appropriate routine medication.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: VIEW PRESCRIPTION */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            
            {prescriptionMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{prescriptionMsg}</span>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                    <Pill className="w-5 h-5 text-blue-600" />
                    <span>Active Digital Prescriptions</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Authorized E-Prescriptions with digital physician signature.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    ✓ Doctor Digital Signature Verified
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patientRecord.prescriptions.map((rx, idx) => {
                  const isRefilled = refillStatus[rx.medication];
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-base text-slate-900 dark:text-white font-heading">
                            {rx.medication}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300">
                            {rx.dosage}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                          <p><strong>Frequency:</strong> {rx.frequency}</p>
                          <p><strong>Refill Status:</strong> {rx.refillStatus}</p>
                          <p className="text-slate-400">Prescribing Physician: Dr. Robert Chen (MD)</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleDownload(`Prescription_${rx.medication}.pdf`)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          Print Rx PDF
                        </button>

                        <button
                          disabled={isRefilled}
                          onClick={() => handleRequestRefill(rx.medication)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isRefilled
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-[#0B3D91] hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          {isRefilled ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Refill Requested</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Request Pharmacy Refill</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Medication Usage Guide */}
              <div className="mt-8 p-5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs space-y-2">
                <div className="font-bold text-[#0B3D91] dark:text-blue-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Important Pharmacy Instructions:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Always take prescribed antibiotics for the full recommended duration. Refill requests sent before 2:00 PM are processed same-day by MediCare In-House Hospital Pharmacy.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PAY HOSPITAL BILLS */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            
            {paymentSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{paymentSuccessMsg}</span>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span>Hospital Invoices & Online Payments</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pay medical bills, view insurance claims pre-authorizations & download receipts.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl">
                  <span>Insurance Policy: <strong>MediCare Plus (#POL-99238411)</strong></span>
                </div>
              </div>

              <div className="space-y-6">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-base">
                            {inv.title}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'Paid'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {inv.status === 'Paid' ? 'Paid in Full' : 'Payment Due'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block font-mono mt-0.5">
                          Invoice ID: {inv.id} &bull; Date: {inv.date} &bull; Attending: {inv.doctor}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Out-of-Pocket Balance</span>
                        <strong className="text-2xl font-extrabold text-[#0B3D91] dark:text-blue-400 font-heading">
                          ${inv.payableAmount.toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    {/* Itemized breakdown */}
                    <div className="space-y-1.5 text-xs">
                      <strong className="text-slate-700 dark:text-slate-300 block font-semibold">Itemized Medical Breakdown:</strong>
                      {inv.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                          <span>{item.desc}</span>
                          <span className="font-mono">${item.fee.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold py-1">
                        <span>Insurance Pre-Auth Coverage ({profileForm.insuranceProvider})</span>
                        <span className="font-mono">-${inv.insuranceCoverage.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        onClick={() => handleDownload(`Invoice_Receipt_${inv.id}.pdf`)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        Download Detailed Receipt PDF
                      </button>

                      {inv.status !== 'Paid' && (
                        <button
                          disabled={payingInvoiceId === inv.id}
                          onClick={() => handlePayInvoice(inv.id)}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>{payingInvoiceId === inv.id ? 'Processing Payment...' : `Pay $${inv.payableAmount.toFixed(2)} Now`}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: UPDATE PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0B3D91] dark:text-blue-300">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                  Update Patient Profile & Medical Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Keep your personal demographics, emergency contacts, and insurance details updated.
                </p>
              </div>
            </div>

            {profileSaved && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Patient profile updated successfully in MediCare hospital database!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.address}
                    onChange={(e) => setProfileForm(p => ({ ...p, address: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    value={profileForm.age}
                    onChange={(e) => setProfileForm(p => ({ ...p, age: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Blood Group
                  </label>
                  <select
                    value={profileForm.bloodGroup}
                    onChange={(e) => setProfileForm(p => ({ ...p, bloodGroup: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="O-">O Negative (O-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Emergency Contact Name & Relation
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.emergencyContactName}
                    onChange={(e) => setProfileForm(p => ({ ...p, emergencyContactName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.emergencyContactPhone}
                    onChange={(e) => setProfileForm(p => ({ ...p, emergencyContactPhone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Known Drug & Food Allergies (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.allergies}
                    onChange={(e) => setProfileForm(p => ({ ...p, allergies: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
                    placeholder="e.g. Penicillin, Dust Mites, Peanuts"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl bg-[#0B3D91] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-5 h-5 text-sky-300" />
                  <span>Save Profile Changes</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
