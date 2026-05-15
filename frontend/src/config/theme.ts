export const theme = {
  colors: {
    bg: {
      base: '#080C14',
      surface: '#0D1420',
      elevated: '#111827',
      border: '#1E2D40',
      borderHover: '#2D4A6E',
    },
    cyan: { DEFAULT: '#00D4FF', dim: '#0088AA', glow: 'rgba(0,212,255,0.15)' },
    blue: { DEFAULT: '#3B82F6', dim: '#1D4ED8', glow: 'rgba(59,130,246,0.15)' },
    amber: { DEFAULT: '#F59E0B', dim: '#92400E', glow: 'rgba(245,158,11,0.15)' },
    red: { DEFAULT: '#EF4444', dim: '#7F1D1D', glow: 'rgba(239,68,68,0.20)' },
    green: { DEFAULT: '#10B981', dim: '#064E3B', glow: 'rgba(16,185,129,0.15)' },
    orange: { DEFAULT: '#F97316', dim: '#7C2D12', glow: 'rgba(249,115,22,0.15)' },
    text: {
      primary: '#E8EDF5',
      secondary: '#8B9CC8',
      muted: '#4A5568',
      accent: '#00D4FF',
    },
  },
  spacing: {
    borderRadius: { card: '8px', badge: '4px', panel: '12px' },
  },
  glass: {
    background: 'rgba(13,20,32,0.8)',
    backdropFilter: 'blur(12px)',
  },
  glowShadows: {
    cyan: '0 0 20px rgba(0,212,255,0.12), 0 0 40px rgba(0,212,255,0.06)',
    amber: '0 0 20px rgba(245,158,11,0.20), 0 0 40px rgba(245,158,11,0.10)',
    red: '0 0 24px rgba(239,68,68,0.30), 0 0 48px rgba(239,68,68,0.15)',
    green: '0 0 20px rgba(16,185,129,0.12), 0 0 40px rgba(16,185,129,0.06)',
  },
} as const;
