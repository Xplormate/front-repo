import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in via token
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.valid) {
          setCurrentUser(response.data.user);
        } else {
          // Token invalid, remove from storage
          logout();
        }
      } catch (err) {
        console.error('Token verification failed', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      const { token: newToken, user } = response.data;
      localStorage.setItem('token', newToken);
      
      setToken(newToken);
      setCurrentUser(user);
      return true;
    } catch (err) {
      console.error('Login failed', err);
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
      return false;
    }
  };

  const register = async (email, password, name) => {
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        name
      });
      
      const { token: newToken, user } = response.data;
      localStorage.setItem('token', newToken);
      
      setToken(newToken);
      setCurrentUser(user);
      return true;
    } catch (err) {
      console.error('Registration failed', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 