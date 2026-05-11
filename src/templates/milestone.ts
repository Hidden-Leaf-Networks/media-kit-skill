/**
 * Milestone template — for company news/updates
 */

import type { MilestoneInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';

export function buildMilestoneCopyConfig(
  input: MilestoneInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'professional',
): CopyConfig {
  const dateStr = input.date ? ` (${input.date})` : '';

  return {
    template: 'milestone',
    format: copyFormat,
    sections: [
      {
        role: 'announcement',
        instruction: `Lead with the news: "${input.announcement}"${dateStr}. Make it feel significant but not overblown.`,
      },
      {
        role: 'context',
        instruction: `Provide context with these details: ${input.details.map((d) => `"${d}"`).join(', ')}. Help the reader understand why this matters.`,
      },
      {
        role: 'forward-look',
        instruction: `Close with what this means for the future. Keep it grounded — what's next, not hype.`,
      },
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildMilestoneConfig(input: MilestoneInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];
  const detailsStr = input.details.map((d) => `"${d}"`).join(', ');
  const dateStr = input.date ? ` Date: "${input.date}" in smaller text.` : '';

  return {
    template: 'milestone',
    format: input.format,
    dimensions,
    sections: [
      {
        role: 'announcement',
        content: `Bold announcement text "${input.announcement}" centered, large white sans-serif on dark background. This is the hero element.${dateStr}`,
      },
      {
        role: 'details',
        content: `Supporting details below the announcement in lighter weight text: ${detailsStr}.`,
      },
      {
        role: 'background',
        content: `Detroit skyline silhouette at bottom with network node particles connecting across the sky. Gradient from deep dark (#0A0A1A) to subtle teal glow.`,
      },
      {
        role: 'branding',
        content: `"hiddenleafnetworks.com" URL at bottom in small white type. Leave top-left corner clear for logo overlay. Teal accent elements throughout. Do NOT render a logo — the real logo is composited in post-processing.`,
      },
    ],
    brandElements: {
      logo: true,
      url: true,
      colorPalette: true,
      typography: true,
      background: true,
    },
  };
}
