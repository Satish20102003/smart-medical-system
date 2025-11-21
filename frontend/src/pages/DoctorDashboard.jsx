import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import api from '../api/axios';
import { Users, Calendar, Activity, AlertCircle, Plus, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const DoctorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [searchPid, setSearchPid] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/doctor/stats');
        setStats(data);
      } catch (error) {
        console.error("Stats Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPid.trim()) return;

    setIsSearching(true);
    try {
      const { data } = await api.get(`/patients/${searchPid}`);
      setSearchResult(data);
      toast.success("Patient Found!");
    } catch (error) {
      console.error("Search Error:", error);
      setSearchResult(null);
      toast.error("Patient ID not found.");
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchPid('');
    setSearchResult(null);
  };

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark">Dashboard Overview</h1>
            <p className="text-gray-500">Welcome back, here's what's happening today.</p>
          </div>
          <button 
            onClick={() => navigate('/doctor/add-patient')}
            className="btn-primary flex items-center gap-2 px-6 py-2.5 h-fit"
          >
            <Plus size={20} />
            Add New Patient
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Patients" value={stats?.totalPatients || 0} icon={Users} color="bg-blue-500" subtext="Managed by you" />
          <StatCard title="Appointments" value={stats?.totalAppointments || 0} icon={Calendar} color="bg-purple-500" subtext="Scheduled upcoming" />
          <StatCard title="Total Treatments" value={stats?.totalTreatments || 0} icon={Activity} color="bg-emerald-500" subtext="Records created" />
          <StatCard title="Critical Alerts" value={stats?.criticalAlerts || 0} icon={AlertCircle} color="bg-red-500" subtext="Requires attention" />
        </div>

        {/* --- IMPROVED SEARCH SECTION --- */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 mb-8">
            <h2 className="text-lg font-bold text-dark mb-4">Global Patient Search</h2>
            
            <form onSubmit={handleSearch} className="flex gap-3 items-center">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Enter Patient ID (e.g. P-10001)" 
                        className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        value={searchPid}
                        onChange={(e) => setSearchPid(e.target.value)}
                    />
                    {searchResult && (
                        <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                            <X size={18} />
                        </button>
                    )}
                </div>
                <button 
                    type="submit" 
                    disabled={isSearching} 
                    className="btn-primary px-8 py-3 h-[50px] w-32 flex items-center justify-center disabled:opacity-70"
                >
                    {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Search'}
                </button>
            </form>

            {/* Search Result Display */}
            {searchResult && (
                <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex justify-between items-center animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-primary font-bold">
                            {searchResult.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-dark">{searchResult.name}</h3>
                            <p className="text-sm text-gray-600">PID: <span className="font-mono font-medium text-dark">{searchResult.pid}</span> | {searchResult.age} yrs | {searchResult.gender}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate(`/doctor/patient/${searchResult.pid}`)}
                        className="bg-white text-primary border border-primary/20 px-4 py-2 rounded-lg font-medium hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                    >
                        Open Medical File
                    </button>
                </div>
            )}
        </div>

        {/* Recent Patients Table */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-dark">Recent Patients</h2>
            <button onClick={() => navigate('/doctor/patients')} className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">PID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Age/Gender</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats?.recentPatients?.length > 0 ? (
                  stats.recentPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-dark">{patient.name}</td>
                      <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono">{patient.pid}</span></td>
                      <td className="px-6 py-4 text-gray-600">{patient.age} / {patient.gender}</td>
                      <td className="px-6 py-4 text-gray-600">{patient.contactEmail}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => navigate(`/doctor/patient/${patient.pid}`)}
                          className="text-primary hover:text-indigo-700 font-medium text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No patients found. Start by adding one!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;