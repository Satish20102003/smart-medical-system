import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Activity } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Renamed to handleLogin (Triggered by button click directly)
  const handleLogin = async () => {
    console.log("Sign In Clicked via Button");

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    setIsLoading(true);
    try {
      console.log("Calling Login API...");
      const userData = await login(email, password);
      console.log("Login API Success:", userData);
      
      if (userData.role === 'doctor') {
          console.log("Navigating to Doctor Dashboard...");
          navigate('/doctor/dashboard');
      } else {
          console.log("Navigating to Patient Dashboard...");
          navigate('/patient/dashboard');
      }
      
    } catch (err) {
      console.error("Login Error Details:", err);
      alert("Login Failed: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-soft overflow-hidden flex min-h-[600px]">
        
        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-secondary p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <Activity size={400} className="absolute -right-20 -bottom-20 transform rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Stethoscope size={28} /></div>
              <span className="text-2xl font-bold tracking-tight">MediCare AI</span>
            </div>
            <p className="text-blue-100">The Future of Clinic Management</p>
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold leading-tight mb-4">Intelligence meets <br/> Compassion.</h1>
          </div>
          <div className="relative z-10 text-sm text-blue-200">© 2025 Smart Medical System</div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-dark mb-2">Welcome Back</h2>
              <p className="text-gray-500">Please enter your details to sign in.</p>
            </div>

            {/* NOTE: We removed the <form> tag to prevent any accidental submits */}
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@gmail.com"
                  className="input-field pl-4"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-4"
                />
              </div>

              {/* TYPE IS NOW 'BUTTON'. It CANNOT refresh the page. */}
              <button
                type="button" 
                onClick={handleLogin}
                disabled={isLoading}
                className="btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <button type="button" onClick={() => navigate('/register')} className="text-primary font-semibold hover:underline">Create Account</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;