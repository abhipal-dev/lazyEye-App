import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/HeaderBar';
import CustomIcon from '../../components/CustomIcon';
import { AvatarImage } from '../../services/avatarHelper';
import realDataService from '../../services/realDataService';
import { GAMES } from '../../services/games';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PatientOverviewScreen({
  onLaunchGame,
  onLaunchCalibration,
  onOpenHistory,
  onOpenThemeModal,
  onOpenProfile,
  onNavigateToGames,
}) {
  const { theme, useWebGames, toggleUseWebGames } = useTheme();
  const { currentUser } = useAuth();

  // Load real stats and clinical announcements
  const [stats, setStats] = useState(() => realDataService.getUserStats(currentUser));
  const announcements = realDataService.getClinicalAnnouncements();

  useEffect(() => {
    if (currentUser) {
      setStats(realDataService.getUserStats(currentUser));
    }
  }, [currentUser]);

  const firstName = currentUser?.fullname?.split(' ')[0] || 'Friend';
  const leftColorHex = currentUser?.left_eye_contrast_color || '#EF4444';
  const rightColorHex = currentUser?.right_eye_contrast_color || '#0284C7';

  // Recommend favorite or primary game
  const primaryGame = GAMES.find((g) => g.title.toLowerCase().includes(stats.favoriteGame.toLowerCase())) || GAMES[0];

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
        {/* Real User Greeting & Status Banner */}
        <View style={styles.userBannerRow}>
          <TouchableOpacity
            style={styles.avatarTouch}
            onPress={onOpenProfile}
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel="View profile"
          >
            <AvatarImage
              user={currentUser}
              size={54}
              borderColor={theme.colors.primary}
              borderWidth={2}
            />
            <View
              style={[
                styles.onlineBadge,
                {
                  backgroundColor: theme.colors.success || '#10B981',
                  borderColor: theme.colors.background,
                },
              ]}
            />
          </TouchableOpacity>

          <View style={styles.userInfoCol}>
            <View style={styles.nameRow}>
              <Text style={[styles.greetingTitle, { color: theme.colors.text }]}>
                {currentUser?.fullname || 'Welcome back'}
              </Text>
            </View>
            <Text style={[styles.greetingSubtitle, { color: theme.colors.textSecondary }]}>
              {currentUser?.accounttype === 'user' ? 'Active Clinical Prescription' : 'Digital Vision Patient'}
            </Text>
          </View>

          {/* Real Streak Badge */}
          <View
            style={[
              styles.streakPill,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <Text style={styles.streakFlame}>🔥</Text>
            <Text style={[styles.streakText, { color: theme.colors.primary }]}>
              {stats.streakDays}d streak
            </Text>
          </View>
        </View>

        {/* PRIMARY ACTION CARD: Real Daily Regimen & Progress */}
        <View
          style={[
            styles.primaryCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.primaryTopRow}>
            <View style={styles.goalInfo}>
              <Text style={[styles.goalHeaderLabel, { color: theme.colors.textMuted }]}>
                TODAY'S THERAPY REGIMEN
              </Text>
              <View style={styles.goalNumberRow}>
                <Text style={[styles.goalBigNum, { color: theme.colors.text }]}>
                  {stats.minutesCompletedToday}
                </Text>
                <Text style={[styles.goalDenom, { color: theme.colors.textMuted }]}>
                  {' '}/ {stats.dailyGoalMinutes} mins
                </Text>
              </View>
              <Text style={[styles.goalSubtext, { color: theme.colors.primary }]}>
                {stats.progressPercent}% prescribed visual dosage completed
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

          {/* Real Progress Bar */}
          <View
            style={[
              styles.progressBarBg,
              { backgroundColor: theme.colors.surfaceHighlight || 'rgba(0,0,0,0.06)' },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${stats.progressPercent}%`,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>

          {/* Quick Metrics Row: Real Database Metrics */}
          <View style={styles.statsRow}>
            <View style={styles.statMetricItem}>
              <Text style={[styles.statMetricVal, { color: theme.colors.text }]}>
                {stats.totalSessions}
              </Text>
              <Text style={[styles.statMetricLabel, { color: theme.colors.textMuted }]}>
                Sessions
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statMetricItem}>
              <Text style={[styles.statMetricVal, { color: theme.colors.text }]}>
                {stats.totalMinutes}m
              </Text>
              <Text style={[styles.statMetricLabel, { color: theme.colors.textMuted }]}>
                Total Time
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statMetricItem}>
              <Text style={[styles.statMetricVal, { color: theme.colors.text }]}>
                {stats.highestScore}
              </Text>
              <Text style={[styles.statMetricLabel, { color: theme.colors.textMuted }]}>
                High Score
              </Text>
            </View>
          </View>

          {/* Clear Primary Action Button */}
          <TouchableOpacity
            onPress={() => onLaunchGame(primaryGame)}
            activeOpacity={0.85}
            style={[
              styles.primaryButton,
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.buttonBorder,
              },
            ]}
            accessible={true}
            accessibilityLabel={`Start session with ${primaryGame.title}`}
          >
            <CustomIcon
              library="Feather"
              name="play"
              size={18}
              color={theme.colors.textInverted || '#FFFFFF'}
            />
            <Text style={[styles.primaryButtonText, { color: theme.colors.textInverted || '#FFFFFF' }]}>
              Start Session • {primaryGame.title}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dichoptic Glasses & Calibration Card */}
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
              Anaglyph Lens Calibration
            </Text>
            <View style={styles.lensTagsRow}>
              <View style={styles.lensTag}>
                <View style={[styles.lensDot, { backgroundColor: leftColorHex }]} />
                <Text style={[styles.lensLabel, { color: theme.colors.textSecondary }]}>
                  OS (Left)
                </Text>
              </View>
              <Text style={[styles.lensDivider, { color: theme.colors.borderLight }]}>•</Text>
              <View style={styles.lensTag}>
                <View style={[styles.lensDot, { backgroundColor: rightColorHex }]} />
                <Text style={[styles.lensLabel, { color: theme.colors.textSecondary }]}>
                  OD (Right)
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

        {/* CLINICAL INFO & ANNOUNCEMENTS ("advertisements / info") */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>
            Clinical Information & Tips
          </Text>
          <View
            style={[
              styles.infoBadgePill,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <CustomIcon library="Feather" name="info" size={12} color={theme.colors.primary} />
            <Text style={[styles.infoBadgeText, { color: theme.colors.primary }]}>
              Evidence-Based
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.announcementsRow}
        >
          {announcements.map((item) => (
            <View
              key={item.id}
              style={[
                styles.announcementCard,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.cardBorder,
                },
              ]}
            >
              <View style={styles.announcementTop}>
                <View
                  style={[
                    styles.announcementCategoryTag,
                    {
                      backgroundColor: theme.colors.iconContainerBg,
                      borderColor: theme.colors.iconContainerBorder,
                    },
                  ]}
                >
                  <Text style={[styles.announcementCategoryText, { color: theme.colors.primary }]}>
                    {item.category}
                  </Text>
                </View>

                <View
                  style={[
                    styles.announcementIconBox,
                    {
                      backgroundColor: theme.colors.iconContainerBg,
                    },
                  ]}
                >
                  <CustomIcon
                    library={item.iconLibrary}
                    name={item.icon}
                    size={16}
                    color={theme.colors.primary}
                  />
                </View>
              </View>

              <Text style={[styles.announcementTitle, { color: theme.colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text
                style={[styles.announcementDesc, { color: theme.colors.textSecondary }]}
                numberOfLines={3}
              >
                {item.description}
              </Text>

              <View style={styles.announcementFooter}>
                <Text style={[styles.announcementTag, { color: theme.colors.textMuted }]}>
                  {item.tag}
                </Text>
                <Text style={[styles.announcementReadTime, { color: theme.colors.primary }]}>
                  {item.readTime}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* RECENT REAL ACTIVITY PREVIEW */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>
            Recent Sessions
          </Text>
          <TouchableOpacity
            onPress={onOpenHistory}
            style={styles.seeAllBtn}
            accessible={true}
            accessibilityLabel="View complete therapy history"
          >
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
              View All ({stats.totalSessions})
            </Text>
            <CustomIcon
              library="Feather"
              name="chevron-right"
              size={14}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {stats.recentSessions.slice(0, 3).map((session, idx) => (
          <View
            key={session.id || idx}
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
                styles.sessionIconBox,
                {
                  backgroundColor: theme.colors.iconContainerBg,
                  borderColor: theme.colors.iconContainerBorder,
                },
              ]}
            >
              <CustomIcon
                library="MaterialCommunityIcons"
                name="gamepad-variant-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>

            <View style={styles.sessionDetails}>
              <Text style={[styles.sessionGameName, { color: theme.colors.text }]}>
                {session.game_name}
              </Text>
              <Text style={[styles.sessionDate, { color: theme.colors.textMuted }]}>
                {session.played_at ? session.played_at.slice(0, 16) : 'Recorded Session'}
              </Text>
            </View>

            <View style={styles.sessionScoreCol}>
              <Text style={[styles.sessionScoreVal, { color: theme.colors.text }]}>
                {session.score} pts
              </Text>
              <Text style={[styles.sessionDuration, { color: theme.colors.textSecondary }]}>
                {Math.round((session.duration_seconds || 600) / 60)} mins
              </Text>
            </View>
          </View>
        ))}

        {/* Quick Navigate to Games Card */}
        <TouchableOpacity
          onPress={onNavigateToGames}
          activeOpacity={0.8}
          style={[
            styles.gamesPromoCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View
            style={[
              styles.gamesPromoIcon,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <CustomIcon
              library="MaterialCommunityIcons"
              name="grid-large"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.gamesPromoContent}>
            <Text style={[styles.gamesPromoTitle, { color: theme.colors.text }]}>
              All 11 Vision Therapy Engines
            </Text>
            <Text style={[styles.gamesPromoSubtitle, { color: theme.colors.textSecondary }]}>
              Tetris, Snake, Menja, Bubble Shooter, Maze & more
            </Text>
          </View>
          <View
            style={[
              styles.gamesPromoArrow,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <CustomIcon
              library="Feather"
              name="arrow-right"
              size={18}
              color={theme.colors.primary}
            />
          </View>
        </TouchableOpacity>

        {/* Space at bottom for floating CustomTabBar */}
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
    paddingTop: 14,
  },
  userBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarTouch: {
    position: 'relative',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  userInfoCol: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  greetingSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  streakFlame: {
    fontSize: 13,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
  },
  primaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  primaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalHeaderLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  goalNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  goalBigNum: {
    fontSize: 26,
    fontWeight: '800',
  },
  goalDenom: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalSubtext: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    marginBottom: 14,
  },
  statMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  statMetricVal: {
    fontSize: 16,
    fontWeight: '700',
  },
  statMetricLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    opacity: 0.3,
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
    padding: 12,
    marginBottom: 16,
  },
  glassesContent: {
    flex: 1,
    marginLeft: 12,
  },
  glassesTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  lensTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
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
    fontSize: 11,
    fontWeight: '500',
  },
  lensDivider: {
    fontSize: 10,
  },
  adjustButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  adjustButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  infoBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  infoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  announcementsRow: {
    paddingRight: 16,
    gap: 12,
    marginBottom: 18,
  },
  announcementCard: {
    width: SCREEN_WIDTH * 0.72,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  announcementTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  announcementCategoryTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  announcementCategoryText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  announcementIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  announcementDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  announcementFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 8,
  },
  announcementTag: {
    fontSize: 10,
    fontWeight: '500',
  },
  announcementReadTime: {
    fontSize: 10,
    fontWeight: '700',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  sessionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionDetails: {
    flex: 1,
    marginHorizontal: 12,
  },
  sessionGameName: {
    fontSize: 14,
    fontWeight: '600',
  },
  sessionDate: {
    fontSize: 11,
    marginTop: 2,
  },
  sessionScoreCol: {
    alignItems: 'flex-end',
  },
  sessionScoreVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  sessionDuration: {
    fontSize: 11,
    marginTop: 2,
  },
  gamesPromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginTop: 8,
  },
  gamesPromoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gamesPromoContent: {
    flex: 1,
    marginLeft: 12,
  },
  gamesPromoTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  gamesPromoSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  gamesPromoArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

