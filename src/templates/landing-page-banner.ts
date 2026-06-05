/**
 * Landing Page Banner template — section-level web graphics.
 * Features, CTAs, testimonials, stats, pricing sections
 * designed to compose into a full landing page.
 */

import type { LandingPageBannerInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';

/** Section-specific layout instructions */
const SECTION_LAYOUTS: Record<string, string> = {
  features: 'Grid of 3-4 feature cards with icons or illustrations. Each card has an icon area, title, and short description. Clean spacing between cards, consistent sizing.',
  cta: 'Centered call-to-action section with a bold headline, supporting text, and a prominent button. Full-width background with gradient or pattern. High-contrast button stands out.',
  testimonial: 'Client quote in large italic text, attribution below with name and title. Subtle quotation marks as decorative element. Photo/avatar placeholder on the side.',
  stats: 'Large numbers/metrics displayed prominently in a row. Each stat has a big number and a label below. Use accent color for the numbers. Clean, data-forward layout.',
  pricing: 'Pricing cards side by side (2-3 tiers). Each card has tier name, price, feature list, and CTA button. Highlighted/recommended tier has accent border or badge.',
  about: 'Two-column layout: text content on one side, image/illustration on the other. Balanced composition, narrative flow from left to right.',
  gallery: 'Masonry or grid layout showing multiple images/screenshots. Slight overlapping for depth. Clean borders with rounded corners. Portfolio feel.',
};

export function buildLandingPageBannerCopyConfig(
  input: LandingPageBannerInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'professional',
): CopyConfig {
  return {
    template: 'landing-page-banner',
    format: copyFormat,
    sections: [
      {
        role: 'heading',
        instruction: `Write a section heading for a "${input.sectionType}" section: "${input.heading}". Clear, benefit-focused.`,
      },
      {
        role: 'body',
        instruction: input.supportingText
          ? `Expand on: "${input.supportingText}". Keep it concise and scannable.`
          : `Write supporting copy for this ${input.sectionType} section. 1-2 sentences max.`,
      },
      ...(input.items?.map((item, i) => ({
        role: `item-${i + 1}`,
        instruction: `Write micro-copy for: "${item}". Short, punchy, benefit-driven.`,
      })) ?? []),
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildLandingPageBannerConfig(input: LandingPageBannerInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];
  const layoutDir = SECTION_LAYOUTS[input.sectionType] ?? SECTION_LAYOUTS['features'];
  const moodNote = input.mood
    ? ` Visual mood: ${input.mood}.`
    : ' Visual mood: clean, modern, professional.';

  const sections = [
    {
      role: 'composition',
      content: `Website section banner at ${dimensions.width}x${dimensions.height}px. This is one section of a landing page — it should look like a premium web section, not a standalone graphic.${moodNote}`,
    },
    {
      role: 'layout',
      content: layoutDir,
    },
    {
      role: 'heading',
      content: `Section heading: "${input.heading}" in bold sans-serif, high contrast. ${input.supportingText ? `Supporting text: "${input.supportingText}" in lighter weight below.` : ''}`,
    },
  ];

  if (input.items && input.items.length > 0) {
    sections.push({
      role: 'items',
      content: `Content items:\n${input.items.map((item, i) => `${i + 1}. ${item}`).join('\n')}\nRender each item clearly in the layout described above.`,
    });
  }

  return {
    template: 'landing-page-banner',
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
