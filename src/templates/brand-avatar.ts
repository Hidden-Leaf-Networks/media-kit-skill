/**
 * Brand Avatar template — chibi characters, scenery, and logo treatments
 * for social media avatars and org profile images.
 *
 * Supports three styles:
 * - chibi: Chibi anime character in cyberpunk setting (Snowchild NFT style)
 * - scenery: Environmental/cityscape with logo as focal element
 * - logo-treatment: Logo mark with stylistic treatment (holographic, neon, etc.)
 */

import type { BrandAvatarInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';

/** Style presets with their visual DNA */
const STYLE_PRESETS: Record<string, string> = {
  'cyberpunk-konoha': 'Cyberpunk reimagining of a hidden village. Massive curved gate posts with neon teal circuit patterns, Japanese katakana neon signs, rain-slicked streets reflecting teal and magenta light. Dark night sky, moody atmosphere.',
  'neo-detroit': 'Cyberpunk Detroit cityscape. Industrial smokestacks and auto factories reimagined as neon-lit cyber structures. Rain, neon signs with Japanese characters, flying drones, circuit patterns in architecture. Teal, magenta, deep purple.',
  'frost-shrine': 'Frozen cyber-temple with crystalline architecture. Ice and teal energy flows through circuit-veined walls. Arctic aurora overhead. Sacred geometry patterns in frost.',
  'neon-forge': 'Industrial forge meets futuristic lab. Molten teal energy, circuit-board traces radiating outward, sparks and particles. Detroit steel meets silicon.',
  'holographic': 'Holographic projection floating in dark space. Glass-morphism depth layers, prismatic refractions, subtle rainbow edge highlights. Faint grid receding into perspective.',
  'void-terminal': 'Deep space command terminal. Obsidian surfaces, floating holographic displays, teal data streams. Minimal, vast, powerful.',
};

export function buildBrandAvatarCopyConfig(
  input: BrandAvatarInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'ai-engineering',
): CopyConfig {
  return {
    template: 'brand-avatar',
    format: copyFormat,
    sections: [
      {
        role: 'context',
        instruction: `Describe the new ${input.style} avatar for "${input.brandName}". What it represents and why it fits the brand.`,
      },
      {
        role: 'reveal',
        instruction: `Announce the new profile image. ${input.description ?? 'Fresh look for the brand.'}`,
      },
      {
        role: 'cta',
        instruction: `Invite followers to check the updated profile. Keep it casual.`,
      },
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildBrandAvatarConfig(input: BrandAvatarInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];

  // Resolve style preset or use custom scene description
  const sceneDescription = STYLE_PRESETS[input.scenePreset ?? ''] ?? input.customScene ?? STYLE_PRESETS['neo-detroit'];

  const parts: string[] = [];

  // Base style directive
  if (input.style === 'chibi') {
    parts.push(
      `Chibi anime character avatar in a cyberpunk setting. Bold outlines, vibrant neon colors, cute proportions with oversized head.`,
      input.characterDescription ?? 'Young Black male character with locs, teal cyber-visor, dark tech armor with teal circuit accents, confident smirk.',
      `Background: ${sceneDescription}`,
      input.logoPlacement ? `The brand logo appears as: ${input.logoPlacement}` : 'A glowing teal emblem on the character\'s chest armor.',
    );
  } else if (input.style === 'scenery') {
    parts.push(
      `Environmental cyberpunk cityscape avatar. Wide establishing shot feel compressed into a square frame.`,
      `Scene: ${sceneDescription}`,
      input.logoPlacement ?? 'The brand logo appears as a massive holographic projection hovering above the city, casting teal light downward.',
    );
  } else {
    // logo-treatment
    parts.push(
      `Logo mark treatment avatar. The brand shield/leaf logo is the sole focus.`,
      `Treatment: ${sceneDescription}`,
      `The logo fills 70% of the frame. No characters, no cityscape — pure logo with the style treatment applied.`,
    );
  }

  // Universal style rules
  parts.push(
    `Color palette: Deep dark (#0A0A1A) background, teal (#00D4FF) primary accent, magenta/pink secondary accent, silver/white highlights.`,
    `Square composition optimized for social media avatar (must read well at 48px).`,
    `No watermarks. ${input.includeText ? '' : 'No text or letters.'}`,
  );

  return {
    template: 'brand-avatar',
    format: input.format,
    dimensions,
    sections: [
      {
        role: 'scene',
        content: parts.join('\n'),
      },
    ],
    brandElements: {
      logo: false, // avatar IS the brand element — no compositor overlay
      url: false,
      colorPalette: true,
      typography: false,
      background: true,
    },
  };
}
