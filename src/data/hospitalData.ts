import { Doctor, Department, FeatureItem, Testimonial, FAQItem, PatientRecord, AdminStat } from '../types';
import heroDoctorImage from '../assets/images/hero_doctor_1785767031163.jpg';
import hospitalBuildingImage from '../assets/images/hospital_building_1785767047089.jpg';

export { heroDoctorImage, hospitalBuildingImage };

export const DEPARTMENTS: Department[] = [
  {
    id: 'gen-med',
    name: 'General Medicine',
    iconName: 'Stethoscope',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive primary health care, diagnostic evaluations, and ongoing wellness management for adult patients.',
    headDoctor: 'Dr. Robert Chen, MD',
    services: ['Preventive Screenings', 'Chronic Disease Care', 'Health Assessments', 'Routine Checkups'],
    patientCount: '5,000+ Annual Patients'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    iconName: 'Baby',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    description: 'Gentle, specialized pediatric care from newborns to adolescents, ensuring healthy growth and development.',
    headDoctor: 'Dr. Sarah Jenkins, MD',
    services: ['Child Immunization', 'Growth Tracking', 'Pediatric Emergencies', 'Developmental Screening'],
    patientCount: '3,800+ Annual Patients'
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    iconName: 'HeartPulse',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    description: 'Advanced cardiovascular care featuring non-invasive diagnostics, interventional procedures, and heart rehabilitation.',
    headDoctor: 'Dr. Marcus Vance, FACC',
    services: ['Echocardiography', 'Coronary Angiography', 'Heart Failure Clinic', 'Pacemaker Care'],
    patientCount: '2,900+ Annual Patients'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    iconName: 'Bone',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    description: 'Expert treatment for bone fracture, joint replacement, sports injury rehabilitation, and spinal health.',
    headDoctor: 'Dr. Elena Rostova, MD',
    services: ['Joint Replacement', 'Sports Medicine', 'Spine Surgery', 'Fracture Management'],
    patientCount: '2,400+ Annual Patients'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    iconName: 'Brain',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
    description: 'Specialized neurological diagnostic care for disorders of the brain, spinal cord, nerves, and muscles.',
    headDoctor: 'Dr. Alexander Wright, MD',
    services: ['EEG Diagnostics', 'Stroke Management', 'Epilepsy Clinic', 'Memory & Dementia Care'],
    patientCount: '1,800+ Annual Patients'
  },
  {
    id: 'obgyn',
    name: 'Obstetrics & Gynecology',
    iconName: 'Users',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
    description: 'Complete women’s health services including prenatal care, maternity birthing suites, and gynecological surgery.',
    headDoctor: 'Dr. Maria Garcia, MD',
    services: ['Prenatal & Delivery', 'High-Risk Pregnancy', 'Minimally Invasive Surgery', 'Family Planning'],
    patientCount: '3,100+ Annual Patients'
  },
  {
    id: 'dentistry',
    name: 'Dentistry',
    iconName: 'Smile',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
    description: 'State-of-the-art dental care ranging from routine hygiene and restorative procedures to cosmetic dentistry.',
    headDoctor: 'Dr. David Kim, DDS',
    services: ['Teeth Cleaning', 'Root Canal Therapy', 'Dental Implants', 'Cosmetic Orthodontics'],
    patientCount: '2,200+ Annual Patients'
  },
  {
    id: 'radiology',
    name: 'Radiology',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    description: 'High-resolution imaging technology including 3T MRI, 128-Slice CT, Ultrasound, and Digital X-Ray.',
    headDoctor: 'Dr. Claire Bennett, MD',
    services: ['3T MRI Imaging', '128-Slice CT Scan', 'Digital Mammography', 'Interventional Radiology'],
    patientCount: '4,500+ Annual Scans'
  }
];

export const DOCTORS: Doctor[] = [];

