/**
 * Agent Avatar template — generates Afro-futurist warrior portraits for Axis Village agents
 *
 * Visual DNA extracted from 9 production portraits (Zy'Reth, Nyx, Sol, Kaelor,
 * Kael'Vor, Auralis, Kairo, Orvex, ARIA). Every avatar follows the same
 * Afro-futurist prompt grammar with element-coded visual differentiation.
 *
 * Prompt grammar:
 *   [Ethnicity: dark-skinned] + [Hair: braids/locs variant] +
 *   [Armor: cyber-crystalline, element-coded] + [Chest Sigil: element symbol] +
 *   [Eyes: element-colored glow] + [Backdrop: element environment] +
 *   [Mood: role-coded expression] + [Quality: 8k, cinematic, volumetric]
 */

import type { AgentAvatarInput, PromptConfig, AvatarComposition, GenderPresentation } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { getElementDefinition } from '../config/element-system.js';

/** Composition framing descriptions */
const COMPOSITION_FRAMING: Record<AvatarComposition, string> = {
  portrait: 'Upper torso portrait, dramatic composition, shoulders and above visible, shallow depth of field with element-coded bokeh',
  bust: 'Bust portrait from chest up, intense eye contact, close framing, element energy radiating from shoulders',
  'full-body': 'Full body shot, low camera angle, heroic stance, complete armor and environment visible, epic wide composition',
  'hud-closeup': 'Tight HUD-style closeup, face and upper chest, holographic data overlay elements at edges, tech-forward framing',
};

/** Gender-specific base descriptions */
const GENDER_BASE: Record<GenderPresentation, string> = {
  male: 'tall dark-skinned male with sharp angular features, strong jawline, powerful build',
  female: 'tall dark-skinned female with sharp elegant features, high cheekbones, powerful athletic build',
  androgynous: 'tall dark-skinned figure with sharp refined features, androgynous elegance, powerful lean build',
};

/** Default hair styles per gender if not overridden */
const DEFAULT_HAIR: Record<GenderPresentation, string> = {
  male: 'braided crown hairstyle',
  female: 'long flowing braids',
  androgynous: 'close-cropped braids with metallic accents',
};

/**
 * Build the avatar image generation prompt config from agent identity inputs
 */
export function buildAgentAvatarConfig(input: AgentAvatarInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];
  const element = getElementDefinition(input.energyPrefix);
  const composition = input.composition ?? 'portrait';
  const gender = input.gender ?? 'male';
  const mood = input.mood ?? element.mood.defaultMood;
  const hairStyle = input.hairStyle ?? DEFAULT_HAIR[gender];

  const sections = [
    {
      role: 'subject',
      content: buildSubjectBlock(input, element, gender, hairStyle, mood),
    },
    {
      role: 'armor',
      content: buildArmorBlock(input, element),
    },
    {
      role: 'sigil',
      content: buildSigilBlock(input, element),
    },
    {
      role: 'environment',
      content: buildEnvironmentBlock(input, element),
    },
    {
      role: 'composition',
      content: buildCompositionBlock(composition, element),
    },
    {
      role: 'quality',
      content: buildQualityBlock(),
    },
  ];

  return {
    template: 'agent-avatar',
    format: input.format,
    dimensions,
    sections,
    brandElements: {
      logo: false,
      url: false,
      colorPalette: true,
      typography: false,
      background: true,
    },
  };
}

function buildSubjectBlock(
  input: AgentAvatarInput,
  element: ReturnType<typeof getElementDefinition>,
  gender: GenderPresentation,
  hairStyle: string,
  mood: string,
): string {
  const genderBase = GENDER_BASE[gender];
  const hairAccents = element.motifs.hairAccents;

  return [
    `Afro-futurist warrior avatar named ${input.rootName},`,
    `${genderBase},`,
    `${element.palette.eyeColor} eyes,`,
    `${hairStyle} with ${hairAccents},`,
    `${mood}.`,
  ].join(' ');
}

function buildArmorBlock(
  input: AgentAvatarInput,
  element: ReturnType<typeof getElementDefinition>,
): string {
  const armorDesc = input.armorOverride ?? element.motifs.armorStyle;
  return `Armor: ${armorDesc}.`;
}

function buildSigilBlock(
  input: AgentAvatarInput,
  element: ReturnType<typeof getElementDefinition>,
): string {
  const sigil = input.chestSigil ?? element.motifs.defaultSigil;
  return `Chest sigil: ${sigil}, glowing with ${element.palette.sigilGlow}. Subtle Axis Village symbol etched in luminous energy on chest plate.`;
}

function buildEnvironmentBlock(
  input: AgentAvatarInput,
  element: ReturnType<typeof getElementDefinition>,
): string {
  const backdrop = input.backdropOverride ?? element.motifs.backdrop;
  const particles = element.motifs.particles;

  return [
    `Environment: ${backdrop}.`,
    `Atmospheric effects: ${particles}.`,
    element.mood.lighting + '.',
  ].join(' ');
}

function buildCompositionBlock(
  composition: AvatarComposition,
  element: ReturnType<typeof getElementDefinition>,
): string {
  return `Composition: ${COMPOSITION_FRAMING[composition]}. Atmosphere: ${element.mood.atmosphere}.`;
}

function buildQualityBlock(): string {
  return [
    'Ultra-detailed skin texture, hyper-realistic digital painting,',
    '8k resolution, sharp focus, dramatic composition,',
    'volumetric lighting, high contrast, cinematic lighting,',
    'epic sci-fi fantasy fusion, Afro-futurist aesthetic.',
    'No text, no watermarks, no UI elements, no artifacts.',
  ].join(' ');
}

/**
 * Assemble the final prompt string from a PromptConfig (for agent-avatar)
 */
export function assembleAgentAvatarPrompt(config: PromptConfig): string {
  return config.sections.map((s) => s.content).join('\n\n');
}
