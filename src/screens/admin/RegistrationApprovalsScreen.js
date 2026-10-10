import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Button from '../../components/Button';

export default function RegistrationApprovalsScreen({ onClose, onApproved }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await api.fetchRegisters(currentUser);
      setApplicants(data || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (regId, fullname) => {
    try {
      await api.approveRegistration(regId);
      setApplicants((prev) => prev.filter((a) => a.reg_id !== regId));
      Alert.alert('Applicant Approved', `${fullname} has been enrolled as an active therapy patient.`);
      if (onApproved) onApproved();
    } catch (e) {
      Alert.alert('Error', 'Approval failed.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topIcon}>⏳</Text>
          <View>
            <Text style={[styles.topTitle, { color: theme.colors.text }]}>Applicant Queue</Text>
            <Text style={[styles.topSub, { color: theme.colors.textSecondary }]}>
              Pending Patient Registrations ({applicants.length})
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {applicants.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Queue Clear!</Text>
            <Text style={[styles.emptySub, { color: theme.colors.textSecondary }]}>
              All applicant registrations have been processed.
            </Text>
          </View>
        ) : (
          applicants.map((item) => (
            <View
              key={item.reg_id}
              style={[styles.applicantCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
            >
              <View style={styles.appHeader}>
                <Text style={styles.appEmoji}>📝</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.appName, { color: theme.colors.text }]}>{item.fullname}</Text>
                  <Text style={[styles.appSub, { color: theme.colors.textSecondary }]}>
                    @{item.username} • {item.email}
                  </Text>
                </View>
                <View style={[styles.rolePill, { backgroundColor: `${theme.colors.warning}18` }]}>
                  <Text style={[styles.roleText, { color: theme.colors.warning }]}>Pending User</Text>
                </View>
              </View>

              <View style={[styles.actionRow, { borderTopColor: theme.colors.borderLight }]}>
                <TouchableOpacity
                  onPress={() => handleApprove(item.reg_id, item.fullname)}
                  activeOpacity={0.8}
                  style={[styles.approveBtn, { backgroundColor: theme.colors.primary }]}
                >
                  <Text style={[styles.approveText, { color: theme.colors.textInverted }]}>
                    ✓ Approve & Enroll Patient
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
  emptyBox: {
    padding: 30,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 12,
    marginTop: 4,
  },
  applicantCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  appEmoji: {
    fontSize: 20,
  },
  appName: {
    fontSize: 15,
    fontWeight: '700',
  },
  appSub: {
    fontSize: 11.5,
    marginTop: 1,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  actionRow: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  approveBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  approveText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
