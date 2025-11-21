import Patient from '../models/PatientModel.js';
import Appointment from '../models/AppointmentModel.js';
import Treatment from '../models/TreatmentModel.js';
import Alert from '../models/AlertModel.js';

// @desc    Get Dashboard Statistics
// @route   GET /api/doctor/stats
export const getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.user.id;

    // 1. Count Total Patients (Created by YOU)
    const totalPatients = await Patient.countDocuments({ createdBy: doctorId });

    // 2. Count Total Appointments (Scheduled for YOU)
    const totalAppointments = await Appointment.countDocuments({ doctorId });

    // 3. Count Total Treatments (Done by YOU)
    const totalTreatments = await Treatment.countDocuments({ doctorId });

    // 4. Count Critical Alerts (ONLY for patients YOU created)
    // Step A: Find all patients belonging to this doctor
    const myPatients = await Patient.find({ createdBy: doctorId }).select('_id');
    const myPatientIds = myPatients.map(p => p._id);

    // Step B: Find alerts where patientId is in that list
    const criticalAlerts = await Alert.countDocuments({ 
        patientId: { $in: myPatientIds },
        level: 'High', 
        isResolved: false 
    });

    // 5. Get Recent Patients
    const recentPatients = await Patient.find({ createdBy: doctorId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalPatients,
      totalAppointments,
      totalTreatments,
      criticalAlerts,
      recentPatients
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};