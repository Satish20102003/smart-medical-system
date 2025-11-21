import express from 'express';
import { addVital, getVitals } from '../controllers/vitalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Doctor records vitals
router.post('/add', protect(['doctor']), addVital);

// Doctor OR Patient views history
router.get('/:patientId', protect(['doctor', 'patient']), getVitals);

export default router;