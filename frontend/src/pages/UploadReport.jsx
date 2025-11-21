import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UploadReport = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [reportTitle, setReportTitle] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
        setFile(selectedFile);
    } else {
        toast.error("Only PDF files are allowed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a PDF file");

    setIsLoading(true);
    const formData = new FormData();
    
    try {
      // 1. Resolve PID to _id
      const { data: patient } = await api.get(`/patients/${pid}`);
      
      // 2. Append Data
      formData.append('patientId', patient._id);
      formData.append('reportTitle', reportTitle);
      formData.append('file', file);

      // 3. Upload
      await api.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Report Uploaded!");
      navigate(`/doctor/patient/${pid}`);
    } catch (error) {
      console.error("Upload Error", error);
      toast.error("Failed to upload report");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary mb-6">
            <ArrowLeft size={20} className="mr-2" /> Back to Patient
        </button>

        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-blue-50/50">
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <UploadCloud size={24} /> Upload Report
                </h1>
                <p className="text-blue-600/80 text-sm mt-1">Add lab results for {pid}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Report Title</label>
                    <input 
                        required 
                        className="input-field pl-4" 
                        placeholder="e.g. Blood Test Results - Nov 2025" 
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">PDF File</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer relative group">
                        <FileText size={32} className="mb-3 text-gray-400 group-hover:text-primary transition-colors"/>
                        <span className="text-sm font-medium text-dark">{file ? file.name : "Click to browse PDF"}</span>
                        <span className="text-xs text-gray-400 mt-1">Max size: 10MB</span>
                        <input 
                            type="file" 
                            accept="application/pdf"
                            required
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full flex justify-center items-center gap-2">
                    {isLoading ? 'Uploading...' : 'Upload Report'}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;