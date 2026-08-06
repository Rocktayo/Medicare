import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { MongoClient, Db } from 'mongodb';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB Configuration & Client Initialization
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medicare_db';
let dbClient: MongoClient | null = null;
let db: Db | null = null;
let isMongoConnected = false;

// Local fallback store file path for zero-config offline/preview environment
const DATA_FILE = path.join(process.cwd(), 'local_db_backup.json');

// Memory store for fallback
interface UserRecord {
  id: string;
  patientId: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'Patient' | 'Doctor' | 'Admin';
  age?: number;
  gender?: string;
  bloodGroup?: string;
  phone?: string;
  medicalHistory?: string;
  allergies?: string[];
  createdAt: string;
}

interface AppointmentRecord {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
  room: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

const defaultUsers: UserRecord[] = [
  {
    id: 'USR-003',
    patientId: 'ADM-0001',
    fullName: 'Omotayo Apata (Admin)',
    email: 'apataomotayo@gmail.com',
    passwordHash: 'Heredity',
    role: 'Admin',
    phone: '+1 (555) 000-1122',
    createdAt: new Date().toISOString()
  }
];

const defaultDoctors: any[] = [];

let localData: { users: UserRecord[]; appointments: AppointmentRecord[]; doctors: any[] } = {
  users: [...defaultUsers],
  doctors: [],
  appointments: []
};

// Load initial local data if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    localData = JSON.parse(content);
  } catch (err) {
    console.log('Error reading local backup store:', err);
  }
}

function saveLocalData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(localData, null, 2));
  } catch (e) {
    console.error('Failed to write local backup:', e);
  }
}

// Attempt MongoDB connection asynchronously
async function connectToMongoDB() {
  if (!process.env.MONGODB_URI) {
    console.log('ℹ️ MONGODB_URI not provided. Operating with simulated in-memory MongoDB store.');
    return;
  }
  try {
    dbClient = new MongoClient(MONGODB_URI, { connectTimeoutMS: 4000 });
    await dbClient.connect();
    db = dbClient.db('medicare_db');
    isMongoConnected = true;
    console.log('✅ Successfully connected to MongoDB database!');

    // Seed default users in MongoDB if collection is empty
    const usersCol = db.collection('users');
    const count = await usersCol.countDocuments();
    if (count === 0) {
      await usersCol.insertMany(defaultUsers);
      console.log('✅ Initialized Administrator account in MongoDB `users` collection.');
    }
  } catch (err: any) {
    console.warn('⚠️ Could not establish connection to external MongoDB instance:', err.message);
    console.log('ℹ️ Falling back to resilient embedded store mode with MongoDB API structure.');
    isMongoConnected = false;
  }
}

connectToMongoDB();

// API ROUTES

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodbConnected: isMongoConnected,
    database: isMongoConnected ? 'MongoDB (Cloud/URI)' : 'MongoDB Store Engine (Local/Fallback)',
    userCount: localData.users.length
  });
});

