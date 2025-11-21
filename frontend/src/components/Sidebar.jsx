import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  LogOut, 
  Stethoscope,
  Search
} from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Search State
  const [searchPid, setSearchPid] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/doctor/dashboard' },
    { name: 'My Patients', icon: Users, path: '/doctor/patients' },
    { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { name: 'Treatments', icon: FileText, path: '/doctor/treatments' },
    { name: 'Reports', icon: Activity, path: '/doctor/reports' },
  ];

  const handleGlobalSearch = async (e) => {
    if (e.key === 'Enter' && searchPid.trim()) {
        setIsSearching(true);
        try {
            // Check if patient exists
            const { data } = await api.get(`/patients/${searchPid.trim()}`);
            toast.success(`Found ${data.name}`);
            // Navigate to their details page (We will build this next!)
            navigate(`/doctor/patient/${data.pid}`);
            setSearchPid(''); // Clear search
        } catch (error) {
             console.error("Search Error:", error);
            toast.error("Patient ID not found");
        } finally {
            setIsSearching(false);
        }
    }
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20">
      {/* Brand Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Stethoscope size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-dark tracking-tight">MediCare AI</h1>
          <p className="text-xs text-gray-500 font-medium">Doctor Portal</p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="px-4 mb-2">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
                type="text"
                placeholder="Search PID (Enter)..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                value={searchPid}
                onChange={(e) => setSearchPid(e.target.value)}
                onKeyDown={handleGlobalSearch}
                disabled={isSearching}
            />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {user?.name?.charAt(0) || 'D'}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-bold text-dark truncate">{user?.name || 'Dr. User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-danger bg-white border border-gray-200 hover:bg-red-50 hover:border-red-100 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;