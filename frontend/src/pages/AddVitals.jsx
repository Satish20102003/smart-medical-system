import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddVitals = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    sugar: '',
    heartRate: '',
    temperature: '',
    oxygen: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Resolve PID -> _id
      const { data: patient } = await api.get(`/patients/${pid}`);

      // 2. Save Vitals
      await api.post('/vitals/add', {
        ...formData,
        patientId: patient._id
      });

      // 3. (Optional) Auto-Trigger AI Analysis here if values are high
      // For now, just save.
      toast.success("Vitals Recorded");
      navigate(`/doctor/patient/${pid}`);
    } catch (error) {
         console.error(error);
      toast.error("Failed to save vitals");
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

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-dark">Record Vitals</h1>
                <p className="text-gray-500">Daily health check for {pid}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">BP Systolic (Upper)</label>
                        <input required name="bloodPressureSystolic" type="number" className="input-field pl-4" placeholder="120" onChange={handleChange}/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">BP Diastolic (Lower)</label>
                        <input required name="bloodPressureDiastolic" type="number" className="input-field pl-4" placeholder="80" onChange={handleChange}/>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Sugar (mg/dL)</label>
                        <input required name="sugar" type="number" className="input-field pl-4" placeholder="90" onChange={handleChange}/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
                        <input required name="heartRate" type="number" className="input-field pl-4" placeholder="72" onChange={handleChange}/>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Temperature (F)</label>
                        <input required name="temperature" type="number" step="0.1" className="input-field pl-4" placeholder="98.6" onChange={handleChange}/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Oxygen (%)</label>
                        <input required name="oxygen" type="number" className="input-field pl-4" placeholder="98" onChange={handleChange}/>
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full flex justify-center items-center gap-2">
                    {isLoading ? 'Saving...' : <><Activity size={20}/> Save Vitals</>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddVitals;