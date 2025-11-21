import express from 'express';
import { 
    createPatient, 
    getPatients, 
    getPatientByPid, 
    getMyProfile // <--- New Import
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Doctor adds patient
router.post('/add', protect(['doctor']), createPatient);

// Doctor lists patients
router.get('/all', protect(['doctor']), getPatients);

// Patient gets THEIR OWN profile (Must come before /:pid)
router.get('/profile/me', protect(['patient']), getMyProfile); 

// Global Search
router.get('/:pid', protect(['doctor', 'patient']), getPatientByPid);

export default router;