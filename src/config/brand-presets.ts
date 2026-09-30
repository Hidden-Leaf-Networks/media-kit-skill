/**
 * Brand Presets — HLN venture brand identities.
 *
 * Usage:
 *   generator.generate({ brand: 'moplay', template: 'scene-composition', ... });
 *
 * Each preset overrides the design system colors, tagline, and URL
 * so all prompts are style-locked to the correct venture identity.
 */

/** Available brand presets */
export type BrandPreset = 'hln' | 'moplay' | 'emlink' | 'snowchild' | 'aria' | 'scroll' | 'axis-bank' | 'star-chasers' | 'dojo';

export interface BrandConfig {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  cardBg: string;
  tagline: string;
  url: string;
  motifs: string[];
}

/** All HLN venture brand configurations */
export const BRAND_PRESETS: Record<BrandPreset, BrandConfig> = {
  hln: {
    name: 'Hidden Leaf Networks',
    primary: '#00D4FF',
    secondary: '#FFFFFF',
    background: '#0A0A1A',
    cardBg: '#1A3A4A',
    tagline: 'Building the future from Detroit',
    url: 'hiddenleafnetworks.com',
    motifs: [
      'Detroit skyline (evening/night, city lights)',
      'Network nodes / particle connections / tech mesh',
      'Gradient mesh (teal to dark)',
      'Glass-morphism cards with slight blur',
      'Leaf/foliage subtle accents',
    ],
  },

  moplay: {
    name: 'MoPlay',
    primary: '#FFC640',
    secondary: '#FFFFFF',
    background: '#0B0B0E',
    cardBg: '#1A1A0E',
    tagline: 'The Future of Black Music Ownership',
    url: 'moplay.io',
    motifs: [
      'Gold vinyl record with circuit-trace patterns',
      'Detroit skyline at night with gold glow',
      'Sound wave visualizations in gold',
      'Glass-morphism cards with gold (#FFC640) glow shadows',
      'Musical note particles and gold energy effects',
    ],
  },

  emlink: {
    name: 'EmLink',
    primary: '#00D4FF',
    secondary: '#FFFFFF',
    background: '#0A0A1A',
    cardBg: '#1A3A4A',
    tagline: 'Scan. Verify. Transact.',
    url: 'hiddenleafnetworks.com',
    motifs: [
      'QR codes and digital identity credentials',
      'Cyberpunk Detroit skyline with beacon towers',
      'Holographic phone displays and verification stations',
      'Cyan network pulse rings and node connections',
      'Cardano geometric patterns and shield motifs',
    ],
  },

  snowchild: {
    name: 'Snowchild',
    primary: '#C0E8FF',
    secondary: '#FFFFFF',
    background: '#070A12',
    cardBg: '#0F1A2E',
    tagline: 'Cold Logic. Warm Purpose.',
    url: 'hiddenleafnetworks.com',
    motifs: [
      'Frost crystalline structures with inner glow',
      'Arctic aurora borealis with circuit patterns',
      'Ice-blue particle effects and cold vapor',
      'Snowflake geometry merged with tech nodes',
      'Dark winter sky with starfield data points',
    ],
  },

  aria: {
    name: 'ARIA',
    primary: '#00BFA5',
    secondary: '#FFFFFF',
    background: '#070A0F',
    cardBg: '#0F2A2A',
    tagline: 'Your AI Navigator',
    url: 'hiddenleafnetworks.com',
    motifs: [
      'HUD interface elements and data overlays',
      'Teal holographic displays',
      'Neural network visualization',
      'Companion AI presence (warm, loyal energy)',
      'Navigation waypoints and compass geometry',
    ],
  },

  scroll: {
    name: 'Scroll',
    primary: '#8B5CF6',
    secondary: '#FFFFFF',
    background: '#0A0A1A',
    cardBg: '#1A1A3A',
    tagline: 'Your LLM Harness',
    url: 'hiddenleafnetworks.com',
    motifs: [
      'Ancient scroll unfurling with glowing text',
      'Purple energy streams and data flow',
      'Terminal/CLI aesthetic with purple accents',
      'Multi-provider routing visualization',
      'Katana blade motif (Benihime, Senbonzakura)',
    ],
  },

  'axis-bank': {
    name: 'Axis Village Bank',
    primary: '#FFD600',
    secondary: '#FFFFFF',
    background: '#0A0F0A',
    cardBg: '#1A2A1A',
    tagline: 'Sovereign Finance',
    url: 'hiddenleafnetworks.com',
    motifs: [
      'Gold currency streams and financial data',
      'Trading chart visualizations',
      'Constellation of agent nodes',
      'Vault/treasury architectural elements',
      'Gold-green iridescent energy',
    ],
  },

  'star-chasers': {
    name: 'Star Chasers',
    primary: '#FFD600',
    secondary: '#00BFA5',
    background: '#0A0A00',
    cardBg: '#1A1A0A',
    tagline: 'Navigate the Markets',
    url: 'hiddenleafnetworks.com',
    motifs: [
      'Star constellation patterns as trading signals',
      'Gold and teal trading dashboard elements',
      'Navigator agents as celestial bodies',
      'Equity curves rendered as star trails',
      'Solar energy motifs (storm element)',
    ],
  },

  dojo: {
    name: 'Machine Dojo',
    primary: '#FF6B35',
    secondary: '#FFFFFF',
    background: '#0A0500',
    cardBg: '#1A1000',
    tagline: 'Industrial Intelligence',
    url: 'hiddenleafnetworks.com',
    motifs: [
      'Industrial machinery and sensor arrays',
      'Forge/workshop environment with orange glow',
      'Vibration waveforms and frequency analysis',
      'Bandsaw blade cutting metal (sparks)',
      'Ember-orange data streams from IoT sensors',
    ],
  },
};

/**
 * Apply a brand preset to the environment.
 * This updates process.env so that BRAND (design-system.ts) picks up the values.
 */
export function applyBrandPreset(preset: BrandPreset): BrandConfig {
  const config = BRAND_PRESETS[preset];
  if (!config) {
    throw new Error(`Unknown brand preset: ${preset}. Available: ${Object.keys(BRAND_PRESETS).join(', ')}`);
  }

  process.env.BRAND_NAME = config.name;
  process.env.BRAND_PRIMARY_COLOR = config.primary;
  process.env.BRAND_BACKGROUND = config.background;
  process.env.BRAND_TAGLINE = config.tagline;
  process.env.BRAND_URL = config.url;

  return config;
}

/**
 * Get a brand preset config without applying it.
 */
export function getBrandPreset(preset: BrandPreset): BrandConfig {
  const config = BRAND_PRESETS[preset];
  if (!config) {
    throw new Error(`Unknown brand preset: ${preset}. Available: ${Object.keys(BRAND_PRESETS).join(', ')}`);
  }
  return config;
}

/** Get all available brand preset names */
export function getAllBrandPresets(): BrandPreset[] {
  return Object.keys(BRAND_PRESETS) as BrandPreset[];
}
