import express from 'express';
import { 
    getTreatmentSuggestion, 
    analyzeVitals, 
    suggestMedicines, 
    summarizeReport 
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Doctor Assistant
router.post('/treatment-suggestion', protect(['doctor']), getTreatmentSuggestion);

// 2. Vitals AI
router.post('/analyze-vitals', protect(['doctor']), analyzeVitals);

// 3. Medicine AI
router.post('/suggest-medicines', protect(['doctor']), suggestMedicines);

// 4. PDF Summary AI
router.post('/summarize-report', protect(['doctor']), summarizeReport);

export default router;