import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  
  type: { type: String, required: true }, // e.g., "High Blood Pressure"
  message: { type: String, required: true },
  level: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  isResolved: { type: Boolean, default: false },
}, {
  timestamps: true
});

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;