/**
 * Commercial template — paid ad creatives for social platforms
 */

import type { CommercialInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';

export function buildCommercialCopyConfig(
  input: CommercialInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'conversational',
): CopyConfig {
  const offerStr = input.offerText ? ` Mention the offer: "${input.offerText}".` : '';

  return {
    template: 'commercial',
    format: copyFormat,
    sections: [
      {
        role: 'hook',
        instruction: `Open with a thumb-stopping line for ${input.targetAudience}. Lead with the outcome, not the product.`,
      },
      {
        role: 'value-prop',
        instruction: `Deliver the core value: "${input.subheadline}". Make it concrete — what changes for them?`,
      },
      {
        role: 'offer',
        instruction: `Present the offer clearly.${offerStr} Frame it as a no-brainer.`,
      },
      {
        role: 'cta',
        instruction: `Close with: "${input.cta}". One clear action, zero friction.`,
      },
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildCommercialConfig(input: CommercialInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];
  const offerBadge = input.offerText
    ? `Offer badge "${input.offerText}" in teal (#00D4FF) accent pill or ribbon, eye-catching placement.`
    : '';

  return {
    template: 'commercial',
    format: input.format,
    dimensions,
    sections: [
      {
        role: 'headline',
        content: `Bold headline "${input.headline}" in large white sans-serif text, centered and dominant. Maximum visual impact — this must stop the scroll.`,
      },
      {
        role: 'subheadline',
        content: `Supporting line "${input.subheadline}" in lighter weight text below the headline, slightly smaller.`,
      },
      {
        role: 'offer',
        content: `${offerBadge} CTA button "${input.cta}" styled with teal (#00D4FF) background, white bold text, rounded corners, prominent placement.`,
      },
      {
        role: 'footer',
        content: `"hiddenleafnetworks.com" URL text at bottom in small white type. Clean, minimal layout — no clutter. Do NOT render a logo — the real logo is composited in post-processing.`,
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
