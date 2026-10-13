import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Button from '../../components/Button';
import CustomIcon from '../../components/CustomIcon';

export default function NewConsultationScreen({ patient, onClose, onLogged }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const [notes, setNotes] = useState('');
  const [compliance, setCompliance] = useState('Good');
  const [prescribedMinutes, setPrescribedMinutes] = useState(patient?.user_playing_time || '20');
  const [loading, setLoading] = useState(false);

  const complianceOptions = ['Excellent', 'Good', 'Moderate', 'Low'];

  const handleSave = async () => {
    if (!notes.trim()) {
      Alert.alert('Required', 'Please enter clinical evaluation remarks.');
      return;
    }

    setLoading(true);
    try {
      await api.logConsultation({
        doctorId: currentUser.id,
        patientId: patient.id,
        status: 'Prescribed',
        notes: notes.trim(),
        compliance,
        prescribedMinutes,
      });

      Alert.alert('Evaluation Saved', `Consultation report logged for ${patient.fullname}.`);
      if (onLogged) onLogged();
      onClose();
    } catch (e) {
      Alert.alert('Error', 'Failed to log consultation.');
    } finally {
      setLoading(false);
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
              name="file-text"
              size={18}
              color={theme.colors.text}
            />
          </View>
          <View>
            <Text style={[styles.topTitle, { color: theme.colors.text }]}>
              Clinical Evaluation
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
          accessibilityLabel="Cancel consultation"
        >
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Compliance Rating Selector */}
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
            Therapy Compliance Rating
          </Text>
          <View style={styles.complianceRow}>
            {complianceOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setCompliance(opt)}
                style={[
                  styles.compliancePill,
                  {
                    backgroundColor:
                      compliance === opt
                        ? theme.colors.primary
                        : theme.colors.iconContainerBg,
                    borderColor:
                      compliance === opt
                        ? theme.colors.primary
                        : theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.complianceText,
                    {
                      color:
                        compliance === opt
                          ? theme.colors.textInverted
                          : theme.colors.text,
                    },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Doctor Remarks Input */}
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
            Clinical Evaluation & Findings
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Stereoscopic fusion improving. Patient shows reduced suppression during Tetris gameplay. Maintain 20 min daily."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={[
              styles.textArea,
              {
                backgroundColor: theme.colors.inputBg,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
          />
        </View>

        {/* Prescribed Duration */}
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
            Recommended Daily Regimen (Minutes)
          </Text>
          <TextInput
            value={prescribedMinutes}
            onChangeText={setPrescribedMinutes}
            keyboardType="number-pad"
            placeholder="20"
            placeholderTextColor={theme.colors.textMuted}
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBg,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
          />
        </View>

        <Button
          title="Save Clinical Evaluation"
          iconName="check"
          iconLibrary="Feather"
          onPress={handleSave}
          loading={loading}
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
  complianceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  compliancePill: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  complianceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textArea: {
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    fontSize: 14,
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
});
