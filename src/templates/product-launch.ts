/**
 * Product Launch template — for new tool/skill releases
 */

import type { ProductLaunchInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';

export function buildProductLaunchCopyConfig(
  input: ProductLaunchInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'professional',
): CopyConfig {
  const versionStr = input.version ? ` v${input.version}` : '';

  return {
    template: 'product-launch',
    format: copyFormat,
    sections: [
      {
        role: 'announcement',
        instruction: `Announce "${input.productName}${versionStr}" — lead with what it does, not what it is. Make it feel like a milestone.`,
      },
      {
        role: 'tagline',
        instruction: `Work in the tagline naturally: "${input.tagline}". Don't just paste it — integrate it into the narrative.`,
      },
      {
        role: 'features',
        instruction: `Highlight these three capabilities: "${input.features[0]}", "${input.features[1]}", "${input.features[2]}". Describe the value each delivers.`,
      },
      {
        role: 'cta',
        instruction: `Close with where to learn more or get started. Link to ${BRAND.url} if appropriate for the platform.`,
      },
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildProductLaunchConfig(input: ProductLaunchInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];
  const versionStr = input.version ? ` v${input.version}` : '';

  return {
    template: 'product-launch',
    format: input.format,
    dimensions,
    sections: [
      {
        role: 'header',
        content: `Product name "${input.productName}${versionStr}" displayed prominently in bold white sans-serif text. Position the product name to the right or center — leave the top-left corner clear for logo overlay.`,
      },
      {
        role: 'tagline',
        content: `Tagline below product name: "${input.tagline}" in lighter weight text, slightly smaller.`,
      },
      {
        role: 'features',
        content: `Three feature cards arranged horizontally in a row with glass-morphism effect (dark teal #1A3A4A background, slight blur, rounded corners). Each card contains an abstract icon and label: "${input.features[0]}", "${input.features[1]}", "${input.features[2]}".`,
      },
      {
        role: 'footer',
        content: `Footer area with `${BRAND.url}` URL text and subtle tech mesh pattern.`,
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
