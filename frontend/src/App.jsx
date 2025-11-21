import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// --- Import ALL Pages (Directly matching your folder structure) ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPatients from './pages/DoctorPatients';
import DoctorAppointments from './pages/DoctorAppointments';
import PatientDetails from './pages/PatientDetails';
import AddTreatment from './pages/AddTreatment';
import AddVitals from './pages/AddVitals';
import AddAlert from './pages/AddAlert';
import UploadReport from './pages/UploadReport';
import AddAppointment from './pages/AddAppointment'; 
import AddPatient from './pages/AddPatient'; // <--- THIS WAS THE MISSING/BLANK LINK
import PatientDashboard from './pages/PatientDashboard'; 


const DashboardLayout = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== requiredRole) return <div className="p-10 text-red-500">Access Denied</div>;
  return <div>{children}</div>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* DOCTOR ROUTES */}
      <Route path="/doctor/dashboard" element={<DashboardLayout requiredRole="doctor"><DoctorDashboard /></DashboardLayout>} />
      <Route path="/doctor/patients" element={<DashboardLayout requiredRole="doctor"><DoctorPatients /></DashboardLayout>} />
      <Route path="/doctor/appointments" element={<DashboardLayout requiredRole="doctor"><DoctorAppointments /></DashboardLayout>} />
      
      {/* Sidebar Redirects */}
      <Route path="/doctor/treatments" element={<Navigate to="/doctor/patients" replace />} />
      <Route path="/doctor/reports" element={<Navigate to="/doctor/patients" replace />} />

      {/* PATIENT FORMS */}
      <Route path="/doctor/patient/:pid" element={<DashboardLayout requiredRole="doctor"><PatientDetails /></DashboardLayout>} />
      
      {/* --- CRITICAL ROUTE FIX --- */}
      <Route path="/doctor/add-patient" element={<DashboardLayout requiredRole="doctor"><AddPatient /></DashboardLayout>} />
      
      <Route path="/doctor/patient/:pid/treatment/new" element={<DashboardLayout requiredRole="doctor"><AddTreatment /></DashboardLayout>} />
      <Route path="/doctor/patient/:pid/vitals/new" element={<DashboardLayout requiredRole="doctor"><AddVitals /></DashboardLayout>} />
      <Route path="/doctor/patient/:pid/alert/new" element={<DashboardLayout requiredRole="doctor"><AddAlert /></DashboardLayout>} />
      <Route path="/doctor/patient/:pid/report/new" element={<DashboardLayout requiredRole="doctor"><UploadReport /></DashboardLayout>} />
      <Route path="/doctor/patient/:pid/appointment/new" element={<DashboardLayout requiredRole="doctor"><AddAppointment /></DashboardLayout>} /> 
      
      {/* PATIENT PORTAL */}
      <Route path="/patient/dashboard" element={<DashboardLayout requiredRole="patient"><PatientDashboard /></DashboardLayout>} />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;