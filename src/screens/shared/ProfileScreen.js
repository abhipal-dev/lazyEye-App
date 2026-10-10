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
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/Button';

export default function ProfileScreen({ onClose, onOpenThemeModal }) {
  const { theme, themes, themeKey, changeTheme } = useTheme();
  const { currentUser, logout, quickLogin, quickRoles } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topIcon}>👤</Text>
          <View>
            <Text style={[styles.topTitle, { color: theme.colors.text }]}>Account & Preferences</Text>
            <Text style={[styles.topSub, { color: theme.colors.textSecondary }]}>LazyEye Platform Profile</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.surfaceHighlight }]}>
            <Text style={styles.avatarEmoji}>
              {currentUser?.accounttype === 'doctor'
                ? '🩺'
                : currentUser?.accounttype === 'admin'
                ? '🏥'
                : currentUser?.accounttype === 'root'
                ? '👑'
                : '🧒'}
            </Text>
          </View>

          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {currentUser?.fullname || 'Abhishek Pal'}
          </Text>
          <Text style={[styles.userHandle, { color: theme.colors.textSecondary }]}>
            @{currentUser?.username || 'user'} • {currentUser?.email || 'user@lazyeye.org'}
          </Text>

          <View style={[styles.roleBadge, { backgroundColor: theme.colors.badgeBg }]}>
            <Text style={[styles.roleBadgeText, { color: theme.colors.primary }]}>
              ROLE: {currentUser?.accounttype?.toUpperCase() || 'PATIENT'}
            </Text>
          </View>
        </View>

        {/* Theme Selector Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Visual Themes ({themes.length})
          </Text>
          <Text style={[styles.sectionSub, { color: theme.colors.textMuted }]}>
            Tap to switch application color palette instantly
          </Text>
        </View>

        <View style={styles.themeGrid}>
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
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.themeCardTop}>
                  <Text style={styles.themeIcon}>{t.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.themeName, { color: t.colors.text }]}>
                      {t.name}
                    </Text>
                    <Text style={[styles.themeDesc, { color: t.colors.textSecondary }]}>
                      {t.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.activePill, { backgroundColor: theme.colors.primary }]}>
                      <Text style={[styles.activePillText, { color: theme.colors.textInverted }]}>Active</Text>
                    </View>
                  )}
                </View>

                {/* Color Swatch Bar */}
                <View style={styles.swatchBar}>
                  <View style={[styles.swatch, { backgroundColor: t.colors.background }]} />
                  <View style={[styles.swatch, { backgroundColor: t.colors.surface }]} />
                  <View style={[styles.swatch, { backgroundColor: t.colors.primary }]} />
                  <View style={[styles.swatch, { backgroundColor: t.colors.accentRed }]} />
                  <View style={[styles.swatch, { backgroundColor: t.colors.accentCyan }]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Role Switcher */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Switch to Another Account
          </Text>
          <Text style={[styles.sectionSub, { color: theme.colors.textMuted }]}>
            Instant one-tap login for testing different roles
          </Text>
        </View>

        <View style={styles.quickRolesList}>
          {quickRoles.map((r) => (
            <TouchableOpacity
              key={r.role}
              onPress={() => {
                quickLogin(r.role);
                onClose();
              }}
              style={[
                styles.quickRoleItem,
                { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border },
              ]}
            >
              <Text style={styles.quickRoleEmoji}>{r.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.quickRoleName, { color: theme.colors.text }]}>{r.title}</Text>
                <Text style={[styles.quickRoleSub, { color: theme.colors.textSecondary }]}>
                  {r.badge} • @{r.username}
                </Text>
              </View>
              <Text style={[styles.quickRoleArrow, { color: theme.colors.primary }]}>Switch ➔</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <Button
          title="Sign Out of Session"
          variant="danger"
          icon="🚪"
          onPress={handleLogout}
          style={{ marginTop: 26 }}
        />
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userCard: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarEmoji: {
    fontSize: 30,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
  },
  userHandle: {
    fontSize: 12,
    marginTop: 3,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 11,
    marginTop: 2,
  },
  themeGrid: {
    gap: 10,
  },
  themeCard: {
    borderRadius: 16,
    padding: 14,
  },
  themeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  themeIcon: {
    fontSize: 22,
  },
  themeName: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  themeDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  swatchBar: {
    flexDirection: 'row',
    gap: 6,
  },
  swatch: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  quickRolesList: {
    gap: 8,
  },
  quickRoleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  quickRoleEmoji: {
    fontSize: 20,
  },
  quickRoleName: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  quickRoleSub: {
    fontSize: 11,
    marginTop: 1,
  },
  quickRoleArrow: {
    fontSize: 12,
    fontWeight: '700',
  },
});

