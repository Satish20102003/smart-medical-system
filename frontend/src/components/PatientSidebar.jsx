import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, User } from 'lucide-react';

const PatientSidebar = () => {
  const { logout, user } = useAuth();

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg text-green-600">
          <User size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-dark">MediCare AI</h1>
          <p className="text-xs text-gray-500">Patient Portal</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-green-50 text-green-700">
           <LayoutDashboard size={18} />
           My Health Dashboard
        </button>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="mb-4 px-2">
            <p className="text-sm font-bold text-dark">{user?.name}</p>
            <p className="text-xs text-gray-500">Patient Account</p>
        </div>
        <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-danger border border-gray-200 hover:bg-red-50">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default PatientSidebar;