import express from 'express';
import { getDoctorStats } from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get Dashboard Stats
router.get('/stats', protect(['doctor']), getDoctorStats);

export default router;
