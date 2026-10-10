import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import DoctorDashboardScreen from '../screens/doctor/DoctorDashboardScreen';
import HeatmapModalScreen from '../screens/doctor/HeatmapModalScreen';
import PatientDetailScreen from '../screens/doctor/PatientDetailScreen';
import NewConsultationScreen from '../screens/doctor/NewConsultationScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import RegistrationApprovalsScreen from '../screens/admin/RegistrationApprovalsScreen';
import RootSuperadminScreen from '../screens/root/RootSuperadminScreen';
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import DichopticTetrisGame from '../screens/patient/DichopticTetrisGame';
import DichopticSnakeGame from '../screens/patient/DichopticSnakeGame';
import CalibrationScreen from '../screens/patient/CalibrationScreen';
import TherapyHistoryScreen from '../screens/patient/TherapyHistoryScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import SettingsThemeModal from '../screens/shared/SettingsThemeModal';

export default function RootNavigator() {
  const { currentUser, loading } = useAuth();
  const { theme } = useTheme();

  // Navigation State
  const [currentView, setCurrentView] = useState('main'); // 'main' | 'tetris' | 'snake' | 'history' | 'calibration' | 'approvals'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'heatmap' | 'patientDetail' | 'consultation' | 'theme' | 'profile'

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // 1. Unauthenticated View
  if (!currentUser) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <LoginScreen onOpenThemeModal={() => setActiveModal('theme')} />
        <SettingsThemeModal visible={activeModal === 'theme'} onClose={() => setActiveModal(null)} />
      </View>
    );
  }

  // 2. Active Screen Renderer based on role & sub-views
  const renderRoleScreen = () => {
    const role = currentUser.accounttype;

    // A. Vision Patient Views
    if (role === 'user') {
      if (currentView === 'tetris') {
        return <DichopticTetrisGame onClose={() => setCurrentView('main')} />;
      }
      if (currentView === 'snake') {
        return <DichopticSnakeGame onClose={() => setCurrentView('main')} />;
      }
      if (currentView === 'calibration') {
        return <CalibrationScreen onClose={() => setCurrentView('main')} />;
      }
      if (currentView === 'history') {
        return <TherapyHistoryScreen onClose={() => setCurrentView('main')} />;
      }
      return (
        <PatientHomeScreen
          onLaunchTetris={() => setCurrentView('tetris')}
          onLaunchSnake={() => setCurrentView('snake')}
          onLaunchCalibration={() => setCurrentView('calibration')}
          onOpenHistory={() => setCurrentView('history')}
          onOpenThemeModal={() => setActiveModal('theme')}
          onOpenProfile={() => setActiveModal('profile')}
        />
      );
    }

    // B. Clinic Admin Views
    if (role === 'admin') {
      if (currentView === 'approvals') {
        return <RegistrationApprovalsScreen onClose={() => setCurrentView('main')} />;
      }
      return (
        <AdminDashboardScreen
          onOpenApprovals={() => setCurrentView('approvals')}
          onOpenThemeModal={() => setActiveModal('theme')}
          onOpenProfile={() => setActiveModal('profile')}
        />
      );
    }

    // C. Root Superadmin Views
    if (role === 'root') {
      return (
        <RootSuperadminScreen
          onOpenThemeModal={() => setActiveModal('theme')}
          onOpenProfile={() => setActiveModal('profile')}
        />
      );
    }

    // D. Doctor / Optometrist Views (Default)
    return (
      <DoctorDashboardScreen
        onOpenPatientHeatmap={(patient) => {
          setSelectedPatient(patient);
          setActiveModal('heatmap');
        }}
        onOpenPatientDetail={(patient) => {
          setSelectedPatient(patient);
          setActiveModal('patientDetail');
        }}
        onOpenNewConsultation={(patient) => {
          setSelectedPatient(patient);
          setActiveModal('consultation');
        }}
        onOpenThemeModal={() => setActiveModal('theme')}
        onOpenProfile={() => setActiveModal('profile')}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderRoleScreen()}

      {/* Global Modals */}
      {activeModal === 'heatmap' && (
        <View style={StyleSheet.absoluteFill}>
          <HeatmapModalScreen patient={selectedPatient} onClose={() => setActiveModal(null)} />
        </View>
      )}

      {activeModal === 'patientDetail' && (
        <View style={StyleSheet.absoluteFill}>
          <PatientDetailScreen patient={selectedPatient} onClose={() => setActiveModal(null)} />
        </View>
      )}

      {activeModal === 'consultation' && (
        <View style={StyleSheet.absoluteFill}>
          <NewConsultationScreen patient={selectedPatient} onClose={() => setActiveModal(null)} />
        </View>
      )}

      {activeModal === 'profile' && (
        <View style={StyleSheet.absoluteFill}>
          <ProfileScreen
            onClose={() => setActiveModal(null)}
            onOpenThemeModal={() => setActiveModal('theme')}
          />
        </View>
      )}

      <SettingsThemeModal visible={activeModal === 'theme'} onClose={() => setActiveModal(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
