import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { updatePassword } from '../controllers/userController.js'; // <--- Import this
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// NEW ROUTE: Update Password (User must be logged in, so protect it)
router.put('/update-password', protect(['doctor', 'patient']), updatePassword);

export default router;