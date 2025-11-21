import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- STRICT VALIDATION HELPERS ---

// 1. Strict Email Whitelist (Gmail, Yahoo, Outlook, Hotmail, iCloud)
const validateEmail = (email) => {
  // Regex matches ONLY these specific domains
  const re = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com)$/;
  return re.test(String(email).toLowerCase());
};

// 2. Validate Password (Min 8 chars, at least 1 number)
const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return re.test(password);
};

// --- CONTROLLERS ---

export const registerUser = async (req, res) => {
  const { name, email, password, role, specialization, accessCode } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // --- SECURITY CHECK ---
    if (role === 'doctor') {
        if (accessCode !== process.env.DOCTOR_ACCESS_CODE) {
            return res.status(403).json({ message: 'Invalid Access Code. Contact Admin.' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid Email. Only Gmail, Yahoo, Outlook allowed.' });
        }
        
        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password too weak (8+ chars & number needed)' });
        }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      specialization
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    }
  } catch (error) {
    console.error("Register Error:", error); // Log error to terminal
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};