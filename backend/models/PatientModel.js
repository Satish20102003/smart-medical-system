import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  // Unique identifiers
  pid: { type: String, required: true, unique: true }, // Auto-generated Patient ID (e.g., P-1001)
  
  // Link to the user account if the patient logs in (optional for now)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, default: null }, 
  
  // Demographic information
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  contactEmail: { type: String, default: null, lowercase: true },

  // Link to the doctor who created the patient record
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;