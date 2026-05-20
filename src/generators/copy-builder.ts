/**
 * Copy Builder — assembles brand-locked system prompts for text generation
 *
 * Mirrors prompt-builder.ts but produces chat completion prompts instead of image prompts.
 */

import type { MediaKitInput, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { COPY_FORMAT_RULES } from '../types/index.js';
import { buildProductLaunchCopyConfig } from '../templates/product-launch.js';
import { buildCaseStudyCopyConfig } from '../templates/case-study.js';
import { buildServicePromoCopyConfig } from '../templates/service-promo.js';
import { buildMilestoneCopyConfig } from '../templates/milestone.js';
import { buildCommercialCopyConfig } from '../templates/commercial.js';
import { buildSoftwareReleaseCopyConfig } from '../templates/software-release.js';
import { buildVideoPromoCopyConfig } from '../templates/video-promo.js';
import { buildAppShowcaseCopyConfig } from '../templates/app-showcase.js';
import { buildBrandAvatarCopyConfig } from '../templates/brand-avatar.js';

/**
 * Build a CopyConfig from a MediaKitInput by routing to the correct template
 */
export function buildCopyConfig(
  input: MediaKitInput,
  copyFormat: CopyFormat,
  tone?: CopyTone,
): CopyConfig {
  switch (input.template) {
    case 'product-launch':
      return buildProductLaunchCopyConfig(input, copyFormat, tone);
    case 'case-study':
      return buildCaseStudyCopyConfig(input, copyFormat, tone);
    case 'service-promo':
      return buildServicePromoCopyConfig(input, copyFormat, tone);
    case 'milestone':
      return buildMilestoneCopyConfig(input, copyFormat, tone);
    case 'agent-avatar':
      throw new Error('agent-avatar template does not support copy generation');
    case 'commercial':
      return buildCommercialCopyConfig(input, copyFormat, tone);
    case 'software-release':
      return buildSoftwareReleaseCopyConfig(input, copyFormat, tone);
    case 'video-promo':
      return buildVideoPromoCopyConfig(input, copyFormat, tone);
    case 'app-showcase':
      return buildAppShowcaseCopyConfig(input, copyFormat, tone);
    case 'brand-avatar':
      return buildBrandAvatarCopyConfig(input, copyFormat, tone);
  }
}

/**
 * Assemble the system prompt from a CopyConfig.
 * This becomes the system message for the chat completion.
 */
export function assembleCopySystemPrompt(config: CopyConfig): string {
  const rules = COPY_FORMAT_RULES[config.format];
  const voice = config.brandVoice;

  const parts: string[] = [];

  // Identity
  parts.push(
    `## Identity`,
    voice.perspective,
    ``,
  );

  // Platform context
  parts.push(
    `## Platform`,
    voice.platformNotes,
    `Maximum length: ${rules.maxLength} characters.`,
    `Hashtags: ${rules.hashtagStyle === 'none' ? 'Do not use hashtags.' : rules.hashtagStyle === 'minimal' ? 'Use 1-2 hashtags at most, at the end.' : 'Add 3-5 relevant hashtags at the end.'}`,
    `Emojis: ${rules.emojiLevel === 'none' ? 'Do not use emojis.' : rules.emojiLevel === 'light' ? 'Emojis sparingly if natural.' : 'Light emoji use is OK.'}`,
    ``,
  );

  // Voice rules
  parts.push(`## Voice — Do`);
  for (const rule of voice.doRules) {
    parts.push(`- ${rule}`);
  }
  parts.push(``);

  parts.push(`## Voice — Don't`);
  for (const rule of voice.dontRules) {
    parts.push(`- ${rule}`);
  }
  parts.push(``);

  // Tone
  parts.push(
    `## Tone: ${voice.tone}`,
    `Write in a ${voice.tone} tone throughout.`,
    ``,
  );

  // Quality directives
  parts.push(
    `## Output Rules`,
    `- Return ONLY the post text. No preamble, no "Here's a post:", no explanations.`,
    `- Do not wrap in quotes or markdown formatting.`,
    `- Write as if you are posting this directly to the platform right now.`,
    `- Every sentence must earn its place — no filler.`,
  );

  return parts.join('\n');
}

/**
 * Assemble the user prompt from a CopyConfig.
 * This becomes the user message for the chat completion.
 */
export function assembleCopyUserPrompt(config: CopyConfig): string {
  const parts: string[] = [];

  parts.push(`Write a ${config.format} post for a ${config.template} using these details:`);
  parts.push(``);

  for (const section of config.sections) {
    parts.push(`**${section.role}**: ${section.instruction}`);
  }

  return parts.join('\n');
}

/**
 * Full pipeline: input → system prompt + user prompt
 */
export function buildCopyPrompts(
  input: MediaKitInput,
  copyFormat: CopyFormat,
  tone?: CopyTone,
): { system: string; user: string } {
  const config = buildCopyConfig(input, copyFormat, tone);
  return {
    system: assembleCopySystemPrompt(config),
    user: assembleCopyUserPrompt(config),
  };
}

/**
 * Validate copy-specific input fields
 */
export function validateCopyInput(copyFormat: CopyFormat | undefined): string[] {
  const errors: string[] = [];

  if (!copyFormat) {
    errors.push('copyFormat is required for text generation');
  } else if (!COPY_FORMAT_RULES[copyFormat]) {
    const valid = Object.keys(COPY_FORMAT_RULES).join(', ');
    errors.push(`Invalid copyFormat: ${copyFormat}. Must be one of: ${valid}`);
  }

  return errors;
}
