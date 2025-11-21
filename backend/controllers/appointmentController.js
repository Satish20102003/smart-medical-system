import Appointment from '../models/AppointmentModel.js';
import Patient from '../models/PatientModel.js';

// @desc    Schedule Appointment
// @route   POST /api/appointments/add
export const addAppointment = async (req, res) => {
  const { patientId, date, time, purpose } = req.body;
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const appointment = await Appointment.create({
      patientId,
      doctorId: req.user.id,
      date,
      time,
      purpose,
      status: 'Scheduled'
    });
    res.status(201).json({ message: 'Appointment Scheduled', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Appointments (WITH SECURITY CHECK)
// @route   GET /api/appointments/:patientId
export const getAppointments = async (req, res) => {
  try {
    // --- SECURITY CHECK ---
    if (req.user.role === 'patient') {
        const patientProfile = await Patient.findOne({ userId: req.user.id });
        if (!patientProfile || patientProfile._id.toString() !== req.params.patientId) {
            return res.status(403).json({ message: 'Access Denied' });
        }
    }
    // ----------------------

    const appointments = await Appointment.find({ patientId: req.params.patientId }).sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete/Cancel Appointment
// @route   DELETE /api/appointments/:id
export const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Not found' });
        
        // Only allow doctor to delete
        if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Not Authorized' });

        await appointment.deleteOne();
        res.json({ message: 'Appointment Cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id })
      .populate('patientId', 'name pid')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};