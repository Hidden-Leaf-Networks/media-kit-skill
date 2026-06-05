/**
 * Image Editor — wraps OpenAI image edit API for logo cleanup, background removal, etc.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ImageQuality } from '../types/index.js';

/** OpenAI client interface for image editing */
export interface OpenAIImageEditClient {
  images: {
    edit(params: {
      model: string;
      image: unknown;
      prompt: string;
      n: number;
      size: string;
      quality?: string;
    }): Promise<{ data: Array<{ b64_json?: string; url?: string }> }>;
  };
}

/** Configuration for image editing */
export interface ImageEditorConfig {
  apiKey: string;
  model?: string;
  quality?: ImageQuality;
  outputDir?: string;
}

/** Input for an image edit operation */
export interface ImageEditInput {
  /** Path to the source image */
  imagePath: string;
  /** What to do with the image */
  prompt: string;
  /** Output size (default: '1024x1024') */
  size?: string;
  /** Quality level */
  quality?: ImageQuality;
  /** Output directory */
  outputDir?: string;
  /** Output filename */
  filename?: string;
}

/** Result from an image edit */
export interface ImageEditResult {
  outputPath: string;
  prompt: string;
  model: string;
  size: string;
  timestamp: string;
}

export class ImageEditor {
  private client: OpenAIImageEditClient;
  private model: string;
  private quality: ImageQuality;
  private outputDir: string;

  constructor(client: OpenAIImageEditClient, config: ImageEditorConfig) {
    this.client = client;
    this.model = config.model ?? 'gpt-image-1';
    this.quality = config.quality ?? 'high';
    this.outputDir = config.outputDir ?? './output';
  }

  /**
   * Edit an image using OpenAI's image edit API
   */
  async edit(input: ImageEditInput): Promise<ImageEditResult> {
    const { imagePath, prompt } = input;

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Source image not found: ${imagePath}`);
    }

    const outputDir = input.outputDir ?? this.outputDir;
    const size = input.size ?? '1024x1024';
    const quality = input.quality ?? this.quality;

    // Generate filename
    const filename = input.filename ?? `edit-${Date.now()}.png`;
    const outputPath = path.resolve(outputDir, filename);

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Read source image as a File-like object for the API
    const imageBuffer = fs.readFileSync(imagePath);
    const imageFile = new File(
      [imageBuffer],
      path.basename(imagePath),
      { type: 'image/png' }
    );

    // Call OpenAI edit API
    const response = await this.client.images.edit({
      model: this.model,
      image: imageFile,
      prompt,
      n: 1,
      size,
      quality,
    });

    // Save result
    const imageData = response.data[0];
    if (!imageData?.b64_json) {
      throw new Error('No image data returned from edit API');
    }

    const buffer = Buffer.from(imageData.b64_json, 'base64');
    fs.writeFileSync(outputPath, buffer);

    return {
      outputPath,
      prompt,
      model: this.model,
      size,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Factory: create ImageEditor from environment variables
 */
export function createImageEditorFromEnv(clientOverride?: OpenAIImageEditClient): ImageEditor {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey && !clientOverride) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const config: ImageEditorConfig = {
    apiKey: apiKey ?? '',
    model: process.env.MEDIA_KIT_MODEL ?? 'gpt-image-1',
    quality: (process.env.MEDIA_KIT_QUALITY as ImageQuality) ?? 'high',
    outputDir: process.env.MEDIA_KIT_OUTPUT_DIR ?? './output',
  };

  let client: OpenAIImageEditClient;
  if (clientOverride) {
    client = clientOverride;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: OpenAI } = require('openai') as { default: new (opts: { apiKey: string }) => OpenAIImageEditClient };
    client = new OpenAI({ apiKey: config.apiKey });
  }

  return new ImageEditor(client, config);
}
