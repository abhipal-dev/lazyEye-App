import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsThemeModal({ visible, onClose }) {
  const { theme, themes, themeKey, changeTheme } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.dialog, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.headRow}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                🎨 Choose Application Theme
              </Text>
              <Text style={[styles.sub, { color: theme.colors.textSecondary }]}>
                Clinical & Dichoptic Presets
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.closeText, { color: theme.colors.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {themes.map((t) => {
              const isSelected = themeKey === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => {
                    changeTheme(t.id);
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: t.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  <View style={styles.themeHead}>
                    <Text style={styles.icon}>{t.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.name, { color: t.colors.text }]}>{t.name}</Text>
                      <Text style={[styles.desc, { color: t.colors.textSecondary }]}>{t.description}</Text>
                    </View>
                    {isSelected && (
                      <View style={[styles.activeDot, { backgroundColor: theme.colors.primary }]}>
                        <Text style={[styles.activeDotText, { color: theme.colors.textInverted }]}>✓</Text>
                      </View>
                    )}
                  </View>

                  {/* Swatches preview */}
                  <View style={styles.swatchRow}>
                    <View style={[styles.swatch, { backgroundColor: t.colors.background }]} />
                    <View style={[styles.swatch, { backgroundColor: t.colors.surface }]} />
                    <View style={[styles.swatch, { backgroundColor: t.colors.primary }]} />
                    <View style={[styles.swatch, { backgroundColor: t.colors.accentRed }]} />
                    <View style={[styles.swatch, { backgroundColor: t.colors.accentCyan }]} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.doneBtn, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={[styles.doneBtnText, { color: theme.colors.textInverted }]}>
              Apply & Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  dialog: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  sub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scroll: {
    marginBottom: 14,
  },
  themeOption: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  themeHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  icon: {
    fontSize: 22,
  },
  name: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  desc: {
    fontSize: 11,
    marginTop: 2,
  },
  activeDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDotText: {
    fontSize: 12,
    fontWeight: '900',
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 6,
  },
  swatch: {
    flex: 1,
    height: 7,
    borderRadius: 3.5,
  },
  doneBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
