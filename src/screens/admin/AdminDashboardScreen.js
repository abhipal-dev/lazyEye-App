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
import CustomIcon from '../../components/CustomIcon';

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
        subtitle="Operations Hub"
        onThemePress={onOpenThemeModal}
        onProfilePress={onOpenProfile}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Pending Registrations Alert Banner */}
        {registers.length > 0 && (
          <TouchableOpacity
            onPress={onOpenApprovals}
            activeOpacity={0.8}
            style={[
              styles.alertBanner,
              {
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.warning,
              },
            ]}
          >
            <View
              style={[
                styles.alertIconWrap,
                {
                  backgroundColor: `${theme.colors.warning}18`,
                  borderColor: theme.colors.warning,
                },
              ]}
            >
              <CustomIcon
                library="Feather"
                name="clock"
                size={18}
                color={theme.colors.warning}
              />
            </View>
            <View style={styles.alertTextCol}>
              <Text style={[styles.alertTitle, { color: theme.colors.text }]}>
                {registers.length} Registration Applicants Pending
              </Text>
              <Text style={[styles.alertSub, { color: theme.colors.textSecondary }]}>
                Tap to review patient onboarding requests
              </Text>
            </View>
            <CustomIcon
              library="Feather"
              name="chevron-right"
              size={18}
              color={theme.colors.warning}
            />
          </TouchableOpacity>
        )}

        {/* 2 Key Clinic Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Clinic Patients"
            value={patients.length.toString()}
            subtitle="Enrolled under therapy"
            iconName="users"
            iconLibrary="Feather"
            accentColor={theme.colors.primary}
            style={styles.metricItem}
          />
          <MetricCard
            title="Optometrists"
            value={doctors.length.toString()}
            subtitle="Clinical supervisors"
            iconName="activity"
            iconLibrary="Feather"
            accentColor={theme.colors.info}
            style={styles.metricItem}
          />
        </View>

        {/* Tab Selector */}
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('patients')}
            style={[
              styles.tabBtn,
              activeTab === 'patients' && {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.buttonBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'patients'
                      ? theme.colors.textInverted
                      : theme.colors.textSecondary,
                },
              ]}
            >
              Patients ({patients.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('doctors')}
            style={[
              styles.tabBtn,
              activeTab === 'doctors' && {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.buttonBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'doctors'
                      ? theme.colors.textInverted
                      : theme.colors.textSecondary,
                },
              ]}
            >
              Optometrists ({doctors.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Patients Tab List */}
        {activeTab === 'patients' && (
          <View style={styles.listSection}>
            {patients.map((p) => (
              <View
                key={p.id}
                style={[
                  styles.itemCard,
                  {
                    backgroundColor: theme.colors.cardBg,
                    borderColor: theme.colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.itemHeader}>
                  <View
                    style={[
                      styles.avatarBox,
                      {
                        backgroundColor: theme.colors.iconContainerBg,
                        borderColor: theme.colors.iconContainerBorder,
                      },
                    ]}
                  >
                    <CustomIcon
                      library="Feather"
                      name="user"
                      size={18}
                      color={theme.colors.text}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: theme.colors.text }]}>
                      {p.fullname}
                    </Text>
                    <Text style={[styles.itemSub, { color: theme.colors.textSecondary }]}>
                      @{p.username} • {p.email}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badgePill,
                      {
                        backgroundColor: theme.colors.iconContainerBg,
                        borderColor: theme.colors.iconContainerBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: theme.colors.info }]}>
                      {p.doctor_name || 'Dr. Mitchell'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.paramRow, { borderTopColor: theme.colors.borderLight }]}>
                  <Text style={[styles.paramText, { color: theme.colors.textMuted }]}>
                    Daily Regimen:{' '}
                    <Text style={{ color: theme.colors.text, fontWeight: '600' }}>
                      {p.user_playing_time || 20}m/day
                    </Text>
                  </Text>
                  <Text style={[styles.paramText, { color: theme.colors.textMuted }]}>
                    Lenses:{' '}
                    <Text style={{ color: theme.colors.text, fontWeight: '600' }}>
                      {p.left_eye_color || 'Red'} / {p.right_eye_color || 'Blue'}
                    </Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Doctors Tab List */}
        {activeTab === 'doctors' && (
          <View style={styles.listSection}>
            {doctors.map((d) => (
              <View
                key={d.id}
                style={[
                  styles.itemCard,
                  {
                    backgroundColor: theme.colors.cardBg,
                    borderColor: theme.colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.itemHeader}>
                  <View
                    style={[
                      styles.avatarBox,
                      {
                        backgroundColor: theme.colors.iconContainerBg,
                        borderColor: theme.colors.iconContainerBorder,
                      },
                    ]}
                  >
                    <CustomIcon
                      library="MaterialCommunityIcons"
                      name="doctor"
                      size={20}
                      color={theme.colors.info}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: theme.colors.text }]}>
                      {d.fullname}
                    </Text>
                    <Text style={[styles.itemSub, { color: theme.colors.textSecondary }]}>
                      @{d.username} • {d.email}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badgePill,
                      {
                        backgroundColor: theme.colors.iconContainerBg,
                        borderColor: theme.colors.iconContainerBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: theme.colors.success }]}>
                      Practitioner
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
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
    paddingBottom: 36,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  alertIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTextCol: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  alertSub: {
    fontSize: 12,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listSection: {
    gap: 12,
  },
  itemCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemSub: {
    fontSize: 12,
    marginTop: 2,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  paramText: {
    fontSize: 12,
  },
});
