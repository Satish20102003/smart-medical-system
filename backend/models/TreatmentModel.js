import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  diagnosis: { type: String, required: true },
  symptoms: { type: String, required: true },
  medicines: { type: String, required: true }, // Stores prescribed meds as a text string
  advice: { type: String },
  followUpDate: { type: Date, default: null },
}, {
  timestamps: true
});

const Treatment = mongoose.model('Treatment', treatmentSchema);
export default Treatment;