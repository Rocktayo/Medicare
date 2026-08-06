import React, { useState, useEffect } from 'react';
import {
  Users,
  Stethoscope,
  Calendar,
  FileText,
  FilePlus,
  CreditCard,
  BarChart3,
  Search,
  Plus,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Filter,
  UserCheck,
  Building2,
  DollarSign,
  TrendingUp,
  Activity,
  BedDouble,
  Pill,
  Trash2,
  Edit3,
  Eye,
  Check,
  RefreshCw,
  Sparkles,
  Phone,
  Mail,
  Printer
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS, ADMIN_STATS, MOCK_PATIENT_RECORD } from '../data/hospitalData';
import { Doctor } from '../types';

interface AdminDashboardProps {
  userName?: string;
  onLogout: () => void;
  onGoHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userName,
  onLogout,
  onGoHome,
}) => {
  // 7 Core Modules requested:
  // 1. Manage Patients | 2. Manage Doctors | 3. Schedule Appointments | 4. Update Medical Records | 5. Generate Bills | 6. Manage Payments | 7. Generate Reports
  const [activeTab, setActiveTab] = useState<
    'patients' | 'doctors' | 'appointments' | 'records' | 'bills' | 'payments' | 'reports'
  >('patients');

  // --- 1. PATIENTS STATE ---
  const [patientList, setPatientList] = useState<any[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [patientActionMsg, setPatientActionMsg] = useState<string | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<{ id: string; name: string } | null>(null);
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    age: 30,
    gender: 'Male',
    bloodGroup: 'O+',
    contact: '',
    email: '',
    status: 'Outpatient',
    department: DEPARTMENTS[0]?.name || 'General Medicine',
    attendingDoctor: DOCTORS[0]?.name || 'Dr. Unassigned'
  });

  // --- 2. DOCTORS STATE ---
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<{ id: string; name: string; specialty: string } | null>(null);
  const [doctorActionMsg, setDoctorActionMsg] = useState<string | null>(null);
  const [newDoctorForm, setNewDoctorForm] = useState({
    name: '',
    specialty: '',
    departmentId: DEPARTMENTS[0]?.id || 'gen-med',
    experienceYears: 10,
    rating: 4.8,
    reviewsCount: 20,
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    education: 'MD - Johns Hopkins Medicine',
    availability: 'On-Duty'
  });

  // --- 3. SCHEDULE APPOINTMENTS STATE ---
  const [appointmentList, setAppointmentList] = useState([
    {
      id: 'APT-901',
      patientName: 'Jane Doe',
      patientId: 'PAT-8801',
      doctorName: 'Dr. Robert Chen',
      specialty: 'Internal Medicine',
      date: '2026-08-05',
      time: '10:00 AM',
      room: 'OPD Room 204',
      status: 'Scheduled',
      type: 'In-Person'
    },
    {
      id: 'APT-902',
      patientName: 'Michael Vance',
      patientId: 'PAT-8802',
      doctorName: 'Dr. Marcus Vance',
      specialty: 'Cardiology',
      date: '2026-08-05',
      time: '11:30 AM',
      room: 'Cath Lab 2',
      status: 'Checked In',
      type: 'In-Person'
    },
    {
      id: 'APT-903',
      patientName: 'Emily Watson',
      patientId: 'PAT-8803',
      doctorName: 'Dr. Sarah Jenkins',
      specialty: 'Pediatrics',
      date: '2026-08-06',
      time: '02:00 PM',
      room: 'Telehealth Room 4',
      status: 'Scheduled',
      type: 'Video Consultation'
    }
  ]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newAptForm, setNewAptForm] = useState({
    patientName: 'Jane Doe',
    patientId: 'PAT-8801',
    doctorName: doctorList[0]?.name || 'Dr. Unassigned',
    specialty: doctorList[0]?.specialty || 'General Medicine',
    date: '2026-08-06',
    time: '10:00 AM',
    room: 'OPD Room 102',
    type: 'In-Person'
  });

  // Fetch real-time patients from database API
  useEffect(() => {
    const fetchAdminPatients = async () => {
      try {
        const res = await fetch('/api/admin/patients');
        const data = await res.json();
        if (data.success && Array.isArray(data.patients)) {
          const mapped = data.patients.map((p: any) => ({
            id: p.patientId || p.id,
            name: p.fullName || p.name || 'Anonymous Patient',
            age: p.age || 30,
            gender: p.gender || 'Unspecified',
            bloodGroup: p.bloodGroup || 'O+',
            contact: p.phone || p.contact || '+1 (555) 000-0000',
            email: p.email || '',
            status: p.status || 'Outpatient',
            department: p.department || 'General Medicine',
            attendingDoctor: p.attendingDoctor || 'Duty Medical Officer',
            admissionDate: p.createdAt ? p.createdAt.split('T')[0] : '2026-08-05'
          }));
          setPatientList(mapped);
        }
      } catch (err) {
        console.warn('Failed to fetch admin patients API:', err);
      }
    };

    fetchAdminPatients();
    const interval = setInterval(fetchAdminPatients, 3000);
    window.addEventListener('medicare_patient_updated', fetchAdminPatients);
    return () => {
      clearInterval(interval);
      window.removeEventListener('medicare_patient_updated', fetchAdminPatients);
    };
  }, []);

  // Fetch real-time appointments from database API
  useEffect(() => {
    const fetchAdminAppointments = async () => {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        if (data.success && Array.isArray(data.appointments)) {
          const mapped = data.appointments.map((a: any) => ({
            id: a.id,
            patientName: a.patientName || 'Jane Doe',
            patientId: a.patientId || 'PAT-8801',
            doctorName: a.doctorName || 'Dr. Robert Chen',
            specialty: a.specialty || 'General Medicine',
            date: a.date || (a.dateTime ? a.dateTime.split(' at ')[0] : '2026-08-05'),
            time: a.time || (a.dateTime ? a.dateTime.split(' at ')[1] : '10:00 AM'),
            room: a.room || 'OPD Room 204',
            status: a.status || 'Scheduled',
            type: a.type || 'In-Person'
          }));
          if (mapped.length > 0) {
            setAppointmentList(mapped);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch admin appointments API:', err);
      }
    };

    fetchAdminAppointments();
    const interval = setInterval(fetchAdminAppointments, 3000);
    window.addEventListener('medicare_appointment_updated', fetchAdminAppointments);
    return () => {
      clearInterval(interval);
      window.removeEventListener('medicare_appointment_updated', fetchAdminAppointments);
    };
  }, []);

  // Fetch real-time doctors from database API
  useEffect(() => {
    const fetchAdminDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (data.success && Array.isArray(data.doctors)) {
          setDoctorList(data.doctors);
        }
      } catch (err) {
        console.warn('Failed to fetch admin doctors API:', err);
      }
    };

    fetchAdminDoctors();
    const interval = setInterval(fetchAdminDoctors, 3000);
    window.addEventListener('medicare_doctor_updated', fetchAdminDoctors);
    return () => {
      clearInterval(interval);
      window.removeEventListener('medicare_doctor_updated', fetchAdminDoctors);
    };
  }, []);

  // --- 4. UPDATE MEDICAL RECORDS STATE ---
  const [selectedRecordPatientId, setSelectedRecordPatientId] = useState('PAT-8801');
  const [emrData, setEmrData] = useState(MOCK_PATIENT_RECORD);

  const [newDiagnosisInput, setNewDiagnosisInput] = useState('');
  const [newLabTestForm, setNewLabTestForm] = useState({
    name: '',
    result: '',
    status: 'Completed'
  });
  const [newPrescriptionForm, setNewPrescriptionForm] = useState({
    medication: '',
    dosage: '',
    frequency: 'Once Daily',
    refillStatus: 'Active Refill'
  });
  const [recordNotification, setRecordNotification] = useState<string | null>(null);

  // --- 5. GENERATE BILLS STATE ---
  const [billPatientId, setBillPatientId] = useState('PAT-8801');
  const [billDoctor, setBillDoctor] = useState('Dr. Robert Chen');
  const [billItems, setBillItems] = useState([
    { id: '1', desc: 'OPD Consultation Fee', cost: 100 },
    { id: '2', desc: 'Diagnostic Blood Chemistry', cost: 80 }
  ]);
  const [newBillItemDesc, setNewBillItemDesc] = useState('');
  const [newBillItemCost, setNewBillItemCost] = useState('');
  const [billInsuranceDiscount, setBillInsuranceDiscount] = useState(120);
  const [billSuccessMsg, setBillSuccessMsg] = useState<string | null>(null);

  // --- 6. MANAGE PAYMENTS STATE ---
  const [invoiceList, setInvoiceList] = useState([
    {
      id: 'INV-2026-101',
      patientId: 'PAT-8801',
      patientName: 'Jane Doe',
      doctor: 'Dr. Robert Chen',
      date: '2026-08-01',
      totalAmount: 180.00,
      insurancePaid: 120.00,
      payableAmount: 60.00,
      status: 'Unpaid',
      method: 'Pending'
    },
    {
      id: 'INV-2026-102',
      patientId: 'PAT-8802',
      patientName: 'Michael Vance',
      doctor: 'Dr. Marcus Vance',
      date: '2026-08-03',
      totalAmount: 1450.00,
      insurancePaid: 1000.00,
      payableAmount: 450.00,
      status: 'Unpaid',
      method: 'Pending'
    },
    {
      id: 'INV-2026-103',
      patientId: 'PAT-8803',
      patientName: 'Emily Watson',
      doctor: 'Dr. Sarah Jenkins',
      date: '2026-07-25',
      totalAmount: 140.00,
      insurancePaid: 140.00,
      payableAmount: 0.00,
      status: 'Paid',
      method: 'Insurance Pre-Auth'
    },
    {
      id: 'INV-2026-104',
      patientId: 'PAT-8804',
      patientName: 'Robert Harris',
      date: '2026-07-28',
      totalAmount: 890.00,
      insurancePaid: 600.00,
      payableAmount: 290.00,
      status: 'Paid',
      method: 'Credit Card'
    }
  ]);

  const [paymentFilterStatus, setPaymentFilterStatus] = useState<'All' | 'Paid' | 'Unpaid'>('All');
  const [paymentActionMsg, setPaymentActionMsg] = useState<string | null>(null);

  // --- 7. GENERATE REPORTS STATE ---
  const [reportType, setReportType] = useState<'revenue' | 'occupancy' | 'department' | 'prescriptions'>('revenue');
  const [reportDateRange, setReportDateRange] = useState<'Monthly' | 'Quarterly' | 'Annual'>('Monthly');
  const [reportGeneratedMsg, setReportGeneratedMsg] = useState<string | null>(null);

  // Helper Handlers
  const handleAddPatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newPatientForm.name,
          age: newPatientForm.age,
          gender: newPatientForm.gender,
          bloodGroup: newPatientForm.bloodGroup,
          phone: newPatientForm.contact,
          email: newPatientForm.email,
          status: newPatientForm.status,
          department: newPatientForm.department,
          attendingDoctor: newPatientForm.attendingDoctor
        })
      });
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event('medicare_patient_updated'));
        setPatientActionMsg(`Patient record for ${newPatientForm.name} registered successfully.`);
        setTimeout(() => setPatientActionMsg(null), 4000);
      }
    } catch (err) {
      console.error('Failed to post patient record:', err);
    }

    setShowAddPatientModal(false);
    setNewPatientForm({
      name: '',
      age: 30,
      gender: 'Male',
      bloodGroup: 'O+',
      contact: '',
      email: '',
      status: 'Outpatient',
      department: DEPARTMENTS[0]?.name || 'General Medicine',
      attendingDoctor: doctorList[0]?.name || 'Dr. Unassigned'
    });
  };

  const handleConfirmDeletePatient = async () => {
    if (!patientToDelete) return;
    try {
      const res = await fetch(`/api/admin/patients/${patientToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPatientList(prev => prev.filter(p => p.id !== patientToDelete.id));
        window.dispatchEvent(new Event('medicare_patient_updated'));
        setPatientActionMsg(`Patient record for ${patientToDelete.name} (${patientToDelete.id}) permanently deleted from system.`);
        setTimeout(() => setPatientActionMsg(null), 5000);
      }
    } catch (err) {
      console.error('Failed to delete patient:', err);
    }
    setPatientToDelete(null);
  };

  const handleAddDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDocData = {
      name: newDoctorForm.name,
      specialty: newDoctorForm.specialty,
      departmentId: newDoctorForm.departmentId,
      experienceYears: Number(newDoctorForm.experienceYears),
      rating: Number(newDoctorForm.rating),
      reviewsCount: Number(newDoctorForm.reviewsCount),
      photo: newDoctorForm.photo,
      education: newDoctorForm.education,
      availability: newDoctorForm.availability
    };

    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDocData)
      });
      const data = await res.json();
      if (data.success && data.doctor) {
        setDoctorList(prev => [data.doctor, ...prev]);
      }
      setDoctorActionMsg(`Dr. ${newDocData.name} profile created and added to active staff roster.`);
      setTimeout(() => setDoctorActionMsg(null), 4000);
    } catch (err) {
      console.error('Failed to post doctor:', err);
    }

    window.dispatchEvent(new Event('medicare_doctor_updated'));
    setShowAddDoctorModal(false);
    setNewDoctorForm({
      name: '',
      specialty: '',
      departmentId: DEPARTMENTS[0]?.id || 'gen-med',
      experienceYears: 10,
      rating: 4.8,
      reviewsCount: 20,
      photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
      education: 'MD - Johns Hopkins Medicine',
      availability: 'On-Duty'
    });
  };

  const promptDeleteDoctor = (doc: Doctor) => {
    setDoctorToDelete({ id: doc.id, name: doc.name, specialty: doc.specialty });
  };

  const executeDoctorDelete = async () => {
    if (!doctorToDelete) return;
    const { id, name } = doctorToDelete;
    try {
      await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
      setDoctorList(prev => prev.filter(d => d.id !== id));
      window.dispatchEvent(new Event('medicare_doctor_updated'));
      setDoctorActionMsg(`Doctor profile for ${name} has been permanently deleted from hospital roster.`);
      setTimeout(() => setDoctorActionMsg(null), 4000);
    } catch (err) {
      console.error('Failed to delete doctor profile:', err);
    } finally {
      setDoctorToDelete(null);
    }
  };

  const handleScheduleAptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAptData = {
      patientName: newAptForm.patientName,
      patientId: newAptForm.patientId,
      doctorName: newAptForm.doctorName,
      specialty: newAptForm.specialty,
      date: newAptForm.date,
      time: newAptForm.time,
      dateTime: `${newAptForm.date} at ${newAptForm.time}`,
      room: newAptForm.room,
      status: 'Scheduled',
      type: newAptForm.type
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAptData)
      });
      const data = await res.json();
      if (data.success && data.appointment) {
        setAppointmentList(prev => [data.appointment, ...prev]);
      }
    } catch (err) {
      console.error('Failed to post appointment:', err);
    }

    window.dispatchEvent(new Event('medicare_appointment_updated'));
    setShowScheduleModal(false);
  };

  const handleAddDiagnosis = () => {
    if (!newDiagnosisInput.trim()) return;
    setEmrData(prev => ({
      ...prev,
      recentDiagnoses: [newDiagnosisInput.trim(), ...prev.recentDiagnoses]
    }));
    setNewDiagnosisInput('');
    setRecordNotification('New clinical diagnosis added to EMR record.');
    setTimeout(() => setRecordNotification(null), 3000);
  };

  const handleAddPrescriptionItem = () => {
    if (!newPrescriptionForm.medication.trim()) return;
    setEmrData(prev => ({
      ...prev,
      prescriptions: [
        {
          medication: newPrescriptionForm.medication,
          dosage: newPrescriptionForm.dosage || '10mg',
          frequency: newPrescriptionForm.frequency,
          refillStatus: newPrescriptionForm.refillStatus
        },
        ...prev.prescriptions
      ]
    }));
    setNewPrescriptionForm({
      medication: '',
      dosage: '',
      frequency: 'Once Daily',
      refillStatus: 'Active Refill'
    });
    setRecordNotification('Prescription item added & digitally signed.');
    setTimeout(() => setRecordNotification(null), 3000);
  };

  const handleAddBillItem = () => {
    if (!newBillItemDesc.trim() || !newBillItemCost) return;
    setBillItems([
      ...billItems,
      { id: String(Date.now()), desc: newBillItemDesc, cost: Number(newBillItemCost) }
    ]);
    setNewBillItemDesc('');
    setNewBillItemCost('');
  };

  const handleGenerateBillSubmit = () => {
    const subtotal = billItems.reduce((acc, curr) => acc + curr.cost, 0);
    const payable = Math.max(0, subtotal - billInsuranceDiscount);
    const pat = patientList.find(p => p.id === billPatientId) || patientList[0];
    const patName = pat?.name || 'Jane Doe';
    const patId = pat?.id || 'PAT-101';

    const newInvoice = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientId: patId,
      patientName: patName,
      doctor: billDoctor,
      date: new Date().toISOString().split('T')[0],
      totalAmount: subtotal,
      insurancePaid: billInsuranceDiscount,
      payableAmount: payable,
      status: payable === 0 ? 'Paid' : 'Unpaid',
      method: payable === 0 ? 'Insurance Direct Settlement' : 'Pending'
    };

    setInvoiceList([newInvoice, ...invoiceList]);
    setBillSuccessMsg(`Invoice #${newInvoice.id} generated & issued for ${patName}! Total: $${subtotal.toFixed(2)} (Payable: $${payable.toFixed(2)})`);
    setTimeout(() => setBillSuccessMsg(null), 5000);
  };

  const handleMarkPaid = (invId: string) => {
    setInvoiceList(prev =>
      prev.map(inv =>
        inv.id === invId ? { ...inv, status: 'Paid', payableAmount: 0, method: 'Recorded Cash/Card' } : inv
      )
    );
    setPaymentActionMsg(`Invoice #${invId} payment marked as completed! Receipt generated.`);
    setTimeout(() => setPaymentActionMsg(null), 4000);
  };

  const handleTriggerReportPDF = () => {
    setReportGeneratedMsg(`Generating comprehensive ${reportType.toUpperCase()} report (${reportDateRange}). Download starting...`);
    setTimeout(() => setReportGeneratedMsg(null), 4000);
  };

  const filteredPatients = patientList.filter(p =>
    p.name?.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.id?.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.department?.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredDoctorsList = doctorList.filter(d =>
    d.name?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const filteredInvoices = invoiceList.filter(inv => {
    if (paymentFilterStatus === 'Paid') return inv.status === 'Paid';
    if (paymentFilterStatus === 'Unpaid') return inv.status === 'Unpaid';
    return true;
  });

  const adminDisplayName = userName || 'Admin Director';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span>Hospital Main Portal</span>
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md">
                <Building2 className="w-5 h-5 text-sky-200" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-base text-white block leading-none">
                  MediCare HMS Master Control Panel
                </span>
                <span className="text-[10px] text-sky-400 font-mono">
                  Role: Super Admin ({adminDisplayName})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>MongoDB Node Connected</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Logout Admin</span>
            </button>
          </div>

        </div>
      </header>

      {/* Admin KPI Quick Stat Bar */}
      <section className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Total Registered Patients</span>
              <strong className="text-xl font-extrabold text-white font-heading">{patientList.length + 1240}</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Active Doctors & Consultants</span>
              <strong className="text-xl font-extrabold text-white font-heading">{doctorList.length}</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Bed Occupancy Rate</span>
              <strong className="text-xl font-extrabold text-white font-heading">88% (220/250)</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Monthly Revenue</span>
              <strong className="text-xl font-extrabold text-white font-heading">$184,500</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation Tabs Bar for 7 Modules */}
        <div className="bg-slate-900 rounded-2xl p-2 shadow-lg border border-slate-800 mb-8 flex flex-wrap gap-1.5">
          
          <button
            onClick={() => setActiveTab('patients')}
            className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'patients'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. Manage Patients</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'doctors'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>2. Manage Doctors</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>3. Schedule Appointments</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'records'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>4. Update Records</span>
          </button>

          <button
            onClick={() => setActiveTab('bills')}
            className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'bills'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FilePlus className="w-4 h-4" />
            <span>5. Generate Bills</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>6. Manage Payments</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>7. Generate Reports</span>
          </button>

        </div>

        {/* MODULE 1: MANAGE PATIENTS */}
        {activeTab === 'patients' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Hospital Patient Directory & EMR Management</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Register new patient admissions, track ward status, and inspect medical files.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by Name or PAT ID..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                  />
                </div>

                <button
                  onClick={() => setShowAddPatientModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Patient</span>
                </button>
              </div>
            </div>

            {/* Patient Action Notification */}
            {patientActionMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{patientActionMsg}</span>
                </div>
                <button onClick={() => setPatientActionMsg(null)} className="text-emerald-400 hover:text-white cursor-pointer font-bold">✕</button>
              </div>
            )}

            {/* Patient Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Patient ID & Name</th>
                    <th className="pb-3 px-4">Demographics</th>
                    <th className="pb-3 px-4">Blood Group</th>
                    <th className="pb-3 px-4">Contact</th>
                    <th className="pb-3 px-4">Department & Doctor</th>
                    <th className="pb-3 px-4">Ward Status</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center text-slate-400">
                        <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="font-bold text-sm text-slate-300">No Patient Records Found</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                          There are currently no patient accounts registered in the hospital database. Click "Register Patient" above or register new accounts via the Auth portal.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((pat) => (
                      <tr key={pat.id} className="hover:bg-slate-800/40">
                        <td className="py-4 pr-4">
                          <strong className="text-white text-sm block">{pat.name}</strong>
                          <span className="text-sky-400 font-mono text-[11px]">{pat.id}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          {pat.age} yrs &bull; {pat.gender}
                        </td>
                        <td className="py-4 px-4 font-bold text-rose-400">
                          {pat.bloodGroup}
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          <span className="block">{pat.contact}</span>
                          <span className="text-[10px] text-slate-400">{pat.email}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="block text-white font-semibold">{pat.department}</span>
                          <span className="text-slate-400 text-[10px]">{pat.attendingDoctor}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            pat.status.includes('Admitted')
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : pat.status === 'Discharged'
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}>
                            {pat.status}
                          </span>
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedRecordPatientId(pat.id);
                                setActiveTab('records');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-950/80 text-blue-300 hover:bg-blue-900 border border-blue-800 text-[11px] font-bold cursor-pointer"
                            >
                              View EMR
                            </button>
                            <button
                              onClick={() => {
                                setPatientList(prev =>
                                  prev.map(p => p.id === pat.id ? { ...p, status: p.status === 'Discharged' ? 'Outpatient' : 'Discharged' } : p)
                                );
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                            >
                              {pat.status === 'Discharged' ? 'Re-Admit' : 'Discharge'}
                            </button>
                            <button
                              onClick={() => setPatientToDelete({ id: pat.id, name: pat.name })}
                              className="px-2.5 py-1 rounded-lg bg-red-950/80 text-red-400 hover:bg-red-900 border border-red-800/80 text-[11px] font-bold cursor-pointer flex items-center gap-1 transition-colors"
                              title={`Delete ${pat.name} record`}
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal: Add New Patient */}
            {showAddPatientModal && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                  <h3 className="text-lg font-bold text-white mb-4">Register New Patient Record</h3>
                  
                  <form onSubmit={handleAddPatientSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Johnathan Smith"
                        value={newPatientForm.name}
                        onChange={(e) => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Age</label>
                        <input
                          type="number"
                          required
                          value={newPatientForm.age}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, age: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Gender</label>
                        <select
                          value={newPatientForm.gender}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Blood Group</label>
                        <select
                          value={newPatientForm.bloodGroup}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, bloodGroup: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-rose-400"
                        >
                          <option value="O+">O+</option>
                          <option value="A+">A+</option>
                          <option value="B+">B+</option>
                          <option value="AB+">AB+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Contact Phone</label>
                        <input
                          type="text"
                          placeholder="+1 (555) 000-0000"
                          value={newPatientForm.contact}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, contact: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Ward / Care Status</label>
                        <select
                          value={newPatientForm.status}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, status: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                        >
                          <option value="Outpatient">Outpatient</option>
                          <option value="Admitted (Ward)">Admitted (General Ward)</option>
                          <option value="Admitted (ICU)">Admitted (ICU)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setShowAddPatientModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                      >
                        Save Patient Record
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* MODULE 2: MANAGE DOCTORS */}
        {activeTab === 'doctors' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-400" />
                  <span>Hospital Doctors & Specialist Roster</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage physician profiles, department allocations, experience, and shift availability.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Filter doctor or specialty..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
                />

                <button
                  onClick={() => setShowAddDoctorModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Doctor</span>
                </button>
              </div>
            </div>

            {doctorActionMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{doctorActionMsg}</span>
              </div>
            )}

            {/* Doctor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctorsList.length === 0 ? (
                <div className="col-span-full p-10 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-sky-400">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white font-heading">No Doctors in Directory</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    There are currently no doctor profiles in the hospital roster. Click "Add Doctor" above to register a new physician or specialist.
                  </p>
                </div>
              ) : (
                filteredDoctorsList.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between gap-4 relative group hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-base text-white">{doc.name}</h4>
                        <p className="text-xs text-sky-400 font-medium">{doc.specialty}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">{doc.education}</span>
                      </div>
                    </div>

                    {/* Quick Delete Trash Button */}
                    <button
                      onClick={() => promptDeleteDoctor(doc)}
                      title={`Delete ${doc.name} profile`}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Experience</span>
                      <strong className="text-white">{doc.experienceYears} Years</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Rating</span>
                      <strong className="text-amber-400">★ {doc.rating} ({doc.reviewsCount})</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
                      doc.availability === 'On-Duty'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : doc.availability === 'In Surgery'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {doc.availability || 'On-Duty'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setDoctorList(prev =>
                            prev.map(d => d.id === doc.id ? {
                              ...d,
                              availability: d.availability === 'On-Duty' ? 'In Surgery' : 'On-Duty'
                            } : d)
                          );
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Toggle Status
                      </button>

                      <button
                        onClick={() => promptDeleteDoctor(doc)}
                        className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white text-[11px] font-bold cursor-pointer border border-red-800/60 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>

            {/* Modal: Add Doctor */}
            {showAddDoctorModal && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                  <h3 className="text-lg font-bold text-white mb-4">Add Doctor to Hospital Staff</h3>
                  
                  <form onSubmit={handleAddDoctorSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Doctor Name & Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Alexander Wright, MD"
                        value={newDoctorForm.name}
                        onChange={(e) => setNewDoctorForm({ ...newDoctorForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Specialization</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Neurologist"
                          value={newDoctorForm.specialty}
                          onChange={(e) => setNewDoctorForm({ ...newDoctorForm, specialty: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Department</label>
                        <select
                          value={newDoctorForm.departmentId}
                          onChange={(e) => setNewDoctorForm({ ...newDoctorForm, departmentId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                        >
                          {DEPARTMENTS.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Experience (Years)</label>
                        <input
                          type="number"
                          value={newDoctorForm.experienceYears}
                          onChange={(e) => setNewDoctorForm({ ...newDoctorForm, experienceYears: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Duty Status</label>
                        <select
                          value={newDoctorForm.availability}
                          onChange={(e) => setNewDoctorForm({ ...newDoctorForm, availability: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                        >
                          <option value="On-Duty">On-Duty</option>
                          <option value="In Surgery">In Surgery</option>
                          <option value="Off-Duty">Off-Duty</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setShowAddDoctorModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                      >
                        Add Physician
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: Confirm Delete Doctor */}
            {doctorToDelete && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-slate-900 border border-red-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-150">
                  <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400 mx-auto">
                    <Trash2 className="w-6 h-6" />
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-white font-heading">Delete Doctor Profile?</h3>
                    <p className="text-xs text-slate-300">
                      Are you sure you want to permanently remove <strong className="text-white font-semibold">{doctorToDelete.name}</strong> ({doctorToDelete.specialty}) from the hospital staff directory?
                    </p>
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-800/60 mt-1">
                      ⚠️ Permanent Action
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setDoctorToDelete(null)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={executeDoctorDelete}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-lg shadow-red-900/30 flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* MODULE 3: SCHEDULE APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>Master OPD Appointment Scheduler</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  View and assign consultation appointments across all hospital doctors.
                </p>
              </div>

              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule New Appointment</span>
              </button>
            </div>

            {/* Appointment Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Appointment ID</th>
                    <th className="pb-3 px-4">Patient Name</th>
                    <th className="pb-3 px-4">Assigned Doctor</th>
                    <th className="pb-3 px-4">Date & Time</th>
                    <th className="pb-3 px-4">Room / Mode</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                  {appointmentList.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-800/40">
                      <td className="py-4 pr-4 font-mono text-sky-400 font-bold">{apt.id}</td>
                      <td className="py-4 px-4 font-bold text-white">{apt.patientName}</td>
                      <td className="py-4 px-4">
                        <span className="block font-semibold">{apt.doctorName}</span>
                        <span className="text-[10px] text-slate-400">{apt.specialty}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {apt.date} at {apt.time}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs">{apt.room}</span>
                        <span className="block text-[10px] text-slate-400">{apt.type}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : apt.status === 'Checked In'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-blue-950 text-blue-400 border border-blue-800'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <select
                          value={apt.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            setAppointmentList(prev =>
                              prev.map(a => a.id === apt.id ? { ...a, status: newStatus } : a)
                            );
                            try {
                              await fetch(`/api/appointments/${apt.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: newStatus })
                              });
                              window.dispatchEvent(new Event('medicare_appointment_updated'));
                            } catch (err) {
                              console.error('Failed to update appointment status API:', err);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Checked In">Checked In</option>
                          <option value="In Consultation">In Consultation</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal: Schedule Appointment */}
            {showScheduleModal && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                  <h3 className="text-lg font-bold text-white mb-4">Schedule Patient Consultation</h3>
                  
                  <form onSubmit={handleScheduleAptSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Select Patient</label>
                      <select
                        value={newAptForm.patientName}
                        onChange={(e) => {
                          const name = e.target.value;
                          const pat = patientList.find(p => p.name === name);
                          setNewAptForm({ ...newAptForm, patientName: name, patientId: pat?.id || 'PAT-8801' });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                      >
                        {patientList.map(p => (
                          <option key={p.id} value={p.name}>{p.name} ({p.id})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Assign Doctor</label>
                      <select
                        value={newAptForm.doctorName}
                        onChange={(e) => {
                          const docName = e.target.value;
                          const doc = doctorList.find(d => d.name === docName);
                          setNewAptForm({ ...newAptForm, doctorName: docName, specialty: doc?.specialty || '' });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                      >
                        {doctorList.map(d => (
                          <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Date</label>
                        <input
                          type="date"
                          required
                          value={newAptForm.date}
                          onChange={(e) => setNewAptForm({ ...newAptForm, date: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Time Slot</label>
                        <input
                          type="text"
                          required
                          value={newAptForm.time}
                          onChange={(e) => setNewAptForm({ ...newAptForm, time: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setShowScheduleModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                      >
                        Create Appointment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* MODULE 4: UPDATE MEDICAL RECORDS */}
        {activeTab === 'records' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>Update Patient Electronic Medical Records (EMR)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Append diagnoses, clinical lab reports, digital prescriptions, and doctor notes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Target Patient:</span>
                <select
                  value={selectedRecordPatientId}
                  onChange={(e) => setSelectedRecordPatientId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white"
                >
                  {patientList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>
            </div>

            {recordNotification && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{recordNotification}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Add Clinical Diagnoses & Notes */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-400" />
                  <span>1. Append Clinical Diagnosis</span>
                </h3>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="e.g. Essential Hypertension - Stage 1 (Controlled)"
                    value={newDiagnosisInput}
                    onChange={(e) => setNewDiagnosisInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                  <button
                    onClick={handleAddDiagnosis}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Add Diagnosis to EMR
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Current Active Diagnoses:</span>
                  <div className="space-y-1.5">
                    {emrData.recentDiagnoses.map((diag, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900 text-xs text-slate-200 border border-slate-800 flex justify-between">
                        <span>{diag}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">Recorded</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add Digital E-Prescription */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-400" />
                  <span>2. Issue Digital Prescription</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <input
                    type="text"
                    placeholder="Medication Name (e.g. Amoxicillin)"
                    value={newPrescriptionForm.medication}
                    onChange={(e) => setNewPrescriptionForm({ ...newPrescriptionForm, medication: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Dosage (e.g. 500mg)"
                      value={newPrescriptionForm.dosage}
                      onChange={(e) => setNewPrescriptionForm({ ...newPrescriptionForm, dosage: e.target.value })}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                    <select
                      value={newPrescriptionForm.frequency}
                      onChange={(e) => setNewPrescriptionForm({ ...newPrescriptionForm, frequency: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value="Once Daily">Once Daily</option>
                      <option value="Twice Daily (BID)">Twice Daily (BID)</option>
                      <option value="Three Times Daily (TID)">Three Times Daily (TID)</option>
                    </select>
                  </div>
                  <button
                    onClick={handleAddPrescriptionItem}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                  >
                    Authorize & Digitally Sign Rx
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Prescriptions File:</span>
                  <div className="space-y-1.5">
                    {emrData.prescriptions.map((rx, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900 text-xs text-slate-200 border border-slate-800 flex justify-between">
                        <strong>{rx.medication} ({rx.dosage})</strong>
                        <span className="text-[10px] text-sky-400">{rx.frequency}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* MODULE 5: GENERATE BILLS */}
        {activeTab === 'bills' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <FilePlus className="w-5 h-5 text-blue-400" />
                  <span>Hospital Invoice & Billing Generator</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compile line items, OPD consultation fees, lab diagnostics, and insurance pre-authorization claims.
                </p>
              </div>
            </div>

            {billSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{billSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Billing Form */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Select Billed Patient</label>
                    <select
                      value={billPatientId}
                      onChange={(e) => setBillPatientId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                    >
                      {patientList.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Attending Physician</label>
                    <select
                      value={billDoctor}
                      onChange={(e) => setBillDoctor(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                    >
                      {doctorList.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Add Item Row */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold text-white block">Add Itemized Charge / Fee</span>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <input
                      type="text"
                      placeholder="Item Description (e.g. ICU Bed Charges)"
                      value={newBillItemDesc}
                      onChange={(e) => setNewBillItemDesc(e.target.value)}
                      className="col-span-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Cost ($)"
                      value={newBillItemCost}
                      onChange={(e) => setNewBillItemCost(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <button
                    onClick={handleAddBillItem}
                    className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs cursor-pointer"
                  >
                    + Add Line Item to Bill
                  </button>
                </div>

                {/* Itemized Table */}
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800 text-slate-400 font-bold uppercase">
                      <tr>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-right">Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {billItems.map(item => (
                        <tr key={item.id}>
                          <td className="p-3 text-white">{item.desc}</td>
                          <td className="p-3 text-right font-mono font-bold text-sky-400">${item.cost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Invoice Summary Card */}
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <Printer className="w-5 h-5 text-blue-400" />
                    <span>Bill Summary & Calculation</span>
                  </h3>

                  {(() => {
                    const subtotal = billItems.reduce((acc, c) => acc + c.cost, 0);
                    const payable = Math.max(0, subtotal - billInsuranceDiscount);

                    return (
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Subtotal Charges:</span>
                          <strong className="text-white font-mono">${subtotal.toFixed(2)}</strong>
                        </div>

                        <div className="flex justify-between text-slate-400 items-center">
                          <span>Insurance Credit:</span>
                          <input
                            type="number"
                            value={billInsuranceDiscount}
                            onChange={(e) => setBillInsuranceDiscount(Number(e.target.value))}
                            className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-right font-bold"
                          />
                        </div>

                        <div className="pt-3 border-t border-slate-700 flex justify-between text-sm font-bold text-white">
                          <span>Net Payable Amount:</span>
                          <strong className="text-xl font-mono text-emerald-400">${payable.toFixed(2)}</strong>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <button
                  onClick={handleGenerateBillSubmit}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FilePlus className="w-5 h-5" />
                  <span>Generate & Issue Official Invoice</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* MODULE 6: MANAGE PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span>Hospital Payment Records & Collections</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track completed payments, clear outstanding balances, and record cash/credit payments.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold">Filter Status:</span>
                <select
                  value={paymentFilterStatus}
                  onChange={(e) => setPaymentFilterStatus(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                >
                  <option value="All">All Invoices</option>
                  <option value="Unpaid font-bold">Unpaid Only</option>
                  <option value="Paid">Paid Only</option>
                </select>
              </div>
            </div>

            {paymentActionMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{paymentActionMsg}</span>
              </div>
            )}

            {/* Invoices Payment Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Invoice #</th>
                    <th className="pb-3 px-4">Patient Name</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Total Amount</th>
                    <th className="pb-3 px-4">Insurance Paid</th>
                    <th className="pb-3 px-4">Net Patient Payable</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Payment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-800/40">
                      <td className="py-4 pr-4 font-mono font-bold text-sky-400">{inv.id}</td>
                      <td className="py-4 px-4 font-bold text-white">{inv.patientName}</td>
                      <td className="py-4 px-4 text-slate-400">{inv.date}</td>
                      <td className="py-4 px-4 font-mono">${inv.totalAmount.toFixed(2)}</td>
                      <td className="py-4 px-4 font-mono text-emerald-400">${inv.insurancePaid.toFixed(2)}</td>
                      <td className="py-4 px-4 font-mono font-bold text-amber-400">${inv.payableAmount.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        {inv.status === 'Unpaid' ? (
                          <button
                            onClick={() => handleMarkPaid(inv.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                          >
                            Record Payment Received
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Receipt Issued</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* MODULE 7: GENERATE REPORTS */}
        {activeTab === 'reports' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span>Hospital Analytics & Executive Report Generator</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Export financial revenue audits, department performance metrics, and bed utilization statistics.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={reportDateRange}
                  onChange={(e) => setReportDateRange(e.target.value as any)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white"
                >
                  <option value="Monthly">Monthly Audit</option>
                  <option value="Quarterly">Quarterly Report</option>
                  <option value="Annual">Annual Report</option>
                </select>

                <button
                  onClick={handleTriggerReportPDF}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report PDF</span>
                </button>
              </div>
            </div>

            {reportGeneratedMsg && (
              <div className="p-4 rounded-2xl bg-sky-950/80 border border-sky-800 text-sky-300 text-xs font-bold flex items-center gap-3 animate-in fade-in">
                <Download className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{reportGeneratedMsg}</span>
              </div>
            )}

            {/* Report Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setReportType('revenue')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  reportType === 'revenue'
                    ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                    : 'bg-slate-800/40 border-slate-700/80 text-slate-400'
                }`}
              >
                <DollarSign className="w-5 h-5 text-emerald-400 mb-2" />
                <span className="text-xs font-bold block">Financial Revenue Audit</span>
                <span className="text-[10px] text-slate-400 font-normal">OPD, IPD & Pharmacy income</span>
              </button>

              <button
                onClick={() => setReportType('occupancy')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  reportType === 'occupancy'
                    ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                    : 'bg-slate-800/40 border-slate-700/80 text-slate-400'
                }`}
              >
                <BedDouble className="w-5 h-5 text-amber-400 mb-2" />
                <span className="text-xs font-bold block">Bed Occupancy & Ward Stats</span>
                <span className="text-[10px] text-slate-400 font-normal">ICU & Emergency capacity</span>
              </button>

              <button
                onClick={() => setReportType('department')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  reportType === 'department'
                    ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                    : 'bg-slate-800/40 border-slate-700/80 text-slate-400'
                }`}
              >
                <Building2 className="w-5 h-5 text-sky-400 mb-2" />
                <span className="text-xs font-bold block">Department Utilization</span>
                <span className="text-[10px] text-slate-400 font-normal">Consultation turnarounds</span>
              </button>

              <button
                onClick={() => setReportType('prescriptions')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  reportType === 'prescriptions'
                    ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                    : 'bg-slate-800/40 border-slate-700/80 text-slate-400'
                }`}
              >
                <Pill className="w-5 h-5 text-purple-400 mb-2" />
                <span className="text-xs font-bold block">Pharmacy & Prescriptions</span>
                <span className="text-[10px] text-slate-400 font-normal">Medication dispensation log</span>
              </button>
            </div>

            {/* Generated Report Preview Card */}
            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                <h3 className="font-bold text-base text-white font-heading uppercase tracking-wider">
                  Executive Report: {reportType.toUpperCase()} ({reportDateRange})
                </h3>
                <span className="text-xs text-emerald-400 font-mono">Status: Verified Official Document</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Total OPD Volume</span>
                  <strong className="text-lg text-white font-heading">3,420 Visits</strong>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Average Length of Stay</span>
                  <strong className="text-lg text-white font-heading">3.2 Days</strong>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Patient Satisfaction Index</span>
                  <strong className="text-lg text-emerald-400 font-heading">98.4% CSAT</strong>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-2">
                This comprehensive executive summary validates that all hospital clinical departments operating under MediCare standard operating procedures achieved target throughput for the {reportDateRange.toLowerCase()} period. All metrics are archived securely in the hospital EMR system.
              </p>
            </div>

          </div>
        )}

        {/* Modal: Confirm Delete Patient */}
        {patientToDelete && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-red-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-white font-heading">Delete Patient Record?</h3>
                <p className="text-xs text-slate-300">
                  Are you sure you want to permanently remove patient <strong className="text-white font-semibold">{patientToDelete.name}</strong> (<span className="text-sky-400 font-mono">{patientToDelete.id}</span>) from the hospital system?
                </p>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-800/60 mt-1">
                  ⚠️ Permanent Database Erasure
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPatientToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeletePatient}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-lg shadow-red-950 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Patient</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