export const QUICK_FEATURES: FeatureItem[] = [
  {
    id: 'feat-1',
    title: 'Online Appointment Booking',
    description: 'Instant real-time doctor scheduling with preferred time slots, instant SMS/Email reminders, and easy rescheduling.',
    iconName: 'CalendarCheck',
    category: 'patient',
    details: [
      'Real-time doctor schedule visibility',
      'Instant booking confirmation with QR code pass',
      'Automated SMS & WhatsApp appointment reminders',
      'One-click rescheduling and cancellation'
    ]
  },
  {
    id: 'feat-2',
    title: 'Electronic Medical Records (EMR)',
    description: 'Secure, encrypted Cloud EMR repository accessible anytime by patients and authorized healthcare providers.',
    iconName: 'FileText',
    category: 'clinical',
    details: [
      'HIPAA compliant cloud storage',
      'Complete patient medical history timeline',
      'Digital doctor consultation notes',
      'Instant record sharing with specialists'
    ]
  },
  {
    id: 'feat-3',
    title: 'Patient Portal',
    description: 'Unified mobile-friendly dashboard for patients to view test results, download prescriptions, and manage family accounts.',
    iconName: 'UserCheck',
    category: 'patient',
    details: [
      'Personalized health statistics dashboard',
      'Family member profile management',
      'Secure doctor messaging & video calls',
      'Downloadable PDF health summaries'
    ]
  },
  {
    id: 'feat-4',
    title: 'Doctor Management System',
    description: 'Comprehensive workflow management for doctor rotas, patient queues, digital prescriptions, and clinical notes.',
    iconName: 'Stethoscope',
    category: 'admin',
    details: [
      'Intelligent e-Prescription generator',
      'Real-time OPD queue status monitor',
      'Doctor availability & leave roster',
      'Consultation fee tracking'
    ]
  },
  {
    id: 'feat-5',
    title: 'Pharmacy Management',
    description: 'Automated drug inventory tracking, expiry alerts, e-prescription fulfillment, and medicine billing.',
    iconName: 'Pill',
    category: 'admin',
    details: [
      'Real-time drug stock level alerts',
      'Direct e-prescription import from OPD',
      'Batch number & expiry date tracking',
      'Integrated POS pharmacy checkout'
    ]
  },
  {
    id: 'feat-6',
    title: 'Laboratory Services',
    description: 'Digital diagnostic lab workflow from sample collection barcodes to automated PDF result generation.',
    iconName: 'FlaskConical',
    category: 'clinical',
    details: [
      'Barcode tracking for blood & tissue samples',
      'Automated lab equipment integration',
      'Instant SMS result notifications to patients',
      'Critical lab value red-flag alerts'
    ]
  },
  {
    id: 'feat-7',
    title: 'Billing & Payments',
    description: 'Transparent itemized invoices, insurance claim processing, online credit card payments, and payment receipts.',
    iconName: 'CreditCard',
    category: 'admin',
    details: [
      'Seamless online payment gateway',
      'Direct insurance pre-authorization portal',
      'Itemized hospital bill breakdowns',
      'Automated payment receipts & tax invoices'
    ]
  },
  {
    id: 'feat-8',
    title: '24/7 Emergency Care Hub',
    description: 'Rapid ambulance dispatch tracking, ICU bed availability monitor, and priority emergency intake protocols.',
    iconName: 'Ambulance',
    category: 'core',
    details: [
      'Live GPS ambulance tracking link',
      'Real-time ICU & Emergency bed counter',
      'Trauma team instant alert system',
      'One-tap 24/7 emergency hotline dispatch'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    patientName: 'Eleanor Vance',
    role: 'Cardiac Surgery Patient',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'MediCare HMS made my heart surgery preparation effortless. Booking appointments online, receiving digital reminders, and checking my lab test results on the patient portal was so smooth and reassuring!',
    department: 'Cardiology',
    date: '2 weeks ago'
  },
  {
    id: 't-2',
    patientName: 'Marcus Sterling',
    role: 'Orthopedic Patient',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'The doctor portal and digital prescription downloads saved me hours of waiting. Dr. Elena Rostova and the whole orthopedic team provided world-class treatment for my knee recovery.',
    department: 'Orthopedics',
    date: '1 month ago'
  },
  {
    id: 't-3',
    patientName: 'Sophia Rodriguez',
    role: 'Maternity Patient',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'From my first trimester ultrasound to delivering our healthy baby boy, MediCare HMS provided 24/7 support. The emergency hotline and pediatrician access gave our family total peace of mind.',
    department: 'Obstetrics & Gynecology',
    date: '3 weeks ago'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I book an appointment with a specialist?',
    answer: 'You can book an appointment directly through our online booking wizard by selecting your desired department, preferred doctor, and available date and time slot. You can also call our 24/7 hotline.',
    category: 'appointments'
  },
  {
    id: 'faq-2',
    question: 'How can I access my lab test results and medical records?',
    answer: 'Log in to the MediCare Patient Portal using your registered email or patient ID. Under "Medical Records & Lab Results", you can view and download encrypted PDF reports as soon as they are validated by our diagnostics team.',
    category: 'records'
  },
  {
    id: 'faq-3',
    question: 'Does MediCare accept health insurance policies?',
    answer: 'Yes! We partner with over 45 major health insurance providers. You can upload your insurance policy details during online check-in or present your insurance card at our billing counter for instant pre-authorization.',
    category: 'billing'
  },
  {
    id: 'faq-4',
    question: 'What should I do in case of a medical emergency?',
    answer: 'Call our dedicated 24/7 Emergency Hotline immediately at 1-800-MEDICARE or click the red "Emergency Call" button on our app. Our trauma response unit and ambulance service operate round-the-clock.',
    category: 'emergency'
  },
  {
    id: 'faq-5',
    question: 'Is my personal health information secure on MediCare HMS?',
    answer: 'Absoluty. MediCare HMS is fully HIPAA compliant and utilizes 256-bit SSL encryption, strict role-based access control, and audited cloud storage to ensure your private medical records remain completely confidential.',
    category: 'general'
  }
];

export const MOCK_PATIENT_RECORD: PatientRecord = {
  id: 'PR-98241',
  patientId: 'MC-2026-88',
  name: 'Jane Doe',
  age: 34,
  gender: 'Female',
  bloodGroup: 'O+',
  allergies: ['Penicillin', 'Peanuts'],
  recentDiagnoses: ['Seasonal Allergic Rhinitis', 'Mild Vitamin D Deficiency'],
  upcomingAppointments: [
    {
      id: 'APT-101',
      doctorName: 'Dr. Robert Chen',
      specialty: 'Internal Medicine',
      dateTime: 'Tomorrow at 10:30 AM',
      room: 'OPD Suite 3B'
    },
    {
      id: 'APT-102',
      doctorName: 'Dr. Claire Bennett',
      specialty: 'Radiology (Routine Chest X-Ray)',
      dateTime: 'Aug 12, 2026 at 02:00 PM',
      room: 'Imaging Center 1'
    }
  ],
  prescriptions: [
    {
      medication: 'Amoxicillin 500mg',
      dosage: '1 tablet 3x daily',
      frequency: '7 days',
      refillStatus: 'Active (2 refills remaining)'
    },
    {
      medication: 'Vitamin D3 60,000 IU',
      dosage: '1 capsule weekly',
      frequency: '8 weeks',
      refillStatus: 'Active'
    }
  ]
};

export const ADMIN_STATS: AdminStat[] = [
  {
    title: 'Total Active Patients',
    value: '24,850',
    change: '+14% this month',
    isPositive: true,
    iconName: 'Users'
  },
  {
    title: 'Today Appointments',
    value: '184',
    change: '32 Pending OPD',
    isPositive: true,
    iconName: 'Calendar'
  },
  {
    title: 'ICU & Bed Occupancy',
    value: '84%',
    change: '42 Beds Available',
    isPositive: true,
    iconName: 'BedDouble'
  },
  {
    title: 'Monthly HMS Revenue',
    value: '$482,500',
    change: '+8.4% vs target',
    isPositive: true,
    iconName: 'TrendingUp'
  }
];
