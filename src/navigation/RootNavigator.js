import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Screens & Components
import LoginScreen from '../screens/auth/LoginScreen';
import DoctorDashboardScreen from '../screens/doctor/DoctorDashboardScreen';
import HeatmapModalScreen from '../screens/doctor/HeatmapModalScreen';
import PatientDetailScreen from '../screens/doctor/PatientDetailScreen';
import NewConsultationScreen from '../screens/doctor/NewConsultationScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import RegistrationApprovalsScreen from '../screens/admin/RegistrationApprovalsScreen';
import RootSuperadminScreen from '../screens/root/RootSuperadminScreen';
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import PatientOverviewScreen from '../screens/patient/PatientOverviewScreen';
import CalibrationScreen from '../screens/patient/CalibrationScreen';
import TherapyHistoryScreen from '../screens/patient/TherapyHistoryScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import SettingsThemeModal from '../screens/shared/SettingsThemeModal';
import LoadingScreen from '../components/LoadingScreen';
import GameWebView from '../components/GameWebView';
import BottomTabBar from '../components/BottomTabBar';
import { GAMES } from '../services/games';
import settingsHandler from '../services/settingsHandler';

export default function RootNavigator() {
  const { currentUser, loading } = useAuth();
  const { theme, useWebGames } = useTheme();

  // Navigation State
  const [currentView, setCurrentView] = useState('main'); // 'main' | 'game' | 'calibration' | 'approvals'
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'heatmap' | 'patientDetail' | 'consultation' | 'theme' | 'profile'
  const [activePatientTab, setActivePatientTab] = useState(() => settingsHandler.getActiveTab() || 'Overview');

  React.useEffect(() => {
    const unsub = settingsHandler.subscribe((allSettings, key, val) => {
      if (allSettings && allSettings.activeTab) {
        setActivePatientTab(allSettings.activeTab);
      }
    });
    return unsub;
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading LazyEye..." />;
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
      const leftCol = currentUser?.left_eye_contrast_color || '#EF4444';
      const rightCol = currentUser?.right_eye_contrast_color || '#0284C7';

      // Resolve source based on useWebGames setting
      const resolveGameSource = (game) => {
        if (useWebGames) {
          const url = game?.getUrl ? game.getUrl() : `https://lazyeye.onrender.com${game?.route || ''}`;
          return { uri: url };
        }
        return { html: game.getHtml(leftCol, rightCol) };
      };

      // Fullscreen Game Launcher for any of the 11 games (WebView maximized space)
      if (currentView === 'game' && selectedGame) {
        return (
          <GameWebView
            title={selectedGame.title}
            source={resolveGameSource(selectedGame)}
            leftColor={leftCol}
            rightColor={rightCol}
            onClose={() => {
              setSelectedGame(null);
              setCurrentView('main');
            }}
          />
        );
      }

      // Calibration screen
      if (currentView === 'calibration') {
        return <CalibrationScreen onClose={() => setCurrentView('main')} />;
      }

      // Tab Screen Content
      const renderPatientTabContent = () => {
        switch (activePatientTab) {
          case 'Games':
            return (
              <PatientHomeScreen
                onLaunchGame={(game) => {
                  setSelectedGame(game);
                  setCurrentView('game');
                }}
                onLaunchTetris={() => {
                  const g = GAMES.find((x) => x.id === 'tetris') || GAMES[0];
                  setSelectedGame(g);
                  setCurrentView('game');
                }}
                onLaunchSnake={() => {
                  const g = GAMES.find((x) => x.id === 'snake') || GAMES[0];
                  setSelectedGame(g);
                  setCurrentView('game');
                }}
                onLaunchCalibration={() => setCurrentView('calibration')}
                onOpenHistory={() => setActivePatientTab('Activity')}
                onOpenThemeModal={() => setActiveModal('theme')}
                onOpenProfile={() => setActivePatientTab('Profile')}
              />
            );
          case 'Activity':
            return (
              <TherapyHistoryScreen
                onOpenThemeModal={() => setActiveModal('theme')}
                onOpenProfile={() => setActivePatientTab('Profile')}
              />
            );
          case 'Profile':
            return (
              <ProfileScreen
                onClose={() => setActivePatientTab('Overview')}
                onOpenThemeModal={() => setActiveModal('theme')}
              />
            );
          case 'Overview':
          default:
            return (
              <PatientOverviewScreen
                onLaunchGame={(game) => {
                  setSelectedGame(game);
                  setCurrentView('game');
                }}
                onLaunchCalibration={() => setCurrentView('calibration')}
                onOpenHistory={() => setActivePatientTab('Activity')}
                onOpenThemeModal={() => setActiveModal('theme')}
                onOpenProfile={() => setActivePatientTab('Profile')}
                onNavigateToGames={() => setActivePatientTab('Games')}
              />
            );
        }
      };

      return (
        <View style={styles.tabContainer}>
          {renderPatientTabContent()}
          {/* Custom Animated Floating Bottom Tab Bar */}
          <BottomTabBar
            activeTab={activePatientTab}
            onTabPress={(tabKey) => {
              setActivePatientTab(tabKey);
              settingsHandler.setActiveTab(tabKey);
            }}
          />
        </View>
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
  tabContainer: {
    flex: 1,
    position: 'relative',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
