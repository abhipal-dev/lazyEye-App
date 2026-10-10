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

export default function TherapyHistoryScreen({ onClose }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.fetchPatientActivity(currentUser?.id || 1);
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topIcon}>📜</Text>
          <View>
            <Text style={[styles.topTitle, { color: theme.colors.text }]}>My Therapy History</Text>
            <Text style={[styles.topSub, { color: theme.colors.textSecondary }]}>Scores, play logs & doctor remarks</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Close</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Summary Banner */}
          <View style={[styles.statsCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.colors.primary }]}>
                {data?.metrics?.total_sessions || 0}
              </Text>
              <Text style={[styles.statLbl, { color: theme.colors.textMuted }]}>GAMES PLAYED</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.colors.success }]}>
                {data?.metrics?.total_minutes || 0}m
              </Text>
              <Text style={[styles.statLbl, { color: theme.colors.textMuted }]}>MINUTES LOGGED</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.colors.info }]}>
                {data?.metrics?.avg_score || 0}
              </Text>
              <Text style={[styles.statLbl, { color: theme.colors.textMuted }]}>AVERAGE SCORE</Text>
            </View>
          </View>

          {/* Doctor Consultations */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Doctor Prescriptions & Notes
          </Text>

          {consultations.map((c) => (
            <View key={c.id} style={[styles.consultBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
              <View style={styles.consultTop}>
                <Text style={[styles.consultDoc, { color: theme.colors.text }]}>{c.doctor_name}</Text>
                <Text style={[styles.consultRating, { color: theme.colors.success }]}>{c.compliance_assessment}</Text>
              </View>
              <Text style={[styles.consultNote, { color: theme.colors.textSecondary }]}>"{c.notes}"</Text>
            </View>
          ))}

          {/* Sessions List */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 18 }]}>
            Completed Game Sessions ({sessions.length})
          </Text>

          {sessions.map((s, idx) => (
            <View key={s.id || idx} style={[styles.sessionRow, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
              <View style={styles.sessionLeft}>
                <Text style={styles.gameEmoji}>🎮</Text>
                <View>
                  <Text style={[styles.gameTitle, { color: theme.colors.text }]}>{s.game_name}</Text>
                  <Text style={[styles.gameTime, { color: theme.colors.textMuted }]}>{s.played_at}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.scoreVal, { color: theme.colors.primary }]}>{s.score} pts</Text>
                <Text style={[styles.durVal, { color: theme.colors.textSecondary }]}>
                  {Math.round(s.duration_seconds / 60)} mins
                </Text>
              </View>
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 16,
    paddingBottom: 14,
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
  topIcon: {
    fontSize: 22,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  topSub: {
    fontSize: 11,
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLbl: {
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  consultBox: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  consultTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  consultDoc: {
    fontSize: 13,
    fontWeight: '700',
  },
  consultRating: {
    fontSize: 11,
    fontWeight: '700',
  },
  consultNote: {
    fontSize: 11.5,
    fontStyle: 'italic',
    lineHeight: 16,
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
  gameEmoji: {
    fontSize: 20,
  },
  gameTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  gameTime: {
    fontSize: 10.5,
    marginTop: 1,
  },
  scoreVal: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  durVal: {
    fontSize: 10.5,
  },
});

