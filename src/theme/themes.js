// LazyEye Mobile Theme Definitions
// High-Contrast, WCAG AA Compliant Clinical & Therapy Presets

export const THEMES = {
  cyberCyan: {
    id: 'cyberCyan',
    name: 'Cyber Cyan (Dark Therapy)',
    description: 'High-contrast clinical dark mode with electric cyan accents',
    icon: 'flash-outline',
    isDark: true,
    statusBar: 'light-content',
    colors: {
      background: '#070C18',
      surface: '#0D1426',
      surfaceElevated: '#131D36',
      surfaceHighlight: '#1A2748',
      
      border: '#24345A',
      borderLight: '#32477A',
      cardBorder: 'rgba(255, 255, 255, 0.14)',
      buttonBorder: 'rgba(255, 255, 255, 0.22)',
      iconContainerBg: '#131D36',
      iconContainerBorder: 'rgba(255, 255, 255, 0.16)',
      selectedBorder: '#00E5FF',
      selectedBg: 'rgba(0, 229, 255, 0.14)',

      primary: '#00E5FF',
      primaryDark: '#00B4D8',
      primaryLight: '#E0F7FA',
      primaryGlow: 'rgba(0, 229, 255, 0.15)',

      accentRed: '#FF3366',
      accentCyan: '#00E5FF',
      accentBlue: '#3B82F6',

      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#06B6D4',

      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      textInverted: '#070C18',

      cardBg: '#0D1426',
      inputBg: '#090E1C',
      badgeBg: 'rgba(0, 229, 255, 0.12)',
    },
  },

  clinicalCrisp: {
    id: 'clinicalCrisp',
    name: 'Clinical Crisp (Light Clinic)',
    description: 'Clean, professional optometrist daytime clinic mode',
    icon: 'medical-outline',
    isDark: false,
    statusBar: 'dark-content',
    colors: {
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      surfaceHighlight: '#F1F5F9',

      border: '#CBD5E1',
      borderLight: '#E2E8F0',
      cardBorder: '#CBD5E1',
      buttonBorder: '#94A3B8',
      iconContainerBg: '#F1F5F9',
      iconContainerBorder: '#CBD5E1',
      selectedBorder: '#0284C7',
      selectedBg: 'rgba(2, 132, 199, 0.10)',

      primary: '#0284C7',
      primaryDark: '#0369A1',
      primaryLight: '#E0F2FE',
      primaryGlow: 'rgba(2, 132, 199, 0.12)',

      accentRed: '#DC2626',
      accentCyan: '#0284C7',
      accentBlue: '#2563EB',

      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      info: '#0284C7',

      text: '#0F172A',
      textSecondary: '#334155',
      textMuted: '#64748B',
      textInverted: '#FFFFFF',

      cardBg: '#FFFFFF',
      inputBg: '#F8FAFC',
      badgeBg: 'rgba(2, 132, 199, 0.10)',
    },
  },

  anaglyphDichoptic: {
    id: 'anaglyphDichoptic',
    name: 'Anaglyph 3D (Red & Cyan)',
    description: 'Dichoptic vision suppression therapy with chromatic separation',
    icon: 'glasses-outline',
    isDark: true,
    statusBar: 'light-content',
    colors: {
      background: '#09090F',
      surface: '#13131F',
      surfaceElevated: '#1A1A2B',
      surfaceHighlight: '#24243A',

      border: '#323250',
      borderLight: '#44446C',
      cardBorder: 'rgba(255, 255, 255, 0.16)',
      buttonBorder: 'rgba(255, 255, 255, 0.24)',
      iconContainerBg: '#1C1C2E',
      iconContainerBorder: 'rgba(255, 255, 255, 0.18)',
      selectedBorder: '#FF2A6D',
      selectedBg: 'rgba(255, 42, 109, 0.14)',

      primary: '#FF2A6D',
      primaryDark: '#D90429',
      primaryLight: '#FFE5EC',
      primaryGlow: 'rgba(255, 42, 109, 0.2)',

      accentRed: '#FF2A6D',
      accentCyan: '#05D9E8',
      accentBlue: '#005670',

      success: '#00F5D4',
      warning: '#FEE440',
      danger: '#FF0054',
      info: '#05D9E8',

      text: '#FFFFFF',
      textSecondary: '#D1D1E6',
      textMuted: '#9E9EB8',
      textInverted: '#09090F',

      cardBg: '#13131F',
      inputBg: '#0D0D16',
      badgeBg: 'rgba(255, 42, 109, 0.15)',
    },
  },

  emeraldComfort: {
    id: 'emeraldComfort',
    name: 'Emerald Wellness (Anti-Strain)',
    description: 'Soft botanical green tones designed to reduce eye strain',
    icon: 'leaf-outline',
    isDark: true,
    statusBar: 'light-content',
    colors: {
      background: '#05130E',
      surface: '#0B2219',
      surfaceElevated: '#113327',
      surfaceHighlight: '#184435',

      border: '#1E543F',
      borderLight: '#2C7357',
      cardBorder: 'rgba(255, 255, 255, 0.15)',
      buttonBorder: 'rgba(255, 255, 255, 0.22)',
      iconContainerBg: '#113327',
      iconContainerBorder: 'rgba(255, 255, 255, 0.16)',
      selectedBorder: '#10B981',
      selectedBg: 'rgba(16, 185, 129, 0.15)',

      primary: '#10B981',
      primaryDark: '#059669',
      primaryLight: '#D1FAE5',
      primaryGlow: 'rgba(16, 185, 129, 0.18)',

      accentRed: '#F43F5E',
      accentCyan: '#2DD4BF',
      accentBlue: '#38BDF8',

      success: '#10B981',
      warning: '#FBBF24',
      danger: '#EF4444',
      info: '#34D399',

      text: '#ECFDF5',
      textSecondary: '#A7F3D0',
      textMuted: '#6EE7B7',
      textInverted: '#05130E',

      cardBg: '#0B2219',
      inputBg: '#071812',
      badgeBg: 'rgba(16, 185, 129, 0.16)',
    },
  },
};

export const DEFAULT_THEME = 'cyberCyan';
