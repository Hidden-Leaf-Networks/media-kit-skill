import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { ImageGenerator } from '../src/generators/image-generator';
import type { OpenAIImageClient } from '../src/generators/image-generator';
import type { ProductLaunchInput, MilestoneInput } from '../src/types/index';

// Mock OpenAI client
function createMockClient(b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='): OpenAIImageClient {
  return {
    images: {
      generate: jest.fn().mockResolvedValue({
        data: [{ b64_json: b64Data }],
      }),
    },
  };
}

function createFailingClient(): OpenAIImageClient {
  return {
    images: {
      generate: jest.fn().mockResolvedValue({
        data: [{}],
      }),
    },
  };
}

describe('ImageGenerator', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'media-kit-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  const productInput: ProductLaunchInput = {
    template: 'product-launch',
    format: 'linkedin',
    productName: 'Test Skill',
    tagline: 'Testing is easy',
    features: ['Feature A', 'Feature B', 'Feature C'],
    logo: false, // disable compositing for mock image tests
    outputDir: '', // will be set in tests
  };

  it('generates an image and saves to disk', async () => {
    const client = createMockClient();
    const generator = new ImageGenerator(client, {
      apiKey: 'test-key',
      outputDir: tmpDir,
    });

    const input = { ...productInput, outputDir: tmpDir };
    const result = await generator.generate(input);

    expect(result.outputPath).toContain(tmpDir);
    expect(result.outputPath).toEndWith('.png');
    expect(fs.existsSync(result.outputPath)).toBe(true);
    expect(result.model).toBe('gpt-image-2');
    expect(result.format).toBe('linkedin');
    expect(result.dimensions).toEqual({ width: 1200, height: 624 });
    expect(result.prompt).toContain('Test Skill');
  });

  it('calls OpenAI API with correct parameters', async () => {
    const client = createMockClient();
    const generator = new ImageGenerator(client, {
      apiKey: 'test-key',
      model: 'dall-e-3',
      outputDir: tmpDir,
    });

    const input = { ...productInput, outputDir: tmpDir };
    await generator.generate(input);

    expect(client.images.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'dall-e-3',
        n: 1,
        size: '1200x624',
        quality: 'medium',
        output_format: 'png',
      }),
    );
  });

  it('uses custom filename when provided', async () => {
    const client = createMockClient();
    const generator = new ImageGenerator(client, {
      apiKey: 'test-key',
      outputDir: tmpDir,
    });

    const input = { ...productInput, outputDir: tmpDir, filename: 'custom-name.png' };
    const result = await generator.generate(input);

    expect(result.outputPath).toBe(path.resolve(tmpDir, 'custom-name.png'));
  });

  it('generates slug-based filename from product name', async () => {
    const client = createMockClient();
    const generator = new ImageGenerator(client, {
      apiKey: 'test-key',
      outputDir: tmpDir,
    });

    const input = { ...productInput, outputDir: tmpDir };
    const result = await generator.generate(input);

    expect(result.outputPath).toContain('product-launch-test-skill-linkedin-');
  });

  it('throws on invalid input', async () => {
    const client = createMockClient();
    const generator = new ImageGenerator(client, {
      apiKey: 'test-key',
      outputDir: tmpDir,
    });

    const badInput = { ...productInput, productName: '', outputDir: tmpDir };
    await expect(generator.generate(badInput)).rejects.toThrow('Invalid input');
  });

  it('throws when API returns no image data', async () => {
    const client = createFailingClient();
    const generator = new ImageGenerator(client, {
      apiKey: 'test-key',
      outputDir: tmpDir,
    });

    const input = { ...productInput, outputDir: tmpDir };
    await expect(generator.generate(input)).rejects.toThrow('No image data returned');
  });

  it('creates output directory if it does not exist', async () => {
    const client = createMockClient();
    const nestedDir = path.join(tmpDir, 'nested', 'deep');
    const generator = new ImageGenerator(client, {
      apiKey: 'test-key',
      outputDir: nestedDir,
    });

    const input = { ...productInput, outputDir: nestedDir };
    const result = await generator.generate(input);

    expect(fs.existsSync(result.outputPath)).toBe(true);
  });

  it('includes timestamp in result', async () => {
    const client = createMockClient();
    const generator = new ImageGenerator(client, {
      apiKey: 'test-key',
      outputDir: tmpDir,
    });

    const input = { ...productInput, outputDir: tmpDir };
    const result = await generator.generate(input);

    expect(result.timestamp).toBeDefined();
    // Should be a valid ISO date
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });

  it('uses high quality when specified in input', async () => {
    const client = createMockClient();
    const generator = new ImageGenerator(client, {
      apiKey: 'test-key',
      outputDir: tmpDir,
    });

    const input = { ...productInput, outputDir: tmpDir, quality: 'high' as const };
    await generator.generate(input);

    expect(client.images.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        quality: 'high',
      }),
    );
  });

  it('defaults to medium quality', async () => {
    const client = createMockClient();
    const generator = new ImageGenerator(client, {
      apiKey: 'test-key',
      outputDir: tmpDir,
    });

    const input = { ...productInput, outputDir: tmpDir };
    await generator.generate(input);

    expect(client.images.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        quality: 'medium',
      }),
    );
  });

  it('works with milestone template', async () => {
    const client = createMockClient();
    const generator = new ImageGenerator(client, {
      apiKey: 'test-key',
      outputDir: tmpDir,
    });

    const milestoneInput: MilestoneInput = {
      template: 'milestone',
      format: 'instagram',
      announcement: 'Big News Dropping',
      details: ['Detail 1', 'Detail 2'],
      logo: false,
      outputDir: tmpDir,
    };

    const result = await generator.generate(milestoneInput);
    expect(result.format).toBe('instagram');
    expect(result.dimensions).toEqual({ width: 1088, height: 1088 });
    expect(result.prompt).toContain('Big News Dropping');
  });
});

describe('createImageGeneratorFromEnv', () => {
  it('throws without OPENAI_API_KEY and no client override', () => {
    delete process.env.OPENAI_API_KEY;
    const { createImageGeneratorFromEnv } = require('../src/generators/image-generator');
    expect(() => createImageGeneratorFromEnv()).toThrow('OPENAI_API_KEY');
  });

  it('accepts a client override without needing API key', () => {
    delete process.env.OPENAI_API_KEY;
    const { createImageGeneratorFromEnv } = require('../src/generators/image-generator');
    const mockClient = createMockClient();
    const generator = createImageGeneratorFromEnv(mockClient);
    expect(generator).toBeInstanceOf(ImageGenerator);
  });
});

// Custom matcher for string ending
expect.extend({
  toEndWith(received: string, suffix: string) {
    const pass = received.endsWith(suffix);
    return {
      message: () => `expected "${received}" to end with "${suffix}"`,
      pass,
    };
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toEndWith(suffix: string): R;
    }
  }
}
