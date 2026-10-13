import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import HeatmapGrid from '../../components/HeatmapGrid';
import CustomIcon from '../../components/CustomIcon';

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
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.patientHeadRow}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <CustomIcon
              library="Feather"
              name="calendar"
              size={18}
              color={theme.colors.primary}
            />
          </View>
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
          style={[
            styles.closeBtn,
            {
              backgroundColor: theme.colors.iconContainerBg,
              borderColor: theme.colors.iconContainerBorder,
            },
          ]}
          accessible={true}
          accessibilityLabel="Close report"
        >
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Done</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Aggregating clinical activity metrics...
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Quick Metrics Bar */}
          <View style={styles.kpiRow}>
            <View
              style={[
                styles.kpiBox,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.cardBorder,
                },
              ]}
            >
              <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>Sessions</Text>
              <Text style={[styles.kpiValue, { color: theme.colors.text }]}>
                {activityData?.metrics?.total_sessions || 0}
              </Text>
            </View>

            <View
              style={[
                styles.kpiBox,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.cardBorder,
                },
              ]}
            >
              <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>Minutes</Text>
              <Text style={[styles.kpiValue, { color: theme.colors.primary }]}>
                {activityData?.metrics?.total_minutes || 0}m
              </Text>
            </View>

            <View
              style={[
                styles.kpiBox,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.cardBorder,
                },
              ]}
            >
              <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>Avg Score</Text>
              <Text style={[styles.kpiValue, { color: theme.colors.success }]}>
                {activityData?.metrics?.avg_score || 0}
              </Text>
            </View>

            <View
              style={[
                styles.kpiBox,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.cardBorder,
                },
              ]}
            >
              <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>Goal</Text>
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
            <View
              style={[
                styles.filterBar,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.primary,
                },
              ]}
            >
              <Text style={[styles.filterText, { color: theme.colors.primary }]}>
                Filtered: Sessions on {selectedDate} ({filteredSessions.length} played)
              </Text>
              <TouchableOpacity onPress={() => setSelectedDate(null)}>
                <Text style={[styles.clearFilterText, { color: theme.colors.text }]}>
                  Show All Days
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Therapy Sessions Log */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {selectedDate ? `Games on ${selectedDate}` : `Recent Sessions (${filteredSessions.length})`}
            </Text>
          </View>

          {filteredSessions.length === 0 ? (
            <View
              style={[
                styles.emptyDayBox,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.cardBorder,
                },
              ]}
            >
              <Text style={[styles.emptyDayText, { color: theme.colors.textMuted }]}>
                No gameplay logged on this date.
              </Text>
            </View>
          ) : (
            filteredSessions.map((s) => (
              <View
                key={s.id}
                style={[
                  styles.sessionRow,
                  {
                    backgroundColor: theme.colors.cardBg,
                    borderColor: theme.colors.cardBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.gameIconBox,
                    {
                      backgroundColor: theme.colors.iconContainerBg,
                      borderColor: theme.colors.iconContainerBorder,
                    },
                  ]}
                >
                  <CustomIcon
                    library={s.game_name?.includes('Snake') ? 'MaterialCommunityIcons' : 'Ionicons'}
                    name={s.game_name?.includes('Snake') ? 'snake' : 'grid-outline'}
                    size={16}
                    color={theme.colors.primary}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.sessionGame, { color: theme.colors.text }]}>
                    {s.game_name}
                  </Text>
                  <Text style={[styles.sessionDate, { color: theme.colors.textSecondary }]}>
                    {s.played_at}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.sessionScore, { color: theme.colors.text }]}>
                    {s.score} pts
                  </Text>
                  <Text style={[styles.sessionDur, { color: theme.colors.primary }]}>
                    {s.duration_minutes} mins
                  </Text>
                </View>
              </View>
            ))
          )}

          <View style={{ height: 28 }} />
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 14,
    paddingBottom: 12,
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
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  patientSub: {
    fontSize: 11,
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 13,
    marginTop: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  kpiBox: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 12,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  clearFilterText: {
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  emptyDayBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyDayText: {
    fontSize: 13,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  gameIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionGame: {
    fontSize: 14,
    fontWeight: '600',
  },
  sessionDate: {
    fontSize: 11,
    marginTop: 2,
  },
  sessionScore: {
    fontSize: 14,
    fontWeight: '700',
  },
  sessionDur: {
    fontSize: 11,
    marginTop: 2,
  },
});
