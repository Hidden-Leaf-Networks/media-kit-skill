/**
 * Case Study template — for client portfolio pieces
 */

import type { CaseStudyInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';
import { BRAND } from '../config/design-system.js';

export function buildCaseStudyCopyConfig(
  input: CaseStudyInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'conversational',
): CopyConfig {
  const resultsNarrative = input.results.map((r) => `"${r}"`).join(', ');

  return {
    template: 'case-study',
    format: copyFormat,
    sections: [
      {
        role: 'hook',
        instruction: `Open with the transformation story. A ${input.businessType} needed a website — paint the before picture briefly.`,
      },
      {
        role: 'transformation',
        instruction: `Describe what was built: "${input.headline}". Focus on what the client can now DO, not what technology was used.`,
      },
      {
        role: 'results',
        instruction: `Share the results naturally: ${resultsNarrative}. Frame as real outcomes the reader can relate to.`,
      },
      {
        role: 'bridge',
        instruction: `Connect this story to the reader. "If you run a [similar business]..." — make them see themselves in the case study. End with a soft CTA.`,
      },
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildCaseStudyConfig(input: CaseStudyInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];
  const resultsStr = input.results.map((r) => `"${r}"`).join(', ');

  return {
    template: 'case-study',
    format: input.format,
    dimensions,
    sections: [
      {
        role: 'header',
        content: `Client name "${input.clientName}" and business type "${input.businessType}" displayed at the top in medium weight white text. Position to the right or center — leave the top-left corner clear for logo overlay.`,
      },
      {
        role: 'headline',
        content: `Transformation headline "${input.headline}" in bold white sans-serif, large and prominent, center-aligned.`,
      },
      {
        role: 'results',
        content: `Key results displayed as metric cards or bullet points with teal (#00D4FF) accent markers: ${resultsStr}.`,
      },
      {
        role: 'footer',
        content: `Footer at bottom: "${BRAND.url}" URL text in small white type. Do NOT render a logo here — the real logo is composited in post-processing.`,
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
