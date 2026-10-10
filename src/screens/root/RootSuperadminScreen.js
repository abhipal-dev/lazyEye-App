import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import HeaderBar from '../../components/HeaderBar';
import MetricCard from '../../components/MetricCard';
import Button from '../../components/Button';

export default function RootSuperadminScreen({
  onOpenThemeModal,
  onOpenProfile,
}) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFullname, setNewFullname] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [creating, setCreating] = useState(false);

  const loadAdmins = async () => {
    try {
      const data = await api.fetchAdmins(currentUser);
      setAdmins(data || []);
    } catch (e) {}
  };

  useEffect(() => {
    loadAdmins();
  }, [currentUser]);

  const handleCreateAdmin = async () => {
    if (!newUsername.trim() || !newFullname.trim()) {
      Alert.alert('Required', 'Please enter Full Name and Username.');
      return;
    }

    setCreating(true);
    try {
      await api.createAdmin({
        fullname: newFullname.trim(),
        username: newUsername.trim(),
        email: newEmail.trim() || `${newUsername.trim()}@lazyeye.org`,
        accounttype: newRole,
      });

      Alert.alert('Success', `${newRole.toUpperCase()} account created successfully.`);
      setNewFullname('');
      setNewUsername('');
      setNewEmail('');
      setShowAddModal(false);
      loadAdmins();
    } catch (e) {
      Alert.alert('Error', 'Failed to create account.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HeaderBar
        title="Superadmin Console"
        subtitle="Master Root Control"
        onThemePress={onOpenThemeModal}
        onProfilePress={onOpenProfile}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Root Authority Banner */}
        <View style={[styles.rootBanner, { backgroundColor: `${theme.colors.warning}18`, borderColor: theme.colors.warning }]}>
          <Text style={styles.rootIcon}>👑</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rootTitle, { color: theme.colors.warning }]}>
              Master Platform Authority (`root`)
            </Text>
            <Text style={[styles.rootSub, { color: theme.colors.textSecondary }]}>
              Exclusive permissions to manage system administrators, cloud synchronization, and platform health.
            </Text>
          </View>
        </View>

        {/* Global Platform KPIs */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="System Admins"
            value={admins.length.toString()}
            subtitle="Clinic managers"
            icon="🛡️"
            accentColor={theme.colors.warning}
            style={styles.metricItem}
          />
          <MetricCard
            title="Total Users"
            value="8 Active"
            subtitle="Across all roles"
            icon="👥"
            accentColor={theme.colors.primary}
            style={styles.metricItem}
          />
          <MetricCard
            title="Database Status"
            value="Healthy"
            subtitle="Clever Cloud + SQLite"
            icon="⚡"
            accentColor={theme.colors.success}
            style={styles.metricItem}
          />
          <MetricCard
            title="Therapy Sessions"
            value="42 Logs"
            subtitle="Normalized records"
            icon="🎮"
            accentColor={theme.colors.info}
            style={styles.metricItem}
          />
        </View>

        {/* Admin Provisioning Form Toggle */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Platform Administrators ({admins.length})
          </Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(!showAddModal)}
            style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={[styles.addBtnText, { color: theme.colors.textInverted }]}>
              {showAddModal ? '✕ Cancel' : '+ Provision Admin'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Admin Form */}
        {showAddModal && (
          <View style={[styles.formCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.primary }]}>
            <Text style={[styles.formTitle, { color: theme.colors.text }]}>
              Provision New Administrator Account
            </Text>

            <TextInput
              value={newFullname}
              onChangeText={setNewFullname}
              placeholder="Full Name (e.g. Dr. Rajesh Kumar)"
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderColor: theme.colors.border }]}
            />

            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Username"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderColor: theme.colors.border }]}
            />

            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Email address"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderColor: theme.colors.border }]}
            />

            <View style={styles.rolePickerRow}>
              <TouchableOpacity
                onPress={() => setNewRole('admin')}
                style={[
                  styles.rolePickBtn,
                  {
                    backgroundColor: newRole === 'admin' ? theme.colors.primary : theme.colors.inputBg,
                    borderColor: newRole === 'admin' ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.rolePickText, { color: newRole === 'admin' ? theme.colors.textInverted : theme.colors.text }]}>
                  Clinic Admin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNewRole('root')}
                style={[
                  styles.rolePickBtn,
                  {
                    backgroundColor: newRole === 'root' ? theme.colors.warning : theme.colors.inputBg,
                    borderColor: newRole === 'root' ? theme.colors.warning : theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.rolePickText, { color: newRole === 'root' ? '#000' : theme.colors.text }]}>
                  Root Superadmin
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Create Account"
              icon="🛡️"
              onPress={handleCreateAdmin}
              loading={creating}
              style={{ marginTop: 10 }}
            />
          </View>
        )}

        {/* Administrators List */}
        <View style={styles.adminList}>
          {admins.map((adm) => (
            <View
              key={adm.id}
              style={[styles.adminCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
            >
              <View style={styles.adminRow}>
                <Text style={styles.adminIcon}>
                  {adm.accounttype === 'root' ? '👑' : '🛡️'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.adminName, { color: theme.colors.text }]}>{adm.fullname}</Text>
                  <Text style={[styles.adminSub, { color: theme.colors.textSecondary }]}>
                    @{adm.username} • {adm.email}
                  </Text>
                </View>
                <View
                  style={[
                    styles.roleBadge,
                    {
                      backgroundColor: adm.accounttype === 'root' ? `${theme.colors.warning}18` : `${theme.colors.info}18`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleBadgeText,
                      {
                        color: adm.accounttype === 'root' ? theme.colors.warning : theme.colors.info,
                      },
                    ]}
                  >
                    {adm.accounttype.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  rootBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  rootIcon: {
    fontSize: 26,
  },
  rootTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  rootSub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  metricItem: {
    width: '48%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 16,
    gap: 10,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  rolePickerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rolePickBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  rolePickText: {
    fontSize: 12,
    fontWeight: '700',
  },
  adminList: {
    gap: 10,
  },
  adminCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  adminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  adminIcon: {
    fontSize: 22,
  },
  adminName: {
    fontSize: 15,
    fontWeight: '700',
  },
  adminSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
});

