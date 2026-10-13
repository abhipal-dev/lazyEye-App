import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, MOCK_USERS } from '../services/api';
import { getStoredUserSession, storeUserSession, removeUserSession } from '../services/storage';

const AuthContext = createContext();

export const QUICK_ROLES = [
  {
    role: 'patient',
    title: 'Abhishek Pal (Patient)',
    subtitle: 'Vision Therapy Patient',
    username: 'abhicoder',
    password: '4567',
    iconLibrary: 'Ionicons',
    iconName: 'eye-outline',
    badge: 'Patient Portal',
    scopeDescription: 'Plays dichoptic anaglyph games (Tetris, Snake), adjusts red-cyan calibration',
  },
  {
    role: 'doctor',
    title: 'Dr. Sameer Arora',
    subtitle: 'Clinical Optometrist',
    username: 'dr_arora',
    password: 'doctor123',
    iconLibrary: 'MaterialCommunityIcons',
    iconName: 'doctor',
    badge: 'Doctor Portal',
    scopeDescription: 'Sees assigned cohort, reviews therapy heatmap, logs consultations',
  },
  {
    role: 'admin',
    title: 'Pranjal Agarwal (Admin)',
    subtitle: 'Healthcare Admin',
    username: 'pranjal',
    password: '4567',
    iconLibrary: 'MaterialCommunityIcons',
    iconName: 'shield-account-outline',
    badge: 'Clinic Admin',
    scopeDescription: 'Manages clinic patients & doctors, approves pending applicant registrations',
  },
  {
    role: 'root',
    title: 'Root Administrator',
    subtitle: 'System Superadmin',
    username: 'root',
    password: 'root123',
    iconLibrary: 'Ionicons',
    iconName: 'shield-checkmark-outline',
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
          // Default to patient portal for therapy preview if not logged in
          const defaultUser = MOCK_USERS.find((u) => u.username === 'abhicoder') || MOCK_USERS[0];
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

