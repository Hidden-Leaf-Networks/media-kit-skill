/**
 * Video Generator — wraps AI SDK v6 experimental_generateVideo
 *
 * Supports multiple providers via Vercel AI Gateway model strings.
 * Follows the same pattern as ImageGenerator for consistency.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { experimental_generateVideo as generateVideo } from 'ai';
import type {
  VideoGeneratorConfig,
  VideoGenerationInput,
  VideoResult,
  VideoProvider,
  VideoAspectRatio,
  VideoResolution,
} from '../types/index.js';
import { VIDEO_PROVIDER_MODELS, VIDEO_RESOLUTIONS } from '../types/index.js';

/** Default configuration values */
const DEFAULTS = {
  model: VIDEO_PROVIDER_MODELS.kling,
  duration: 5,
  aspectRatio: '16:9' as VideoAspectRatio,
  resolution: '1080p' as VideoResolution,
  outputDir: './output',
  pollTimeoutMs: 600_000, // 10 minutes
};

export class VideoGenerator {
  private model: string;
  private duration: number;
  private aspectRatio: VideoAspectRatio;
  private resolution: VideoResolution;
  private outputDir: string;
  private pollTimeoutMs: number;

  constructor(config: VideoGeneratorConfig = {}) {
    // Provider shorthand resolves to model string
    if (config.provider && !config.model) {
      this.model = VIDEO_PROVIDER_MODELS[config.provider];
    } else {
      this.model = config.model ?? DEFAULTS.model;
    }

    this.duration = config.duration ?? DEFAULTS.duration;
    this.aspectRatio = config.aspectRatio ?? DEFAULTS.aspectRatio;
    this.resolution = config.resolution ?? DEFAULTS.resolution;
    this.outputDir = config.outputDir ?? DEFAULTS.outputDir;
    this.pollTimeoutMs = config.pollTimeoutMs ?? DEFAULTS.pollTimeoutMs;
  }

  /**
   * Generate a video from a text prompt (and optional source image)
   */
  async generate(input: VideoGenerationInput): Promise<VideoResult> {
    const model = this.resolveModel(input);
    const duration = input.duration ?? this.duration;
    const aspectRatio = input.aspectRatio ?? this.aspectRatio;
    const resolution = input.resolution ?? this.resolution;
    const outputDir = input.outputDir ?? this.outputDir;
    const resolutionStr = VIDEO_RESOLUTIONS[resolution];

    // Build prompt — text-only or image-to-video
    const prompt = input.sourceImage
      ? { text: input.prompt, image: input.sourceImage }
      : input.prompt;

    // Generate video via AI SDK
    const { video } = await generateVideo({
      model,
      prompt,
      aspectRatio,
      resolution: resolutionStr as `${number}x${number}`,
      duration,
      abortSignal: AbortSignal.timeout(this.pollTimeoutMs),
    });

    if (!video) {
      throw new Error('No video data returned from API');
    }

    // Save to file
    const filename = input.filename ?? this.generateFilename(input, model);
    const outputPath = path.resolve(outputDir, filename);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, Buffer.from(video.uint8Array));

    return {
      outputPath,
      prompt: typeof prompt === 'string' ? prompt : prompt.text,
      model: typeof model === 'string' ? model : String(model),
      duration,
      aspectRatio,
      resolution,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Resolve the model from input overrides or defaults
   */
  private resolveModel(input: VideoGenerationInput): string {
    if (input.model) return input.model;
    if (input.provider) return VIDEO_PROVIDER_MODELS[input.provider];
    return this.model;
  }

  /**
   * Generate a filename for the video
   */
  private generateFilename(input: VideoGenerationInput, model: string | object): string {
    const timestamp = Date.now();
    const modelSlug = (typeof model === 'string' ? model : 'video')
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase();
    const promptSlug = input.prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 30);
    return `video-${modelSlug}-${promptSlug}-${timestamp}.mp4`;
  }
}

/**
 * Factory: create VideoGenerator from environment variables
 *
 * Env vars:
 *   MEDIA_KIT_VIDEO_MODEL — AI Gateway model string (e.g., "kling/kling-v2.6-t2v")
 *   MEDIA_KIT_VIDEO_PROVIDER — Shorthand: kling, runway, veo, seedance, fal
 *   MEDIA_KIT_VIDEO_DURATION — Default duration in seconds
 *   MEDIA_KIT_VIDEO_ASPECT_RATIO — Default aspect ratio
 *   MEDIA_KIT_VIDEO_RESOLUTION — Default resolution (720p, 1080p)
 *   MEDIA_KIT_OUTPUT_DIR — Output directory
 */
export function createVideoGeneratorFromEnv(): VideoGenerator {
  const config: VideoGeneratorConfig = {};

  if (process.env.MEDIA_KIT_VIDEO_MODEL) {
    config.model = process.env.MEDIA_KIT_VIDEO_MODEL;
  }
  if (process.env.MEDIA_KIT_VIDEO_PROVIDER) {
    config.provider = process.env.MEDIA_KIT_VIDEO_PROVIDER as VideoProvider;
  }
  if (process.env.MEDIA_KIT_VIDEO_DURATION) {
    config.duration = parseInt(process.env.MEDIA_KIT_VIDEO_DURATION, 10);
  }
  if (process.env.MEDIA_KIT_VIDEO_ASPECT_RATIO) {
    config.aspectRatio = process.env.MEDIA_KIT_VIDEO_ASPECT_RATIO as VideoAspectRatio;
  }
  if (process.env.MEDIA_KIT_VIDEO_RESOLUTION) {
    config.resolution = process.env.MEDIA_KIT_VIDEO_RESOLUTION as VideoResolution;
  }
  if (process.env.MEDIA_KIT_OUTPUT_DIR) {
    config.outputDir = process.env.MEDIA_KIT_OUTPUT_DIR;
  }

  return new VideoGenerator(config);
}
