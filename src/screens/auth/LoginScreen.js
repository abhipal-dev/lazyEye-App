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

export default function LoginScreen({ onOpenThemeModal }) {
  const { theme } = useTheme();
  const { login, quickLogin, quickRoles, loading, authError } = useAuth();

  const [username, setUsername] = useState('dr_sarah');
  const [password, setPassword] = useState('doctor123');

  const handleCustomLogin = async () => {
    if (!username.trim()) return;
    await login(username.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar with Theme Toggle */}
        <View style={styles.topBar}>
          <View style={[styles.cloudBadge, { backgroundColor: theme.colors.badgeBg, borderColor: theme.colors.border }]}>
            <View style={[styles.pulseDot, { backgroundColor: theme.colors.success }]} />
            <Text style={[styles.cloudText, { color: theme.colors.primary }]}>
              Render Cloud • Paris MySQL
            </Text>
          </View>

          <TouchableOpacity
            onPress={onOpenThemeModal}
            style={[styles.themeBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <Text style={styles.themeBtnText}>🎨 Theme</Text>
          </TouchableOpacity>
        </View>

        {/* Brand Banner */}
        <View style={styles.brandContainer}>
          <View style={[styles.brandIconWrap, { backgroundColor: theme.colors.primaryGlow }]}>
            <Text style={styles.brandIcon}>👁️</Text>
          </View>
          <Text style={[styles.brandTitle, { color: theme.colors.text }]}>LazyEye</Text>
          <Text style={[styles.brandTagline, { color: theme.colors.textSecondary }]}>
            Digital Dichoptic Vision Therapy Platform
          </Text>
          <Text style={[styles.brandSub, { color: theme.colors.textMuted }]}>
            Amblyopia rehabilitation • Scoped clinical portals • Anaglyph gaming
          </Text>
        </View>

        {/* Custom Login Form */}
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardHeader, { color: theme.colors.text }]}>
            Sign In with Account
          </Text>

          {authError && (
            <View style={[styles.errorBox, { backgroundColor: `${theme.colors.danger}18`, borderColor: theme.colors.danger }]}>
              <Text style={[styles.errorText, { color: theme.colors.danger }]}>{authError}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Username</Text>
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
            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Password</Text>
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
            title="Authenticate & Enter"
            icon="🔒"
            onPress={handleCustomLogin}
            loading={loading}
            style={styles.submitBtn}
          />
        </View>

        {/* 1-Tap Quick Role Tester Presets */}
        <View style={styles.quickSection}>
          <View style={styles.quickHeaderRow}>
            <Text style={[styles.quickTitle, { color: theme.colors.text }]}>
              🧪 One-Tap Quick Role Switcher
            </Text>
            <Text style={[styles.quickBadge, { color: theme.colors.primary, backgroundColor: theme.colors.badgeBg }]}>
              Instant Access
            </Text>
          </View>
          <Text style={[styles.quickSubtitle, { color: theme.colors.textSecondary }]}>
            Tap any role to immediately test distinct dashboards and scoped data:
          </Text>

          <View style={styles.rolesGrid}>
            {quickRoles.map((roleItem) => (
              <TouchableOpacity
                key={roleItem.role}
                onPress={() => quickLogin(roleItem.role)}
                activeOpacity={0.7}
                style={[
                  styles.roleCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <View style={styles.roleCardTop}>
                  <Text style={styles.roleIcon}>{roleItem.icon}</Text>
                  <View style={styles.roleNameCol}>
                    <Text style={[styles.roleTitle, { color: theme.colors.text }]}>
                      {roleItem.title}
                    </Text>
                    <Text style={[styles.roleBadge, { color: theme.colors.primary }]}>
                      {roleItem.badge}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.roleDesc, { color: theme.colors.textMuted }]}>
                  {roleItem.scopeDescription}
                </Text>

                <View style={[styles.credPill, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}>
                  <Text style={[styles.credText, { color: theme.colors.textSecondary }]}>
                    User: <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{roleItem.username}</Text>
                    {'  •  '}
                    Pass: <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{roleItem.password}</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 16 : 45,
    paddingBottom: 50,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cloudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  cloudText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  themeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  themeBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandIcon: {
    fontSize: 34,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  brandSub: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 290,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  errorBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
  },
  submitBtn: {
    marginTop: 6,
  },
  quickSection: {
    marginTop: 6,
  },
  quickHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  quickBadge: {
    fontSize: 10.5,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  quickSubtitle: {
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 17,
  },
  rolesGrid: {
    gap: 12,
  },
  roleCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  roleCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },
  roleIcon: {
    fontSize: 24,
  },
  roleNameCol: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  roleBadge: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  roleDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 10,
  },
  credPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  credText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

