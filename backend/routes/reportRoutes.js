import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Import fs to verify directory exists
import { fileURLToPath } from 'url'; // Import helpers for __dirname
import { dirname, join } from 'path'; // Import path helpers

import { uploadReport, getReports } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Multer Configuration ---

// 1. Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 2. Define Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Go up two levels from 'routes' to 'backend', then into 'uploads/reports'
    // Adjusted path: ../uploads/reports relative to this file location
    const uploadPath = path.join(__dirname, '..', 'uploads', 'reports');
    
    // Ensure directory exists before saving
    if (!fs.existsSync(uploadPath)){
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-originalName (e.g., 170999-bloodtest.pdf)
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// 3. File Filter (Only PDFs allowed)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Not a PDF! Please upload only PDF files.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit 10MB
});

// --- Routes ---

// Doctor uploads report (Multer middleware 'upload.single' handles the file first)
router.post('/upload', protect(['doctor']), upload.single('file'), uploadReport);

// Doctor OR Patient views reports
router.get('/:patientId', protect(['doctor', 'patient']), getReports);

export default router;