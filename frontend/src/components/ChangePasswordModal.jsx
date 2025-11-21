import React, { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Lock, X } from 'lucide-react';

const ChangePasswordModal = ({ onClose}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      await api.put('/auth/update-password', {
        currentPassword,
        newPassword,
      });

      toast.success("Password updated! Please log in again.");
      onClose();
      // Force logout to clear old session data
      localStorage.clear();
      window.location.href = '/login'; 

    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                <Lock size={20} className="text-primary"/> Update Password
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500"/>
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              required
              placeholder="Enter current password"
              className="input-field pl-4"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              required
              placeholder="New strong password (8+ chars, 1 number)"
              className="input-field pl-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex justify-center items-center gap-2"
          >
            {isLoading ? 'Saving...' : 'Confirm Change'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;