// User Registration API (Patient & Admin)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, role, age, gender, bloodGroup, phone, medicalHistory, allergies } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, error: 'Full Name, Email, and Password are required.' });
    }

    const targetRole = (role === 'Admin' ? 'Admin' : 'Patient') as 'Patient' | 'Admin';
    const lowerEmail = email.toLowerCase().trim();

    // Restrict Admin registration to authorized email only
    if (targetRole === 'Admin' && lowerEmail !== 'apataomotayo@gmail.com') {
      return res.status(403).json({
        success: false,
        error: 'Registration restricted: Only authorized Administrator can register as an Administrator.'
      });
    }

    // Check if user already exists
    if (isMongoConnected && db) {
      const existing = await db.collection('users').findOne({ email: lowerEmail });
      if (existing) {
        return res.status(400).json({ success: false, error: 'An account with this email address already exists.' });
      }

      const patientId = targetRole === 'Admin'
        ? `ADM-${Math.floor(1000 + Math.random() * 9000)}`
        : `MED-${Math.floor(100000 + Math.random() * 900000)}`;

      const newUserDoc = {
        patientId,
        fullName,
        email: lowerEmail,
        passwordHash: password, // In production, hash with bcrypt
        role: targetRole,
        age: targetRole === 'Patient' ? (Number(age) || 30) : undefined,
        gender: targetRole === 'Patient' ? (gender || 'Not Specified') : undefined,
        bloodGroup: targetRole === 'Patient' ? (bloodGroup || 'O+') : undefined,
        phone: phone || '',
        medicalHistory: medicalHistory || 'None',
        allergies: allergies || [],
        createdAt: new Date().toISOString()
      };

      const result = await db.collection('users').insertOne(newUserDoc);
      return res.status(201).json({
        success: true,
        message: `${targetRole} registered successfully in MongoDB!`,
        user: {
          id: result.insertedId.toString(),
          patientId: newUserDoc.patientId,
          fullName: newUserDoc.fullName,
          email: newUserDoc.email,
          role: targetRole,
          age: newUserDoc.age,
          gender: newUserDoc.gender,
          bloodGroup: newUserDoc.bloodGroup
        }
      });
    } else {
      // Fallback local persistence
      const existing = localData.users.find((u) => u.email.toLowerCase() === lowerEmail);
      if (existing) {
        return res.status(400).json({ success: false, error: 'An account with this email address already exists.' });
      }

      const patientId = targetRole === 'Admin'
        ? `ADM-${Math.floor(1000 + Math.random() * 9000)}`
        : `MED-${Math.floor(100000 + Math.random() * 900000)}`;

      const newUser: UserRecord = {
        id: `USR-${Date.now()}`,
        patientId,
        fullName,
        email: lowerEmail,
        passwordHash: password,
        role: targetRole,
        age: targetRole === 'Patient' ? (Number(age) || 30) : undefined,
        gender: targetRole === 'Patient' ? (gender || 'Not Specified') : undefined,
        bloodGroup: targetRole === 'Patient' ? (bloodGroup || 'O+') : undefined,
        phone: phone || '',
        medicalHistory: medicalHistory || 'None',
        allergies: typeof allergies === 'string' ? allergies.split(',').map((s) => s.trim()) : allergies || [],
        createdAt: new Date().toISOString()
      };

      localData.users.push(newUser);
      saveLocalData();

      return res.status(201).json({
        success: true,
        message: `${targetRole} registered successfully!`,
        user: {
          id: newUser.id,
          patientId: newUser.patientId,
          fullName: newUser.fullName,
          email: newUser.email,
          role: targetRole,
          age: newUser.age,
          gender: newUser.gender,
          bloodGroup: newUser.bloodGroup
        }
      });
    }
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during registration.' });
  }
});

// Login API for Patient, Doctor & Admin
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const lowerEmail = email.toLowerCase().trim();

    // Strict Admin Authorization Check
    if (role === 'Admin') {
      if (lowerEmail !== 'apataomotayo@gmail.com' || password !== 'Heredity') {
        return res.status(401).json({
          success: false,
          error: 'Access denied: Only authorized Administrator with correct password can log in as Admin.'
        });
      }

      // Return successful Admin user object
      return res.json({
        success: true,
        message: 'Administrator authentication successful!',
        user: {
          id: 'ADM-0001',
          patientId: 'ADM-0001',
          fullName: 'Omotayo Apata (Admin)',
          email: 'apataomotayo@gmail.com',
          role: 'Admin'
        }
      });
    }

    if (isMongoConnected && db) {
      const user = await db.collection('users').findOne({ email: lowerEmail, role: role || 'Patient' });
      if (!user || user.passwordHash !== password) {
        return res.status(401).json({ success: false, error: `Invalid ${role || 'user'} credentials.` });
      }

      return res.json({
        success: true,
        message: 'Authentication successful!',
        user: {
          id: user._id.toString(),
          patientId: user.patientId,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          age: user.age,
          gender: user.gender,
          bloodGroup: user.bloodGroup
        }
      });
    } else {
      // Local check
      const user = localData.users.find(
        (u) => u.email.toLowerCase() === lowerEmail && (!role || u.role === role)
      );

      if (!user || user.passwordHash !== password) {
        return res.status(401).json({ success: false, error: `Invalid credentials for ${role || 'Patient'}.` });
      }

      return res.json({
        success: true,
        message: 'Authentication successful!',
        user: {
          id: user.id,
          patientId: user.patientId,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          age: user.age,
          gender: user.gender,
          bloodGroup: user.bloodGroup
        }
      });
    }
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during login.' });
  }
});

