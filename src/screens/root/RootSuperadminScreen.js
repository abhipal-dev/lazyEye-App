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
import CustomIcon from '../../components/CustomIcon';

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
        subtitle="Master System Control"
        onThemePress={onOpenThemeModal}
        onProfilePress={onOpenProfile}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Root Authority Banner */}
        <View
          style={[
            styles.rootBanner,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View
            style={[
              styles.bannerIconWrap,
              {
                backgroundColor: `${theme.colors.warning}18`,
                borderColor: theme.colors.warning,
              },
            ]}
          >
            <CustomIcon
              library="Ionicons"
              name="shield-checkmark-outline"
              size={20}
              color={theme.colors.warning}
            />
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={[styles.rootTitle, { color: theme.colors.text }]}>
              Master Platform Authority
            </Text>
            <Text style={[styles.rootSub, { color: theme.colors.textSecondary }]}>
              Full permissions to manage clinic admins and system parameters.
            </Text>
          </View>
        </View>

        {/* Global Platform KPIs */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="System Admins"
            value={admins.length.toString()}
            subtitle="Platform managers"
            iconName="shield"
            iconLibrary="Feather"
            accentColor={theme.colors.warning}
            style={styles.metricItem}
          />
          <MetricCard
            title="Database State"
            value="Active"
            subtitle="Cloud + local cache"
            iconName="database"
            iconLibrary="Feather"
            accentColor={theme.colors.success}
            style={styles.metricItem}
          />
        </View>

        {/* Admin Provisioning Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Platform Administrators ({admins.length})
          </Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(!showAddModal)}
            style={[
              styles.addBtn,
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.buttonBorder,
              },
            ]}
          >
            <Text style={[styles.addBtnText, { color: theme.colors.textInverted }]}>
              {showAddModal ? 'Cancel' : '+ New Admin'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Admin Form */}
        {showAddModal && (
          <View
            style={[
              styles.formCard,
              {
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            <Text style={[styles.formTitle, { color: theme.colors.text }]}>
              Provision New Administrator
            </Text>

            <TextInput
              value={newFullname}
              onChangeText={setNewFullname}
              placeholder="Full Name (e.g. Dr. Rajesh Kumar)"
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

            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Username"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
            />

            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Email address"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
            />

            <View style={styles.rolePickerRow}>
              <TouchableOpacity
                onPress={() => setNewRole('admin')}
                style={[
                  styles.rolePickBtn,
                  {
                    backgroundColor:
                      newRole === 'admin'
                        ? theme.colors.primary
                        : theme.colors.iconContainerBg,
                    borderColor:
                      newRole === 'admin'
                        ? theme.colors.primary
                        : theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rolePickText,
                    {
                      color:
                        newRole === 'admin'
                          ? theme.colors.textInverted
                          : theme.colors.text,
                    },
                  ]}
                >
                  Clinic Admin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNewRole('root')}
                style={[
                  styles.rolePickBtn,
                  {
                    backgroundColor:
                      newRole === 'root'
                        ? theme.colors.warning
                        : theme.colors.iconContainerBg,
                    borderColor:
                      newRole === 'root'
                        ? theme.colors.warning
                        : theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rolePickText,
                    {
                      color:
                        newRole === 'root'
                          ? theme.colors.textInverted
                          : theme.colors.text,
                    },
                  ]}
                >
                  Superadmin
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Confirm Account Creation"
              iconName="check"
              iconLibrary="Feather"
              loading={creating}
              onPress={handleCreateAdmin}
              style={{ marginTop: 6 }}
            />
          </View>
        )}

        {/* Existing Admins List */}
        <View style={styles.adminsList}>
          {admins.map((adm) => (
            <View
              key={adm.id}
              style={[
                styles.adminCard,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.cardBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.adminIconBox,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <CustomIcon
                  library="Feather"
                  name={adm.accounttype === 'root' ? 'award' : 'shield'}
                  size={18}
                  color={adm.accounttype === 'root' ? theme.colors.warning : theme.colors.primary}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.adminName, { color: theme.colors.text }]}>
                  {adm.fullname}
                </Text>
                <Text style={[styles.adminSub, { color: theme.colors.textSecondary }]}>
                  @{adm.username} • {adm.email}
                </Text>
              </View>

              <View
                style={[
                  styles.roleBadge,
                  {
                    backgroundColor: theme.colors.iconContainerBg,
                    borderColor: theme.colors.iconContainerBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    {
                      color:
                        adm.accounttype === 'root'
                          ? theme.colors.warning
                          : theme.colors.primary,
                    },
                  ]}
                >
                  {adm.accounttype?.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
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
    paddingBottom: 36,
  },
  rootBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  bannerIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextCol: {
    flex: 1,
  },
  rootTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  rootSub: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  rolePickerRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  rolePickBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolePickText: {
    fontSize: 13,
    fontWeight: '600',
  },
  adminsList: {
    gap: 10,
  },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  adminIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminName: {
    fontSize: 14,
    fontWeight: '600',
  },
  adminSub: {
    fontSize: 12,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
