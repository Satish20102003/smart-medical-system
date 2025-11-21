import express from 'express';
import { 
    addTreatment, 
    getTreatments, 
    deleteTreatment, 
    updateTreatment 
} from '../controllers/treatmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', protect(['doctor']), addTreatment);
router.get('/:patientId', protect(['doctor', 'patient']), getTreatments);

// --- NEW CRUD ROUTES ---
router.delete('/:id', protect(['doctor']), deleteTreatment);
router.put('/:id', protect(['doctor']), updateTreatment);

export default router;