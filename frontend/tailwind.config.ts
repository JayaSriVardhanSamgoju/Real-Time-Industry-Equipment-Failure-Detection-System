/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#080C14',
          surface: '#0D1420',
          elevated: '#111827',
          border: '#1E2D40',
          'border-hover': '#2D4A6E',
        },
        cyan: {
          DEFAULT: '#00D4FF',
          dim: '#0088AA',
          glow: 'rgba(0,212,255,0.15)',
        },
        blue: {
          DEFAULT: '#3B82F6',
          dim: '#1D4ED8',
          glow: 'rgba(59,130,246,0.15)',
        },
        amber: {
          DEFAULT: '#F59E0B',
          dim: '#92400E',
          glow: 'rgba(245,158,11,0.15)',
        },
        red: {
          DEFAULT: '#EF4444',
          dim: '#7F1D1D',
          glow: 'rgba(239,68,68,0.20)',
        },
        green: {
          DEFAULT: '#10B981',
          dim: '#064E3B',
          glow: 'rgba(16,185,129,0.15)',
        },
        orange: {
          DEFAULT: '#F97316',
          dim: '#7C2D12',
          glow: 'rgba(249,115,22,0.15)',
        },
        text: {
          primary: '#E8EDF5',
          secondary: '#8B9CC8',
          muted: '#4A5568',
          accent: '#00D4FF',
        },
      },
      fontFamily: {
        display: ['JetBrains Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '8px',
        badge: '4px',
        panel: '12px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,212,255,0.12), 0 0 40px rgba(0,212,255,0.06)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.20), 0 0 40px rgba(245,158,11,0.10)',
        'glow-red': '0 0 24px rgba(239,68,68,0.30), 0 0 48px rgba(239,68,68,0.15)',
        'glow-green': '0 0 20px rgba(16,185,129,0.12), 0 0 40px rgba(16,185,129,0.06)',
        'glow-blue': '0 0 20px rgba(59,130,246,0.12), 0 0 40px rgba(59,130,246,0.06)',
        'card-default': '0 0 0 1px rgba(0,212,255,0.04)',
        'card-hover': '0 0 0 1px rgba(0,212,255,0.12), 0 4px 16px rgba(0,0,0,0.4)',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'vibrate-slow': 'vibrate 0.3s ease-in-out infinite',
        'vibrate-fast': 'vibrate 0.15s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(239,68,68,0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(239,68,68,0.6)' },
        },
        scanLine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        vibrate: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
};
