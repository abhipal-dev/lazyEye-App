import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import CustomIcon from '../../components/CustomIcon';

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
              name="user-check"
              size={18}
              color={theme.colors.text}
            />
          </View>
          <View>
            <Text style={[styles.topTitle, { color: theme.colors.text }]}>
              Applicant Approvals
            </Text>
            <Text style={[styles.topSub, { color: theme.colors.textSecondary }]}>
              Pending Patient Applications ({applicants.length})
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
          accessibilityLabel="Done"
        >
          <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {applicants.length === 0 ? (
          <View
            style={[
              styles.emptyBox,
              {
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            <View
              style={[
                styles.emptyIconWrap,
                {
                  backgroundColor: theme.colors.iconContainerBg,
                  borderColor: theme.colors.iconContainerBorder,
                },
              ]}
            >
              <CustomIcon
                library="Feather"
                name="check-circle"
                size={32}
                color={theme.colors.success}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Queue Clear
            </Text>
            <Text style={[styles.emptySub, { color: theme.colors.textSecondary }]}>
              All applicant registrations have been processed.
            </Text>
          </View>
        ) : (
          applicants.map((item) => (
            <View
              key={item.reg_id}
              style={[
                styles.applicantCard,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.cardBorder,
                },
              ]}
            >
              <View style={styles.appHeader}>
                <View
                  style={[
                    styles.avatarBox,
                    {
                      backgroundColor: theme.colors.iconContainerBg,
                      borderColor: theme.colors.iconContainerBorder,
                    },
                  ]}
                >
                  <CustomIcon
                    library="Feather"
                    name="user"
                    size={18}
                    color={theme.colors.text}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.appName, { color: theme.colors.text }]}>
                    {item.fullname}
                  </Text>
                  <Text style={[styles.appSub, { color: theme.colors.textSecondary }]}>
                    @{item.username} • {item.email}
                  </Text>
                </View>
                <View
                  style={[
                    styles.rolePill,
                    {
                      backgroundColor: theme.colors.iconContainerBg,
                      borderColor: theme.colors.iconContainerBorder,
                    },
                  ]}
                >
                  <Text style={[styles.roleText, { color: theme.colors.warning }]}>
                    Pending
                  </Text>
                </View>
              </View>

              <View style={[styles.actionRow, { borderTopColor: theme.colors.borderLight }]}>
                <TouchableOpacity
                  onPress={() => handleApprove(item.reg_id, item.fullname)}
                  activeOpacity={0.8}
                  style={[
                    styles.approveBtn,
                    {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.buttonBorder,
                    },
                  ]}
                >
                  <CustomIcon
                    library="Feather"
                    name="check"
                    size={16}
                    color={theme.colors.textInverted}
                  />
                  <Text style={[styles.approveText, { color: theme.colors.textInverted }]}>
                    Approve & Enroll Patient
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
  emptyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
  },
  applicantCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 15,
    fontWeight: '600',
  },
  appSub: {
    fontSize: 12,
    marginTop: 2,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  approveText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
