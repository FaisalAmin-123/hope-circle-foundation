import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  // State to store user info and token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Base API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Function: Register new user
  const register = async (userData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        userData
      );

      if (response.data.success) {
        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        
        // Update state
        setToken(response.data.token);
        setUser(response.data.user);

        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

// Function: Login user
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });

    if (response.data.success) {
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); 
      
      // Update state
      setToken(response.data.token);
      setUser(response.data.user);

      return { 
        success: true, 
        message: response.data.message,
        user: response.data.user 
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
    };
  }
};

  // Function: Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Function: Load user data on app start
  // useCallback prevents function from being recreated on every render
  const loadUser = useCallback(async () => {
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [token, API_URL]); // Dependencies: only recreate if token or API_URL changes

  // Load user when component mounts or token changes
  useEffect(() => {
    loadUser();
  }, [loadUser]); // Now loadUser is in the dependency array

  // Value to provide to all components
  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;