import { TextGenerator, generateKit } from '../src/generators/text-generator';
import { ImageGenerator } from '../src/generators/image-generator';
import type { OpenAIChatClient } from '../src/generators/text-generator';
import type { OpenAIImageClient } from '../src/generators/image-generator';
import type { ServicePromoInput, CaseStudyInput } from '../src/types/index';

const mockChatClient: OpenAIChatClient = {
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Your business deserves a website that works as hard as you do.\n\nI build clean, mobile-first sites for small businesses in Metro Detroit — starting at $950, launched in weeks.\n\nDM me for a free 5-minute site audit.' } }],
      }),
    },
  },
};

const servicePromoInput: ServicePromoInput = {
  template: 'service-promo',
  format: 'og',
  serviceName: 'Professional Website',
  price: 'Starting at $950',
  benefits: ['Mobile-first design', 'Launched in weeks', 'No templates'],
  cta: 'DM me to get started',
};

const caseStudyInput: CaseStudyInput = {
  template: 'case-study',
  format: 'instagram',
  clientName: 'KYC Doggz',
  businessType: 'Food Vendor',
  headline: 'From no web presence to a full menu site',
  results: ['Full menu online', 'Gallery + events page', 'Contact form live'],
};

describe('TextGenerator', () => {
  let generator: TextGenerator;

  beforeEach(() => {
    jest.clearAllMocks();
    generator = new TextGenerator(mockChatClient, { apiKey: 'test-key' });
  });

  describe('generate', () => {
    it('generates copy for service-promo', async () => {
      const result = await generator.generate(servicePromoInput, 'facebook-post');
      expect(result.text).toBeTruthy();
      expect(result.format).toBe('facebook-post');
      expect(result.template).toBe('service-promo');
      expect(result.model).toBe('gpt-4o');
      expect(result.timestamp).toBeTruthy();
    });

    it('generates copy for case-study', async () => {
      const result = await generator.generate(caseStudyInput, 'group-outreach', 'community');
      expect(result.template).toBe('case-study');
      expect(result.format).toBe('group-outreach');
    });

    it('calls OpenAI with correct message structure', async () => {
      await generator.generate(servicePromoInput, 'linkedin-post', 'professional');
      const createFn = mockChatClient.chat.completions.create as jest.Mock;
      expect(createFn).toHaveBeenCalledTimes(1);

      const callArgs = createFn.mock.calls[0][0];
      expect(callArgs.model).toBe('gpt-4o');
      expect(callArgs.messages).toHaveLength(2);
      expect(callArgs.messages[0].role).toBe('system');
      expect(callArgs.messages[1].role).toBe('user');
      expect(callArgs.temperature).toBe(0.7);
    });

    it('uses custom model from config', async () => {
      const customGen = new TextGenerator(mockChatClient, { apiKey: 'test', model: 'gpt-4o-mini' });
      const result = await customGen.generate(servicePromoInput, 'ad-copy');
      expect(result.model).toBe('gpt-4o-mini');
    });

    it('trims whitespace from response', async () => {
      (mockChatClient.chat.completions.create as jest.Mock).mockResolvedValueOnce({
        choices: [{ message: { content: '  Hello world  \n\n' } }],
      });
      const result = await generator.generate(servicePromoInput, 'facebook-post');
      expect(result.text).toBe('Hello world');
    });

    it('throws on empty response', async () => {
      (mockChatClient.chat.completions.create as jest.Mock).mockResolvedValueOnce({
        choices: [{ message: { content: null } }],
      });
      await expect(generator.generate(servicePromoInput, 'facebook-post'))
        .rejects.toThrow('No text returned from API');
    });

    it('throws on invalid input', async () => {
      const badInput = { ...servicePromoInput, serviceName: '' };
      await expect(generator.generate(badInput, 'facebook-post'))
        .rejects.toThrow('Invalid input');
    });

    it('throws on invalid copyFormat', async () => {
      await expect(generator.generate(servicePromoInput, 'tiktok' as any))
        .rejects.toThrow('Invalid input');
    });

    it('generates for all copy formats', async () => {
      const formats = ['facebook-post', 'instagram-caption', 'linkedin-post', 'group-outreach', 'ad-copy'] as const;
      for (const format of formats) {
        const result = await generator.generate(servicePromoInput, format);
        expect(result.format).toBe(format);
      }
    });
  });
});

describe('generateKit', () => {
  it('generates copy only when no image generator provided', async () => {
    const textGen = new TextGenerator(mockChatClient, { apiKey: 'test' });
    const result = await generateKit(servicePromoInput, {
      textGenerator: textGen,
      copyFormat: 'facebook-post',
    });
    expect(result.copy).toBeTruthy();
    expect(result.image).toBeUndefined();
  });

  it('returns empty result when no generators provided', async () => {
    const result = await generateKit(servicePromoInput, {});
    expect(result.copy).toBeUndefined();
    expect(result.image).toBeUndefined();
  });

  it('passes tone through to text generator', async () => {
    const textGen = new TextGenerator(mockChatClient, { apiKey: 'test' });
    const result = await generateKit(servicePromoInput, {
      textGenerator: textGen,
      copyFormat: 'group-outreach',
      tone: 'community',
    });
    expect(result.copy?.format).toBe('group-outreach');
  });
});