// Get Admin Patients & System Users API
app.get('/api/admin/patients', async (req, res) => {
  try {
    if (isMongoConnected && db) {
      const patients = await db.collection('users').find({ role: 'Patient' }).toArray();
      return res.json({ success: true, count: patients.length, patients });
    } else {
      const patients = localData.users.filter((u) => u.role === 'Patient');
      return res.json({ success: true, count: patients.length, patients });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve patient roster.' });
  }
});

// Admin Create Patient Record API
app.post('/api/admin/patients', async (req, res) => {
  try {
    const { fullName, email, password, age, gender, bloodGroup, phone, status, department, attendingDoctor } = req.body;
    if (!fullName) {
      return res.status(400).json({ success: false, error: 'Full Name is required.' });
    }

    const patientCount = localData.users.filter((u) => u.role === 'Patient').length + 8801;
    const newPatient: UserRecord = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      patientId: `PAT-${patientCount}`,
      fullName,
      email: email || `patient${patientCount}@medicare.org`,
      passwordHash: password || 'Medicare2026',
      role: 'Patient',
      age: Number(age) || 30,
      gender: gender || 'Unspecified',
      bloodGroup: bloodGroup || 'O+',
      phone: phone || '+1 (555) 000-0000',
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected && db) {
      await db.collection('users').insertOne(newPatient);
      return res.json({ success: true, message: 'Patient registered in MongoDB database.', patient: newPatient });
    } else {
      localData.users.unshift(newPatient);
      saveLocalData();
      return res.json({ success: true, message: 'Patient registered in hospital system.', patient: newPatient });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create patient record.' });
  }
});

// Admin Delete Patient API
app.delete('/api/admin/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected && db) {
      await db.collection('users').deleteOne({
        $or: [{ id: id }, { patientId: id }]
      });
      await db.collection('appointments').deleteMany({
        $or: [{ patientId: id }, { patientName: id }]
      });
      return res.json({ success: true, message: 'Patient successfully deleted from database.' });
    } else {
      localData.users = localData.users.filter(
        (u) => u.id !== id && u.patientId !== id
      );
      localData.appointments = localData.appointments.filter(
        (a) => a.patientName !== id
      );
      saveLocalData();
      return res.json({ success: true, message: 'Patient successfully deleted from system.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete patient.' });
  }
});

// Get All Appointments API
app.get('/api/appointments', async (req, res) => {
  try {
    if (isMongoConnected && db) {
      const appointments = await db.collection('appointments').find({}).toArray();
      return res.json({ success: true, count: appointments.length, appointments });
    } else {
      return res.json({ success: true, count: localData.appointments.length, appointments: localData.appointments });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve appointments.' });
  }
});

// Book / Create Appointment API
app.post('/api/appointments', async (req, res) => {
  try {
    const {
      patientName,
      patientId,
      doctorName,
      specialty,
      date,
      time,
      dateTime,
      room,
      type,
      notes,
      status
    } = req.body;

    const newApt = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      patientName: patientName || 'Jane Doe',
      patientId: patientId || 'PAT-8801',
      doctorName: doctorName || 'Dr. Robert Chen',
      specialty: specialty || 'General Medicine',
      date: date || new Date().toISOString().split('T')[0],
      time: time || '10:00 AM',
      dateTime: dateTime || (date && time ? `${date} at ${time}` : 'Tomorrow, 10:00 AM'),
      room: room || (type === 'Video Consultation' ? 'Telehealth Room 4' : 'OPD Room 204'),
      type: type || 'In-Person',
      notes: notes || '',
      status: status || 'Scheduled',
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected && db) {
      await db.collection('appointments').insertOne(newApt);
    } else {
      localData.appointments.unshift(newApt as any);
      saveLocalData();
    }

    return res.status(201).json({ success: true, appointment: newApt });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ success: false, error: 'Failed to schedule appointment.' });
  }
});

