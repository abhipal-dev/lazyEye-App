import React, { useState } from 'react';
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
import { api } from '../../services/api';
import Button from '../../components/Button';
import CustomIcon from '../../components/CustomIcon';

export default function CalibrationScreen({ onClose }) {
  const { theme } = useTheme();
  const { currentUser, updateUserProfile } = useAuth();

  const [leftColor, setLeftColor] = useState(currentUser?.left_eye_color || 'red');
  const [rightColor, setRightColor] = useState(currentUser?.right_eye_color || 'blue');
  const [leftContrast, setLeftContrast] = useState(Number(currentUser?.left_eye_contrastvalue || 240));
  const [rightContrast, setRightContrast] = useState(Number(currentUser?.right_eye_contrastvalue || 220));
  const [saving, setSaving] = useState(false);

  const colors = [
    { name: 'red', hex: '#EF4444' },
    { name: 'blue', hex: '#0284C7' },
    { name: 'green', hex: '#10B981' },
    { name: 'cyan', hex: '#00E5FF' },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const leftHex = colors.find((c) => c.name === leftColor)?.hex || '#EF4444';
      const rightHex = colors.find((c) => c.name === rightColor)?.hex || '#0284C7';

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
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.topBarLeft}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <CustomIcon
              library="Ionicons"
              name="glasses-outline"
              size={18}
              color={theme.colors.text}
            />
          </View>
          <View>
            <Text style={[styles.topTitle, { color: theme.colors.text }]}>
              Lens Calibration
            </Text>
            <Text style={[styles.topSub, { color: theme.colors.textSecondary }]}>
              Anaglyph Dichoptic Separation
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={[
            styles.closeBtn,
            {
              backgroundColor: theme.colors.iconContainerBg,
              borderColor: theme.colors.iconContainerBorder,
            },
          ]}
          accessible={true}
          accessibilityLabel="Back to Home"
        >
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Visual Fusion Calibration Target */}
        <View
          style={[
            styles.fusionTargetBox,
            {
              backgroundColor: '#05070D',
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.targetHeader, { color: '#94A3B8' }]}>
            BINOCULAR SUPPRESSION TARGET
          </Text>

          <View style={styles.dualShapes}>
            <View
              style={[
                styles.targetSquare,
                {
                  backgroundColor: colors.find((c) => c.name === leftColor)?.hex || '#EF4444',
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
                  backgroundColor: colors.find((c) => c.name === rightColor)?.hex || '#0284C7',
                  opacity: rightContrast / 255,
                },
              ]}
            >
              <Text style={styles.squareText}>R</Text>
            </View>
          </View>

          <Text style={[styles.targetHint, { color: '#94A3B8' }]}>
            With Red-Cyan glasses on, calibrate until both letters appear equally clear.
          </Text>
        </View>

        {/* Left Lens Controls */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Left Eye Filter (OS)
          </Text>
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
                    borderColor:
                      leftColor === c.name
                        ? theme.colors.text
                        : theme.colors.iconContainerBorder,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.sliderRow}>
            <Text style={[styles.contrastText, { color: theme.colors.textSecondary }]}>
              Intensity:{' '}
              <Text style={{ color: theme.colors.text, fontWeight: '700' }}>
                {leftContrast}
              </Text>
            </Text>
            <View style={styles.btnRow}>
              <TouchableOpacity
                onPress={() => setLeftContrast(Math.max(50, leftContrast - 20))}
                style={[
                  styles.adjustBtn,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>- 20</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLeftContrast(Math.min(255, leftContrast + 20))}
                style={[
                  styles.adjustBtn,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>+ 20</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Right Lens Controls */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Right Eye Filter (OD)
          </Text>
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
                    borderColor:
                      rightColor === c.name
                        ? theme.colors.text
                        : theme.colors.iconContainerBorder,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.sliderRow}>
            <Text style={[styles.contrastText, { color: theme.colors.textSecondary }]}>
              Intensity:{' '}
              <Text style={{ color: theme.colors.text, fontWeight: '700' }}>
                {rightContrast}
              </Text>
            </Text>
            <View style={styles.btnRow}>
              <TouchableOpacity
                onPress={() => setRightContrast(Math.max(50, rightContrast - 20))}
                style={[
                  styles.adjustBtn,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>- 20</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRightContrast(Math.min(255, rightContrast + 20))}
                style={[
                  styles.adjustBtn,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text style={[styles.adjustText, { color: theme.colors.text }]}>+ 20</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Button
          title="Save Calibration"
          iconName="check"
          iconLibrary="Feather"
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: 8 }}
        />

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 14,
    paddingBottom: 12,
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
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  topSub: {
    fontSize: 11,
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  fusionTargetBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  targetHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  dualShapes: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 14,
  },
  targetSquare: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  targetHint: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  colorBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contrastText: {
    fontSize: 13,
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
    fontSize: 12,
    fontWeight: '600',
  },
});
