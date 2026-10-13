import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import CustomIcon from './CustomIcon';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconLibrary = 'Feather',
  iconName,
  accentColor,
  onPress,
  style,
}) {
  const { theme } = useTheme();
  const color = accentColor || theme.colors.primary;
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder || theme.colors.border,
        },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: theme.colors.textSecondary }]}>
          {title}
        </Text>
        {(iconName || icon) && (
          <View
            style={[
              styles.iconBadge,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            {iconName ? (
              <CustomIcon
                library={iconLibrary}
                name={iconName}
                size={16}
                color={color}
              />
            ) : typeof icon === 'string' ? (
              <Text style={[styles.iconText, { color }]}>{icon}</Text>
            ) : (
              icon
            )}
          </View>
        )}
      </View>

      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>

      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          {subtitle}
        </Text>
      )}
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
});
