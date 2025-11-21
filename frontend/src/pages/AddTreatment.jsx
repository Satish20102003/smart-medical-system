import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddTreatment = () => {
  const { pid } = useParams(); // We need the Patient ID from URL
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    medicines: '',
    advice: '',
    followUpDate: ''
  });

  // --- AI FUNCTION ---
  const handleAiSuggest = async () => {
    if (!formData.symptoms) {
        toast.error("Please enter symptoms first");
        return;
    }

    setIsAiLoading(true);
    try {
        // Call our Node.js -> Python AI pipeline
        const { data } = await api.post('/ai/treatment-suggestion', {
            symptoms: formData.symptoms,
            diagnosis: formData.diagnosis || 'Unknown', 
            age: 30 // Default/Mock age for now (In real app, fetch patient age)
        });

        // The AI returns a text block. We put it in the advice/medicines box.
        // Note: Real AI returns structured text, we append it for the doctor to edit.
        setFormData(prev => ({
            ...prev,
            advice: (prev.advice + "\n" + data.suggestion).trim()
        }));
        toast.success("AI Suggestions Added!");
    } catch (error) {
        console.error(error);
        toast.error("AI Engine Failed");
    } finally {
        setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        // We need the MongoDB _id, but URL has PID (P-1001).
        // First, resolve PID to _id
        const { data: patient } = await api.get(`/patients/${pid}`);
        
        await api.post('/treatments/add', {
            ...formData,
            patientId: patient._id // Use the real MongoDB ID
        });

        toast.success("Treatment Saved");
        navigate(`/doctor/patient/${pid}`);
    } catch (error) {
        console.error("Treatment Error:", error);
        toast.error("Failed to save treatment");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary mb-6">
            <ArrowLeft size={20} className="mr-2" /> Back
        </button>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-dark">New Treatment</h1>
                    <p className="text-gray-500">PID: {pid}</p>
                </div>
                <button 
                    onClick={handleAiSuggest}
                    disabled={isAiLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:opacity-90 transition-all"
                >
                    {isAiLoading ? <Loader size={18} className="animate-spin"/> : <Sparkles size={18} />}
                    Auto-Generate with AI
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Diagnosis</label>
                        <input 
                            required
                            className="input-field pl-4"
                            placeholder="e.g. Viral Fever"
                            value={formData.diagnosis}
                            onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Follow-up Date</label>
                        <input 
                            type="date"
                            className="input-field pl-4"
                            value={formData.followUpDate}
                            onChange={e => setFormData({...formData, followUpDate: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Symptoms</label>
                    <textarea 
                        required
                        rows="3"
                        className="input-field pl-4 py-3"
                        placeholder="e.g. High fever, dry cough, headache..."
                        value={formData.symptoms}
                        onChange={e => setFormData({...formData, symptoms: e.target.value})}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Medicines (Rx)</label>
                    <textarea 
                        required
                        rows="3"
                        className="input-field pl-4 py-3"
                        placeholder="e.g. Paracetamol 650mg (twice daily)"
                        value={formData.medicines}
                        onChange={e => setFormData({...formData, medicines: e.target.value})}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Doctor's Advice / AI Suggestion</label>
                    <textarea 
                        rows="4"
                        className="input-field pl-4 py-3 bg-blue-50/50 border-blue-100"
                        placeholder="AI suggestions will appear here..."
                        value={formData.advice}
                        onChange={e => setFormData({...formData, advice: e.target.value})}
                    />
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full flex justify-center items-center gap-2">
                    {isLoading ? 'Saving...' : <><Save size={20}/> Save Treatment Record</>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddTreatment;