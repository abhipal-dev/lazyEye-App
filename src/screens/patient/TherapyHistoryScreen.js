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
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import CustomIcon from '../../components/CustomIcon';
import HeatmapGrid from '../../components/HeatmapGrid';
import HeaderBar from '../../components/HeaderBar';

export default function TherapyHistoryScreen({
  onClose,
  onOpenThemeModal,
  onOpenProfile,
}) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.fetchPatientActivity(currentUser?.id || 22);
        setData(res);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser]);

  const sessions = data?.recent_sessions || [];
  const consultations = data?.consultations || [];

  // Filter sessions if a specific date was selected on the heatmap
  const filteredSessions = selectedDate
    ? sessions.filter((s) => (s.played_at || '').startsWith(selectedDate))
    : sessions;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {onClose ? (
        <View
          style={[
            styles.topBar,
            {
              backgroundColor: theme.colors.surface,
              borderBottomColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.topBarLeft}>
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
                name="activity"
                size={18}
                color={theme.colors.text}
              />
            </View>
            <View>
              <Text style={[styles.topTitle, { color: theme.colors.text }]}>
                Therapy Records
              </Text>
              <Text style={[styles.topSub, { color: theme.colors.textSecondary }]}>
                Real Session Logs & Heatmap
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
            accessibilityLabel="Close history"
          >
            <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <HeaderBar
          title="Therapy History"
          subtitle={currentUser?.fullname?.split(' ')[0]}
          onThemePress={onOpenThemeModal}
          onProfilePress={onOpenProfile}
        />
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Summary Banner with Real Stats */}
          <View
            style={[
              styles.statsCard,
              {
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.colors.primary }]}>
                {data?.metrics?.total_sessions || 0}
              </Text>
              <Text style={[styles.statLbl, { color: theme.colors.textMuted }]}>
                SESSIONS
              </Text>
            </View>

            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.colors.success }]}>
                {data?.metrics?.total_minutes || 0}m
              </Text>
              <Text style={[styles.statLbl, { color: theme.colors.textMuted }]}>
                MINUTES
              </Text>
            </View>

            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.colors.info }]}>
                {data?.metrics?.avg_score || 0}
              </Text>
              <Text style={[styles.statLbl, { color: theme.colors.textMuted }]}>
                AVG SCORE
              </Text>
            </View>

            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.colors.warning }]}>
                {data?.metrics?.prescribed_goal || 20}m
              </Text>
              <Text style={[styles.statLbl, { color: theme.colors.textMuted }]}>
                GOAL
              </Text>
            </View>
          </View>

          {/* 84-Day Therapy Adherence Heatmap */}
          <View style={{ marginBottom: 16 }}>
            <HeatmapGrid
              heatmapData={data?.heatmap || {}}
              selectedDate={selectedDate}
              onSelectDate={(d) => setSelectedDate(selectedDate === d ? null : d)}
            />
            {selectedDate && (
              <TouchableOpacity
                onPress={() => setSelectedDate(null)}
                style={styles.clearFilterBtn}
              >
                <Text style={[styles.clearFilterText, { color: theme.colors.primary }]}>
                  Filtered to {selectedDate} • Tap to view all
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Doctor Consultations */}
          {consultations.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Optometrist Clinical Notes
              </Text>

              {consultations.map((c) => (
                <View
                  key={c.id}
                  style={[
                    styles.consultBox,
                    {
                      backgroundColor: theme.colors.cardBg,
                      borderColor: theme.colors.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.consultTop}>
                    <Text style={[styles.consultDoc, { color: theme.colors.text }]}>
                      {c.doctor_name}
                    </Text>
                    <Text style={[styles.consultRating, { color: theme.colors.success }]}>
                      {c.compliance_assessment}
                    </Text>
                  </View>
                  <Text style={[styles.consultNote, { color: theme.colors.textSecondary }]}>
                    "{c.notes}"
                  </Text>
                </View>
              ))}
            </>
          )}

          {/* Sessions List */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 12 }]}>
              {selectedDate ? `Sessions on ${selectedDate}` : `All Sessions (${sessions.length})`}
            </Text>
          </View>

          {filteredSessions.map((s) => (
            <View
              key={s.id}
              style={[
                styles.sessionCard,
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
                  name={s.game_name?.includes('Snake') ? 'snake' : 'game-controller-outline'}
                  size={18}
                  color={theme.colors.primary}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.sessionGame, { color: theme.colors.text }]}>
                  {s.game_name}
                </Text>
                <Text style={[styles.sessionDate, { color: theme.colors.textMuted }]}>
                  {s.played_at ? s.played_at.slice(0, 16) : s.created_at ? s.created_at.slice(0, 16) : 'Recorded'}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.sessionScore, { color: theme.colors.text }]}>
                  {s.score} pts
                </Text>
                <Text style={[styles.sessionDur, { color: theme.colors.primary }]}>
                  {Math.round((s.duration_seconds || 600) / 60)} mins
                </Text>
              </View>
            </View>
          ))}

          {/* Floating Bottom Tab Bar Clearance */}
          <View style={{ height: 96 }} />
        </ScrollView>
      )}
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
  topBar: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  topBarLeft: {
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
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  topSub: {
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
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLbl: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.4,
  },
  clearFilterBtn: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  clearFilterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  consultBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  consultTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  consultDoc: {
    fontSize: 14,
    fontWeight: '600',
  },
  consultRating: {
    fontSize: 12,
    fontWeight: '600',
  },
  consultNote: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  gameIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
