/**
 * Service Promo template — for agency offerings
 */

import type { ServicePromoInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';
import { BRAND } from '../config/design-system.js';

export function buildServicePromoCopyConfig(
  input: ServicePromoInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'conversational',
): CopyConfig {
  return {
    template: 'service-promo',
    format: copyFormat,
    sections: [
      {
        role: 'hook',
        instruction: `Open with a question or statement about the pain point that "${input.serviceName}" solves. Make the reader feel seen.`,
      },
      {
        role: 'offer',
        instruction: `Introduce the service: "${input.serviceName}" at ${input.price}. Frame the price as accessible and the value as clear.`,
      },
      {
        role: 'benefits',
        instruction: `Weave in these three benefits naturally (don't use a bulleted list): "${input.benefits[0]}", "${input.benefits[1]}", "${input.benefits[2]}".`,
      },
      {
        role: 'cta',
        instruction: `Close with: "${input.cta}". Make the next step easy and low-pressure.`,
      },
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildServicePromoConfig(input: ServicePromoInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];

  return {
    template: 'service-promo',
    format: input.format,
    dimensions,
    sections: [
      {
        role: 'header',
        content: `Service name "${input.serviceName}" in bold white sans-serif text, large and commanding. Price point "${input.price}" displayed in teal (#00D4FF) accent color nearby.`,
      },
      {
        role: 'benefits',
        content: `Three key benefits in glass-morphism cards (dark teal #1A3A4A, blur effect, rounded): "${input.benefits[0]}", "${input.benefits[1]}", "${input.benefits[2]}".`,
      },
      {
        role: 'cta',
        content: `Call-to-action button or text "${input.cta}" styled with teal (#00D4FF) background or border, white text, prominent placement.`,
      },
      {
        role: 'footer',
        content: `"${BRAND.url}" URL text at bottom in small white type. Subtle gradient mesh background. Do NOT render a logo — the real logo is composited in post-processing.`,
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
