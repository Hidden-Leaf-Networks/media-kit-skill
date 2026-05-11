/**
 * Core types for the media-kit-skill
 */

/** Supported template types */
export type TemplateType = 'product-launch' | 'case-study' | 'service-promo' | 'milestone';

/** Supported output formats with dimensions */
export type OutputFormat = 'linkedin' | 'instagram' | 'og' | 'facebook-cover';

/** Dimensions for each output format */
export interface Dimensions {
  width: number;
  height: number;
}

/** Format dimension mapping */
export const FORMAT_DIMENSIONS: Record<OutputFormat, Dimensions> = {
  linkedin: { width: 1200, height: 627 },
  instagram: { width: 1080, height: 1080 },
  og: { width: 1200, height: 630 },
  'facebook-cover': { width: 820, height: 312 },
};

/** Supported quality levels */
export type ImageQuality = 'low' | 'medium' | 'high';

/** Logo overlay options */
export interface LogoOverlayOptions {
  /** Logo variant: 'dark' (white on dark bg), 'light' (dark on light bg), 'tagline' (with tagline) */
  variant?: 'dark' | 'light' | 'tagline';
  /** Position on the image */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  /** Scale relative to image width (0.0 - 1.0, default 0.12) */
  scale?: number;
  /** Padding from edges in pixels (default 24) */
  padding?: number;
}

/** Base input shared across all templates */
export interface BaseMediaKitInput {
  template: TemplateType;
  format: OutputFormat;
  quality?: ImageQuality;
  /** Logo overlay config. Set to false to disable, or provide options. Default: enabled with 'dark' variant. */
  logo?: false | LogoOverlayOptions;
  outputDir?: string;
  filename?: string;
}

/** Product launch template input */
export interface ProductLaunchInput extends BaseMediaKitInput {
  template: 'product-launch';
  productName: string;
  tagline: string;
  features: [string, string, string];
  version?: string;
}

/** Case study template input */
export interface CaseStudyInput extends BaseMediaKitInput {
  template: 'case-study';
  clientName: string;
  businessType: string;
  headline: string;
  results: string[];
}

/** Service promo template input */
export interface ServicePromoInput extends BaseMediaKitInput {
  template: 'service-promo';
  serviceName: string;
  price: string;
  benefits: [string, string, string];
  cta: string;
}

/** Milestone template input */
export interface MilestoneInput extends BaseMediaKitInput {
  template: 'milestone';
  announcement: string;
  details: string[];
  date?: string;
}

/** Union type for all template inputs */
export type MediaKitInput = ProductLaunchInput | CaseStudyInput | ServicePromoInput | MilestoneInput;

/** Prompt configuration output from templates */
export interface PromptConfig {
  template: TemplateType;
  format: OutputFormat;
  dimensions: Dimensions;
  sections: PromptSection[];
  brandElements: BrandElements;
}

/** A section of the prompt describing one visual area */
export interface PromptSection {
  role: string;
  content: string;
}

/** Brand elements to enforce in all prompts */
export interface BrandElements {
  logo: boolean;
  url: boolean;
  colorPalette: boolean;
  typography: boolean;
  background: boolean;
}

// ── Text Generation Types ──────────────────────────────────────────

/** Supported copy output formats */
export type CopyFormat = 'facebook-post' | 'instagram-caption' | 'linkedin-post' | 'group-outreach' | 'ad-copy';

/** Platform constraints for each copy format */
export const COPY_FORMAT_RULES: Record<CopyFormat, { maxLength: number; hashtagStyle: 'none' | 'minimal' | 'standard'; emojiLevel: 'none' | 'light' | 'moderate' }> = {
  'facebook-post': { maxLength: 500, hashtagStyle: 'none', emojiLevel: 'none' },
  'instagram-caption': { maxLength: 2200, hashtagStyle: 'standard', emojiLevel: 'moderate' },
  'linkedin-post': { maxLength: 700, hashtagStyle: 'minimal', emojiLevel: 'none' },
  'group-outreach': { maxLength: 600, hashtagStyle: 'none', emojiLevel: 'none' },
  'ad-copy': { maxLength: 300, hashtagStyle: 'none', emojiLevel: 'none' },
};

/** Tone presets */
export type CopyTone = 'professional' | 'conversational' | 'community';

/** A section of copy content */
export interface CopySection {
  role: string;
  instruction: string;
}

/** Brand voice rules for text generation */
export interface BrandVoiceRules {
  tone: CopyTone;
  perspective: string;
  doRules: string[];
  dontRules: string[];
  platformNotes: string;
}

/** Copy prompt config — parallel to PromptConfig for images */
export interface CopyConfig {
  template: TemplateType;
  format: CopyFormat;
  sections: CopySection[];
  brandVoice: BrandVoiceRules;
}

/** Base input for text generation */
export interface BaseCopyInput {
  copyFormat: CopyFormat;
  tone?: CopyTone;
}

/** Result from text generation */
export interface CopyResult {
  text: string;
  format: CopyFormat;
  template: TemplateType;
  model: string;
  timestamp: string;
}

/** Combined generation result (image + copy) */
export interface MediaKitResult {
  image?: GenerationResult;
  copy?: CopyResult;
}

/** Configuration for the text generator */
export interface TextGeneratorConfig {
  apiKey: string;
  model?: string;
}

/** Result from image generation */
export interface GenerationResult {
  outputPath: string;
  prompt: string;
  model: string;
  format: OutputFormat;
  dimensions: Dimensions;
  timestamp: string;
}

/** Configuration for the image generator */
export interface ImageGeneratorConfig {
  apiKey: string;
  model?: string;
  quality?: ImageQuality;
  outputDir?: string;
}
