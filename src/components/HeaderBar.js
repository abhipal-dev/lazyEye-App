import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';
import CustomIcon from './CustomIcon';
import { AvatarImage } from '../services/avatarHelper';

export default function HeaderBar({
  title,
  subtitle,
  onThemePress,
  onProfilePress,
  showLogo = true,
}) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'doctor':
        return {
          label: 'Doctor Portal',
          color: theme.colors.info,
          library: 'MaterialCommunityIcons',
          icon: 'doctor',
        };
      case 'admin':
        return {
          label: 'Clinic Admin',
          color: theme.colors.success,
          library: 'MaterialCommunityIcons',
          icon: 'shield-account-outline',
        };
      case 'root':
        return {
          label: 'Superadmin',
          color: theme.colors.warning,
          library: 'Ionicons',
          icon: 'shield-checkmark-outline',
        };
      case 'user':
      default:
        return {
          label: 'Vision Patient',
          color: theme.colors.primary,
          library: 'Ionicons',
          icon: 'eye-outline',
        };
    }
  };

  const badge = getRoleBadge(currentUser?.accounttype);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.leftRow}>
        {showLogo && (
          <View
            style={[
              styles.logoBox,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <BrandLogo size={28} variant="icon" />
          </View>
        )}

        <View style={styles.titleCol}>
          <Text
            style={[styles.title, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {title || 'LazyEye Therapy'}
          </Text>

          <View style={styles.badgeRow}>
            <View style={styles.roleTag}>
              <CustomIcon
                library={badge.library}
                name={badge.icon}
                size={12}
                color={badge.color}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.roleBadgeText, { color: badge.color }]}>
                {badge.label}
              </Text>
            </View>

            {subtitle && (
              <Text
                style={[styles.subtitle, { color: theme.colors.textMuted }]}
                numberOfLines={1}
              >
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
            style={[
              styles.iconButton,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Switch app theme"
          >
            <CustomIcon
              library="Ionicons"
              name="color-palette-outline"
              size={18}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}

        {onProfilePress && (
          <TouchableOpacity
            onPress={onProfilePress}
            style={[
              styles.avatarButton,
              {
                borderColor: theme.colors.primary,
              },
            ]}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Open user profile and settings"
          >
            <AvatarImage
              user={currentUser}
              size={32}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 12,
    paddingBottom: 12,
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
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    flexShrink: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
