import axios from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data'; // Required for sending files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:5001';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Treatment AI
export const getTreatmentSuggestion = async (req, res) => {
  const { diagnosis, symptoms, age } = req.body;
  try {
    const response = await axios.post(`${AI_ENGINE_URL}/generate-treatment`, { diagnosis, symptoms, age });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'AI Error' });
  }
};

// 2. Vitals AI
export const analyzeVitals = async (req, res) => {
  try {
    const response = await axios.post(`${AI_ENGINE_URL}/analyze-vitals`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'AI Error' });
  }
};

// 3. Medicine AI -- NEW
export const suggestMedicines = async (req, res) => {
  const { symptoms, age, allergies } = req.body;
  try {
    const response = await axios.post(`${AI_ENGINE_URL}/suggest-medicines`, { symptoms, age, allergies });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'AI Error' });
  }
};

// 4. PDF Summary AI -- NEW
export const summarizeReport = async (req, res) => {
  const { fileName } = req.body; // Frontend sends the filename stored in DB

  try {
    // Locate the file on the server
    const filePath = path.join(__dirname, '..', 'uploads', 'reports', fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found on server' });
    }

    // Prepare Form Data to send to Python
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    // Send to Python
    const response = await axios.post(`${AI_ENGINE_URL}/summarize-report`, form, {
      headers: {
        ...form.getHeaders()
      }
    });

    res.json(response.data);

  } catch (error) {
    console.error("AI Summary Error:", error.message);
    res.status(500).json({ message: 'Failed to summarize report' });
  }
};