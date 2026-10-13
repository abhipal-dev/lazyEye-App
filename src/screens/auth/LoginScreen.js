import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/Button';
import BrandLogo from '../../components/BrandLogo';
import CustomIcon from '../../components/CustomIcon';

export default function LoginScreen({ onOpenThemeModal }) {
  const { theme } = useTheme();
  const { login, quickLogin, quickRoles, loading, authError } = useAuth();

  const [username, setUsername] = useState('dr_sarah');
  const [password, setPassword] = useState('doctor123');

  const handleCustomLogin = async () => {
    if (!username.trim()) return;
    await login(username.trim(), password);
  };

  const getRoleIconConfig = (roleKey) => {
    switch (roleKey) {
      case 'doctor':
        return { library: 'MaterialCommunityIcons', name: 'doctor', color: theme.colors.info };
      case 'patient':
      case 'user':
        return { library: 'Ionicons', name: 'eye-outline', color: theme.colors.primary };
      case 'admin':
        return { library: 'MaterialCommunityIcons', name: 'shield-account-outline', color: theme.colors.success };
      case 'root':
        return { library: 'Ionicons', name: 'shield-checkmark-outline', color: theme.colors.warning };
      default:
        return { library: 'Feather', name: 'user', color: theme.colors.primary };
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={theme.statusBar || 'light-content'}
        backgroundColor={theme.colors.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar with Clean Theme Switcher */}
        <View style={styles.topBar}>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
          >
            <View style={[styles.pulseDot, { backgroundColor: theme.colors.success }]} />
            <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
              Clinical Cloud Connected
            </Text>
          </View>

          <TouchableOpacity
            onPress={onOpenThemeModal}
            style={[
              styles.themeBtn,
              {
                backgroundColor: theme.colors.iconContainerBg,
                borderColor: theme.colors.iconContainerBorder,
              },
            ]}
            accessible={true}
            accessibilityLabel="Switch theme"
          >
            <CustomIcon
              library="Ionicons"
              name="color-palette-outline"
              size={18}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Brand Banner with Website Logo */}
        <View style={styles.brandContainer}>
          <BrandLogo size={76} variant="icon" />
          <Text style={[styles.brandTitle, { color: theme.colors.text }]}>
            LazyEye
          </Text>
          <Text style={[styles.brandTagline, { color: theme.colors.textSecondary }]}>
            Dichoptic Vision Therapy & Clinical Portals
          </Text>
        </View>

        {/* Clean Login Form Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.cardHeader, { color: theme.colors.text }]}>
            Sign In
          </Text>

          {authError && (
            <View
              style={[
                styles.errorBox,
                {
                  backgroundColor: `${theme.colors.danger}14`,
                  borderColor: theme.colors.danger,
                },
              ]}
            >
              <CustomIcon
                library="Feather"
                name="alert-circle"
                size={16}
                color={theme.colors.danger}
              />
              <Text style={[styles.errorText, { color: theme.colors.danger }]}>
                {authError}
              </Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="e.g. dr_sarah, admin, abhi8535"
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
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry
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
            title="Sign In to Portal"
            iconName="log-in"
            iconLibrary="Feather"
            onPress={handleCustomLogin}
            loading={loading}
            style={styles.submitBtn}
          />
        </View>

        {/* One-Tap Quick Role Tester Presets */}
        <View style={styles.quickSection}>
          <Text style={[styles.quickSectionTitle, { color: theme.colors.text }]}>
            Quick Role Switcher
          </Text>
          <Text style={[styles.quickSectionSub, { color: theme.colors.textSecondary }]}>
            Select a verified profile to test scoped permissions:
          </Text>

          <View style={styles.rolesList}>
            {quickRoles.map((roleItem) => {
              const iconCfg = getRoleIconConfig(roleItem.role);
              return (
                <TouchableOpacity
                  key={roleItem.role}
                  onPress={() => quickLogin(roleItem.role)}
                  activeOpacity={0.75}
                  style={[
                    styles.roleCard,
                    {
                      backgroundColor: theme.colors.cardBg,
                      borderColor: theme.colors.cardBorder,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.roleIconContainer,
                      {
                        backgroundColor: theme.colors.iconContainerBg,
                        borderColor: theme.colors.iconContainerBorder,
                      },
                    ]}
                  >
                    <CustomIcon
                      library={iconCfg.library}
                      name={iconCfg.name}
                      size={20}
                      color={iconCfg.color}
                    />
                  </View>

                  <View style={styles.roleCardText}>
                    <View style={styles.roleCardHeader}>
                      <Text style={[styles.roleCardTitle, { color: theme.colors.text }]}>
                        {roleItem.title}
                      </Text>
                      <Text style={[styles.roleBadge, { color: iconCfg.color }]}>
                        {roleItem.badge}
                      </Text>
                    </View>
                    <Text
                      style={[styles.roleCardDesc, { color: theme.colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {roleItem.scopeDescription}
                    </Text>
                  </View>

                  <CustomIcon
                    library="Feather"
                    name="chevron-right"
                    size={16}
                    color={theme.colors.textMuted}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 24,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  themeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 10,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  submitBtn: {
    marginTop: 6,
  },
  quickSection: {
    marginBottom: 10,
  },
  quickSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  quickSectionSub: {
    fontSize: 13,
    marginBottom: 12,
  },
  rolesList: {
    gap: 10,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  roleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCardText: {
    flex: 1,
    marginHorizontal: 12,
  },
  roleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  roleCardTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  roleBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  roleCardDesc: {
    fontSize: 12,
  },
});
