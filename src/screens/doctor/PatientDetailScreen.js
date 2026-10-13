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
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import Button from '../../components/Button';
import CustomIcon from '../../components/CustomIcon';

export default function PatientDetailScreen({ patient, onClose, onUpdated }) {
  const { theme } = useTheme();

  const [leftColor, setLeftColor] = useState(patient?.left_eye_color || 'red');
  const [rightColor, setRightColor] = useState(patient?.right_eye_color || 'blue');
  const [leftContrast, setLeftContrast] = useState(Number(patient?.left_eye_contrastvalue || 240));
  const [rightContrast, setRightContrast] = useState(Number(patient?.right_eye_contrastvalue || 220));
  const [goalMinutes, setGoalMinutes] = useState(patient?.user_playing_time || '20');
  const [saving, setSaving] = useState(false);

  const colorsList = [
    { name: 'red', hex: '#EF4444' },
    { name: 'blue', hex: '#0284C7' },
    { name: 'green', hex: '#10B981' },
    { name: 'cyan', hex: '#00E5FF' },
  ];

  const timesList = ['10', '15', '20', '25', '30'];

  const handleSave = async () => {
    setSaving(true);
    try {
      const leftHex = colorsList.find((c) => c.name === leftColor)?.hex || '#EF4444';
      const rightHex = colorsList.find((c) => c.name === rightColor)?.hex || '#0284C7';

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
              library="Feather"
              name="sliders"
              size={18}
              color={theme.colors.text}
            />
          </View>
          <View>
            <Text style={[styles.topTitle, { color: theme.colors.text }]}>
              Lens Calibration
            </Text>
            <Text style={[styles.topSub, { color: theme.colors.textSecondary }]}>
              {patient?.fullname}
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
          accessibilityLabel="Cancel"
        >
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dichoptic Fusion Preview */}
        <View
          style={[
            styles.previewCard,
            {
              backgroundColor: '#05070D',
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.previewHeader, { color: '#94A3B8' }]}>
            DICHOPTIC ANAGLYPH FUSION PREVIEW
          </Text>

          <View style={styles.fusionBox}>
            <View
              style={[
                styles.fusionObject,
                {
                  backgroundColor: colorsList.find((c) => c.name === leftColor)?.hex || '#EF4444',
                  opacity: leftContrast / 255,
                  transform: [{ rotate: '-8deg' }],
                },
              ]}
            >
              <Text style={styles.fusionLabel}>OS (Left)</Text>
            </View>

            <View
              style={[
                styles.fusionObject,
                {
                  backgroundColor: colorsList.find((c) => c.name === rightColor)?.hex || '#0284C7',
                  opacity: rightContrast / 255,
                  transform: [{ rotate: '8deg' }],
                },
              ]}
            >
              <Text style={styles.fusionLabel}>OD (Right)</Text>
            </View>
          </View>

          <Text style={[styles.previewHint, { color: '#94A3B8' }]}>
            Child fuses both chromatic streams into a single binocular percept
          </Text>
        </View>

        {/* Left Lens Configuration */}
        <View
          style={[
            styles.configCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.configTitle, { color: theme.colors.text }]}>
            Left Eye Filter (OS)
          </Text>

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Filter Color:</Text>
          <View style={styles.colorRow}>
            {colorsList.map((c) => (
              <TouchableOpacity
                key={c.name}
                onPress={() => setLeftColor(c.name)}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: c.hex,
                    borderColor:
                      leftColor === c.name
                        ? theme.colors.text
                        : theme.colors.iconContainerBorder,
                    borderWidth: leftColor === c.name ? 3 : 1,
                  },
                ]}
              >
                {leftColor === c.name && (
                  <CustomIcon
                    library="Feather"
                    name="check"
                    size={14}
                    color="#FFFFFF"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contrastRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Contrast:{' '}
              <Text style={{ color: theme.colors.text, fontWeight: '700' }}>
                {leftContrast} / 255
              </Text>
            </Text>
            <View style={styles.stepButtons}>
              <TouchableOpacity
                onPress={() => setLeftContrast(Math.max(50, leftContrast - 25))}
                style={[
                  styles.stepBtn,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text style={[styles.stepText, { color: theme.colors.text }]}>- 25</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLeftContrast(Math.min(255, leftContrast + 25))}
                style={[
                  styles.stepBtn,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text style={[styles.stepText, { color: theme.colors.text }]}>+ 25</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Right Lens Configuration */}
        <View
          style={[
            styles.configCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.configTitle, { color: theme.colors.text }]}>
            Right Eye Filter (OD)
          </Text>

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Filter Color:</Text>
          <View style={styles.colorRow}>
            {colorsList.map((c) => (
              <TouchableOpacity
                key={c.name}
                onPress={() => setRightColor(c.name)}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: c.hex,
                    borderColor:
                      rightColor === c.name
                        ? theme.colors.text
                        : theme.colors.iconContainerBorder,
                    borderWidth: rightColor === c.name ? 3 : 1,
                  },
                ]}
              >
                {rightColor === c.name && (
                  <CustomIcon
                    library="Feather"
                    name="check"
                    size={14}
                    color="#FFFFFF"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contrastRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Contrast:{' '}
              <Text style={{ color: theme.colors.text, fontWeight: '700' }}>
                {rightContrast} / 255
              </Text>
            </Text>
            <View style={styles.stepButtons}>
              <TouchableOpacity
                onPress={() => setRightContrast(Math.max(50, rightContrast - 25))}
                style={[
                  styles.stepBtn,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text style={[styles.stepText, { color: theme.colors.text }]}>- 25</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRightContrast(Math.min(255, rightContrast + 25))}
                style={[
                  styles.stepBtn,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text style={[styles.stepText, { color: theme.colors.text }]}>+ 25</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Daily Regimen Target Time */}
        <View
          style={[
            styles.configCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.configTitle, { color: theme.colors.text }]}>
            Prescribed Daily Regimen Target
          </Text>
          <View style={styles.timeRow}>
            {timesList.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setGoalMinutes(t)}
                style={[
                  styles.timeBtn,
                  {
                    backgroundColor:
                      goalMinutes === t
                        ? theme.colors.primary
                        : theme.colors.iconContainerBg,
                    borderColor:
                      goalMinutes === t
                        ? theme.colors.primary
                        : theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.timeText,
                    {
                      color:
                        goalMinutes === t
                          ? theme.colors.textInverted
                          : theme.colors.text,
                    },
                  ]}
                >
                  {t}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title="Save Clinical Prescription"
          iconName="check"
          iconLibrary="Feather"
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: 6 }}
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
  previewCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  previewHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  fusionBox: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  fusionObject: {
    width: 80,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fusionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  previewHint: {
    fontSize: 12,
    textAlign: 'center',
  },
  configCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  configTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  colorButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