// Update Appointment Status API
app.patch('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (isMongoConnected && db) {
      await db.collection('appointments').updateOne({ id }, { $set: { status } });
    } else {
      const idx = localData.appointments.findIndex((a) => a.id === id);
      if (idx !== -1) {
        (localData.appointments[idx] as any).status = status;
        saveLocalData();
      }
    }
    return res.json({ success: true, message: `Appointment ${id} status updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update appointment status.' });
  }
});

// Delete / Cancel Appointment API
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected && db) {
      await db.collection('appointments').deleteOne({ id });
    } else {
      localData.appointments = localData.appointments.filter((a) => a.id !== id);
      saveLocalData();
    }
    return res.json({ success: true, message: `Appointment ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to cancel appointment.' });
  }
});

// --- DOCTOR MANAGEMENT ENDPOINTS ---

// Get All Doctors API
app.get('/api/doctors', async (req, res) => {
  try {
    if (isMongoConnected && db) {
      const doctors = await db.collection('doctors').find({}).toArray();
      return res.json({ success: true, count: doctors.length, doctors });
    } else {
      if (!localData.doctors) {
        localData.doctors = [];
        saveLocalData();
      }
      return res.json({ success: true, count: localData.doctors.length, doctors: localData.doctors });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve doctors roster.' });
  }
});

// Create / Add Doctor API
app.post('/api/doctors', async (req, res) => {
  try {
    const { name, specialty, departmentId, experienceYears, rating, reviewsCount, photo, education, availability } = req.body;
    
    if (!name || !specialty) {
      return res.status(400).json({ success: false, error: 'Doctor name and specialty are required.' });
    }

    const newDoctor = {
      id: `doc-${Date.now()}`,
      name,
      specialty,
      departmentId: departmentId || 'gen-med',
      experienceYears: Number(experienceYears) || 5,
      rating: Number(rating) || 4.9,
      reviewsCount: Number(reviewsCount) || 10,
      photo: photo || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
      education: education || 'MD - Medical University',
      availability: availability || 'On-Duty',
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected && db) {
      await db.collection('doctors').insertOne(newDoctor);
    } else {
      if (!localData.doctors) localData.doctors = [];
      localData.doctors.unshift(newDoctor);
      saveLocalData();
    }

    return res.status(201).json({ success: true, doctor: newDoctor, message: `${name} added to staff roster.` });
  } catch (err) {
    console.error('Error adding doctor:', err);
    res.status(500).json({ success: false, error: 'Failed to create doctor profile.' });
  }
});

// Delete Doctor Profile API
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected && db) {
      await db.collection('doctors').deleteOne({ id });
      // Also delete from local fallback if present
      if (localData.doctors) {
        localData.doctors = localData.doctors.filter(d => d.id !== id);
        saveLocalData();
      }
    } else {
      if (localData.doctors) {
        localData.doctors = localData.doctors.filter(d => d.id !== id);
        saveLocalData();
      }
    }
    return res.json({ success: true, message: `Doctor profile ${id} permanently removed.` });
  } catch (err) {
    console.error('Error deleting doctor:', err);
    res.status(500).json({ success: false, error: 'Failed to delete doctor profile.' });
  }
});

// START EXPRESS SERVER & VITE MIDDLEWARE
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MediCare HMS Server running at http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (process.env.VERCEL !== '1') {
  startServer();
}
