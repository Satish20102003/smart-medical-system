import express from 'express';
import { 
    addAppointment, 
    getAppointments, 
    deleteAppointment,
    getAllDoctorAppointments 
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Create Appointment
router.post('/add', protect(['doctor']), addAppointment);

// 2. GET ALL (MUST BE BEFORE /:patientId) ⚠️ CRITICAL FIX ⚠️
// This specific route must come first so "doctor" isn't treated as an ID
router.get('/doctor/all', protect(['doctor']), getAllDoctorAppointments);

// 3. Get by Patient ID (Dynamic Route)
router.get('/:patientId', protect(['doctor', 'patient']), getAppointments);

// 4. Delete
router.delete('/:id', protect(['doctor']), deleteAppointment);

export default router;