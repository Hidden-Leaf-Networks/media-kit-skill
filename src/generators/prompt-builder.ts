/**
 * Prompt Builder — assembles style-locked GPT image prompts from template configs
 */

import { BRAND, MOTIFS } from '../config/design-system.js';
import { getTemplateDefinition } from '../config/templates.js';
import type { MediaKitInput, PromptConfig } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildProductLaunchConfig } from '../templates/product-launch.js';
import { buildCaseStudyConfig } from '../templates/case-study.js';
import { buildServicePromoConfig } from '../templates/service-promo.js';
import { buildMilestoneConfig } from '../templates/milestone.js';
import { buildAgentAvatarConfig, assembleAgentAvatarPrompt } from '../templates/agent-avatar.js';

/**
 * Build a PromptConfig from a MediaKitInput by routing to the correct template
 */
export function buildPromptConfig(input: MediaKitInput): PromptConfig {
  switch (input.template) {
    case 'product-launch':
      return buildProductLaunchConfig(input);
    case 'case-study':
      return buildCaseStudyConfig(input);
    case 'service-promo':
      return buildServicePromoConfig(input);
    case 'milestone':
      return buildMilestoneConfig(input);
    case 'agent-avatar':
      return buildAgentAvatarConfig(input);
  }
}

/**
 * Assemble the final image generation prompt from a PromptConfig.
 * Enforces HLN brand design system in every prompt.
 */
export function assemblePrompt(config: PromptConfig): string {
  // Agent avatars use their own assembly — no brand marketing preamble
  if (config.template === 'agent-avatar') {
    return assembleAgentAvatarPrompt(config);
  }

  const templateDef = getTemplateDefinition(config.template);
  const { width, height } = config.dimensions;

  const parts: string[] = [];

  // Global style preamble
  parts.push(
    `Create a professional marketing graphic at ${width}x${height} pixels.`,
    `Style: Modern, dark-themed tech company marketing material.`,
    ``,
    `## Brand Design System`,
    `- Background: Deep dark (#0A0A1A) with subtle gradient`,
    `- Primary accent: Teal/cyan (#00D4FF) for highlights and accents`,
    `- Text: White (#FFFFFF) for all text, high contrast on dark`,
    `- Card backgrounds: Dark teal (#1A3A4A) with glass-morphism blur effect`,
    `- Typography: Clean sans-serif font family (like Inter, DM Sans, or similar)`,
    `  - Headlines: Bold weight, large size`,
    `  - Subheadlines: Medium weight, slightly smaller`,
    `  - Body: Light weight, high readability`,
    `- Brand name: "Hidden Leaf Networks"`,
    `- Brand tagline: "${BRAND.tagline}"`,
    `- URL: "${BRAND.url}"`,
    ``,
  );

  // Template layout description
  parts.push(
    `## Layout: ${templateDef.name}`,
    `${templateDef.layoutDescription}`,
    ``,
  );

  // Content sections
  parts.push(`## Content Sections`);
  for (const section of config.sections) {
    parts.push(`### ${section.role.charAt(0).toUpperCase() + section.role.slice(1)}`);
    parts.push(section.content);
    parts.push('');
  }

  // Visual motifs
  parts.push(
    `## Visual Motifs (use 1-2 subtly)`,
    ...MOTIFS.map((m) => `- ${m}`),
    ``,
  );

  // Logo reservation zone
  parts.push(
    `## Logo Placement`,
    `- IMPORTANT: Leave the top-left corner area (roughly 15% width × 15% height) EMPTY with only the dark background visible.`,
    `- Do NOT render any logo, text, or content in this zone — a real logo will be composited on top in post-processing.`,
    `- The rest of the image should have normal content and layout.`,
    ``,
  );

  // Final quality directives
  parts.push(
    `## Quality Directives`,
    `- Professional marketing quality, ready for social media posting`,
    `- No placeholder text — all text shown must be exactly as specified`,
    `- Clean composition with clear visual hierarchy`,
    `- Text must be legible and properly rendered`,
    `- No watermarks or artifacts`,
  );

  return parts.join('\n');
}

/**
 * Full pipeline: input → prompt string
 */
export function buildPrompt(input: MediaKitInput): string {
  const config = buildPromptConfig(input);
  return assemblePrompt(config);
}

/**
 * Validate a MediaKitInput, returning errors if invalid
 */
export function validateInput(input: MediaKitInput): string[] {
  const errors: string[] = [];

  if (!input.template) {
    errors.push('template is required');
  }

  if (!input.format) {
    errors.push('format is required');
  } else if (!FORMAT_DIMENSIONS[input.format]) {
    errors.push(`Invalid format: ${input.format}. Must be one of: linkedin, instagram, og, facebook-cover`);
  }

  switch (input.template) {
    case 'product-launch':
      if (!input.productName) errors.push('productName is required for product-launch');
      if (!input.tagline) errors.push('tagline is required for product-launch');
      if (!input.features || input.features.length !== 3) errors.push('features must be an array of exactly 3 strings');
      break;
    case 'case-study':
      if (!input.clientName) errors.push('clientName is required for case-study');
      if (!input.businessType) errors.push('businessType is required for case-study');
      if (!input.headline) errors.push('headline is required for case-study');
      if (!input.results || input.results.length === 0) errors.push('results must be a non-empty array');
      break;
    case 'service-promo':
      if (!input.serviceName) errors.push('serviceName is required for service-promo');
      if (!input.price) errors.push('price is required for service-promo');
      if (!input.benefits || input.benefits.length !== 3) errors.push('benefits must be an array of exactly 3 strings');
      if (!input.cta) errors.push('cta is required for service-promo');
      break;
    case 'milestone':
      if (!input.announcement) errors.push('announcement is required for milestone');
      if (!input.details || input.details.length === 0) errors.push('details must be a non-empty array');
      break;
    case 'agent-avatar':
      if (!input.energyPrefix) errors.push('energyPrefix is required for agent-avatar');
      else if (!['frost', 'ember', 'storm', 'void', 'verdance', 'axis'].includes(input.energyPrefix)) {
        errors.push(`Invalid energyPrefix: ${input.energyPrefix}. Must be one of: frost, ember, storm, void, verdance, axis`);
      }
      if (!input.rootName) errors.push('rootName is required for agent-avatar');
      if (!input.suffixModifier) errors.push('suffixModifier is required for agent-avatar');
      if (!input.domain) errors.push('domain is required for agent-avatar');
      if (!input.designation) errors.push('designation is required for agent-avatar');
      if (input.composition && !['portrait', 'bust', 'full-body', 'hud-closeup'].includes(input.composition)) {
        errors.push(`Invalid composition: ${input.composition}`);
      }
      if (input.gender && !['male', 'female', 'androgynous'].includes(input.gender)) {
        errors.push(`Invalid gender: ${input.gender}`);
      }
      break;
    default:
      errors.push(`Unknown template: ${(input as MediaKitInput).template}`);
  }

  return errors;
}
