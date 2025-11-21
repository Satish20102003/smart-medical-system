import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// --- Import Routes ---
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import treatmentRoutes from './routes/treatmentRoutes.js';
import vitalRoutes from './routes/vitalRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js'; // <--- NEW IMPORT

// --- Configuration ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Middleware Setup ---
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());

// --- Static File Server ---
const uploadPath = join(__dirname, 'uploads/reports');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// --- Mount Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/vitals', vitalRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/doctor', doctorRoutes); // <--- CONNECTED

// --- Root Route ---
app.get('/', (req, res) => {
  res.send('Smart Medical AI System API is running.');
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});