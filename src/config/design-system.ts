/**
 * HLN Design System — extracted from 12 existing marketing graphics
 */

export const BRAND = {
  name: 'Hidden Leaf Networks',
  primary: '#00D4FF',
  secondary: '#FFFFFF',
  background: '#0A0A1A',
  cardBg: '#1A3A4A',
  tagline: 'Applied AI & Advanced Digital Systems',
  url: 'hiddenleafnetworks.com',
} as const;

export const TYPOGRAPHY = {
  headline: 'Bold, clean sans-serif, high contrast white on dark',
  subheadline: 'Light/medium weight, slightly smaller',
  body: 'Light weight, high readability',
} as const;

export const MOTIFS = [
  'Detroit skyline (evening/night, city lights)',
  'Network nodes / particle connections / tech mesh',
  'Gradient mesh (teal to dark)',
  'Glass-morphism cards with slight blur',
  'Laptop/device mockups for product shots',
] as const;

export const LAYOUT_RULES = {
  logoPosition: 'top-left or centered',
  featureCards: '3-column icon + label, glass effect',
  footer: 'URL + optional GitHub link',
} as const;

/** Full design system object for external consumption */
export const DESIGN_SYSTEM = {
  brand: BRAND,
  typography: TYPOGRAPHY,
  motifs: MOTIFS,
  layoutRules: LAYOUT_RULES,
} as const;
