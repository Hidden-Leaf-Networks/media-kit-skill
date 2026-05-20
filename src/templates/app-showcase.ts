/**
 * App Showcase template — portfolio pieces and client site showcases
 */

import type { AppShowcaseInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';

export function buildAppShowcaseCopyConfig(
  input: AppShowcaseInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'web-studio',
): CopyConfig {
  const clientStr = input.clientName
    ? ` This was built for ${input.clientName}.`
    : '';

  return {
    template: 'app-showcase',
    format: copyFormat,
    sections: [
      {
        role: 'intro',
        instruction: `Introduce "${input.appName}" — what it is and why it matters.${clientStr} Lead with the transformation, not the tech.`,
      },
      {
        role: 'value-props',
        instruction: `Highlight these three value propositions: "${input.valueProps[0]}", "${input.valueProps[1]}", "${input.valueProps[2]}". Show outcomes, not features.`,
      },
      {
        role: 'client-context',
        instruction: `${input.clientName ? `Frame as a portfolio piece — "${input.clientName}" trusted Hidden Leaf Web Studio to bring this to life.` : 'Position as a capability demonstration of what the studio builds.'}`,
      },
      {
        role: 'cta',
        instruction: `Close with a next step — visit ${input.appUrl} or reach out for a similar build. Keep it inviting.`,
      },
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildAppShowcaseConfig(input: AppShowcaseInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];
  const clientLabel = input.clientName
    ? `Client label "${input.clientName}" in small caps above or below the app name.`
    : '';

  const deviceDescriptions: Record<string, string> = {
    laptop: 'Modern laptop mockup (MacBook-style) displaying the application screenshot',
    phone: 'Modern smartphone mockup (iPhone-style) displaying the application screenshot',
    tablet: 'Modern tablet mockup (iPad-style) displaying the application screenshot',
    'multi-device': 'Multiple device mockups (laptop, phone, tablet) arranged in perspective showing the application',
  };

  return {
    template: 'app-showcase',
    format: input.format,
    dimensions,
    sections: [
      {
        role: 'header',
        content: `App name "${input.appName}" in bold white sans-serif text. URL "${input.appUrl}" in smaller teal (#00D4FF) text below. ${clientLabel}`,
      },
      {
        role: 'device-mockup',
        content: `${deviceDescriptions[input.deviceFrame]}. Screen shows: ${input.screenshotDescription}. The mockup should feel premium and polished.`,
      },
      {
        role: 'value-props',
        content: `Three value proposition badges below the mockup: "${input.valueProps[0]}", "${input.valueProps[1]}", "${input.valueProps[2]}". Glass-morphism cards, horizontal layout.`,
      },
      {
        role: 'footer',
        content: `"hiddenleafnetworks.com" URL at bottom. Clean dark gradient background. Premium, portfolio-quality feel. Do NOT render a logo — the real logo is composited in post-processing.`,
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
