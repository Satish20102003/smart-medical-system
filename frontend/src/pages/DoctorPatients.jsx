import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get('/patients/all');
        setPatients(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.pid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-dark">My Patient List</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input 
              type="text" 
              placeholder="Filter by Name or PID..." 
              className="input-field pl-10 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? <div>Loading...</div> : (
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-500">Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-500">PID</th>
                  <th className="p-4 text-sm font-semibold text-gray-500">Age/Gender</th>
                  <th className="p-4 text-sm font-semibold text-gray-500">Contact</th>
                  <th className="p-4 text-sm font-semibold text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map(patient => (
                  <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-dark flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                        {patient.name.charAt(0)}
                      </div>
                      {patient.name}
                    </td>
                    <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{patient.pid}</span></td>
                    <td className="p-4 text-sm text-gray-600">{patient.age} / {patient.gender}</td>
                    <td className="p-4 text-sm text-gray-600">{patient.contactEmail}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => navigate(`/doctor/patient/${patient.pid}`)}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        Open File
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.length === 0 && <div className="p-8 text-center text-gray-500">No patients found.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;