// LazyEye Mobile Theme Definitions
// 4 Distinct Clinical & Therapy Presets

export const THEMES = {
  cyberCyan: {
    id: 'cyberCyan',
    name: 'Cyber Cyan (Dark Therapy)',
    description: 'High-contrast clinical dark mode with electric cyan accents',
    icon: '⚡',
    statusBar: 'light-content',
    colors: {
      background: '#070C18',
      surface: '#0D1426',
      surfaceElevated: '#131D36',
      surfaceHighlight: '#1A2748',
      border: '#1C2A4D',
      borderLight: '#283B6C',
      
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
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      textInverted: '#070C18',
      
      cardBg: '#0D1426',
      inputBg: '#080E1C',
      badgeBg: 'rgba(0, 229, 255, 0.12)',
    },
  },

  clinicalCrisp: {
    id: 'clinicalCrisp',
    name: 'Clinical Crisp (Light Clinic)',
    description: 'Clean, professional optometrist hospital daytime mode',
    icon: '🏥',
    statusBar: 'dark-content',
    colors: {
      background: '#F1F5F9',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      surfaceHighlight: '#E2E8F0',
      border: '#CBD5E1',
      borderLight: '#E2E8F0',
      
      primary: '#0284C7',
      primaryDark: '#0369A1',
      primaryLight: '#E0F2FE',
      primaryGlow: 'rgba(2, 132, 199, 0.12)',
      
      accentRed: '#E11D48',
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
      badgeBg: 'rgba(2, 132, 199, 0.12)',
    },
  },

  anaglyphDichoptic: {
    id: 'anaglyphDichoptic',
    name: 'Anaglyph 3D (Red & Cyan)',
    description: 'Dichoptic vision suppression therapy with chromatic separation',
    icon: '🕶️',
    statusBar: 'light-content',
    colors: {
      background: '#0A0A10',
      surface: '#12121E',
      surfaceElevated: '#1A1A2E',
      surfaceHighlight: '#24243E',
      border: '#2E2E4A',
      borderLight: '#3E3E64',
      
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
      textSecondary: '#B8B8D1',
      textMuted: '#7D7D9C',
      textInverted: '#0A0A10',
      
      cardBg: '#12121E',
      inputBg: '#0E0E18',
      badgeBg: 'rgba(255, 42, 109, 0.15)',
    },
  },

  emeraldComfort: {
    id: 'emeraldComfort',
    name: 'Emerald Wellness (Anti-Strain)',
    description: 'Soft botanical green tones designed to reduce eye strain',
    icon: '🌿',
    statusBar: 'light-content',
    colors: {
      background: '#041510',
      surface: '#0A251C',
      surfaceElevated: '#10372A',
      surfaceHighlight: '#164837',
      border: '#1B5440',
      borderLight: '#286E55',
      
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
      textInverted: '#041510',
      
      cardBg: '#0A251C',
      inputBg: '#061D15',
      badgeBg: 'rgba(16, 185, 129, 0.16)',
    },
  },
};

export const DEFAULT_THEME = 'cyberCyan';

