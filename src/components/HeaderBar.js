import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function HeaderBar({ title, subtitle, onThemePress, onProfilePress }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'doctor':
        return { label: 'Doctor Portal', color: theme.colors.info, icon: '🩺' };
      case 'admin':
        return { label: 'Clinic Admin', color: theme.colors.success, icon: '🏥' };
      case 'root':
        return { label: 'Superadmin', color: theme.colors.warning, icon: '👑' };
      case 'user':
      default:
        return { label: 'Vision Patient', color: theme.colors.accentRed, icon: '🎮' };
    }
  };

  const badge = getRoleBadge(currentUser?.accounttype);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
      <View style={styles.leftRow}>
        <View style={[styles.logoIconBg, { backgroundColor: theme.colors.primaryGlow }]}>
          <Text style={styles.logoEmoji}>👁️</Text>
        </View>
        <View style={styles.titleCol}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title || 'LazyEye Therapy'}
          </Text>
          <View style={styles.badgeRow}>
            <Text style={[styles.roleBadgeText, { color: badge.color }]}>
              {badge.icon} {badge.label}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                {' • '}{subtitle}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.rightActions}>
        {onThemePress && (
          <TouchableOpacity
            onPress={onThemePress}
            style={[styles.iconButton, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🎨</Text>
          </TouchableOpacity>
        )}

        {onProfilePress && (
          <TouchableOpacity
            onPress={onProfilePress}
            style={[styles.iconButton, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>👤</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 14,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoEmoji: {
    fontSize: 22,
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: 6,
  },
  actionIcon: {
    fontSize: 17,
  },
});

