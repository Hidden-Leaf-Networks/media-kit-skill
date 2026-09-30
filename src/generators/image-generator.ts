/**
 * Image Generator — wraps OpenAI image generation API
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ImageGeneratorConfig, GenerationResult, MediaKitInput, OutputFormat, ImageQuality } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildPrompt, validateInput } from './prompt-builder.js';
import { compositeLogoOnImage } from './compositor.js';
import type { CompositeOptions } from './compositor.js';
import { applyBrandPreset } from '../config/brand-presets.js';

/** OpenAI client interface (subset we need) */
export interface OpenAIImageClient {
  images: {
    generate(params: {
      model: string;
      prompt: string;
      n: number;
      size: string;
      quality: string;
      output_format?: string;
    }): Promise<{ data: Array<{ b64_json?: string; url?: string }> }>;
    edit(params: {
      model: string;
      image: unknown | unknown[];
      prompt: string;
      n: number;
      size: string;
      quality?: string;
      output_format?: string;
    }): Promise<{ data: Array<{ b64_json?: string; url?: string }> }>;
  };
}

/** Fixed sizes supported by gpt-image-1 */
const GPT_IMAGE_1_SIZES: Record<string, string> = {
  'landscape': '1536x1024',
  'portrait': '1024x1536',
  'square': '1024x1024',
};

/**
 * Map our format dimensions to an OpenAI-supported size string.
 * gpt-image-2 supports arbitrary sizes; gpt-image-1 has fixed options.
 */
function getOpenAISize(format: OutputFormat, model: string): string {
  const dims = FORMAT_DIMENSIONS[format];

  if (model === 'gpt-image-1') {
    if (dims.width > dims.height) return GPT_IMAGE_1_SIZES['landscape'];
    if (dims.height > dims.width) return GPT_IMAGE_1_SIZES['portrait'];
    return GPT_IMAGE_1_SIZES['square'];
  }

  return `${dims.width}x${dims.height}`;
}

export class ImageGenerator {
  private client: OpenAIImageClient;
  private model: string;
  private quality: ImageQuality;
  private outputDir: string;

  constructor(client: OpenAIImageClient, config: ImageGeneratorConfig) {
    this.client = client;
    this.model = config.model ?? 'gpt-image-2';
    this.quality = config.quality ?? 'medium';
    this.outputDir = config.outputDir ?? './output';
  }

