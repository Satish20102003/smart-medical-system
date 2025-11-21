import mongoose from 'mongoose';

const vitalSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Vitals measurements
  bloodPressureSystolic: { type: Number, required: true }, // e.g., 120
  bloodPressureDiastolic: { type: Number, required: true }, // e.g., 80
  sugar: { type: Number, required: true }, // mg/dL
  heartRate: { type: Number, required: true }, // bpm
  temperature: { type: Number, required: true }, // Fahrenheit or Celsius
  oxygen: { type: Number, required: true }, // % saturation
}, {
  timestamps: true
});

const Vital = mongoose.model('Vital', vitalSchema);
export default Vital;