import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import CustomIcon from '../../components/CustomIcon';

export default function SettingsThemeModal({ visible, onClose }) {
  const {
    theme,
    themes,
    themeKey,
    changeTheme,
    useWebGames,
    toggleUseWebGames,
  } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.headRow}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Settings & Preferences
              </Text>
              <Text style={[styles.sub, { color: theme.colors.textSecondary }]}>
                Therapy Engines, Themes & Display
              </Text>
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
              accessibilityLabel="Close settings"
            >
              <CustomIcon
                library="Feather"
                name="x"
                size={16}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Game Engine Mode Toggler */}
            <View
              style={[
                styles.engineCard,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.cardBorder,
                },
              ]}
            >
              <View style={styles.engineHead}>
                <View
                  style={[
                    styles.engineIconWrap,
                    {
                      backgroundColor: theme.colors.iconContainerBg,
                      borderColor: theme.colors.iconContainerBorder,
                    },
                  ]}
                >
                  <CustomIcon
                    library="Ionicons"
                    name={useWebGames ? 'globe-outline' : 'phone-portrait-outline'}
                    size={20}
                    color={useWebGames ? theme.colors.info : theme.colors.primary}
                  />
                </View>
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  <View style={styles.engineTitleRow}>
                    <Text style={[styles.engineTitle, { color: theme.colors.text }]}>
                      {useWebGames ? 'Live Web Games Engine' : 'Offline Engine (Gestures)'}
                    </Text>
                    <View
                      style={[
                        styles.modeBadge,
                        {
                          backgroundColor: useWebGames
                            ? `${theme.colors.info}22`
                            : `${theme.colors.primary}22`,
                          borderColor: useWebGames
                            ? theme.colors.info
                            : theme.colors.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.modeBadgeText,
                          {
                            color: useWebGames
                              ? theme.colors.info
                              : theme.colors.primary,
                          },
                        ]}
                      >
                        {useWebGames ? 'WEB ONLINE' : 'LOCAL'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.engineDesc, { color: theme.colors.textSecondary }]}>
                    {useWebGames
                      ? 'Loads online clinical games from the web server inside WebView.'
                      : 'Uses calibrated offline engines with smooth swipe gestures and full screen.'}
                  </Text>
                </View>

                <Switch
                  value={useWebGames}
                  onValueChange={toggleUseWebGames}
                  trackColor={{
                    false: theme.colors.border,
                    true: theme.colors.primary,
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Themes Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                CLINICAL THEME & CONTRAST
              </Text>
            </View>

            {themes.map((t) => {
              const isSelected = themeKey === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => changeTheme(t.id)}
                  activeOpacity={0.8}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: t.colors.surface,
                      borderColor: isSelected
                        ? theme.colors.selectedBorder || theme.colors.primary
                        : theme.colors.cardBorder || theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  <View style={styles.themeHead}>
                    <View
                      style={[
                        styles.themeIconWrap,
                        {
                          backgroundColor: t.colors.iconContainerBg || t.colors.surfaceHighlight,
                          borderColor: t.colors.iconContainerBorder || t.colors.border,
                        },
                      ]}
                    >
                      <CustomIcon
                        library="Ionicons"
                        name={t.icon || 'color-palette-outline'}
                        size={18}
                        color={t.colors.primary}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.name, { color: t.colors.text }]}>
                        {t.name}
                      </Text>
                      <Text style={[styles.desc, { color: t.colors.textSecondary }]}>
                        {t.description}
                      </Text>
                    </View>

                    {isSelected && (
                      <View
                        style={[
                          styles.activeDot,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      >
                        <CustomIcon
                          library="Feather"
                          name="check"
                          size={12}
                          color={theme.colors.textInverted}
                        />
                      </View>
                    )}
                  </View>

                  {/* Contrast Swatches */}
                  <View style={styles.swatchRow}>
                    <View style={[styles.swatch, { backgroundColor: t.colors.background, borderColor: t.colors.cardBorder }]} />
                    <View style={[styles.swatch, { backgroundColor: t.colors.surface, borderColor: t.colors.cardBorder }]} />
                    <View style={[styles.swatch, { backgroundColor: t.colors.primary, borderColor: t.colors.cardBorder }]} />
                    <View style={[styles.swatch, { backgroundColor: t.colors.accentRed, borderColor: t.colors.cardBorder }]} />
                    <View style={[styles.swatch, { backgroundColor: t.colors.accentCyan, borderColor: t.colors.cardBorder }]} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.doneBtn,
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.buttonBorder,
              },
            ]}
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: '88%',
    padding: 20,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  sub: {
    fontSize: 12,
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
  scroll: {
    marginBottom: 16,
  },
  engineCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  engineHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engineIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  engineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  engineTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  modeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  modeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  engineDesc: {
    fontSize: 11,
    marginTop: 3,
    lineHeight: 15,
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  themeOption: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  themeHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  desc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  activeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  swatch: {
    flex: 1,
    height: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  doneBtn: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
