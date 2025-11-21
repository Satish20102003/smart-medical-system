import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ChevronRight } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor',
    specialization: '',
    accessCode: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // STOP PAGE RELOAD
    console.log("Registering...", formData);

    setIsLoading(true);
    try {
      await register(formData);
      console.log("Register Success");
      navigate('/doctor/dashboard');
    } catch (err) {
      console.error("Register Error", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-soft overflow-hidden flex min-h-[600px]">
        
        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-secondary to-primary p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <div className="absolute right-0 top-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-20"></div>
             <div className="absolute left-0 bottom-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-20"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Stethoscope size={28} />
              </div>
              <span className="text-2xl font-bold tracking-tight">MediCare AI</span>
            </div>
            <p className="text-blue-100">The Future of Clinic Management</p>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Empowering <br/> Doctors.
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed opacity-90">
              Create an account to manage your clinic efficiently with AI-driven insights.
            </p>
          </div>
          <div className="relative z-10 text-sm text-blue-200">© 2025 Smart Medical System</div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-dark mb-2">Doctor Registration</h2>
              <p className="text-gray-500">Create your secure medical practice account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Dr. Stephen Strange"
                  className="input-field pl-4"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="doctor@gmail.com"
                  className="input-field pl-4"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Strong Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="8+ chars with number"
                  className="input-field pl-4"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Specialization</label>
                <input
                  name="specialization"
                  type="text"
                  required
                  placeholder="e.g. Cardiology"
                  className="input-field pl-4"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-danger">Hospital Access Code</label>
                <input
                  name="accessCode"
                  type="password"
                  required
                  placeholder="Required for Doctors"
                  className="input-field pl-4 border-red-100 focus:border-red-400"
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
              >
                {isLoading ? <span>Verifying...</span> : <><span>Register Now</span><ChevronRight size={18} /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/login')} className="text-primary font-semibold hover:underline">Sign In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;