import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  Switch,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/Button';
import CustomIcon from '../../components/CustomIcon';
import { AvatarImage } from '../../services/avatarHelper';

export default function ProfileScreen({ onClose, onOpenThemeModal }) {
  const {
    theme,
    themes,
    themeKey,
    changeTheme,
    useWebGames,
    toggleUseWebGames,
  } = useTheme();
  const { currentUser, logout, quickLogin, quickRoles } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of LazyEye?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          onClose();
        },
      },
    ]);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'doctor':
        return { library: 'MaterialCommunityIcons', name: 'doctor', color: theme.colors.info };
      case 'admin':
        return { library: 'MaterialCommunityIcons', name: 'shield-account-outline', color: theme.colors.success };
      case 'root':
        return { library: 'Ionicons', name: 'shield-checkmark-outline', color: theme.colors.warning };
      case 'user':
      default:
        return { library: 'Ionicons', name: 'eye-outline', color: theme.colors.primary };
    }
  };

  const roleCfg = getRoleIcon(currentUser?.accounttype);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
              styles.topIconBox,
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
          <View>
            <Text style={[styles.topTitle, { color: theme.colors.text }]}>
              Account Profile
            </Text>
            <Text style={[styles.topSub, { color: theme.colors.textSecondary }]}>
              LazyEye Digital Portal
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
          accessibilityLabel="Close profile screen"
        >
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.avatarWrapper}>
            <AvatarImage
              user={currentUser}
              size={76}
              borderColor={theme.colors.primary}
              borderWidth={3}
            />
          </View>

          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {currentUser?.fullname || 'Patient Account'}
          </Text>
          <Text style={[styles.userHandle, { color: theme.colors.textSecondary }]}>
            @{currentUser?.username || 'user'} • {currentUser?.email || 'patient@lazyeye.org'}
          </Text>

          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <Text style={[styles.roleBadgeText, { color: roleCfg.color }]}>
              {currentUser?.accounttype?.toUpperCase() || 'PATIENT'}
            </Text>
          </View>
        </View>

        {/* Game Engine Mode */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Therapy Game Engine
          </Text>
          <Text style={[styles.sectionSub, { color: theme.colors.textSecondary }]}>
            Choose between local gesture games and web portal games
          </Text>
        </View>

        <View
          style={[
            styles.engineCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.engineCardInner}>
            <View
              style={[
                styles.engineIconWrap,
                {
                  backgroundColor: theme.colors.iconContainerBg,
                  borderColor: theme.colors.iconContainerBorder,
                },
              ]}
            >
              <CustomIcon
                library="Ionicons"
                name={useWebGames ? 'globe-outline' : 'phone-portrait-outline'}
                size={20}
                color={useWebGames ? theme.colors.info : theme.colors.primary}
              />
            </View>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <Text style={[styles.engineTitle, { color: theme.colors.text }]}>
                  {useWebGames ? 'Live Web Games' : 'Offline Gesture Games'}
                </Text>
                <View
                  style={[
                    styles.modeBadge,
                    {
                      backgroundColor: useWebGames
                        ? `${theme.colors.info}22`
                        : `${theme.colors.primary}22`,
                      borderColor: useWebGames
                        ? theme.colors.info
                        : theme.colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modeBadgeText,
                      {
                        color: useWebGames
                          ? theme.colors.info
                          : theme.colors.primary,
                      },
                    ]}
                  >
                    {useWebGames ? 'WEB ONLINE' : 'LOCAL'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.engineDesc, { color: theme.colors.textSecondary }]}>
                {useWebGames
                  ? 'Plays clinical games streamed directly from the LazyEye web portal.'
                  : 'Plays responsive local games with touch gestures and chromatic balance.'}
              </Text>
            </View>
            <Switch
              value={useWebGames}
              onValueChange={toggleUseWebGames}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Visual Themes Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Visual Palette
          </Text>
          <Text style={[styles.sectionSub, { color: theme.colors.textSecondary }]}>
            High-contrast themes tailored for clinical environments
          </Text>
        </View>

        <View style={styles.themeList}>
          {themes.map((t) => {
            const isSelected = themeKey === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => changeTheme(t.id)}
                activeOpacity={0.8}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: t.colors.surface,
                    borderColor: isSelected
                      ? theme.colors.selectedBorder || theme.colors.primary
                      : theme.colors.cardBorder,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.themeCardTop}>
                  <View
                    style={[
                      styles.themeIconBox,
                      {
                        backgroundColor: t.colors.iconContainerBg,
                        borderColor: t.colors.iconContainerBorder,
                      },
                    ]}
                  >
                    <CustomIcon
                      library="Ionicons"
                      name={t.icon}
                      size={18}
                      color={t.colors.primary}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.themeName, { color: t.colors.text }]}>
                      {t.name}
                    </Text>
                    <Text style={[styles.themeDesc, { color: t.colors.textSecondary }]}>
                      {t.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <View
                      style={[
                        styles.activeDot,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      <CustomIcon
                        library="Feather"
                        name="check"
                        size={12}
                        color={theme.colors.textInverted}
                      />
                    </View>
                  )}
                </View>

                {/* Swatches */}
                <View style={styles.swatchRow}>
                  <View style={[styles.swatch, { backgroundColor: t.colors.background, borderColor: t.colors.cardBorder }]} />
                  <View style={[styles.swatch, { backgroundColor: t.colors.surface, borderColor: t.colors.cardBorder }]} />
                  <View style={[styles.swatch, { backgroundColor: t.colors.primary, borderColor: t.colors.cardBorder }]} />
                  <View style={[styles.swatch, { backgroundColor: t.colors.accentRed, borderColor: t.colors.cardBorder }]} />
                  <View style={[styles.swatch, { backgroundColor: t.colors.accentCyan, borderColor: t.colors.cardBorder }]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Role Switcher */}
        <View style={[styles.sectionHeader, { marginTop: 22 }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Switch Account
          </Text>
          <Text style={[styles.sectionSub, { color: theme.colors.textSecondary }]}>
            One-tap authentication to explore different role scopes
          </Text>
        </View>

        <View style={styles.quickRolesList}>
          {quickRoles.map((r) => {
            const iconCfg = getRoleIcon(r.role);
            return (
              <TouchableOpacity
                key={r.role}
                onPress={() => {
                  quickLogin(r.role);
                  onClose();
                }}
                style={[
                  styles.quickRoleItem,
                  {
                    backgroundColor: theme.colors.cardBg,
                    borderColor: theme.colors.cardBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.roleIconWrap,
                    {
                      backgroundColor: theme.colors.iconContainerBg,
                      borderColor: theme.colors.iconContainerBorder,
                    },
                  ]}
                >
                  <CustomIcon
                    library={iconCfg.library}
                    name={iconCfg.name}
                    size={18}
                    color={iconCfg.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.quickRoleName, { color: theme.colors.text }]}>
                    {r.title}
                  </Text>
                  <Text style={[styles.quickRoleSub, { color: theme.colors.textSecondary }]}>
                    {r.badge} • @{r.username}
                  </Text>
                </View>
                <CustomIcon
                  library="Feather"
                  name="chevron-right"
                  size={16}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sign Out Button */}
        <Button
          title="Sign Out of Session"
          variant="danger"
          iconName="log-out"
          iconLibrary="Feather"
          onPress={handleLogout}
          style={{ marginTop: 24 }}
        />

        <View style={{ height: 28 }} />
      </ScrollView>
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
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topIconBox: {
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
  userCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
  },
  userHandle: {
    fontSize: 13,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionSub: {
    fontSize: 12,
    marginTop: 2,
  },
  themeList: {
    gap: 10,
  },
  themeCard: {
    borderRadius: 12,
    padding: 12,
  },
  themeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  activeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  swatch: {
    flex: 1,
    height: 10,
    borderRadius: 3,
    borderWidth: 1,
  },
  quickRolesList: {
    gap: 8,
  },
  quickRoleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  roleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRoleName: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickRoleSub: {
    fontSize: 12,
    marginTop: 2,
  },
  engineCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },
  engineCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engineIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  engineTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  modeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  modeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  engineDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
});
