import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/UserModel.js';
import Patient from './models/PatientModel.js';
import Treatment from './models/TreatmentModel.js';
import Vital from './models/VitalModel.js';
import Appointment from './models/AppointmentModel.js';
import Alert from './models/AlertModel.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// --- INDIAN DOCTORS ---
const DOCTORS = [
    { name: 'Dr. Rajesh Gupta', email: 'rajesh.gupta.md@gmail.com', specialization: 'Cardiology' },
    { name: 'Dr. Priya Sharma', email: 'priya.sharma.dr@outlook.com', specialization: 'Pediatrics' },
    { name: 'Dr. Amit Verma', email: 'amit.verma.neuro@gmail.com', specialization: 'Neurology' },
    { name: 'Dr. Neha Singh', email: 'neha.singh.gp@yahoo.com', specialization: 'General Practice' }
];

// --- INDIAN PATIENTS ---
const PATIENT_NAMES = [
    { name: 'Rahul Kumar', age: 45, gender: 'Male', pid: 'P-10001' },
    { name: 'Anjali Desai', age: 28, gender: 'Female', pid: 'P-10002' },
    { name: 'Vikram Singh', age: 55, gender: 'Male', pid: 'P-10003' },
    { name: 'Sneha Patel', age: 34, gender: 'Female', pid: 'P-10004' },
    { name: 'Arjun Reddy', age: 29, gender: 'Male', pid: 'P-10005' },
    { name: 'Meera Iyer', age: 62, gender: 'Female', pid: 'P-10006' },
    { name: 'Rohan Das', age: 19, gender: 'Male', pid: 'P-10007' },
    { name: 'Kavita Nair', age: 40, gender: 'Female', pid: 'P-10008' },
    { name: 'Ishaan Malhotra', age: 12, gender: 'Male', pid: 'P-10009' },
    { name: 'Pooja Mehta', age: 25, gender: 'Female', pid: 'P-10010' }
];

const VITALS_DATA = [
    { bpS: 120, bpD: 80, sugar: 90, hr: 70, temp: 98.6, ox: 99 },
    { bpS: 125, bpD: 82, sugar: 95, hr: 75, temp: 98.7, ox: 98 },
    { bpS: 145, bpD: 95, sugar: 140, hr: 85, temp: 99.2, ox: 96 },
    { bpS: 110, bpD: 70, sugar: 85, hr: 65, temp: 97.9, ox: 99 },
];

const importData = async () => {
  await connectDB();
  
  // FIX: Plain text passwords (The UserModel pre-save hook will hash them!)
  const doctorPassword = 'StrongPass123!'; 
  const patientPassword = 'Medical@123';

  try {
    // 1. Clear Data
    await Promise.all([
      User.deleteMany(), Patient.deleteMany(), Treatment.deleteMany(), Vital.deleteMany(),
      Appointment.deleteMany(), Alert.deleteMany()
    ]);
    console.log('🗑️  Data Cleared');

    // 2. Create Doctors
    const createdDoctors = await Promise.all(
      DOCTORS.map(d => User.create({ ...d, password: doctorPassword, role: 'doctor' }))
    );
    const [docRajesh, docPriya, docAmit, docNeha] = createdDoctors;
    console.log(`👨‍⚕️ ${createdDoctors.length} Indian Doctors Created`);

    // 3. Create Patients
    const createdPatients = [];
    let doctorIndex = 0;
    const allDoctors = [docRajesh, docPriya, docAmit, docNeha];

    for (const p of PATIENT_NAMES) {
        const primaryDoctor = allDoctors[doctorIndex % allDoctors.length];
        const validEmail = p.name.toLowerCase().replace(/\s/g, '.') + '@gmail.com';

        const user = await User.create({
            name: p.name,
            email: validEmail,
            password: patientPassword,
            role: 'patient',
            age: p.age,
            gender: p.gender
        });

        const patient = await Patient.create({
            pid: p.pid,
            userId: user._id,
            name: p.name,
            age: p.age,
            gender: p.gender,
            contactEmail: validEmail,
            createdBy: primaryDoctor._id
        });
        createdPatients.push({ ...p, _id: patient._id, user_id: user._id, primaryDoctorId: primaryDoctor._id });
        doctorIndex++;
    }
    console.log(`👤 ${createdPatients.length} Indian Patients Created`);

    // 4. Populate Medical Data
    for (const patient of createdPatients) {
        const docId = patient.primaryDoctorId;

        // Add Vitals
        for (let i = 0; i < 3; i++) {
            const vitals = VITALS_DATA[i % VITALS_DATA.length];
            await Vital.create({
                patientId: patient._id,
                doctorId: docId,
                bloodPressureSystolic: vitals.bpS + Math.floor(Math.random() * 5),
                bloodPressureDiastolic: vitals.bpD + Math.floor(Math.random() * 3),
                sugar: vitals.sugar + Math.floor(Math.random() * 10),
                heartRate: vitals.hr + Math.floor(Math.random() * 5),
                temperature: vitals.temp,
                oxygen: vitals.ox,
                createdAt: new Date(Date.now() - (i * 86400000))
            });
        }
        
        // Add Treatments
        await Treatment.create({
            patientId: patient._id,
            doctorId: docId,
            diagnosis: patient.age > 50 ? 'Type 2 Diabetes' : 'Viral Fever',
            symptoms: patient.age > 50 ? 'Fatigue, Thirst' : 'Fever, Cough',
            medicines: patient.age > 50 ? 'Metformin 500mg' : 'Paracetamol 650mg',
            advice: 'Complete rest and follow diet plan.',
            followUpDate: new Date('2025-12-10')
        });

        if (patient.name.includes('Vikram')) {
             await Alert.create({
                patientId: patient._id,
                type: 'Critical Hypertension',
                message: `Patient recorded BP 150/95. Immediate consultation required.`,
                level: 'High',
                isResolved: false
            });
        }
    }
    
    console.log('\n--- LOGIN CREDENTIALS (FOR TESTING) ---');
    console.log(`👨‍⚕️ Doctor: ${docRajesh.email} | Pass: StrongPass123!`);
    console.log(`👤 Patient: ${createdPatients[0].name.toLowerCase().replace(/\s/g, '.')}@gmail.com | Pass: Medical@123`);

    console.log('\n🎉 Database Populated Successfully!');
    process.exit();

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

importData();