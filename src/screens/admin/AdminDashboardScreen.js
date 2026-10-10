import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import HeaderBar from '../../components/HeaderBar';
import MetricCard from '../../components/MetricCard';

export default function AdminDashboardScreen({
  onOpenApprovals,
  onOpenThemeModal,
  onOpenProfile,
}) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('patients'); // 'patients' | 'doctors'
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [u, d, r] = await Promise.all([
        api.fetchUsers(currentUser),
        api.fetchDoctors(currentUser),
        api.fetchRegisters(currentUser),
      ]);
      setPatients(u || []);
      setDoctors(d || []);
      setRegisters(r || []);
    } catch (e) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HeaderBar
        title="Clinic Administration"
        subtitle="Healthcare Hub"
        onThemePress={onOpenThemeModal}
        onProfilePress={onOpenProfile}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {/* Pending Registrations Alert Card */}
        {registers.length > 0 && (
          <TouchableOpacity
            onPress={onOpenApprovals}
            activeOpacity={0.8}
            style={[styles.alertBanner, { backgroundColor: `${theme.colors.warning}18`, borderColor: theme.colors.warning }]}
          >
            <View style={styles.alertLeft}>
              <Text style={styles.alertIcon}>⏳</Text>
              <View>
                <Text style={[styles.alertTitle, { color: theme.colors.warning }]}>
                  {registers.length} Registration Applicants Pending
                </Text>
                <Text style={[styles.alertSub, { color: theme.colors.textSecondary }]}>
                  Tap here to review and enroll patient applications
                </Text>
              </View>
            </View>
            <Text style={[styles.alertArrow, { color: theme.colors.warning }]}>Review ➔</Text>
          </TouchableOpacity>
        )}

        {/* 4 Clinic KPI Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Clinic Patients"
            value={patients.length.toString()}
            subtitle="Enrolled under therapy"
            icon="👥"
            accentColor={theme.colors.primary}
            style={styles.metricItem}
          />
          <MetricCard
            title="Optometrists"
            value={doctors.length.toString()}
            subtitle="Supervising doctors"
            icon="🩺"
            accentColor={theme.colors.info}
            style={styles.metricItem}
          />
          <MetricCard
            title="Applicants Queue"
            value={registers.length.toString()}
            subtitle="Pending review"
            icon="⏳"
            accentColor={theme.colors.warning}
            style={styles.metricItem}
          />
          <MetricCard
            title="Clinic Adherence"
            value="89%"
            subtitle="Avg cohort compliance"
            icon="📊"
            accentColor={theme.colors.success}
            style={styles.metricItem}
          />
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <TouchableOpacity
            onPress={() => setActiveTab('patients')}
            style={[
              styles.tabBtn,
              activeTab === 'patients' && { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'patients' ? theme.colors.textInverted : theme.colors.textSecondary },
              ]}
            >
              Patients ({patients.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('doctors')}
            style={[
              styles.tabBtn,
              activeTab === 'doctors' && { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'doctors' ? theme.colors.textInverted : theme.colors.textSecondary },
              ]}
            >
              Optometrists ({doctors.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Patients Tab Content */}
        {activeTab === 'patients' && (
          <View style={styles.listSection}>
            {patients.map((p) => (
              <View
                key={p.id}
                style={[styles.itemCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
              >
                <View style={styles.itemHeader}>
                  <Text style={styles.userEmoji}>🧒</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: theme.colors.text }]}>{p.fullname}</Text>
                    <Text style={[styles.itemSub, { color: theme.colors.textSecondary }]}>
                      @{p.username} • {p.email}
                    </Text>
                  </View>
                  <View style={[styles.badgePill, { backgroundColor: `${theme.colors.info}18` }]}>
                    <Text style={[styles.badgeText, { color: theme.colors.info }]}>
                      {p.doctor_name || 'Dr. Sarah Mitchell'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.paramRow, { borderTopColor: theme.colors.borderLight }]}>
                  <Text style={[styles.paramText, { color: theme.colors.textMuted }]}>
                    Goal: <Text style={{ color: theme.colors.text }}>{p.user_playing_time || 20}m/day</Text>
                  </Text>
                  <Text style={[styles.paramText, { color: theme.colors.textMuted }]}>
                    Lenses: <Text style={{ color: theme.colors.text }}>{p.left_eye_color || 'Red'} / {p.right_eye_color || 'Blue'}</Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Doctors Tab Content */}
        {activeTab === 'doctors' && (
          <View style={styles.listSection}>
            {doctors.map((d) => (
              <View
                key={d.id}
                style={[styles.itemCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
              >
                <View style={styles.itemHeader}>
                  <Text style={styles.userEmoji}>🩺</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: theme.colors.text }]}>{d.fullname}</Text>
                    <Text style={[styles.itemSub, { color: theme.colors.textSecondary }]}>
                      @{d.username} • {d.email}
                    </Text>
                  </View>
                  <View style={[styles.badgePill, { backgroundColor: `${theme.colors.success}18` }]}>
                    <Text style={[styles.badgeText, { color: theme.colors.success }]}>
                      Active Practitioner
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  alertIcon: {
    fontSize: 22,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  alertSub: {
    fontSize: 11,
    marginTop: 2,
  },
  alertArrow: {
    fontSize: 12,
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  metricItem: {
    width: '48%',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listSection: {
    gap: 10,
  },
  itemCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  userEmoji: {
    fontSize: 22,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemSub: {
    fontSize: 11.5,
    marginTop: 1,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  paramText: {
    fontSize: 11,
  },
});
