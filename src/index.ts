/**
 * @hidden-leaf/media-kit-skill
 *
 * Branded marketing image generation for Hidden Leaf Networks.
 * Generates style-locked graphics via GPT image API.
 */

// Types — Image
export type {
  TemplateType,
  OutputFormat,
  ImageQuality,
  LogoOverlayOptions,
  Dimensions,
  BaseMediaKitInput,
  ProductLaunchInput,
  CaseStudyInput,
  ServicePromoInput,
  MilestoneInput,
  MediaKitInput,
  PromptConfig,
  PromptSection,
  BrandElements,
  GenerationResult,
  ImageGeneratorConfig,
} from './types/index.js';

// Types — Text
export type {
  CopyFormat,
  CopyTone,
  CopySection,
  BrandVoiceRules,
  CopyConfig,
  BaseCopyInput,
  CopyResult,
  MediaKitResult,
  TextGeneratorConfig,
} from './types/index.js';

export { FORMAT_DIMENSIONS, COPY_FORMAT_RULES } from './types/index.js';

// Design System
export { BRAND, TYPOGRAPHY, MOTIFS, LAYOUT_RULES, DESIGN_SYSTEM } from './config/design-system.js';

// Tone System
export { VOICE, VOICE_DO, VOICE_DONT, TONE_SYSTEM, buildBrandVoice } from './config/tone-system.js';

// Templates — Image
export { TEMPLATE_DEFINITIONS, getTemplateDefinition, getAllTemplateTypes } from './config/templates.js';
export { buildProductLaunchConfig } from './templates/product-launch.js';
export { buildCaseStudyConfig } from './templates/case-study.js';
export { buildServicePromoConfig } from './templates/service-promo.js';
export { buildMilestoneConfig } from './templates/milestone.js';

// Templates — Copy
export { buildProductLaunchCopyConfig } from './templates/product-launch.js';
export { buildCaseStudyCopyConfig } from './templates/case-study.js';
export { buildServicePromoCopyConfig } from './templates/service-promo.js';
export { buildMilestoneCopyConfig } from './templates/milestone.js';

// Generators — Image
export { buildPromptConfig, assemblePrompt, buildPrompt, validateInput } from './generators/prompt-builder.js';
export { ImageGenerator, createImageGeneratorFromEnv } from './generators/image-generator.js';
export type { OpenAIImageClient } from './generators/image-generator.js';

// Generators — Text
export { buildCopyConfig, assembleCopySystemPrompt, assembleCopyUserPrompt, buildCopyPrompts, validateCopyInput } from './generators/copy-builder.js';
export { TextGenerator, createTextGeneratorFromEnv, generateKit } from './generators/text-generator.js';
export type { OpenAIChatClient } from './generators/text-generator.js';

// Compositor
export { compositeLogoOnImage, compositeAssets } from './generators/compositor.js';
export type { CompositeOptions, LogoVariant, LogoPosition } from './generators/compositor.js';
