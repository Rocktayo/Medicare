export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  departmentId: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  photo: string;
  education: string;
  availableDays?: string[];
  availableTime?: string;
  bio?: string;
  availability?: string;
}

export interface Department {
  id: string;
  name: string;
  iconName: string;
  image: string;
  description: string;
  headDoctor: string;
  services: string[];
  patientCount: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'core' | 'patient' | 'admin' | 'clinical';
  details: string[];
}

export interface Testimonial {
  id: string;
  patientName: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  department: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'appointments' | 'billing' | 'records' | 'emergency' | 'general';
}

export interface AppointmentData {
  department: string;
  doctor: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  symptoms: string;
  visitType: 'In-Person' | 'Video Consultation';
}

export interface LabResult {
  id: string;
  testName: string;
  date: string;
  doctor: string;
  status: 'Completed' | 'Pending';
  result: string;
  normalRange: string;
}

export interface PatientRecord {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  recentDiagnoses: string[];
  upcomingAppointments: {
    id: string;
    doctorName: string;
    specialty: string;
    dateTime: string;
    room: string;
  }[];
  prescriptions: {
    medication: string;
    dosage: string;
    frequency: string;
    refillStatus: string;
  }[];
}

export interface AdminStat {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  iconName: string;
}
