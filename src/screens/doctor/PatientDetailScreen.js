import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import HeaderBar from '../../components/HeaderBar';
import Button from '../../components/Button';

export default function PatientDetailScreen({ patient, onClose, onUpdated }) {
  const { theme } = useTheme();

  const [leftColor, setLeftColor] = useState(patient?.left_eye_color || 'red');
  const [rightColor, setRightColor] = useState(patient?.right_eye_color || 'blue');
  const [leftContrast, setLeftContrast] = useState(Number(patient?.left_eye_contrastvalue || 240));
  const [rightContrast, setRightContrast] = useState(Number(patient?.right_eye_contrastvalue || 220));
  const [goalMinutes, setGoalMinutes] = useState(patient?.user_playing_time || '20');
  const [saving, setSaving] = useState(false);

  const colorsList = [
    { name: 'red', hex: '#FF0033' },
    { name: 'blue', hex: '#0066FF' },
    { name: 'green', hex: '#00CC66' },
    { name: 'cyan', hex: '#00E5FF' },
  ];

  const timesList = ['10', '15', '20', '25', '30'];

  const handleSave = async () => {
    setSaving(true);
    try {
      const leftHex = colorsList.find((c) => c.name === leftColor)?.hex || '#FF0033';
      const rightHex = colorsList.find((c) => c.name === rightColor)?.hex || '#0066FF';

      await api.updateCalibration(patient.id, {
        left_eye_color: leftColor,
        right_eye_color: rightColor,
        left_eye_contrast_color: leftHex,
        right_eye_contrast_color: rightHex,
        left_eye_contrastvalue: leftContrast.toString(),
        right_eye_contrastvalue: rightContrast.toString(),
        user_playing_time: goalMinutes.toString(),
      });

      if (onUpdated) onUpdated();
      Alert.alert('Prescription Updated', `New lens parameters calibrated for ${patient.fullname}.`);
      onClose();
    } catch (e) {
      Alert.alert('Error', 'Failed to update calibration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topIcon}>⚙️</Text>
          <View>
            <Text style={[styles.topTitle, { color: theme.colors.text }]}>Lens Calibration</Text>
            <Text style={[styles.topSub, { color: theme.colors.textSecondary }]}>{patient?.fullname}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dichoptic Dual-Eye Fusion Preview Canvas */}
        <View style={[styles.previewCard, { backgroundColor: '#05070D', borderColor: theme.colors.border }]}>
          <Text style={[styles.previewHeader, { color: theme.colors.textMuted }]}>
            DICHOPTIC ANAGLYPH FUSION PREVIEW
          </Text>

          <View style={styles.fusionBox}>
            {/* Left Eye Object */}
            <View
              style={[
                styles.fusionObject,
                {
                  backgroundColor: colorsList.find((c) => c.name === leftColor)?.hex || '#FF0033',
                  opacity: leftContrast / 255,
                  transform: [{ rotate: '-8deg' }],
                },
              ]}
            >
              <Text style={styles.fusionLabel}>OS (Left)</Text>
            </View>

            {/* Right Eye Object */}
            <View
              style={[
                styles.fusionObject,
                {
                  backgroundColor: colorsList.find((c) => c.name === rightColor)?.hex || '#0066FF',
                  opacity: rightContrast / 255,
                  transform: [{ rotate: '8deg' }],
                },
              ]}
            >
              <Text style={styles.fusionLabel}>OD (Right)</Text>
            </View>
          </View>

          <Text style={[styles.previewHint, { color: theme.colors.textSecondary }]}>
            Child fuses both chromatic streams into a single binocular percept
          </Text>
        </View>

        {/* Left Lens Configuration */}
        <View style={[styles.configCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.configTitle, { color: theme.colors.text }]}>
            Left Eye Filter (OS)
          </Text>

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Anaglyph Lens Color:</Text>
          <View style={styles.colorRow}>
            {colorsList.map((c) => (
              <TouchableOpacity
                key={c.name}
                onPress={() => setLeftColor(c.name)}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: c.hex,
                    borderColor: leftColor === c.name ? '#FFFFFF' : 'transparent',
                    borderWidth: leftColor === c.name ? 3 : 1,
                  },
                ]}
              >
                {leftColor === c.name && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contrastRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Contrast Intensity: <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{leftContrast} / 255</Text>
            </Text>
            <View style={styles.stepButtons}>
              <TouchableOpacity
                onPress={() => setLeftContrast(Math.max(50, leftContrast - 25))}
                style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.stepText, { color: theme.colors.text }]}>- 25</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLeftContrast(Math.min(255, leftContrast + 25))}
                style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.stepText, { color: theme.colors.text }]}>+ 25</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Right Lens Configuration */}
        <View style={[styles.configCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.configTitle, { color: theme.colors.text }]}>
            Right Eye Filter (OD)
          </Text>

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Anaglyph Lens Color:</Text>
          <View style={styles.colorRow}>
            {colorsList.map((c) => (
              <TouchableOpacity
                key={c.name}
                onPress={() => setRightColor(c.name)}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: c.hex,
                    borderColor: rightColor === c.name ? '#FFFFFF' : 'transparent',
                    borderWidth: rightColor === c.name ? 3 : 1,
                  },
                ]}
              >
                {rightColor === c.name && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contrastRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Contrast Intensity: <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{rightContrast} / 255</Text>
            </Text>
            <View style={styles.stepButtons}>
              <TouchableOpacity
                onPress={() => setRightContrast(Math.max(50, rightContrast - 25))}
                style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.stepText, { color: theme.colors.text }]}>- 25</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRightContrast(Math.min(255, rightContrast + 25))}
                style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.stepText, { color: theme.colors.text }]}>+ 25</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Daily Prescribed Minutes */}
        <View style={[styles.configCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.configTitle, { color: theme.colors.text }]}>
            Prescribed Daily Therapy Target
          </Text>
          <View style={styles.timePillsRow}>
            {timesList.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setGoalMinutes(t)}
                style={[
                  styles.timePill,
                  {
                    backgroundColor: goalMinutes === t ? theme.colors.primary : theme.colors.inputBg,
                    borderColor: goalMinutes === t ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.timePillText,
                    { color: goalMinutes === t ? theme.colors.textInverted : theme.colors.text },
                  ]}
                >
                  {t} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title="Save Prescribed Parameters"
          icon="💾"
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: 10 }}
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
    paddingTop: 16,
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
  previewCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  previewHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  fusionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 10,
  },
  fusionObject: {
    width: 65,
    height: 65,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  fusionLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  previewHint: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
  },
  configCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  configTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  contrastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  stepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  stepText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timePillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  timePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  timePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

