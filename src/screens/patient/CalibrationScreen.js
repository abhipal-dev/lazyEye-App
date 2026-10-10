import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import Button from '../../components/Button';

export default function CalibrationScreen({ onClose }) {
  const { theme } = useTheme();
  const { currentUser, updateUserProfile } = useAuth();

  const [leftColor, setLeftColor] = useState(currentUser?.left_eye_color || 'red');
  const [rightColor, setRightColor] = useState(currentUser?.right_eye_color || 'blue');
  const [leftContrast, setLeftContrast] = useState(Number(currentUser?.left_eye_contrastvalue || 240));
  const [rightContrast, setRightContrast] = useState(Number(currentUser?.right_eye_contrastvalue || 220));
  const [saving, setSaving] = useState(false);

  const colors = [
    { name: 'red', hex: '#FF0033' },
    { name: 'blue', hex: '#0066FF' },
    { name: 'green', hex: '#00CC66' },
    { name: 'cyan', hex: '#00E5FF' },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const leftHex = colors.find((c) => c.name === leftColor)?.hex || '#FF0033';
      const rightHex = colors.find((c) => c.name === rightColor)?.hex || '#0066FF';

      await api.updateCalibration(currentUser.id, {
        left_eye_color: leftColor,
        right_eye_color: rightColor,
        left_eye_contrast_color: leftHex,
        right_eye_contrast_color: rightHex,
        left_eye_contrastvalue: leftContrast.toString(),
        right_eye_contrastvalue: rightContrast.toString(),
      });

      await updateUserProfile({
        left_eye_color: leftColor,
        right_eye_color: rightColor,
        left_eye_contrast_color: leftHex,
        right_eye_contrast_color: rightHex,
        left_eye_contrastvalue: leftContrast.toString(),
        right_eye_contrastvalue: rightContrast.toString(),
      });

      Alert.alert('Calibrated', 'Your 3D anaglyph glasses settings have been updated.');
      onClose();
    } catch (e) {
      Alert.alert('Error', 'Failed to save calibration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topIcon}>🕶️</Text>
          <View>
            <Text style={[styles.topTitle, { color: theme.colors.text }]}>Patient Anaglyph Calibration</Text>
            <Text style={[styles.topSub, { color: theme.colors.textSecondary }]}>Fine-tune 3D glasses contrast</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Visual Fusion Calibration Target */}
        <View style={[styles.fusionTargetBox, { backgroundColor: '#05070D', borderColor: theme.colors.border }]}>
          <Text style={[styles.targetHeader, { color: theme.colors.textMuted }]}>
            BINOCULAR SUPPRESSION TEST
          </Text>

          <View style={styles.dualShapes}>
            <View
              style={[
                styles.targetSquare,
                {
                  backgroundColor: colors.find((c) => c.name === leftColor)?.hex || '#FF0033',
                  opacity: leftContrast / 255,
                },
              ]}
            >
              <Text style={styles.squareText}>L</Text>
            </View>

            <View
              style={[
                styles.targetSquare,
                {
                  backgroundColor: colors.find((c) => c.name === rightColor)?.hex || '#0066FF',
                  opacity: rightContrast / 255,
                },
              ]}
            >
              <Text style={styles.squareText}>R</Text>
            </View>
          </View>

          <Text style={[styles.targetHint, { color: theme.colors.textSecondary }]}>
            With glasses on, adjust contrast until both letters 'L' and 'R' appear equally bright without suppression.
          </Text>
        </View>

        {/* Left Lens Controls */}
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Left Lens (OS)</Text>
          <View style={styles.colorRow}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c.name}
                onPress={() => setLeftColor(c.name)}
                style={[
                  styles.colorBtn,
                  {
                    backgroundColor: c.hex,
                    borderWidth: leftColor === c.name ? 3 : 1,
                    borderColor: leftColor === c.name ? '#FFFFFF' : 'transparent',
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.sliderRow}>
            <Text style={[styles.contrastText, { color: theme.colors.textSecondary }]}>
              Contrast: <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{leftContrast}</Text>
            </Text>
            <View style={styles.btnRow}>
              <TouchableOpacity
                onPress={() => setLeftContrast(Math.max(50, leftContrast - 20))}
                style={[styles.adjustBtn, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>- 20</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLeftContrast(Math.min(255, leftContrast + 20))}
                style={[styles.adjustBtn, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>+ 20</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Right Lens Controls */}
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Right Lens (OD)</Text>
          <View style={styles.colorRow}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c.name}
                onPress={() => setRightColor(c.name)}
                style={[
                  styles.colorBtn,
                  {
                    backgroundColor: c.hex,
                    borderWidth: rightColor === c.name ? 3 : 1,
                    borderColor: rightColor === c.name ? '#FFFFFF' : 'transparent',
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.sliderRow}>
            <Text style={[styles.contrastText, { color: theme.colors.textSecondary }]}>
              Contrast: <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{rightContrast}</Text>
            </Text>
            <View style={styles.btnRow}>
              <TouchableOpacity
                onPress={() => setRightContrast(Math.max(50, rightContrast - 20))}
                style={[styles.adjustBtn, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>- 20</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRightContrast(Math.min(255, rightContrast + 20))}
                style={[styles.adjustBtn, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>+ 20</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Button
          title="Save Lens Settings"
          icon="✅"
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
  fusionTargetBox: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  targetHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  dualShapes: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 8,
  },
  targetSquare: {
    width: 60,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  targetHint: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 15,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  colorBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contrastText: {
    fontSize: 12,
    fontWeight: '600',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  adjustBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  adjustText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
