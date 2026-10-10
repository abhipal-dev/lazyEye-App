import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
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
          border: theme.colors.border,
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
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={btnStyle.text} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
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
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
