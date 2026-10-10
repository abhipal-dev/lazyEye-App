import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/HeaderBar';

export default function PatientHomeScreen({
  onLaunchTetris,
  onLaunchSnake,
  onLaunchCalibration,
  onOpenHistory,
  onOpenThemeModal,
  onOpenProfile,
}) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const dailyGoal = Number(currentUser?.user_playing_time || 20);
  const minutesCompleted = 14; // Today's completed therapy minutes
  const progressPercent = Math.min(100, Math.round((minutesCompleted / dailyGoal) * 100));

  const leftColorHex = currentUser?.left_eye_contrast_color || '#FF0033';
  const rightColorHex = currentUser?.right_eye_contrast_color || '#00E5FF';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HeaderBar
        title="Vision Therapy"
        subtitle={`Welcome, ${currentUser?.fullname?.split(' ')[0] || 'Patient'}`}
        onThemePress={onOpenThemeModal}
        onProfilePress={onOpenProfile}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Daily Progress Goal Card */}
        <View style={[styles.progressCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <View style={styles.progressTop}>
            <View>
              <Text style={[styles.progressTag, { color: theme.colors.textMuted }]}>
                TODAY'S THERAPY REGIMEN
              </Text>
              <Text style={[styles.progressValue, { color: theme.colors.text }]}>
                {minutesCompleted} / {dailyGoal} mins
              </Text>
              <Text style={[styles.progressStatus, { color: theme.colors.primary }]}>
                {progressPercent}% prescribed goal reached
              </Text>
            </View>

            <View style={[styles.goalCircle, { borderColor: theme.colors.primary, backgroundColor: `${theme.colors.primary}18` }]}>
              <Text style={[styles.circlePercent, { color: theme.colors.primary }]}>
                {progressPercent}%
              </Text>
            </View>
          </View>

          {/* Progress Bar Track */}
          <View style={[styles.trackBg, { backgroundColor: theme.colors.surfaceHighlight }]}>
            <View
              style={[
                styles.trackFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* Anaglyph 3D Glasses Status */}
        <View style={[styles.glassesCard, { backgroundColor: '#070A14', borderColor: theme.colors.border }]}>
          <View style={styles.glassesHeader}>
            <Text style={styles.glassesEmoji}>🕶️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.glassesTitle, { color: '#FFFFFF' }]}>
                Anaglyph Dichoptic Lens Setup
              </Text>
              <Text style={[styles.glassesSub, { color: theme.colors.textSecondary }]}>
                Put on your Red-Cyan glasses before starting games
              </Text>
            </View>
            <TouchableOpacity
              onPress={onLaunchCalibration}
              style={[styles.calibBtn, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.calibBtnText, { color: theme.colors.text }]}>Adjust</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.lensesRow}>
            <View style={[styles.lensIndicator, { borderColor: leftColorHex }]}>
              <View style={[styles.lensColorDot, { backgroundColor: leftColorHex }]} />
              <Text style={styles.lensText}>Left Eye: {currentUser?.left_eye_color || 'Red'}</Text>
            </View>

            <View style={[styles.lensIndicator, { borderColor: rightColorHex }]}>
              <View style={[styles.lensColorDot, { backgroundColor: rightColorHex }]} />
              <Text style={styles.lensText}>Right Eye: {currentUser?.right_eye_color || 'Blue/Cyan'}</Text>
            </View>
          </View>
        </View>

        {/* Supervising Doctor's Evaluation Card */}
        <View style={[styles.doctorCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <View style={styles.docHead}>
            <Text style={styles.docEmoji}>🩺</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.docName, { color: theme.colors.text }]}>
                Supervised by {currentUser?.doctor_name || 'Dr. Sarah Mitchell, OD'}
              </Text>
              <Text style={[styles.docRemark, { color: theme.colors.textSecondary }]}>
                "Continue Snake & Tetris fusion therapy to reduce amblyopic suppression."
              </Text>
            </View>
          </View>
        </View>

        {/* Clinical Games Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Playable Dichoptic Therapy Games
        </Text>

        {/* Game Card 1: Tetris */}
        <TouchableOpacity
          onPress={onLaunchTetris}
          activeOpacity={0.85}
          style={[styles.gameCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.primary }]}
        >
          <View style={styles.gameTopRow}>
            <View style={[styles.gameIconBox, { backgroundColor: `${theme.colors.accentRed}22` }]}>
              <Text style={styles.gameEmoji}>🕹️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.gameBadgeRow}>
                <Text style={[styles.gameTitle, { color: theme.colors.text }]}>Dichoptic Tetris</Text>
                <View style={[styles.livePill, { backgroundColor: `${theme.colors.success}18` }]}>
                  <Text style={[styles.liveText, { color: theme.colors.success }]}>Playable</Text>
                </View>
              </View>
              <Text style={[styles.gameDesc, { color: theme.colors.textSecondary }]}>
                Falling shapes visible to Left Eye • Fixed grid visible to Right Eye
              </Text>
            </View>
          </View>

          <View style={[styles.gameFooter, { borderTopColor: theme.colors.borderLight }]}>
            <Text style={[styles.gameMeta, { color: theme.colors.textMuted }]}>
              Dichoptic Amblyopia Fusion • 20 mins
            </Text>
            <Text style={[styles.playLink, { color: theme.colors.primary }]}>Start Therapy ➔</Text>
          </View>
        </TouchableOpacity>

        {/* Game Card 2: Snake */}
        <TouchableOpacity
          onPress={onLaunchSnake}
          activeOpacity={0.85}
          style={[styles.gameCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
        >
          <View style={styles.gameTopRow}>
            <View style={[styles.gameIconBox, { backgroundColor: `${theme.colors.info}22` }]}>
              <Text style={styles.gameEmoji}>🐍</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.gameBadgeRow}>
                <Text style={[styles.gameTitle, { color: theme.colors.text }]}>Dichoptic Snake</Text>
                <View style={[styles.livePill, { backgroundColor: `${theme.colors.success}18` }]}>
                  <Text style={[styles.liveText, { color: theme.colors.success }]}>Playable</Text>
                </View>
              </View>
              <Text style={[styles.gameDesc, { color: theme.colors.textSecondary }]}>
                Snake body in Left Eye • Target apples in Right Eye
              </Text>
            </View>
          </View>

          <View style={[styles.gameFooter, { borderTopColor: theme.colors.borderLight }]}>
            <Text style={[styles.gameMeta, { color: theme.colors.textMuted }]}>
              Binocular Motor Coordination • 15 mins
            </Text>
            <Text style={[styles.playLink, { color: theme.colors.primary }]}>Start Therapy ➔</Text>
          </View>
        </TouchableOpacity>

        {/* History Button */}
        <TouchableOpacity
          onPress={onOpenHistory}
          style={[styles.historyRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <Text style={styles.histIcon}>📜</Text>
          <Text style={[styles.histTitle, { color: theme.colors.text }]}>
            View My Past Session Logs & Scores
          </Text>
          <Text style={[styles.histArrow, { color: theme.colors.textSecondary }]}>➔</Text>
        </TouchableOpacity>
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
  progressCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  progressTag: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressValue: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
  },
  progressStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  goalCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePercent: {
    fontSize: 15,
    fontWeight: '800',
  },
  trackBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 4,
  },
  glassesCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  glassesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  glassesEmoji: {
    fontSize: 26,
  },
  glassesTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  glassesSub: {
    fontSize: 11,
    marginTop: 2,
  },
  calibBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  calibBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  lensesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  lensIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 6,
  },
  lensColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  lensText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  doctorCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  docHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  docEmoji: {
    fontSize: 22,
  },
  docName: {
    fontSize: 13,
    fontWeight: '700',
  },
  docRemark: {
    fontSize: 11.5,
    fontStyle: 'italic',
    marginTop: 3,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  gameCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  gameTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  gameIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameEmoji: {
    fontSize: 24,
  },
  gameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  livePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
  },
  gameDesc: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
  gameFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  gameMeta: {
    fontSize: 11,
  },
  playLink: {
    fontSize: 12,
    fontWeight: '800',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
    gap: 10,
  },
  histIcon: {
    fontSize: 18,
  },
  histTitle: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  histArrow: {
    fontSize: 14,
  },
});

