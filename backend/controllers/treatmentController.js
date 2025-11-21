import Treatment from '../models/TreatmentModel.js';
import Patient from '../models/PatientModel.js';

// @desc    Add a new treatment
// @route   POST /api/treatments/add
export const addTreatment = async (req, res) => {
  const { patientId, diagnosis, symptoms, medicines, advice, followUpDate } = req.body;
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const treatment = await Treatment.create({
      patientId,
      doctorId: req.user.id,
      diagnosis,
      symptoms,
      medicines,
      advice,
      followUpDate
    });
    res.status(201).json({ message: 'Treatment Added', treatment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get treatments (WITH SECURITY CHECK AND POPULATE)
// @route   GET /api/treatments/:patientId
export const getTreatments = async (req, res) => {
  try {
    // --- SECURITY CHECK START ---
    if (req.user.role === 'patient') {
        // Find the patient profile linked to this logged-in user
        const patientProfile = await Patient.findOne({ userId: req.user.id });
        if (!patientProfile) return res.status(404).json({ message: 'Patient profile not found' });
        
        // Ensure they are asking for THEIR OWN data
        if (patientProfile._id.toString() !== req.params.patientId) {
            return res.status(403).json({ message: 'Access Denied: You can only view your own records.' });
        }
    }
    // --- SECURITY CHECK END ---

    const treatments = await Treatment.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name') // <--- CRITICAL FIX: Populate the Doctor's Name
      .sort({ createdAt: -1 });

    res.json(treatments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a treatment
// @route   DELETE /api/treatments/:id
export const deleteTreatment = async (req, res) => {
    try {
        const treatment = await Treatment.findById(req.params.id);
        if (!treatment) return res.status(404).json({ message: 'Treatment not found' });

        // Only the doctor who created it (or an admin) should delete it
        if (treatment.doctorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this record' });
        }

        await treatment.deleteOne();
        res.json({ message: 'Treatment Removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a treatment
// @route   PUT /api/treatments/:id
export const updateTreatment = async (req, res) => {
    try {
        const treatment = await Treatment.findById(req.params.id);
        if (!treatment) return res.status(404).json({ message: 'Treatment not found' });

        if (treatment.doctorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this record' });
        }

        // Update fields
        treatment.diagnosis = req.body.diagnosis || treatment.diagnosis;
        treatment.symptoms = req.body.symptoms || treatment.symptoms;
        treatment.medicines = req.body.medicines || treatment.medicines;
        treatment.advice = req.body.advice || treatment.advice;
        treatment.followUpDate = req.body.followUpDate || treatment.followUpDate;

        const updatedTreatment = await treatment.save();
        res.json(updatedTreatment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};