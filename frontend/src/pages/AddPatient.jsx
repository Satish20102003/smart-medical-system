import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react'; // Fixed Imports
import { toast } from 'react-hot-toast';

const AddPatient = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contactEmail: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post('/patients/add', formData);
      
      toast.success(`Patient ${data.patientDetails.name} Created!`);
      setTimeout(() => navigate('/doctor/dashboard'), 1500);
      
    } catch (error) {
      console.error("Add Patient Error:", error);
      toast.error(error.response?.data?.message || "Failed to add patient");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <button 
            onClick={() => navigate('/doctor/dashboard')}
            className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors"
        >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
        </button>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-dark">Register New Patient</h1>
                <p className="text-gray-500 mt-1">Create a medical file and auto-generate login credentials.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                        name="name"
                        type="text" 
                        required
                        placeholder="e.g. Tony Stark"
                        className="input-field pl-4" // Clean padding, no icon
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Age</label>
                        <input 
                            name="age"
                            type="number" 
                            required
                            placeholder="45"
                            className="input-field pl-4"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Gender</label>
                        <select 
                            name="gender"
                            className="input-field pl-4"
                            onChange={handleChange}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Contact Email (For Login)</label>
                    <input 
                        name="contactEmail"
                        type="email" 
                        required
                        placeholder="patient@gmail.com"
                        className="input-field pl-4"
                        onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        * Must be a valid Gmail/Yahoo/Outlook address.
                    </p>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-primary flex items-center justify-center gap-2 w-full mt-8"
                >
                    {isLoading ? 'Creating Record...' : (
                        <>
                            <Save size={20} />
                            Create Patient Record
                        </>
                    )}
                </button>

            </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;