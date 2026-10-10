import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import HeatmapGrid from '../../components/HeatmapGrid';
import Button from '../../components/Button';

export default function HeatmapModalScreen({ patient, onClose }) {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const loadActivity = async () => {
      if (!patient?.id) return;
      try {
        const res = await api.fetchPatientActivity(patient.id);
        setActivityData(res);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    loadActivity();
  }, [patient]);

  const handleSelectDate = (dateStr, dayData) => {
    if (selectedDate === dateStr) {
      setSelectedDate(null); // Toggle off
    } else {
      setSelectedDate(dateStr);
    }
  };

  const allSessions = activityData?.recent_sessions || [];
  const filteredSessions = selectedDate
    ? allSessions.filter((s) => (s.played_at || '').startsWith(selectedDate))
    : allSessions;

  const consultations = activityData?.consultations || [];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Modal Top Nav Bar */}
      <View style={[styles.topBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.patientHeadRow}>
          <Text style={styles.patientEmoji}>🔥</Text>
          <View>
            <Text style={[styles.patientTitle, { color: theme.colors.text }]}>
              {patient?.fullname || 'Patient'}
            </Text>
            <Text style={[styles.patientSub, { color: theme.colors.textSecondary }]}>
              84-Day Therapy Intensity & Progress Report
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={[styles.closeBtn, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}
        >
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>✕ Close</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Aggregating 84-day clinical metrics...
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Quick Metrics Bar */}
          <View style={styles.kpiRow}>
            <View style={[styles.kpiBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
              <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>Total Sessions</Text>
              <Text style={[styles.kpiValue, { color: theme.colors.text }]}>
                {activityData?.metrics?.total_sessions || 0}
              </Text>
            </View>

            <View style={[styles.kpiBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
              <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>Therapy Minutes</Text>
              <Text style={[styles.kpiValue, { color: theme.colors.primary }]}>
                {activityData?.metrics?.total_minutes || 0}m
              </Text>
            </View>

            <View style={[styles.kpiBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
              <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>Average Score</Text>
              <Text style={[styles.kpiValue, { color: theme.colors.success }]}>
                {activityData?.metrics?.avg_score || 0}
              </Text>
            </View>

            <View style={[styles.kpiBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
              <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>Daily Target</Text>
              <Text style={[styles.kpiValue, { color: theme.colors.info }]}>
                {activityData?.metrics?.prescribed_goal || 20}m
              </Text>
            </View>
          </View>

          {/* Interactive Heatmap */}
          <HeatmapGrid
            heatmapData={activityData?.heatmap || {}}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />

          {/* Active Filter Banner */}
          {selectedDate && (
            <View style={[styles.filterBar, { backgroundColor: `${theme.colors.primary}18`, borderColor: theme.colors.primary }]}>
              <Text style={[styles.filterText, { color: theme.colors.primary }]}>
                Filtered: Sessions on {selectedDate} ({filteredSessions.length} played)
              </Text>
              <TouchableOpacity onPress={() => setSelectedDate(null)}>
                <Text style={[styles.clearFilterText, { color: theme.colors.text }]}>Show All Days</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Therapy Sessions Log Table */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {selectedDate ? `Games on ${selectedDate}` : `Recent Sessions Log (${filteredSessions.length})`}
            </Text>
          </View>

          {filteredSessions.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
              <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                No therapy sessions recorded on {selectedDate || 'this date'}.
              </Text>
            </View>
          ) : (
            filteredSessions.map((session, idx) => (
              <View
                key={session.id || idx}
                style={[styles.sessionRow, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
              >
                <View style={styles.sessionLeft}>
                  <Text style={styles.gameIcon}>🎮</Text>
                  <View>
                    <Text style={[styles.gameName, { color: theme.colors.text }]}>{session.game_name}</Text>
                    <Text style={[styles.gameTime, { color: theme.colors.textMuted }]}>
                      {session.played_at}
                    </Text>
                  </View>
                </View>

                <View style={styles.sessionRight}>
                  <View style={[styles.scoreBadge, { backgroundColor: `${theme.colors.primary}18` }]}>
                    <Text style={[styles.scoreText, { color: theme.colors.primary }]}>
                      {session.score} pts
                    </Text>
                  </View>
                  <Text style={[styles.durationText, { color: theme.colors.textSecondary }]}>
                    {Math.round(session.duration_seconds / 60)} mins
                  </Text>
                </View>
              </View>
            ))
          )}

          {/* Clinical Consultations History */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Doctor Consultations & Remarks ({consultations.length})
            </Text>
          </View>

          {consultations.map((c) => (
            <View
              key={c.id}
              style={[styles.consultCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
            >
              <View style={styles.consultTop}>
                <Text style={[styles.consultDoctor, { color: theme.colors.text }]}>
                  {c.doctor_name || 'Dr. Sarah Mitchell'}
                </Text>
                <View style={[styles.complianceBadge, { backgroundColor: `${theme.colors.success}18` }]}>
                  <Text style={[styles.complianceText, { color: theme.colors.success }]}>
                    {c.compliance_assessment || 'Good'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.consultNotes, { color: theme.colors.textSecondary }]}>
                "{c.notes}"
              </Text>
              <Text style={[styles.consultMeta, { color: theme.colors.textMuted }]}>
                Prescription: {c.prescribed_minutes}m/day • Status: {c.status}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  patientHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  patientEmoji: {
    fontSize: 22,
  },
  patientTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  patientSub: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  kpiBox: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 3,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  clearFilterText: {
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptyBox: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gameIcon: {
    fontSize: 20,
  },
  gameName: {
    fontSize: 13,
    fontWeight: '700',
  },
  gameTime: {
    fontSize: 10.5,
    marginTop: 2,
  },
  sessionRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
  },
  durationText: {
    fontSize: 10,
  },
  consultCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  consultTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  consultDoctor: {
    fontSize: 13,
    fontWeight: '700',
  },
  complianceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  complianceText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  consultNotes: {
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  consultMeta: {
    fontSize: 10.5,
  },
});

