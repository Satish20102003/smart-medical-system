import express from 'express';
import { createAlert, getPatientAlerts, getAllDoctorAlerts } from '../controllers/alertController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Alert (Doctor/System)
router.post('/add', protect(['doctor']), createAlert);

// Get alerts for specific patient
router.get('/patient/:patientId', protect(['doctor', 'patient']), getPatientAlerts);

// Get ALL alerts for Doctor Dashboard
router.get('/doctor/all', protect(['doctor']), getAllDoctorAlerts);

export default router;