  /**
   * Generate a branded marketing image from structured input
   */
  async generate(input: MediaKitInput): Promise<GenerationResult> {
    // Apply brand preset if specified (overrides BRAND design system values)
    if (input.brand) {
      applyBrandPreset(input.brand);
    }

    // Validate input
    const errors = validateInput(input);
    if (errors.length > 0) {
      throw new Error(`Invalid input: ${errors.join('; ')}`);
    }

    // Build prompt
    const prompt = buildPrompt(input);

    // Determine output path
    const outputDir = input.outputDir ?? this.outputDir;
    const filename = input.filename ?? this.generateFilename(input);
    const outputPath = path.resolve(outputDir, filename);

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Call OpenAI API
    const size = getOpenAISize(input.format, this.model);
    const quality = input.quality ?? this.quality;

    // If reference images provided, use edit API for style/character consistency.
    // gpt-image-1 is the primary model for edits (supports up to 16 refs).
    // gpt-image-2 can also be used as the generator model — reference images
    // just route through the edit endpoint regardless of the configured model.
    const hasRefs = input.referenceImages && input.referenceImages.length > 0;
    let response: { data: Array<{ b64_json?: string; url?: string }> };

    if (hasRefs) {
      const refImages = input.referenceImages!.map((refPath) => {
        if (!fs.existsSync(refPath)) {
          throw new Error(`Reference image not found: ${refPath}`);
        }
        const buf = fs.readFileSync(refPath);
        return new File([buf], path.basename(refPath), { type: 'image/png' });
      });

      // Use configured model for edit if it supports it, fallback to gpt-image-1
      const editModel = this.model === 'gpt-image-2' ? 'gpt-image-1' : (this.model ?? 'gpt-image-1');
      const editSize = getOpenAISize(input.format, editModel);
      response = await this.client.images.edit({
        model: editModel,
        image: refImages.length === 1 ? refImages[0] : refImages,
        prompt,
        n: 1,
        size: editSize,
        quality,
        output_format: 'png',
      });
    } else {
      // Standard generation — uses configured model (gpt-image-2 default)
      response = await this.client.images.generate({
        model: this.model,
        prompt,
        n: 1,
        size,
        quality,
        output_format: 'png',
      });
    }

    // Save image
    const imageData = response.data[0];
    if (!imageData?.b64_json) {
      throw new Error('No image data returned from API');
    }

    const buffer = Buffer.from(imageData.b64_json, 'base64');
    fs.writeFileSync(outputPath, buffer);

    // Post-process: overlay logo (enabled by default, disabled for agent avatars and web design templates)
    const skipLogo = input.template === 'agent-avatar' || input.template === 'web-hero' || input.template === 'landing-page-banner' || input.template === 'scene-composition';
    if (input.logo !== false && !skipLogo) {
      const logoOpts: CompositeOptions = {};
      if (input.logo) {
        if (input.logo.variant) logoOpts.logo = input.logo.variant;
        if (input.logo.position) logoOpts.logoPosition = input.logo.position;
        if (input.logo.scale) logoOpts.logoScale = input.logo.scale;
        if (input.logo.padding) logoOpts.padding = input.logo.padding;
      }
      await compositeLogoOnImage(outputPath, logoOpts);
    }

    const dimensions = FORMAT_DIMENSIONS[input.format];

    return {
      outputPath,
      prompt,
      model: this.model,
      format: input.format,
      dimensions,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate a filename from the input
   */
  private generateFilename(input: MediaKitInput): string {
    const timestamp = Date.now();
    let slug: string;

    switch (input.template) {
      case 'product-launch':
        slug = input.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        break;
      case 'case-study':
        slug = input.clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        break;
      case 'service-promo':
        slug = input.serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        break;
      case 'milestone':
        slug = input.announcement.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
        break;
      case 'agent-avatar':
        slug = `${input.energyPrefix}-${input.rootName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        break;
      case 'commercial':
        slug = input.headline.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
        break;
      case 'software-release':
        slug = `${input.packageName}-${input.version}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        break;
      case 'video-promo':
        slug = input.videoTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
        break;
      case 'app-showcase':
        slug = input.appName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        break;
      case 'brand-avatar':
        slug = `${input.style}-${input.brandName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        break;
      case 'web-hero':
        slug = input.headline.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
        break;
      case 'landing-page-banner':
        slug = `${input.sectionType}-${input.heading}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
        break;
      case 'scene-composition':
        slug = input.character.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
        break;
    }

    return `${input.template}-${slug}-${input.format}-${timestamp}.png`;
  }
}

/**
 * Factory: create ImageGenerator from environment variables
 */
export function createImageGeneratorFromEnv(clientOverride?: OpenAIImageClient): ImageGenerator {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey && !clientOverride) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const config: ImageGeneratorConfig = {
    apiKey: apiKey ?? '',
    model: process.env.MEDIA_KIT_MODEL ?? 'gpt-image-2',
    quality: (process.env.MEDIA_KIT_QUALITY as ImageQuality) ?? 'medium',
    outputDir: process.env.MEDIA_KIT_OUTPUT_DIR ?? './output',
  };

  // If no override client provided, create real OpenAI client
  let client: OpenAIImageClient;
  if (clientOverride) {
    client = clientOverride;
  } else {
    // Dynamic import would be ideal, but for sync factory we use require-style
    // The actual OpenAI client is created at runtime
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: OpenAI } = require('openai') as { default: new (opts: { apiKey: string }) => OpenAIImageClient };
    client = new OpenAI({ apiKey: config.apiKey });
  }

  return new ImageGenerator(client, config);
}
