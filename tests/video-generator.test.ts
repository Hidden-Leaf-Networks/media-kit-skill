import { VideoGenerator } from '../src/generators/video-generator';
import { VIDEO_PROVIDER_MODELS, VIDEO_RESOLUTIONS } from '../src/types/index';
import type { VideoGeneratorConfig, VideoGenerationInput } from '../src/types/index';

// Mock the AI SDK
jest.mock('ai', () => ({
  experimental_generateVideo: jest.fn(),
}));

// Mock fs
jest.mock('node:fs', () => ({
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

import { experimental_generateVideo } from 'ai';
import * as fs from 'node:fs';

const mockGenerateVideo = experimental_generateVideo as jest.MockedFunction<typeof experimental_generateVideo>;

describe('VideoGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateVideo.mockResolvedValue({
      video: {
        base64: 'dmlkZW9kYXRh', // "videodata" in base64
        uint8Array: new Uint8Array([118, 105, 100, 101, 111]),
      },
      warnings: [],
    } as any);
  });

  describe('constructor', () => {
    it('uses kling as default model', () => {
      const gen = new VideoGenerator();
      expect(gen).toBeTruthy();
    });

    it('resolves provider shorthand to model string', () => {
      const gen = new VideoGenerator({ provider: 'runway' });
      expect(gen).toBeTruthy();
    });

    it('accepts custom model string', () => {
      const gen = new VideoGenerator({ model: 'custom/model-v1' });
      expect(gen).toBeTruthy();
    });
  });

  describe('generate', () => {
    const defaultInput: VideoGenerationInput = {
      prompt: 'A sleek product launch animation with teal accents on dark background',
    };

    it('calls experimental_generateVideo with correct params', async () => {
      const gen = new VideoGenerator();
      await gen.generate(defaultInput);

      expect(mockGenerateVideo).toHaveBeenCalledTimes(1);
      const call = mockGenerateVideo.mock.calls[0][0];
      expect(call.prompt).toBe(defaultInput.prompt);
      expect(call.aspectRatio).toBe('16:9');
      expect(call.resolution).toBe('1920x1080');
      expect(call.duration).toBe(5);
    });

    it('returns VideoResult with correct fields', async () => {
      const gen = new VideoGenerator({ outputDir: '/tmp/test-output' });
      const result = await gen.generate(defaultInput);

      expect(result.prompt).toBe(defaultInput.prompt);
      expect(result.duration).toBe(5);
      expect(result.aspectRatio).toBe('16:9');
      expect(result.resolution).toBe('1080p');
      expect(result.model).toBeTruthy();
      expect(result.timestamp).toBeTruthy();
      expect(result.outputPath).toContain('.mp4');
    });

    it('writes video data to file', async () => {
      const gen = new VideoGenerator({ outputDir: '/tmp/test-output' });
      await gen.generate(defaultInput);

      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('.mp4'),
        expect.any(Buffer),
      );
    });

    it('uses provider override from input', async () => {
      const gen = new VideoGenerator({ provider: 'kling' });
      await gen.generate({ ...defaultInput, provider: 'veo' });

      const call = mockGenerateVideo.mock.calls[0][0];
      expect(call.model).toBe(VIDEO_PROVIDER_MODELS.veo);
    });

    it('uses model override from input', async () => {
      const gen = new VideoGenerator();
      await gen.generate({ ...defaultInput, model: 'custom/my-model' });

      const call = mockGenerateVideo.mock.calls[0][0];
      expect(call.model).toBe('custom/my-model');
    });

    it('supports custom duration', async () => {
      const gen = new VideoGenerator();
      await gen.generate({ ...defaultInput, duration: 10 });

      const call = mockGenerateVideo.mock.calls[0][0];
      expect(call.duration).toBe(10);
    });

    it('supports custom aspect ratio', async () => {
      const gen = new VideoGenerator();
      await gen.generate({ ...defaultInput, aspectRatio: '9:16' });

      const call = mockGenerateVideo.mock.calls[0][0];
      expect(call.aspectRatio).toBe('9:16');
    });

    it('supports custom resolution', async () => {
      const gen = new VideoGenerator();
      await gen.generate({ ...defaultInput, resolution: '720p' });

      const call = mockGenerateVideo.mock.calls[0][0];
      expect(call.resolution).toBe('1280x720');
    });

    it('supports image-to-video with source image', async () => {
      const gen = new VideoGenerator();
      await gen.generate({
        ...defaultInput,
        sourceImage: 'https://example.com/screenshot.png',
      });

      const call = mockGenerateVideo.mock.calls[0][0];
      expect(call.prompt).toEqual({
        text: defaultInput.prompt,
        image: 'https://example.com/screenshot.png',
      });
    });

    it('uses custom filename when provided', async () => {
      const gen = new VideoGenerator({ outputDir: '/tmp/test-output' });
      const result = await gen.generate({
        ...defaultInput,
        filename: 'my-custom-video.mp4',
      });

      expect(result.outputPath).toContain('my-custom-video.mp4');
    });

    it('throws when no video data returned', async () => {
      mockGenerateVideo.mockResolvedValue({ video: undefined, warnings: [] } as any);
      const gen = new VideoGenerator();

      await expect(gen.generate(defaultInput)).rejects.toThrow('No video data returned');
    });
  });
});

describe('VIDEO_PROVIDER_MODELS', () => {
  it('has all 5 providers', () => {
    expect(Object.keys(VIDEO_PROVIDER_MODELS)).toHaveLength(5);
    expect(VIDEO_PROVIDER_MODELS.kling).toBeTruthy();
    expect(VIDEO_PROVIDER_MODELS.runway).toBeTruthy();
    expect(VIDEO_PROVIDER_MODELS.veo).toBeTruthy();
    expect(VIDEO_PROVIDER_MODELS.seedance).toBeTruthy();
    expect(VIDEO_PROVIDER_MODELS.fal).toBeTruthy();
  });
});

describe('VIDEO_RESOLUTIONS', () => {
  it('maps 720p and 1080p', () => {
    expect(VIDEO_RESOLUTIONS['720p']).toBe('1280x720');
    expect(VIDEO_RESOLUTIONS['1080p']).toBe('1920x1080');
  });
});
