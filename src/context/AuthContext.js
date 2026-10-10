import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, MOCK_USERS } from '../services/api';
import { getStoredUserSession, storeUserSession, removeUserSession } from '../services/storage';

const AuthContext = createContext();

export const QUICK_ROLES = [
  {
    role: 'doctor',
    title: 'Dr. Sarah Mitchell',
    subtitle: 'Clinical Optometrist',
    username: 'dr_sarah',
    password: 'doctor123',
    icon: '🩺',
    badge: 'Doctor Portal',
    scopeDescription: 'Sees assigned patients (Abhishek & Riya), reviews therapy heatmap, logs consultations',
  },
  {
    role: 'admin',
    title: 'Clinic Administrator',
    subtitle: 'Healthcare Admin',
    username: 'admin',
    password: 'admin123',
    icon: '🏥',
    badge: 'Clinic Admin',
    scopeDescription: 'Manages clinic patients & doctors, approves pending applicant registrations',
  },
  {
    role: 'patient',
    title: 'Abhishek Pal (Patient)',
    subtitle: 'Pediatric Vision Therapy',
    username: 'abhi8535',
    password: '9870',
    icon: '🎮',
    badge: 'Patient Portal',
    scopeDescription: 'Plays dichoptic anaglyph games (Tetris, Snake), adjusts red-cyan calibration',
  },
  {
    role: 'root',
    title: 'Master Root Control',
    subtitle: 'System Superadmin',
    username: 'root',
    password: 'root123',
    icon: '👑',
    badge: 'Superadmin',
    scopeDescription: 'Platform master oversight, provisions new administrators, view full roster',
  },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check saved session on app launch
    const checkSession = async () => {
      try {
        const saved = await getStoredUserSession();
        if (saved) {
          setCurrentUser(saved);
        } else {
          // Default to Doctor portal for demo preview if not logged in
          const defaultUser = MOCK_USERS.find((u) => u.username === 'dr_sarah');
          setCurrentUser(defaultUser);
        }
      } catch (e) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.login(username, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        await storeUserSession(res.user);
        return { success: true, user: res.user };
      } else {
        setAuthError(res.error || 'Authentication failed');
        return { success: false, error: res.error };
      }
    } catch (err) {
      setAuthError(err.message || 'Server connection error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (roleName) => {
    const roleItem = QUICK_ROLES.find((r) => r.role === roleName);
    if (roleItem) {
      return await login(roleItem.username, roleItem.password);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    await removeUserSession();
  };

  const updateUserProfile = async (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    await storeUserSession(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        authError,
        login,
        quickLogin,
        logout,
        updateUserProfile,
        quickRoles: QUICK_ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

