/**
 * Text Generator — wraps OpenAI chat completions for marketing copy
 */

import type {
  TextGeneratorConfig,
  CopyResult,
  CopyFormat,
  CopyTone,
  MediaKitInput,
  MediaKitResult,
  VideoGenerationInput,
} from '../types/index.js';
import { COPY_FORMAT_RULES } from '../types/index.js';
import { buildCopyPrompts, validateCopyInput } from './copy-builder.js';
import { buildPrompt, validateInput } from './prompt-builder.js';
import { ImageGenerator } from './image-generator.js';
import { ImageEditor } from './image-editor.js';
import { VideoGenerator } from './video-generator.js';

/** OpenAI chat client interface (subset we need) */
export interface OpenAIChatClient {
  chat: {
    completions: {
      create(params: {
        model: string;
        messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
        max_tokens?: number;
        temperature?: number;
      }): Promise<{ choices: Array<{ message: { content: string | null } }> }>;
    };
  };
}

export class TextGenerator {
  private client: OpenAIChatClient;
  private model: string;

  constructor(client: OpenAIChatClient, config: TextGeneratorConfig) {
    this.client = client;
    this.model = config.model ?? 'gpt-4o';
  }

  /**
   * Generate marketing copy from structured input
   */
  async generate(
    input: MediaKitInput,
    copyFormat: CopyFormat,
    tone?: CopyTone,
  ): Promise<CopyResult> {
    // Validate
    const inputErrors = validateInput(input);
    const copyErrors = validateCopyInput(copyFormat);
    const errors = [...inputErrors, ...copyErrors];
    if (errors.length > 0) {
      throw new Error(`Invalid input: ${errors.join('; ')}`);
    }

    // Build prompts
    const { system, user } = buildCopyPrompts(input, copyFormat, tone);

    // Determine max tokens from format rules
    const rules = COPY_FORMAT_RULES[copyFormat];
    // Rough char-to-token ratio: ~4 chars per token, add buffer
    const maxTokens = Math.ceil(rules.maxLength / 3);

    // Call OpenAI
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      throw new Error('No text returned from API');
    }

    return {
      text: text.trim(),
      format: copyFormat,
      template: input.template,
      model: this.model,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Generate both image and copy from a single input
 */
export async function generateKit(
  input: MediaKitInput,
  options: {
    imageGenerator?: ImageGenerator;
    imageEditor?: ImageEditor;
    textGenerator?: TextGenerator;
    videoGenerator?: VideoGenerator;
    videoInput?: VideoGenerationInput;
    copyFormat?: CopyFormat;
    tone?: CopyTone;
  },
): Promise<MediaKitResult> {
  const result: MediaKitResult = {};

  const tasks: Promise<void>[] = [];

  // brand-avatar with sourceImage → route to ImageEditor for exact logo preservation
  if (input.template === 'brand-avatar' && input.sourceImage && options.imageEditor) {
    const prompt = buildPrompt(input);
    tasks.push(
      options.imageEditor.edit({
        imagePath: input.sourceImage,
        prompt,
        size: '1024x1024',
        outputDir: input.outputDir,
        filename: input.filename,
      }).then((editResult) => {
        result.image = {
          outputPath: editResult.outputPath,
          prompt: editResult.prompt,
          model: editResult.model,
          format: input.format,
          dimensions: { width: 1024, height: 1024 },
          timestamp: editResult.timestamp,
        };
      }),
    );
  } else if (options.imageGenerator) {
    tasks.push(
      options.imageGenerator.generate(input).then((img) => {
        result.image = img;
      }),
    );
  }

  if (options.textGenerator && options.copyFormat) {
    tasks.push(
      options.textGenerator.generate(input, options.copyFormat, options.tone).then((copy) => {
        result.copy = copy;
      }),
    );
  }

  if (options.videoGenerator && options.videoInput) {
    tasks.push(
      options.videoGenerator.generate(options.videoInput).then((vid) => {
        result.video = vid;
      }),
    );
  }

  await Promise.all(tasks);

  return result;
}

/**
 * Factory: create TextGenerator from environment variables
 */
export function createTextGeneratorFromEnv(clientOverride?: OpenAIChatClient): TextGenerator {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey && !clientOverride) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const config: TextGeneratorConfig = {
    apiKey: apiKey ?? '',
    model: process.env.MEDIA_KIT_TEXT_MODEL ?? 'gpt-4o',
  };

  let client: OpenAIChatClient;
  if (clientOverride) {
    client = clientOverride;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: OpenAI } = require('openai') as { default: new (opts: { apiKey: string }) => OpenAIChatClient };
    client = new OpenAI({ apiKey: config.apiKey });
  }

  return new TextGenerator(client, config);
}
