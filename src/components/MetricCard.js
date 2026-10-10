import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function MetricCard({ title, value, subtitle, icon, accentColor, onPress, style }) {
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
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: theme.colors.textSecondary }]}>{title}</Text>
        {icon && (
          <View style={[styles.iconBadge, { backgroundColor: `${color}18` }]}>
            <Text style={[styles.iconText, { color }]}>{icon}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>

      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>
      )}
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
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
    letterSpacing: 0.4,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
});
