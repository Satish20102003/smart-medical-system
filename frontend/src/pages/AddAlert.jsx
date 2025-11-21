import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddAlert = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    level: 'Medium',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: patient } = await api.get(`/patients/${pid}`);
      await api.post('/alerts/add', { ...formData, patientId: patient._id });
      toast.success("Alert Flagged Successfully");
      navigate(`/doctor/patient/${pid}`);
    } catch (error) {
         console.error(error);
      toast.error("Failed to create alert");
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

        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-red-50">
                <h1 className="text-2xl font-bold text-danger flex items-center gap-2">
                    <AlertTriangle size={24} />
                    Flag Critical Alert
                </h1>
                <p className="text-red-600/80 text-sm mt-1">Create a system warning for {pid}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Alert Type</label>
                    <input 
                        required 
                        name="type" 
                        className="input-field pl-4" 
                        placeholder="e.g. High Blood Pressure" 
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Risk Level</label>
                    <select name="level" className="input-field pl-4" onChange={handleChange}>
                        <option value="Medium">Medium</option>
                        <option value="High">High (Critical)</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Warning Message</label>
                    <textarea 
                        required 
                        name="message" 
                        rows="3" 
                        className="input-field pl-4 py-3" 
                        placeholder="Describe the risk factor..." 
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-danger text-white font-semibold py-3 rounded-xl hover:bg-red-600 transition-all flex justify-center items-center gap-2">
                    {isLoading ? 'Saving...' : <><Save size={20}/> Create Alert</>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddAlert;