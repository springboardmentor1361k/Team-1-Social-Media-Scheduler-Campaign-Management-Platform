import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

export const AuthContext = createContext();

const mapUserData = (apiUser) => {
  if (!apiUser) return null;
  return {
    id: apiUser.id,
    name: apiUser.username || apiUser.name || "",
    email: apiUser.email,
    phone: apiUser.phone || "",
    companyName: apiUser.company_name || apiUser.companyName || "",
    avatar: apiUser.avatar || ""
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Fetch user profile to verify token validity
          const userData = await userService.getProfile();
          setUser(mapUserData(userData));
        } catch (error) {
          console.error("Token verification failed, logging out:", error);
          handleLogout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      console.log("LOGIN RESPONSE =", response);
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(mapUserData(response.user));
      console.log("USER SAVED =", {
        id: response.user.id,
        name: response.user.username,
        email: response.user.email
      });

      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handleRegister = async (name, email, password, phone, companyName) => {
    setLoading(true);
    try {
      const response = await authService.register({
        username: name,
        email,
        password,
        phone,
        companyName
      });
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(mapUserData(response.user));
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('socialpilot_campaigns');
    localStorage.removeItem('socialpilot_posts');
    localStorage.removeItem('socialpilot_notifications');
    setToken(null);
    setUser(null);
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      const apiData = {
        id: user?.id,
        username: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        company_name: profileData.companyName,
        avatar: profileData.avatar
      };
      const updatedUser = await userService.updateProfile(apiData);
      const mappedUser = mapUserData(updatedUser);
      setUser(mappedUser);
      return mappedUser;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateProfile: handleUpdateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
