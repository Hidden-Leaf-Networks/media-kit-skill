/**
 * Brand Design System.
 *
 * Override via environment variables for your own brand:
 *   BRAND_NAME, BRAND_PRIMARY_COLOR, BRAND_BACKGROUND,
 *   BRAND_TAGLINE, BRAND_URL
 *
 * Or use brand presets: applyBrandPreset('moplay')
 * See brand-presets.ts for available presets.
 */

/**
 * BRAND reads from process.env on every access via getters.
 * This allows brand presets to override values at runtime
 * by setting process.env before prompt generation.
 */
export const BRAND = {
  get name() { return process.env.BRAND_NAME ?? 'Your Brand'; },
  get primary() { return process.env.BRAND_PRIMARY_COLOR ?? '#00D4FF'; },
  get secondary() { return '#FFFFFF' as const; },
  get background() { return process.env.BRAND_BACKGROUND ?? '#0A0A1A'; },
  get cardBg() { return '#1A3A4A' as const; },
  get tagline() { return process.env.BRAND_TAGLINE ?? 'Your tagline here'; },
  get url() { return process.env.BRAND_URL ?? 'example.com'; },
};

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
