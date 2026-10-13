import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import CustomIcon from './CustomIcon';

export default function HeatmapGrid({ heatmapData = {}, onSelectDate, selectedDate }) {
  const { theme } = useTheme();

  // Generate 84 days (12 weeks) grouped by week
  const today = new Date();
  const days = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const data = heatmapData[dateStr] || { count: 0, total_minutes: 0 };
    days.push({
      dateStr,
      dateObj: d,
      dayOfWeek: d.getDay(), // 0 = Sun, 1 = Mon ...
      ...data,
    });
  }

  // Group into 12 columns of 7 days
  const weeks = [];
  for (let w = 0; w < 12; w++) {
    weeks.push(days.slice(w * 7, (w + 1) * 7));
  }

  const getCellColor = (count) => {
    if (count === 0) return theme.colors.surfaceHighlight;
    if (count === 1) return `${theme.colors.primary}44`;
    if (count === 2) return `${theme.colors.primary}88`;
    if (count >= 3) return theme.colors.primary;
    return theme.colors.surfaceHighlight;
  };

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.cardBorder || theme.colors.border }]}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <CustomIcon
            library="Feather"
            name="calendar"
            size={16}
            color={theme.colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Therapy Adherence Heatmap
          </Text>
        </View>
        <Text style={[styles.subText, { color: theme.colors.textSecondary }]}>
          12 Weeks
        </Text>
      </View>

      {/* Horizontal Scrollable Calendar Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gridScroll}>
        {/* Day of Week Labels */}
        <View style={styles.dayLabelsCol}>
          {dayLabels.map((label, idx) => (
            <View key={idx} style={styles.labelCell}>
              <Text style={[styles.dayLabelText, { color: theme.colors.textMuted }]}>{label}</Text>
            </View>
          ))}
        </View>

        {/* 12 Week Columns */}
        {weeks.map((week, wIdx) => (
          <View key={wIdx} style={styles.weekColumn}>
            {week.map((dayItem, dIdx) => {
              const isSelected = selectedDate === dayItem.dateStr;
              const cellBg = getCellColor(dayItem.count);

              return (
                <TouchableOpacity
                  key={dIdx}
                  onPress={() => onSelectDate && onSelectDate(dayItem.dateStr, dayItem)}
                  activeOpacity={0.7}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: cellBg,
                      borderColor: isSelected ? theme.colors.accentRed : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Legend & Hint */}
      <View style={[styles.legendRow, { borderTopColor: theme.colors.borderLight }]}>
        <Text style={[styles.legendHint, { color: theme.colors.textMuted }]}>
          Tap any day to inspect game logs
        </Text>
        <View style={styles.legendScale}>
          <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>Less</Text>
          <View style={[styles.legendBox, { backgroundColor: theme.colors.surfaceHighlight }]} />
          <View style={[styles.legendBox, { backgroundColor: '#00E5FF44' }]} />
          <View style={[styles.legendBox, { backgroundColor: '#00E5FF88' }]} />
          <View style={[styles.legendBox, { backgroundColor: theme.colors.primary }]} />
          <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>More</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarIcon: {
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subText: {
    fontSize: 11,
    fontWeight: '600',
  },
  gridScroll: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  dayLabelsCol: {
    justifyContent: 'space-between',
    marginRight: 6,
  },
  labelCell: {
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabelText: {
    fontSize: 9,
    fontWeight: '600',
  },
  weekColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginRight: 5,
  },
  cell: {
    width: 17,
    height: 17,
    borderRadius: 4,
    marginVertical: 1.5,
  },
  legendRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendHint: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  legendScale: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: 9.5,
    fontWeight: '600',
  },
  legendBox: {
    width: 11,
    height: 11,
    borderRadius: 2.5,
  },
});

