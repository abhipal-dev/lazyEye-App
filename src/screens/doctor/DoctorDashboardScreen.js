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
        title="Optometry Practice"
        subtitle={currentUser?.fullname || 'Dr. Sarah Mitchell'}
        onThemePress={onOpenThemeModal}
        onProfilePress={onOpenProfile}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {/* Scope Notice Banner */}
        <View style={[styles.scopeBanner, { backgroundColor: theme.colors.badgeBg, borderColor: theme.colors.border }]}>
          <Text style={styles.scopeIcon}>🔒</Text>
          <View style={styles.scopeTextCol}>
            <Text style={[styles.scopeTitle, { color: theme.colors.text }]}>
              Clinical Data Scope: Strictly Assigned Cohort
            </Text>
            <Text style={[styles.scopeSub, { color: theme.colors.textSecondary }]}>
              You only have access to your assigned pediatric patients and your own evaluations.
            </Text>
          </View>
        </View>

        {/* 4 Clinical KPI Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Assigned Patients"
            value={patients.length.toString()}
            subtitle="Active amblyopia therapy"
            icon="👥"
            accentColor={theme.colors.primary}
            style={styles.metricItem}
          />
          <MetricCard
            title="Prescribed Regimen"
            value="22 min"
            subtitle="Daily target avg"
            icon="⏱️"
            accentColor={theme.colors.info}
            style={styles.metricItem}
          />
          <MetricCard
            title="Therapy Adherence"
            value="92%"
            subtitle="Weekly compliance"
            icon="📈"
            accentColor={theme.colors.success}
            style={styles.metricItem}
          />
          <MetricCard
            title="Suppression Reduction"
            value="35%"
            subtitle="Binocular fusion gain"
            icon="👁️"
            accentColor={theme.colors.accentRed}
            style={styles.metricItem}
          />
        </View>

        {/* Patients Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            My Assigned Patient Cohort ({patients.length})
          </Text>
          <TouchableOpacity onPress={loadData}>
            <Text style={[styles.reloadText, { color: theme.colors.primary }]}>↻ Refresh</Text>
          </TouchableOpacity>
        </View>

        {patients.map((patient) => (
          <View
            key={patient.id}
            style={[styles.patientCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.avatarBox, { backgroundColor: theme.colors.surfaceHighlight }]}>
                <Text style={styles.avatarEmoji}>🧒</Text>
              </View>

              <View style={styles.patientInfoCol}>
                <Text style={[styles.patientName, { color: theme.colors.text }]}>{patient.fullname}</Text>
                <Text style={[styles.patientUser, { color: theme.colors.textSecondary }]}>
                  @{patient.username} • Goal: {patient.user_playing_time || 20}m/day
                </Text>
              </View>

              <View style={[styles.activeStatusPill, { backgroundColor: `${theme.colors.success}18` }]}>
                <View style={[styles.greenDot, { backgroundColor: theme.colors.success }]} />
                <Text style={[styles.statusText, { color: theme.colors.success }]}>Enrolled</Text>
              </View>
            </View>

            {/* Lens Calibration Preview Chips */}
            <View style={styles.lensChipsRow}>
              <View style={[styles.lensChip, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}>
                <Text style={[styles.lensLabel, { color: theme.colors.textMuted }]}>Left Lens: </Text>
                <View style={[styles.colorSquare, { backgroundColor: patient.left_eye_contrast_color || '#ff0000' }]} />
                <Text style={[styles.lensValue, { color: theme.colors.text }]}>
                  {patient.left_eye_color || 'red'} ({patient.left_eye_contrastvalue || 255})
                </Text>
              </View>

              <View style={[styles.lensChip, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}>
                <Text style={[styles.lensLabel, { color: theme.colors.textMuted }]}>Right Lens: </Text>
                <View style={[styles.colorSquare, { backgroundColor: patient.right_eye_contrast_color || '#0000ff' }]} />
                <Text style={[styles.lensValue, { color: theme.colors.text }]}>
                  {patient.right_eye_color || 'blue'} ({patient.right_eye_contrastvalue || 255})
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={[styles.actionRow, { borderTopColor: theme.colors.borderLight }]}>
              <TouchableOpacity
                onPress={() => onOpenPatientHeatmap && onOpenPatientHeatmap(patient)}
                activeOpacity={0.8}
                style={[styles.btnAction, { backgroundColor: `${theme.colors.primary}18`, borderColor: theme.colors.primary }]}
              >
                <Text style={[styles.btnActionText, { color: theme.colors.primary }]}>
                  🔥 Activity Heatmap
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onOpenPatientDetail && onOpenPatientDetail(patient)}
                activeOpacity={0.8}
                style={[styles.btnAction, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.btnActionText, { color: theme.colors.text }]}>
                  ⚙️ Calibrate
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onOpenNewConsultation && onOpenNewConsultation(patient)}
                activeOpacity={0.8}
                style={[styles.btnAction, { backgroundColor: `${theme.colors.accentRed}18`, borderColor: theme.colors.accentRed }]}
              >
                <Text style={[styles.btnActionText, { color: theme.colors.accentRed }]}>
                  📝 Evaluate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  scopeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    gap: 10,
  },
  scopeIcon: {
    fontSize: 20,
  },
  scopeTextCol: {
    flex: 1,
  },
  scopeTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  scopeSub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  metricItem: {
    width: '48%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  reloadText: {
    fontSize: 12,
    fontWeight: '700',
  },
  patientCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  patientInfoCol: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
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
    gap: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  lensChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  lensChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  colorSquare: {
    width: 10,
    height: 10,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  lensLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  lensValue: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 8,
  },
  btnAction: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

