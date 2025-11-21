import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

// 1. Create Context
const AuthContext = createContext();

// 2. Provider Component
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth Check Error:", error);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // --- Login Function ---
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ 
        id: data._id, 
        name: data.name, 
        role: data.role 
      }));

      setUser({ id: data._id, name: data.name, role: data.role });
      toast.success(`Welcome back, ${data.name}!`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      throw error;
    }
  };

  // --- Register Function (THIS WAS MISSING!) ---
  const register = async (formData) => {
    try {
        // 1. Register the user
        await api.post('/auth/register', formData);
        
        // 2. Automatically Log them in
        await login(formData.email, formData.password);
        
        toast.success(`Registration complete!`);
    } catch (error) {
        const message = error.response?.data?.message || 'Registration failed.';
        toast.error(message);
        throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  // Expose all functions to the app
  const value = {
    user,
    login,
    logout,
    register, // <--- Now it is included!
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Export Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);