// LazyEye Mobile Theme Definitions
// Simplified Clinical & Native Presets

export const THEMES = {
  calmDark: {
    id: 'calmDark',
    name: 'Calm Dark (Night Therapy)',
    description: 'Clean slate dark mode with soft clinical blue accents',
    icon: 'moon-outline',
    isDark: true,
    statusBar: 'light-content',
    colors: {
      background: '#0B1120',
      surface: '#111827',
      surfaceElevated: '#1E293B',
      surfaceHighlight: '#334155',
      
      border: '#1E293B',
      borderLight: '#334155',
      cardBorder: '#334155',
      buttonBorder: '#475569',
      iconContainerBg: '#1E293B',
      iconContainerBorder: '#334155',
      selectedBorder: '#2563EB',
      selectedBg: 'rgba(37, 99, 235, 0.12)',

      primary: '#2563EB',
      primaryDark: '#1D4ED8',
      primaryLight: '#DBEAFE',
      primaryGlow: 'transparent',

      accentRed: '#EF4444',
      accentCyan: '#0284C7',
      accentBlue: '#3B82F6',

      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#0284C7',

      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      textInverted: '#0B1120',

      cardBg: '#111827',
      inputBg: '#0B1120',
      badgeBg: 'rgba(37, 99, 235, 0.10)',
    },
  },

  clinicalCrisp: {
    id: 'clinicalCrisp',
    name: 'Clinical Light (Daytime Clinic)',
    description: 'Clean optometrist daytime clinic mode',
    icon: 'sunny-outline',
    isDark: false,
    statusBar: 'dark-content',
    colors: {
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      surfaceHighlight: '#F1F5F9',

      border: '#E2E8F0',
      borderLight: '#F1F5F9',
      cardBorder: '#E2E8F0',
      buttonBorder: '#CBD5E1',
      iconContainerBg: '#F1F5F9',
      iconContainerBorder: '#E2E8F0',
      selectedBorder: '#0284C7',
      selectedBg: 'rgba(2, 132, 199, 0.08)',

      primary: '#0284C7',
      primaryDark: '#0369A1',
      primaryLight: '#E0F2FE',
      primaryGlow: 'transparent',

      accentRed: '#DC2626',
      accentCyan: '#0284C7',
      accentBlue: '#2563EB',

      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      info: '#0284C7',

      text: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#64748B',
      textInverted: '#FFFFFF',

      cardBg: '#FFFFFF',
      inputBg: '#F8FAFC',
      badgeBg: 'rgba(2, 132, 199, 0.08)',
    },
  },
};

// Backwards-compatibility aliases for stored preferences
THEMES.cyberCyan = THEMES.calmDark;
THEMES.anaglyphDichoptic = THEMES.calmDark;
THEMES.emeraldComfort = THEMES.calmDark;

export const DEFAULT_THEME = 'calmDark';
