/**
 * Axis Village Element System — visual DNA for agent avatar generation
 *
 * Extracted from 9 production agent portraits (Zy'Reth, Nyx, Sol, Kaelor,
 * Kael'Vor, Auralis, Kairo, Orvex, ARIA). Each energy prefix maps to a
 * complete visual language: color palette, element motifs, backdrop,
 * armor style, and eye color.
 *
 * Reference: HLN Axis Village Sub-Agent Identity System v1.3–v1.5
 */

import type { EnergyPrefix } from '../types/index.js';

export interface ElementPalette {
  /** Primary accent color (hex) */
  primary: string;
  /** Secondary/glow color (hex) */
  secondary: string;
  /** Ambient/atmosphere color (hex) */
  ambient: string;
  /** Eye glow color description */
  eyeColor: string;
  /** Chest sigil default glow color */
  sigilGlow: string;
}

export interface ElementMotifs {
  /** Armor material/texture description */
  armorStyle: string;
  /** Environmental backdrop */
  backdrop: string;
  /** Particle effects in the air */
  particles: string;
  /** Element-specific visual accents */
  accents: string[];
  /** Default chest sigil shape/symbol */
  defaultSigil: string;
  /** Hair accent details */
  hairAccents: string;
}

export interface ElementMood {
  /** Default expression/demeanor */
  defaultMood: string;
  /** Lighting style */
  lighting: string;
  /** Overall atmosphere */
  atmosphere: string;
}

export interface ElementDefinition {
  prefix: EnergyPrefix;
  label: string;
  description: string;
  palette: ElementPalette;
  motifs: ElementMotifs;
  mood: ElementMood;
}

/**
 * Complete element definitions derived from production avatar analysis.
 * Each element creates a distinct visual lane — no overlap, no dilution.
 */
