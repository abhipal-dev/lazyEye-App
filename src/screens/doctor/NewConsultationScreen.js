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
      <View style={[styles.topBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topIcon}>📝</Text>
          <View>
            <Text style={[styles.topTitle, { color: theme.colors.text }]}>New Clinical Consultation</Text>
            <Text style={[styles.topSub, { color: theme.colors.textSecondary }]}>{patient?.fullname}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Compliance Rating Selector */}
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Therapy Compliance Assessment
          </Text>
          <View style={styles.complianceRow}>
            {complianceOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setCompliance(opt)}
                style={[
                  styles.compliancePill,
                  {
                    backgroundColor: compliance === opt ? theme.colors.primary : theme.colors.inputBg,
                    borderColor: compliance === opt ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.complianceText,
                    { color: compliance === opt ? theme.colors.textInverted : theme.colors.text },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Doctor Remarks Input */}
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Clinical Evaluation & Suppression Remarks
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Patient shows 35% suppression reduction. Stereoscopic depth perception improving. Maintain daily 20 min session."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            numberOfLines={5}
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
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
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
          title="Submit Clinical Evaluation"
          icon="✅"
          onPress={handleSave}
          loading={loading}
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 16,
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
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  complianceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  compliancePill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  complianceText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textArea: {
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
  },
});

