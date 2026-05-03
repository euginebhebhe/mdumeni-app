// src/constants/theme.ts
// MDUMENI brand design tokens — matches approved v2 Canva design exactly
// All colours referenced from the demo app v2 and pitch deck

export const Colors = {
  // ── Brand ───────────────────────────────────────────────
  green900: '#0A1F0F',
  green800: '#0E2E15',
  green700: '#1A4A22',
  green600: '#1A5C2A',   // primary brand green
  green500: '#237533',
  green400: '#2D9142',
  green300: '#5BB870',
  green200: '#A0D9AC',
  green100: '#D4EDD9',
  green050: '#EEF8F0',

  amber700: '#B36800',
  amber600: '#CC7A00',
  amber500: '#EF9F27',   // primary brand amber
  amber400: '#F5B84A',
  amber100: '#FEF3DC',

  red500:   '#DC3545',
  red100:   '#FDEAEA',

  blue500:  '#2563EB',
  blue100:  '#EFF6FF',

  purple500: '#4A3585',
  purple100: '#F3E8FF',

  // ── Neutrals ─────────────────────────────────────────────
  slate900:  '#0F1A12',
  slate800:  '#1C2B20',
  slate700:  '#2A3D2E',
  slate600:  '#3B5040',
  slate400:  '#607868',
  slate300:  '#8A9F90',
  slate200:  '#B8C9BC',
  slate100:  '#E0E9E2',
  slate050:  '#F4F7F5',
  white:     '#FFFFFF',

  // ── Semantic aliases ──────────────────────────────────────
  primary:       '#1A5C2A',
  primaryLight:  '#EEF8F0',
  accent:        '#EF9F27',
  accentLight:   '#FEF3DC',
  danger:        '#DC3545',
  dangerLight:   '#FDEAEA',
  success:       '#2D9142',
  successLight:  '#D4EDD9',
  info:          '#2563EB',
  infoLight:     '#EFF6FF',
  background:    '#F4F7F5',
  surface:       '#FFFFFF',
  border:        '#E0E9E2',
  borderStrong:  '#B8C9BC',
  text:          '#0F1A12',
  textSecondary: '#607868',
  textTertiary:  '#8A9F90',
} as const;

export const Typography = {
  // Font families
  fontFamily: {
    sans:  'System',   // will be replaced with Outfit when font loads
    mono:  'SpaceMono',
  },

  // Font sizes
  fontSize: {
    xs:   10,
    sm:   12,
    base: 14,
    md:   16,
    lg:   18,
    xl:   20,
    '2xl': 22,
    '3xl': 26,
    '4xl': 32,
    '5xl': 38,
  },

  // Font weights (React Native uses string values)
  fontWeight: {
    normal:    '400' as const,
    medium:    '500' as const,
    semibold:  '600' as const,
    bold:      '700' as const,
    extrabold: '800' as const,
  },

  lineHeight: {
    tight:  1.15,
    normal: 1.45,
    relaxed: 1.6,
  },
} as const;

export const Spacing = {
  0:    0,
  1:    4,
  2:    8,
  3:    12,
  4:    16,
  5:    20,
  6:    24,
  8:    32,
  10:   40,
  12:   48,
  16:   64,
} as const;

export const BorderRadius = {
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  '2xl': 28,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

// Tab bar height — accounts for safe area
export const Layout = {
  tabBarHeight:     60,
  headerHeight:     88,   // status bar + app header
  screenPaddingH:   16,
  screenPaddingV:   16,
} as const;
