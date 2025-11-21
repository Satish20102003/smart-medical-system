import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // Ensure your backend has the /appointments/doctor/all endpoint!
        const { data } = await api.get('/appointments/doctor/all');
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold text-dark mb-6">Scheduled Appointments</h1>

        {loading ? <div className="text-center">Loading...</div> : (
          <div className="grid gap-4 max-w-4xl">
            {appointments.length > 0 ? appointments.map(app => (
              <div key={app._id} className="bg-white p-5 rounded-xl shadow-soft border border-gray-100 flex justify-between items-center hover:shadow-md transition-all">
                <div className="flex gap-4 items-center">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-dark text-lg flex items-center gap-2">
                            {app.patientId?.name || 'Unknown'}
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">
                                {app.patientId?.pid}
                            </span>
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">{app.purpose}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-lg font-bold text-primary">{new Date(app.date).toLocaleDateString()}</div>
                        <div className="text-gray-500 text-sm flex items-center justify-end gap-1">
                            <Clock size={14} /> {app.time}
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => navigate(`/doctor/patient/${app.patientId?.pid}`)}
                        className="btn-primary px-4 py-2 text-sm h-fit"
                    >
                        Open File
                    </button>
                </div>
              </div>
            )) : (
                <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                    <Calendar size={48} className="mx-auto mb-4 opacity-20"/>
                    <p>No upcoming appointments scheduled.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;