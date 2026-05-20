/**
 * Core types for the media-kit-skill
 */

/** Supported template types */
export type TemplateType = 'product-launch' | 'case-study' | 'service-promo' | 'milestone' | 'agent-avatar' | 'commercial' | 'software-release' | 'video-promo' | 'app-showcase' | 'brand-avatar';

/** Supported output formats with dimensions */
export type OutputFormat = 'linkedin' | 'instagram' | 'og' | 'facebook-cover';

/** Dimensions for each output format */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Format dimension mapping.
 * All dimensions are divisible by 16 for GPT Image 2 compatibility.
 * Original social media sizes rounded to nearest valid values.
 */
export const FORMAT_DIMENSIONS: Record<OutputFormat, Dimensions> = {
  linkedin: { width: 1200, height: 624 },     // was 627 → nearest div-by-16
  instagram: { width: 1088, height: 1088 },   // was 1080 → nearest div-by-16
  og: { width: 1200, height: 624 },           // was 630 → nearest div-by-16 (same as linkedin)
  'facebook-cover': { width: 816, height: 320 }, // was 820x312 → nearest div-by-16
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

// ── Agent Avatar Types ──────────────────────────────────────────────

/** Energy prefixes from ARIA Axis Village Identity System */
export type EnergyPrefix = 'frost' | 'ember' | 'storm' | 'void' | 'verdance' | 'axis';

/** Avatar composition style */
export type AvatarComposition = 'portrait' | 'bust' | 'full-body' | 'hud-closeup';

/** Gender presentation for avatar generation */
export type GenderPresentation = 'male' | 'female' | 'androgynous';

/** Agent avatar template input */
export interface AgentAvatarInput extends BaseMediaKitInput {
  template: 'agent-avatar';
  /** Energy prefix — drives color palette, element motifs, backdrop */
  energyPrefix: EnergyPrefix;
  /** Agent root name (e.g., Zy'Reth, Nyx, Kairo) */
  rootName: string;
  /** Suffix modifier describing function (e.g., Prime, Vault, Vanguard) */
  suffixModifier: string;
  /** Agent domain (e.g., finance, devrel, creative, revenue-ops) */
  domain: string;
  /** Agent designation code (e.g., CMD-01, EXEC-01) */
  designation: string;
  /** Composition style */
  composition?: AvatarComposition;
  /** Gender presentation */
  gender?: GenderPresentation;
  /** Mood/expression (e.g., regal, watchful, tactical, nurturing) */
  mood?: string;
  /** Optional custom armor/clothing description override */
  armorOverride?: string;
  /** Optional custom backdrop override */
  backdropOverride?: string;
  /** Optional chest sigil description */
  chestSigil?: string;
  /** Optional hair style override */
  hairStyle?: string;
}

/** Commercial ad creative input */
export interface CommercialInput extends BaseMediaKitInput {
  template: 'commercial';
  headline: string;
  subheadline: string;
  cta: string;
  offerText?: string;
  targetAudience: string;
}

/** Software release announcement input */
export interface SoftwareReleaseInput extends BaseMediaKitInput {
  template: 'software-release';
  packageName: string;
  version: string;
  releaseType: 'major' | 'minor' | 'patch';
  highlights: [string, string, string];
  breakingChanges?: string[];
  installCommand?: string;
  repoUrl?: string;
}

/** Video promo / thumbnail input */
export interface VideoPromoInput extends BaseMediaKitInput {
  template: 'video-promo';
  videoTitle: string;
  duration: string;
  platform: 'youtube' | 'loom' | 'twitter' | 'general';
  keyTopics: [string, string, string];
  thumbnailMood?: string;
  speakerName?: string;
}

/** App showcase / portfolio input */
export interface AppShowcaseInput extends BaseMediaKitInput {
  template: 'app-showcase';
  appName: string;
  appUrl: string;
  screenshotDescription: string;
  deviceFrame: 'laptop' | 'phone' | 'tablet' | 'multi-device';
  valueProps: [string, string, string];
  clientName?: string;
}

/** Brand avatar style */
export type BrandAvatarStyle = 'chibi' | 'scenery' | 'logo-treatment';

/** Brand avatar template input */
export interface BrandAvatarInput extends BaseMediaKitInput {
  template: 'brand-avatar';
  /** Avatar style: chibi character, environmental scenery, or logo treatment */
  style: BrandAvatarStyle;
  /** Brand name */
  brandName: string;
  /** Scene preset: cyberpunk-konoha, neo-detroit, frost-shrine, neon-forge, holographic, void-terminal */
  scenePreset?: string;
  /** Custom scene description (overrides preset) */
  customScene?: string;
  /** Character description for chibi style */
  characterDescription?: string;
  /** How/where the logo appears in the scene */
  logoPlacement?: string;
  /** Optional text description for copy generation */
  description?: string;
  /** Include text in the image (default: false) */
  includeText?: boolean;
}

/** Union type for all template inputs */
export type MediaKitInput = ProductLaunchInput | CaseStudyInput | ServicePromoInput | MilestoneInput | AgentAvatarInput | CommercialInput | SoftwareReleaseInput | VideoPromoInput | AppShowcaseInput | BrandAvatarInput;

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
export type CopyTone = 'professional' | 'conversational' | 'community' | 'ai-engineering' | 'web-studio' | 'small-business';

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

/** Combined generation result (image + copy + video) */
export interface MediaKitResult {
  image?: GenerationResult;
  copy?: CopyResult;
  video?: VideoResult;
}

// ── Video Generation Types ──────────────────────────────────────────

/** Supported video aspect ratios */
export type VideoAspectRatio = '16:9' | '9:16' | '1:1' | '4:3';

/** Supported video resolutions */
export type VideoResolution = '720p' | '1080p';

/** Video resolution mapping */
export const VIDEO_RESOLUTIONS: Record<VideoResolution, string> = {
  '720p': '1280x720',
  '1080p': '1920x1080',
};

/** Video provider presets */
export type VideoProvider = 'kling' | 'runway' | 'veo' | 'seedance' | 'fal';

/** Provider model ID mapping */
export const VIDEO_PROVIDER_MODELS: Record<VideoProvider, string> = {
  kling: 'kling/kling-v2.6-t2v',
  runway: 'runway/gen4-turbo',
  veo: 'google/veo-3.1-generate-001',
  seedance: 'seedance/seedance-2.0',
  fal: 'fal/luma-dream-machine/ray-2',
};

/** Configuration for the video generator */
export interface VideoGeneratorConfig {
  /** Default video model (AI Gateway format: provider/model) */
  model?: string;
  /** Shorthand provider selection — overridden by model if both set */
  provider?: VideoProvider;
  /** Default duration in seconds */
  duration?: number;
  /** Default aspect ratio */
  aspectRatio?: VideoAspectRatio;
  /** Default resolution */
  resolution?: VideoResolution;
  /** Output directory for generated videos */
  outputDir?: string;
  /** Polling timeout in ms (default: 600000 = 10 min) */
  pollTimeoutMs?: number;
}

/** Input for video generation — extends the image prompt system */
export interface VideoGenerationInput {
  /** The text prompt (reuses image prompt builder output) */
  prompt: string;
  /** Optional source image for image-to-video */
  sourceImage?: string;
  /** Duration in seconds (default: 5) */
  duration?: number;
  /** Aspect ratio */
  aspectRatio?: VideoAspectRatio;
  /** Resolution */
  resolution?: VideoResolution;
  /** Override model for this generation */
  model?: string;
  /** Override provider for this generation */
  provider?: VideoProvider;
  /** Output directory */
  outputDir?: string;
  /** Custom filename */
  filename?: string;
}

/** Result from video generation */
export interface VideoResult {
  outputPath: string;
  prompt: string;
  model: string;
  duration: number;
  aspectRatio: VideoAspectRatio;
  resolution: VideoResolution;
  timestamp: string;
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
