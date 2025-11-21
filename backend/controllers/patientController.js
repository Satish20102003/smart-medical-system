import Patient from '../models/PatientModel.js';
import User from '../models/UserModel.js';
import { sendWelcomeEmail } from '../services/emailService.js'; // <--- NEW IMPORT

// Helper: Validate Email
const validateEmail = (email) => {
  // Matches Gmail, Yahoo, Outlook, etc.
  const re = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com)$/;
  return re.test(String(email).toLowerCase());
};

// @desc    Create Patient & Auto-Login
// @route   POST /api/patients/add
export const createPatient = async (req, res) => {
  const { name, age, gender, contactEmail } = req.body;

  try {
    if (!contactEmail || !validateEmail(contactEmail)) {
        return res.status(400).json({ message: 'Invalid Contact Email.' });
    }

    const userExists = await User.findOne({ email: contactEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const pid = `P-${Date.now().toString().slice(-6)}`;
    const defaultPassword = "Medical@123";

    // Create User Account
    const newUser = await User.create({
      name,
      email: contactEmail,
      password: defaultPassword,
      role: 'patient',
      age,
      gender
    });

    // Create Medical Record
    const patient = await Patient.create({
      pid,
      userId: newUser._id,
      name,
      age,
      gender,
      contactEmail,
      createdBy: req.user.id,
    });

    // --- SEND EMAIL HERE ---
    // We use 'await' so we see the log, but inside a separate try/catch or just let the service handle errors
    await sendWelcomeEmail(newUser.email, newUser.name, defaultPassword);
    // -----------------------

    res.status(201).json({
      message: "Patient Created Successfully & Email Sent",
      pid: patient.pid,
      loginEmail: newUser.email,
      tempPassword: defaultPassword,
      patientDetails: patient
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... (Keep getPatients, getPatientByPid, and getMyProfile exactly as they were) ...
// I will omit them here to save space, but MAKE SURE YOU KEEP THEM!
// If you need the full file again, let me know.
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientByPid = async (req, res) => {
  try {
    const patient = await Patient.findOne({ pid: req.params.pid });
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient ID not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'No medical record found for this user.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};