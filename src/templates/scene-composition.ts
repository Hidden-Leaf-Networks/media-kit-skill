/**
 * Scene Composition template — character + environment layered art.
 * The zkgoudan/Midjourney workflow: generate characters and scenes
 * as composable assets for landing page hero sections.
 *
 * Outputs are designed to be layer-friendly — clean edges,
 * separation of foreground/background, ready for Figma or CSS layering.
 */

import type { SceneCompositionInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';

/** Mood-to-scene-direction mapping */
const SCENE_MOODS: Record<string, string> = {
  cinematic: 'Cinematic depth of field, volumetric lighting, film color grading. Character and environment feel like a movie still.',
  minimal: 'Clean isolation, subtle background, character as focal point against near-solid backdrop. Soft ambient light.',
  vibrant: 'Rich saturated colors, dynamic energy. Bold contrasts between character and environment. Vivid, eye-catching.',
  'dark-luxury': 'Deep blacks, metallic highlights, premium materials. Character emerges from darkness with selective rim lighting.',
  editorial: 'Fashion editorial quality. Strong pose, intentional lighting, magazine-worthy composition. Character dominates the frame.',
  futuristic: 'Sci-fi environment, holographic elements, neon accents. Character integrated into a tech-forward world.',
  organic: 'Natural environment, botanical elements, warm sunlight. Character harmonizes with nature.',
  'bold-graphic': 'Flat stylized art, geometric backgrounds, bold outlines. Character as graphic element. Poster-art style.',
};

export function buildSceneCompositionCopyConfig(
  input: SceneCompositionInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'professional',
): CopyConfig {
  return {
    template: 'scene-composition',
    format: copyFormat,
    sections: [
      {
        role: 'narrative',
        instruction: `Write a one-line narrative caption for a scene with: "${input.character}" in "${input.environment}". Evocative, not descriptive.`,
      },
      ...(input.overlayText ? [{
        role: 'overlay',
        instruction: `Integrate this text naturally: "${input.overlayText}". Position suggestion for overlay on the composition.`,
      }] : []),
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildSceneCompositionConfig(input: SceneCompositionInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];
  const moodDir = SCENE_MOODS[input.mood] ?? SCENE_MOODS['cinematic'];
  const layerFriendly = input.layerFriendly !== false;

  const sections = [
    {
      role: 'composition',
      content: `Scene composition at ${dimensions.width}x${dimensions.height}px. This image will be used as a web page hero asset — it must be high-quality, production-ready, and feel like professional concept art or a CGI render.`,
    },
    {
      role: 'character',
      content: `Character/subject: ${input.character}. ${input.action ? `Action/pose: ${input.action}.` : 'Standing confidently, dynamic but grounded pose.'} The character should be the focal point with clear visual weight.`,
    },
    {
      role: 'environment',
      content: `Environment/backdrop: ${input.environment}. The environment sets the scene but does not overpower the character. Use atmospheric perspective — detail falls off with distance.`,
    },
    {
      role: 'mood',
      content: moodDir,
    },
  ];

  if (layerFriendly) {
    sections.push({
      role: 'layering',
      content: 'IMPORTANT: Maintain clear separation between foreground character and background environment. The character should have clean, well-defined edges — no soft blending into the background. This image will be cut and layered in a design tool. Avoid busy edges where character meets background.',
    });
  }

  if (input.overlayText) {
    sections.push({
      role: 'text-overlay',
      content: `Include text overlay: "${input.overlayText}" — rendered in large, bold sans-serif. Position it to complement the composition without covering the character's face.`,
    });
  }

  return {
    template: 'scene-composition',
    format: input.format,
    dimensions,
    sections,
    brandElements: {
      logo: false,
      url: false,
      colorPalette: true,
      typography: true,
      background: true,
    },
  };
}
