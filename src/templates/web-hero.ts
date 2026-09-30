/**
 * Web Hero template — full-width hero section images for landing pages.
 * Midjourney-alternative: cinematic, product-forward compositions
 * sized for desktop/tablet/mobile viewports.
 */

import type { WebHeroInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';

/** Mood-to-visual-direction mapping */
const MOOD_DIRECTIONS: Record<string, string> = {
  cinematic: 'Dramatic cinematic lighting with volumetric rays, deep depth of field, film-grain texture. Moody shadows with selective highlights.',
  minimal: 'Clean, airy composition with generous whitespace. Subtle gradients, muted tones, floating elements. Less is more.',
  vibrant: 'Rich saturated colors, bold gradients, energetic feel. Dynamic angles, vivid contrasts, eye-catching pop.',
  'dark-luxury': 'Deep blacks and dark backgrounds with metallic gold/silver accents. Glass-morphism, reflective surfaces, premium matte textures.',
  editorial: 'Magazine-quality layout with strong typography hierarchy. Photo-forward, elegant grid alignment, sophisticated color grading.',
  futuristic: 'Sci-fi inspired — holographic elements, neon glows, circuit patterns, translucent UI panels. Cyberpunk meets clean tech.',
  organic: 'Natural textures, warm earth tones, flowing curves. Botanical elements, soft lighting, handcrafted feel.',
  'bold-graphic': 'Flat design with bold geometric shapes, strong color blocks, oversized typography. Poster-art energy.',
  'blanime': 'Black anime (blanime) art style — thick black outlines, cel-shaded flat coloring, dramatic angular faces, adult animation aesthetic. Confident linework, dynamic poses, heavy shadows with sharp colored highlights. NOT chibi, NOT photorealistic.',
  'afrofuturist-3d': 'Photorealistic 3D CGI with afrofuturist aesthetic — volumetric lighting, ray-traced reflections, futuristic tactical gear with glowing circuit accents, cyberpunk cityscape through African diaspora lens. Movie-still quality.',
};

export function buildWebHeroCopyConfig(
  input: WebHeroInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'professional',
): CopyConfig {
  return {
    template: 'web-hero',
    format: copyFormat,
    sections: [
      {
        role: 'headline',
        instruction: `Write a compelling hero headline based on: "${input.headline}". Maximum impact, minimum words.`,
      },
      {
        role: 'subheadline',
        instruction: input.subheadline
          ? `Expand on: "${input.subheadline}". One sentence that makes the value undeniable.`
          : `Write a supporting line that amplifies the headline. One clear, benefit-driven sentence.`,
      },
      {
        role: 'cta',
        instruction: input.ctaText
          ? `CTA button text: "${input.ctaText}".`
          : `Write a single CTA button label. 2-4 words, action-oriented.`,
      },
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildWebHeroConfig(input: WebHeroInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];
  const moodDir = MOOD_DIRECTIONS[input.mood] ?? MOOD_DIRECTIONS['cinematic'];

  const sections = [
    {
      role: 'composition',
      content: `Full-width hero section image at ${dimensions.width}x${dimensions.height}px. This is a website hero section — it must feel like a premium landing page, not a social media graphic. The composition should have clear visual hierarchy with a focal point that draws the eye.`,
    },
    {
      role: 'mood',
      content: moodDir,
    },
    {
      role: 'subject',
      content: `Central subject: ${input.subject}. Position the subject as the visual anchor of the composition. Leave breathing room for text overlay — the headline zone should be readable.`,
    },
    {
      role: 'headline-zone',
      content: `Reserve a clear text zone for the headline "${input.headline}"${input.subheadline ? ` and subheadline "${input.subheadline}"` : ''}. The text should be rendered in large, bold sans-serif type with high contrast against the background.${input.ctaText ? ` Include a CTA button "${input.ctaText}" with accent color, rounded corners.` : ''}`,
    },
  ];

  if (input.backgroundOverride) {
    sections.push({
      role: 'background',
      content: `Background: ${input.backgroundOverride}`,
    });
  }

  return {
    template: 'web-hero',
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
