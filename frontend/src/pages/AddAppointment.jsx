import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Save, Clock } from 'lucide-react'; // Import Clock icon
import { toast } from 'react-hot-toast';

const AddAppointment = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    purpose: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: patient } = await api.get(`/patients/${pid}`);
      
      await api.post('/appointments/add', {
        ...formData,
        patientId: patient._id
      });

      toast.success("Appointment Scheduled Successfully");
      navigate(`/doctor/patient/${pid}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule appointment");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back
        </button>

        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-purple-50">
                <h1 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                    <Calendar size={24} /> Schedule Appointment
                </h1>
                <p className="text-purple-600/80 text-sm mt-1">Set a visit for Patient ID: {pid}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <input 
                        required 
                        name="date" 
                        type="date" 
                        className="input-field pl-4" 
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Time</label>
                    <div className="relative">
                        {/* We remove the absolute positioned icon inside the input to prevent overlap */}
                        {/* Instead, we rely on the browser's native picker icon which appears on the right */}
                        <input 
                            required 
                            name="time" 
                            type="time" 
                            className="input-field pl-4" // Standard padding
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Purpose</label>
                    <input 
                        required 
                        name="purpose" 
                        className="input-field pl-4" 
                        placeholder="e.g. General Checkup" 
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-purple-200">
                    {isLoading ? 'Saving...' : <><Save size={20}/> Confirm Schedule</>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;