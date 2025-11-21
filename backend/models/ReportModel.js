import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // File details
  reportTitle: { type: String, required: true },
  fileName: { type: String, required: true }, // The actual name of the file on the server
  mimeType: { type: String, default: 'application/pdf' },
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);
export default Report;