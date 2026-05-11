import {
  buildCopyConfig,
  assembleCopySystemPrompt,
  assembleCopyUserPrompt,
  buildCopyPrompts,
  validateCopyInput,
} from '../src/generators/copy-builder';
import type { ServicePromoInput, CaseStudyInput, ProductLaunchInput, MilestoneInput } from '../src/types/index';

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

const productLaunchInput: ProductLaunchInput = {
  template: 'product-launch',
  format: 'linkedin',
  productName: 'LeafCore Stack',
  tagline: 'Ship client sites in days, not months',
  features: ['DESIGN.md system', 'Next.js 16 scaffold', 'Auto SEO'],
  version: '1.0',
};

const milestoneInput: MilestoneInput = {
  template: 'milestone',
  format: 'facebook-cover',
  announcement: 'Hidden Leaf Web Studio is live',
  details: ['Professional websites for small businesses', 'Metro Detroit focus'],
  date: 'May 2026',
};

describe('Copy Builder', () => {
  describe('buildCopyConfig', () => {
    it('routes service-promo to correct copy config', () => {
      const config = buildCopyConfig(servicePromoInput, 'facebook-post');
      expect(config.template).toBe('service-promo');
      expect(config.format).toBe('facebook-post');
      expect(config.sections.length).toBeGreaterThan(0);
      expect(config.brandVoice.tone).toBe('conversational'); // default
    });

    it('routes case-study to correct copy config', () => {
      const config = buildCopyConfig(caseStudyInput, 'group-outreach', 'community');
      expect(config.template).toBe('case-study');
      expect(config.brandVoice.tone).toBe('community');
    });

    it('routes product-launch to correct copy config', () => {
      const config = buildCopyConfig(productLaunchInput, 'linkedin-post');
      expect(config.template).toBe('product-launch');
      expect(config.brandVoice.tone).toBe('professional'); // default for product-launch
    });

    it('routes milestone to correct copy config', () => {
      const config = buildCopyConfig(milestoneInput, 'instagram-caption');
      expect(config.template).toBe('milestone');
    });

    it('respects tone override', () => {
      const config = buildCopyConfig(servicePromoInput, 'linkedin-post', 'professional');
      expect(config.brandVoice.tone).toBe('professional');
    });
  });

  describe('assembleCopySystemPrompt', () => {
    it('includes identity section', () => {
      const config = buildCopyConfig(servicePromoInput, 'facebook-post');
      const prompt = assembleCopySystemPrompt(config);
      expect(prompt).toContain('## Identity');
      expect(prompt).toContain('Tre');
    });

    it('includes platform section with format rules', () => {
      const config = buildCopyConfig(servicePromoInput, 'facebook-post');
      const prompt = assembleCopySystemPrompt(config);
      expect(prompt).toContain('## Platform');
      expect(prompt).toContain('500 characters');
    });

    it('includes voice do/dont rules', () => {
      const config = buildCopyConfig(servicePromoInput, 'group-outreach');
      const prompt = assembleCopySystemPrompt(config);
      expect(prompt).toContain('## Voice — Do');
      expect(prompt).toContain('## Voice — Don\'t');
      expect(prompt).toContain('Sell outcomes');
    });

    it('includes output rules', () => {
      const config = buildCopyConfig(servicePromoInput, 'ad-copy');
      const prompt = assembleCopySystemPrompt(config);
      expect(prompt).toContain('Return ONLY the post text');
    });

    it('enforces no hashtags for facebook-post', () => {
      const config = buildCopyConfig(servicePromoInput, 'facebook-post');
      const prompt = assembleCopySystemPrompt(config);
      expect(prompt).toContain('Do not use hashtags');
    });

    it('allows hashtags for instagram', () => {
      const config = buildCopyConfig(servicePromoInput, 'instagram-caption');
      const prompt = assembleCopySystemPrompt(config);
      expect(prompt).toContain('3-5 relevant hashtags');
    });

    it('enforces no emojis for linkedin', () => {
      const config = buildCopyConfig(servicePromoInput, 'linkedin-post');
      const prompt = assembleCopySystemPrompt(config);
      expect(prompt).toContain('Do not use emojis');
    });
  });

  describe('assembleCopyUserPrompt', () => {
    it('includes template type and format', () => {
      const config = buildCopyConfig(servicePromoInput, 'group-outreach');
      const prompt = assembleCopyUserPrompt(config);
      expect(prompt).toContain('group-outreach');
      expect(prompt).toContain('service-promo');
    });

    it('includes all section instructions', () => {
      const config = buildCopyConfig(servicePromoInput, 'facebook-post');
      const prompt = assembleCopyUserPrompt(config);
      expect(prompt).toContain('Professional Website');
      expect(prompt).toContain('$950');
      expect(prompt).toContain('DM me to get started');
    });

    it('includes case study details', () => {
      const config = buildCopyConfig(caseStudyInput, 'facebook-post');
      const prompt = assembleCopyUserPrompt(config);
      expect(prompt).toContain('Food Vendor');
      expect(prompt).toContain('From no web presence to a full menu site');
    });
  });

  describe('buildCopyPrompts', () => {
    it('returns both system and user prompts', () => {
      const { system, user } = buildCopyPrompts(servicePromoInput, 'facebook-post');
      expect(system).toContain('## Identity');
      expect(user).toContain('service-promo');
    });

    it('passes tone through', () => {
      const { system } = buildCopyPrompts(servicePromoInput, 'group-outreach', 'community');
      expect(system).toContain('community');
    });
  });

  describe('validateCopyInput', () => {
    it('returns no errors for valid format', () => {
      expect(validateCopyInput('facebook-post')).toEqual([]);
      expect(validateCopyInput('instagram-caption')).toEqual([]);
      expect(validateCopyInput('linkedin-post')).toEqual([]);
      expect(validateCopyInput('group-outreach')).toEqual([]);
      expect(validateCopyInput('ad-copy')).toEqual([]);
    });

    it('returns error for undefined format', () => {
      const errors = validateCopyInput(undefined);
      expect(errors).toContain('copyFormat is required for text generation');
    });

    it('returns error for invalid format', () => {
      const errors = validateCopyInput('tiktok' as any);
      expect(errors[0]).toContain('Invalid copyFormat');
    });
  });
});