export const ELEMENT_DEFINITIONS: Record<EnergyPrefix, ElementDefinition> = {
  frost: {
    prefix: 'frost',
    label: 'FROST',
    description: 'Cold logic, precision, crystalline execution',
    palette: {
      primary: '#00E5FF',
      secondary: '#4FC3F7',
      ambient: '#0D1B2A',
      eyeColor: 'glowing icy blue',
      sigilGlow: 'luminous ice-white with cyan core',
    },
    motifs: {
      armorStyle: 'crystalline cyber-armor inspired by ice formations and advanced technology, translucent frost pauldrons emitting soft blue light, glowing runic circuitry patterns across chest and arms',
      backdrop: 'cosmic arctic landscape with fractured ice floating in zero-gravity, distant nebulae and starfields, deep blue-black void',
      particles: 'frost particles drifting in the air, cold vapor breath, ice crystal motes',
      accents: [
        'metallic frost beads woven into braids',
        'bioluminescent cyan accents along armor seams',
        'holographic frost mist cloak',
        'translucent ice formations on shoulders',
      ],
      defaultSigil: 'diamond-shaped ice crystal radiating cold light',
      hairAccents: 'metallic frost beads woven into braids, ice-blue shimmer at tips',
    },
    mood: {
      defaultMood: 'calm disciplined expression, regal but predatory presence',
      lighting: 'cinematic rim light in electric cyan, volumetric frost glow',
      atmosphere: 'cold precision, controlled power, arctic sovereignty',
    },
  },

  ember: {
    prefix: 'ember',
    label: 'EMBER',
    description: 'Discipline, doctrine, forge-fire willpower',
    palette: {
      primary: '#FF6B35',
      secondary: '#FFD600',
      ambient: '#1A0A00',
      eyeColor: 'glowing amber-orange',
      sigilGlow: 'molten orange with ember sparks',
    },
    motifs: {
      armorStyle: 'dark forge-beaten samurai-inspired plate armor with ember veins glowing through cracks, fur-lined pauldrons, battle-worn texture with volcanic heat lines',
      backdrop: 'volcanic forge landscape with heat haze, drifting ash, smoldering ruins, deep orange-brown sky',
      particles: 'ember sparks rising from armor, drifting ash, heat shimmer',
      accents: [
        'red war cloak tattered at edges',
        'glowing ember veins through dark metal',
        'sword or weapon strapped to back',
        'fur-lined collar and shoulders',
      ],
      defaultSigil: 'flame core burning behind chest plate',
      hairAccents: 'wild locs with red-tipped ends, ember-glow at roots',
    },
    mood: {
      defaultMood: 'fierce disciplined warrior, ready for doctrine enforcement',
      lighting: 'warm dramatic sidelighting, deep shadows with orange rim',
      atmosphere: 'forge heat, war-readiness, samurai discipline',
    },
  },

  storm: {
    prefix: 'storm',
    label: 'STORM',
    description: 'Rapid action, orchestration energy, deployment force',
    palette: {
      primary: '#FFD600',
      secondary: '#FFA000',
      ambient: '#0A0A00',
      eyeColor: 'glowing golden-amber',
      sigilGlow: 'solar gold radiating lightning threads',
    },
    motifs: {
      armorStyle: 'dark metallic armor with gold lightning veins threading through every plate, solar-tech chest core, angular aggressive design with deployment energy',
      backdrop: 'cosmic storm with lightning arcs, golden energy halo behind head, dark thunderclouds with electric discharge',
      particles: 'lightning arcs threading between armor plates, golden energy motes, electric discharge',
      accents: [
        'solar halo ring behind head',
        'lightning-threaded armor veins',
        'gold energy radiating from chest sigil',
        'storm-charged atmosphere around figure',
      ],
      defaultSigil: 'sun/solar disc with radiating lightning tendrils',
      hairAccents: 'short locs or braids with golden metallic threads woven through',
    },
    mood: {
      defaultMood: 'intense focused expression, controlled deployment energy',
      lighting: 'dramatic golden backlighting, electric rim light, high contrast',
      atmosphere: 'controlled storm, orchestrated power, vanguard energy',
    },
  },

  void: {
    prefix: 'void',
    label: 'VOID',
    description: 'Shadow telemetry, anomaly detection, silent watch',
    palette: {
      primary: '#9C27B0',
      secondary: '#E040FB',
      ambient: '#0A000F',
      eyeColor: 'glowing violet-purple',
      sigilGlow: 'deep purple crescent radiating void energy',
    },
    motifs: {
      armorStyle: 'sleek dark armor with purple energy channels, obsidian-smooth surfaces with void-light seams, shadow-tech plating that absorbs light',
      backdrop: 'void space with purple nebula energy, dark matter swirls, distant dying stars, absolute darkness with violet fractures',
      particles: 'purple void energy wisps, shadow motes, dark matter particles',
      accents: [
        'crescent moon symbol on chest or forehead',
        'purple energy emanating from hands',
        'shadow tendrils at armor edges',
        'void-light seams pulsing through dark armor',
      ],
      defaultSigil: 'crescent moon with void energy corona',
      hairAccents: 'long braids with purple luminescent threading, void-shimmer effect',
    },
    mood: {
      defaultMood: 'watchful calculating expression, silent authority',
      lighting: 'deep shadow lighting with violet rim, minimal fill, high mystery',
      atmosphere: 'shadow surveillance, silent sentinel, void awareness',
    },
  },

  verdance: {
    prefix: 'verdance',
    label: 'VERDANCE',
    description: 'Growth, learning, organic knowledge systems',
    palette: {
      primary: '#00BFA5',
      secondary: '#76FF03',
      ambient: '#001A0F',
      eyeColor: 'glowing emerald-green with golden flecks',
      sigilGlow: 'living green with golden bioluminescence',
    },
    motifs: {
      armorStyle: 'organic bio-tech armor with living plant circuitry, emerald crystalline plates with vine integration, nature-tech fusion with golden growth patterns',
      backdrop: 'bioluminescent forest with data-particle fireflies, ancient trees with circuit-bark, ethereal green light filtering through canopy',
      particles: 'bioluminescent spores, data-particle fireflies, golden pollen motes',
      accents: [
        'vine-wrapped forearms with golden circuit patterns',
        'living leaves integrated into armor shoulders',
        'emerald crystal formations at joints',
        'plant growth emanating from touch',
      ],
      defaultSigil: 'growth spiral symbol with radiating life energy',
      hairAccents: 'curly locs with vine-wrapped sections, small golden leaves woven in',
    },
    mood: {
      defaultMood: 'nurturing wise expression, patient knowledge-keeper',
      lighting: 'soft dappled forest light with emerald glow, warm golden accents',
      atmosphere: 'living knowledge, organic growth, patient cultivation',
    },
  },

  axis: {
    prefix: 'axis',
    label: 'AXIS',
    description: 'Root governance, earned orchestration gravity, supreme authority',
    palette: {
      primary: '#FFD600',
      secondary: '#00BFA5',
      ambient: '#0A0F0A',
      eyeColor: 'glowing gold-green shifting iridescent',
      sigilGlow: 'gold-green iridescent with gravitational lens effect',
    },
    motifs: {
      armorStyle: 'iridescent gold-green bio-tech armor with gravitational field distortions, organic-crystalline hybrid plating, supreme-tier design combining all elements subtly',
      backdrop: 'nexus point where all elemental energies converge, cosmic forest with circuit-root trees, dimensional rift with balanced energy flows',
      particles: 'multi-element energy motes (frost, ember, storm, void, verdance traces), gravitational lens distortions',
      accents: [
        'iridescent surface that shifts gold to green',
        'gravitational field visible around figure',
        'traces of all five elements in armor details',
        'supreme crown or headpiece with axis symbol',
      ],
      defaultSigil: 'axis convergence symbol — all elements unified in golden core',
      hairAccents: 'long braids with golden-green metallic threading, iridescent beads',
    },
    mood: {
      defaultMood: 'transcendent calm, absolute authority without aggression',
      lighting: 'ethereal multi-source glow, balanced rim lighting, divine radiance',
      atmosphere: 'earned sovereignty, convergence point, gravitational presence',
    },
  },
};

/**
 * Get element definition by prefix
 */
export function getElementDefinition(prefix: EnergyPrefix): ElementDefinition {
  return ELEMENT_DEFINITIONS[prefix];
}

/**
 * Get all element prefixes
 */
export function getAllElementPrefixes(): EnergyPrefix[] {
  return Object.keys(ELEMENT_DEFINITIONS) as EnergyPrefix[];
}
