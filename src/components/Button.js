import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import CustomIcon from './CustomIcon';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconLibrary,
  iconName,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const { theme } = useTheme();

  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: theme.colors.surfaceElevated,
          border: theme.colors.buttonBorder || theme.colors.border,
          text: theme.colors.text,
        };
      case 'outline':
        return {
          bg: 'transparent',
          border: theme.colors.primary,
          text: theme.colors.primary,
        };
      case 'danger':
        return {
          bg: theme.colors.danger,
          border: theme.colors.danger,
          text: '#FFFFFF',
        };
      case 'primary':
      default:
        return {
          bg: theme.colors.primary,
          border: theme.colors.primary,
          text: theme.colors.textInverted,
        };
    }
  };

  const btnStyle = getButtonStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: btnStyle.bg,
          borderColor: btnStyle.border,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={btnStyle.text} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {iconName ? (
            <CustomIcon
              library={iconLibrary || 'Feather'}
              name={iconName}
              size={18}
              color={btnStyle.text}
            />
          ) : icon && typeof icon === 'string' ? (
            <Text style={[styles.icon, { color: btnStyle.text }]}>{icon}</Text>
          ) : icon ? (
            icon
          ) : null}
          <Text style={[styles.text, { color: btnStyle.text }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  icon: {
    fontSize: 16,
  },
});
