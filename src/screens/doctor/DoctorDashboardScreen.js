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

export default function DoctorDashboardScreen({
  navigation,
  onOpenPatientHeatmap,
  onOpenPatientDetail,
  onOpenNewConsultation,
  onOpenThemeModal,
  onOpenProfile,
}) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.fetchUsers(currentUser);
      setPatients(data);
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
        title="Optometry Portal"
        subtitle={currentUser?.fullname || 'Dr. Sarah Mitchell'}
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
        {/* Scope Notice Banner */}
        <View
          style={[
            styles.scopeBanner,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View
            style={[
              styles.scopeIconWrap,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <CustomIcon
              library="Feather"
              name="shield"
              size={18}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.scopeTextCol}>
            <Text style={[styles.scopeTitle, { color: theme.colors.text }]}>
              Clinical Privacy Scope
            </Text>
            <Text style={[styles.scopeSub, { color: theme.colors.textSecondary }]}>
              Access is strictly restricted to your assigned cohort and direct evaluations.
            </Text>
          </View>
        </View>

        {/* 2x2 Metric KPI Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Cohort Patients"
            value={patients.length.toString()}
            subtitle="Active amblyopia therapy"
            iconName="users"
            iconLibrary="Feather"
            accentColor={theme.colors.primary}
            style={styles.metricItem}
          />
          <MetricCard
            title="Prescribed Target"
            value="20 min"
            subtitle="Daily regimen average"
            iconName="clock"
            iconLibrary="Feather"
            accentColor={theme.colors.info}
            style={styles.metricItem}
          />
        </View>

        {/* Section Heading */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Assigned Patients ({patients.length})
          </Text>
          <TouchableOpacity onPress={loadData} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.reloadText, { color: theme.colors.primary }]}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>

        {patients.map((patient) => (
          <View
            key={patient.id}
            style={[
              styles.patientCard,
              {
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            <View style={styles.cardTopRow}>
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
                  size={20}
                  color={theme.colors.text}
                />
              </View>

              <View style={styles.patientInfoCol}>
                <Text style={[styles.patientName, { color: theme.colors.text }]}>
                  {patient.fullname}
                </Text>
                <Text style={[styles.patientUser, { color: theme.colors.textSecondary }]}>
                  @{patient.username} • {patient.user_playing_time || 20}m/day
                </Text>
              </View>

              <View
                style={[
                  styles.activeStatusPill,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <View style={[styles.greenDot, { backgroundColor: theme.colors.success }]} />
                <Text style={[styles.statusText, { color: theme.colors.success }]}>
                  Active
                </Text>
              </View>
            </View>

            {/* Lens Calibration Preview */}
            <View style={styles.lensChipsRow}>
              <View
                style={[
                  styles.lensChip,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: patient.left_eye_contrast_color || '#EF4444' },
                  ]}
                />
                <Text style={[styles.lensChipText, { color: theme.colors.textSecondary }]}>
                  L: {patient.left_eye_color || 'Red'}
                </Text>
              </View>

              <View
                style={[
                  styles.lensChip,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: patient.right_eye_contrast_color || '#0284C7' },
                  ]}
                />
                <Text style={[styles.lensChipText, { color: theme.colors.textSecondary }]}>
                  R: {patient.right_eye_color || 'Blue'}
                </Text>
              </View>
            </View>

            {/* Clear Separated Action Buttons */}
            <View style={[styles.actionRow, { borderTopColor: theme.colors.borderLight }]}>
              <TouchableOpacity
                onPress={() => onOpenPatientHeatmap && onOpenPatientHeatmap(patient)}
                activeOpacity={0.8}
                style={[
                  styles.btnAction,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <CustomIcon
                  library="Feather"
                  name="calendar"
                  size={15}
                  color={theme.colors.primary}
                />
                <Text style={[styles.btnActionText, { color: theme.colors.primary }]}>
                  Heatmap
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onOpenPatientDetail && onOpenPatientDetail(patient)}
                activeOpacity={0.8}
                style={[
                  styles.btnAction,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <CustomIcon
                  library="Feather"
                  name="sliders"
                  size={15}
                  color={theme.colors.text}
                />
                <Text style={[styles.btnActionText, { color: theme.colors.text }]}>
                  Calibrate
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onOpenNewConsultation && onOpenNewConsultation(patient)}
                activeOpacity={0.8}
                style={[
                  styles.btnAction,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <CustomIcon
                  library="Feather"
                  name="file-text"
                  size={15}
                  color={theme.colors.accentRed}
                />
                <Text style={[styles.btnActionText, { color: theme.colors.accentRed }]}>
                  Consult
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

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
  scopeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  scopeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scopeTextCol: {
    flex: 1,
  },
  scopeTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  scopeSub: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricItem: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  reloadText: {
    fontSize: 13,
    fontWeight: '600',
  },
  patientCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientInfoCol: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '600',
  },
  patientUser: {
    fontSize: 12,
    marginTop: 2,
  },
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  lensChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  lensChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lensChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  btnAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  btnActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
