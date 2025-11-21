import Alert from '../models/AlertModel.js';
import Patient from '../models/PatientModel.js';

// @desc    Create a new Alert (Manual or System Generated)
// @route   POST /api/alerts/add
// @access  Private (Doctor Only)
export const createAlert = async (req, res) => {
  const { patientId, type, message, level } = req.body;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const alert = await Alert.create({
      patientId,
      type,     // e.g., "High Blood Pressure"
      message,  // e.g., "Reading 160/100 is critical"
      level,    // "High", "Medium", "Low"
      isResolved: false
    });

    res.status(201).json({ message: 'Alert Created', alert });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get alerts for a specific patient
// @route   GET /api/alerts/patient/:patientId
// @access  Private (Doctor & Patient)
export const getPatientAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ patientId: req.params.patientId })
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ALL unresolved alerts (For Doctor Dashboard)
// @route   GET /api/alerts/doctor/all
// @access  Private (Doctor Only)
export const getAllDoctorAlerts = async (req, res) => {
  try {
    // Find all alerts where isResolved is false, verify doctor permissions ideally
    // For now, return all high-risk alerts for the dashboard
    const alerts = await Alert.find({ isResolved: false })
      .populate('patientId', 'name pid') // Show patient name in the alert list
      .sort({ level: 1, createdAt: -1 }); // Sort by Level (High first) then Date
      
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};