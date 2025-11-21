import Vital from '../models/VitalModel.js';
import Patient from '../models/PatientModel.js';

// @desc    Add new Vitals record (BP, Sugar, etc.)
// @route   POST /api/vitals/add
// @access  Private (Doctor Only)
export const addVital = async (req, res) => {
  const { patientId, bloodPressureSystolic, bloodPressureDiastolic, sugar, heartRate, temperature, oxygen } = req.body;

  try {
    // 1. Verify Patient Exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // 2. Create Vital Record
    const vital = await Vital.create({
      patientId,
      doctorId: req.user.id,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      sugar,
      heartRate,
      temperature,
      oxygen
    });

    res.status(201).json({
      message: 'Vitals Recorded Successfully',
      vital
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vitals history for a specific patient
// @route   GET /api/vitals/:patientId
// @access  Private (Doctor & Patient)
export const getVitals = async (req, res) => {
  try {
    // Sort by newest first so the dashboard shows recent data at top
    const vitals = await Vital.find({ patientId: req.params.patientId })
      .sort({ createdAt: -1 });

    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};