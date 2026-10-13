import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/HeaderBar';
import CustomIcon from '../../components/CustomIcon';
import { GAMES } from '../../services/games';

import realDataService from '../../services/realDataService';

export default function PatientHomeScreen({
  onLaunchGame,
  onLaunchTetris,
  onLaunchSnake,
  onLaunchCalibration,
  onOpenHistory,
  onOpenThemeModal,
  onOpenProfile,
}) {
  const { theme, useWebGames, toggleUseWebGames } = useTheme();
  const { currentUser } = useAuth();

  const stats = realDataService.getUserStats(currentUser);
  const dailyGoal = stats.dailyGoalMinutes;
  const minutesCompleted = stats.minutesCompletedToday;
  const progressPercent = stats.progressPercent;

  const leftColorHex = currentUser?.left_eye_contrast_color || '#EF4444';
  const rightColorHex = currentUser?.right_eye_contrast_color || '#0284C7';
  const firstName = currentUser?.fullname?.split(' ')[0] || 'Friend';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HeaderBar
        title="LazyEye Therapy"
        subtitle={firstName}
        onThemePress={onOpenThemeModal}
        onProfilePress={onOpenProfile}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Warm Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingTitle, { color: theme.colors.text }]}>
            Good day, {firstName}
          </Text>
          <Text style={[styles.greetingSubtitle, { color: theme.colors.textSecondary }]}>
            Ready for today's visual training session?
          </Text>
        </View>

        {/* ONE CLEAR PRIMARY ACTION: Daily Regimen Card */}
        <View
          style={[
            styles.primaryActionCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.primaryTopRow}>
            <View style={styles.goalInfo}>
              <Text style={[styles.goalLabel, { color: theme.colors.textMuted }]}>
                TODAY'S PROGRESS
              </Text>
              <Text style={[styles.goalTime, { color: theme.colors.text }]}>
                {minutesCompleted} / {dailyGoal} mins
              </Text>
              <Text style={[styles.goalStatus, { color: theme.colors.primary }]}>
                {progressPercent}% of prescribed goal
              </Text>
            </View>

            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: theme.colors.iconContainerBg,
                  borderColor: theme.colors.iconContainerBorder,
                },
              ]}
            >
              <CustomIcon
                library="Feather"
                name="clock"
                size={22}
                color={theme.colors.primary}
              />
            </View>
          </View>

          {/* Simple Progress Bar */}
          <View
            style={[
              styles.progressBarBg,
              { backgroundColor: theme.colors.surfaceHighlight },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>

          {/* Clear Primary Action Button */}
          <TouchableOpacity
            onPress={() => onLaunchGame ? onLaunchGame(GAMES[0]) : onLaunchTetris()}
            activeOpacity={0.85}
            style={[
              styles.primaryButton,
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.buttonBorder,
              },
            ]}
            accessible={true}
            accessibilityLabel="Start today's session with prescribed game"
          >
            <CustomIcon
              library="Feather"
              name="play"
              size={18}
              color={theme.colors.textInverted}
            />
            <Text style={[styles.primaryButtonText, { color: theme.colors.textInverted }]}>
              Start Daily Session
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dichoptic Glasses Notice Card */}
        <View
          style={[
            styles.glassesCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <CustomIcon
              library="Ionicons"
              name="glasses-outline"
              size={22}
              color={theme.colors.text}
            />
          </View>

          <View style={styles.glassesContent}>
            <Text style={[styles.glassesTitle, { color: theme.colors.text }]}>
              Red-Cyan Glasses
            </Text>
            <View style={styles.lensTagsRow}>
              <View style={styles.lensTag}>
                <View style={[styles.lensDot, { backgroundColor: leftColorHex }]} />
                <Text style={[styles.lensLabel, { color: theme.colors.textSecondary }]}>
                  Left Eye
                </Text>
              </View>
              <Text style={[styles.lensDivider, { color: theme.colors.borderLight }]}>•</Text>
              <View style={styles.lensTag}>
                <View style={[styles.lensDot, { backgroundColor: rightColorHex }]} />
                <Text style={[styles.lensLabel, { color: theme.colors.textSecondary }]}>
                  Right Eye
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={onLaunchCalibration}
            style={[
              styles.adjustButton,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
            accessible={true}
            accessibilityLabel="Adjust lens calibration"
          >
            <Text style={[styles.adjustButtonText, { color: theme.colors.text }]}>
              Calibrate
            </Text>
          </TouchableOpacity>
        </View>

        {/* Prescribed Therapy Games Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>
            Prescribed Games
          </Text>
          <View
            style={[
              styles.countPill,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <Text style={[styles.countPillText, { color: theme.colors.primary }]}>
              {GAMES.length} Clinical Engines
            </Text>
          </View>
        </View>

        {GAMES.map((game) => (
          <TouchableOpacity
            key={game.id}
            onPress={() => onLaunchGame ? onLaunchGame(game) : onLaunchTetris()}
            activeOpacity={0.8}
            style={[
              styles.featureCard,
              {
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            {/* Proper Game Image Icon */}
            <View
              style={[
                styles.gameImageContainer,
                {
                  backgroundColor: theme.colors.iconContainerBg,
                  borderColor: theme.colors.iconContainerBorder,
                },
              ]}
            >
              <Image
                source={game.image}
                style={styles.gameImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.featureDetails}>
              <View style={styles.featureHeaderRow}>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]} numberOfLines={1}>
                  {game.title}
                </Text>
                <Text style={[styles.featureDuration, { color: theme.colors.textMuted }]}>
                  {game.duration} mins
                </Text>
              </View>
              <Text style={[styles.featureCategory, { color: theme.colors.primary }]}>
                {game.category}
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                {game.description}
              </Text>
            </View>

            <View
              style={[
                styles.arrowContainer,
                {
                  backgroundColor: theme.colors.iconContainerBg,
                  borderColor: theme.colors.iconContainerBorder,
                },
              ]}
            >
              <CustomIcon
                library="Feather"
                name="chevron-right"
                size={18}
                color={theme.colors.textSecondary}
              />
            </View>
          </TouchableOpacity>
        ))}

        {/* Feature Item 3: Session Logs & History */}
        <TouchableOpacity
          onPress={onOpenHistory}
          activeOpacity={0.8}
          style={[
            styles.featureCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View
            style={[
              styles.iconContainerLarge,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <CustomIcon
              library="Feather"
              name="activity"
              size={22}
              color={theme.colors.success}
            />
          </View>

          <View style={styles.featureDetails}>
            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
              Therapy History
            </Text>
            <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
              Review completed sessions, scores and doctor notes
            </Text>
          </View>

          <View
            style={[
              styles.arrowContainer,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <CustomIcon
              library="Feather"
              name="chevron-right"
              size={18}
              color={theme.colors.textSecondary}
            />
          </View>
        </TouchableOpacity>

        {/* Floating Custom Bottom Tab Bar Clearance */}
        <View style={{ height: 96 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  greetingSection: {
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  greetingSubtitle: {
    fontSize: 14,
    marginTop: 3,
    fontWeight: '400',
  },
  primaryActionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  primaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  goalInfo: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  goalTime: {
    fontSize: 20,
    fontWeight: '700',
  },
  goalStatus: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  glassesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },
  glassesContent: {
    flex: 1,
    marginLeft: 12,
  },
  glassesTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  lensTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  lensTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lensDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lensLabel: {
    fontSize: 12,
  },
  lensDivider: {
    fontSize: 10,
  },
  adjustButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  adjustButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.1,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureDetails: {
    flex: 1,
    marginHorizontal: 14,
  },
  featureHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  featureDuration: {
    fontSize: 12,
    fontWeight: '500',
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  gameImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 4,
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  featureCategory: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
  },
});
