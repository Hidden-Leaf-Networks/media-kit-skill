import { buildPrompt, buildPromptConfig, assemblePrompt, validateInput } from '../src/generators/prompt-builder';
import type { ProductLaunchInput, CaseStudyInput, ServicePromoInput, MilestoneInput } from '../src/types/index';

const productLaunchInput: ProductLaunchInput = {
  template: 'product-launch',
  format: 'linkedin',
  productName: 'Atlassian Skill',
  tagline: 'Jira + Confluence in your terminal',
  features: ['Issue Management', 'Confluence Docs', 'Bitbucket PRs'],
  version: '1.0',
};

const caseStudyInput: CaseStudyInput = {
  template: 'case-study',
  format: 'instagram',
  clientName: 'KYC Doggz',
  businessType: 'Street Vendor / Pet Business',
  headline: 'Street Vendor Goes Digital',
  results: ['Online ordering live', '3x customer reach', 'Professional brand identity'],
};

const servicePromoInput: ServicePromoInput = {
  template: 'service-promo',
  format: 'og',
  serviceName: 'AI Operations Audit',
  price: '$300',
  benefits: ['Full workflow analysis', 'AI integration roadmap', 'ROI projections'],
  cta: 'Book Your Audit Today',
};

const milestoneInput: MilestoneInput = {
  template: 'milestone',
  format: 'facebook-cover',
  announcement: 'Year 2: Scaling Operations',
  details: ['6 active ventures', 'Studio model launched', 'Detroit to global'],
  date: 'April 2026',
};

describe('Prompt Builder', () => {
  describe('buildPromptConfig', () => {
    it('routes product-launch to correct config builder', () => {
      const config = buildPromptConfig(productLaunchInput);
      expect(config.template).toBe('product-launch');
      expect(config.format).toBe('linkedin');
      expect(config.dimensions).toEqual({ width: 1200, height: 627 });
    });

    it('routes case-study to correct config builder', () => {
      const config = buildPromptConfig(caseStudyInput);
      expect(config.template).toBe('case-study');
      expect(config.dimensions).toEqual({ width: 1080, height: 1080 });
    });

    it('routes service-promo to correct config builder', () => {
      const config = buildPromptConfig(servicePromoInput);
      expect(config.template).toBe('service-promo');
      expect(config.dimensions).toEqual({ width: 1200, height: 630 });
    });

    it('routes milestone to correct config builder', () => {
      const config = buildPromptConfig(milestoneInput);
      expect(config.template).toBe('milestone');
      expect(config.dimensions).toEqual({ width: 820, height: 312 });
    });
  });

  describe('assemblePrompt', () => {
    it('includes brand colors in the prompt', () => {
      const config = buildPromptConfig(productLaunchInput);
      const prompt = assemblePrompt(config);
      expect(prompt).toContain('#00D4FF');
      expect(prompt).toContain('#0A0A1A');
      expect(prompt).toContain('#FFFFFF');
      expect(prompt).toContain('#1A3A4A');
    });

    it('includes dimensions in the prompt', () => {
      const config = buildPromptConfig(productLaunchInput);
      const prompt = assemblePrompt(config);
      expect(prompt).toContain('1200x627');
    });

    it('includes brand name and URL', () => {
      const config = buildPromptConfig(caseStudyInput);
      const prompt = assemblePrompt(config);
      expect(prompt).toContain('Hidden Leaf Networks');
      expect(prompt).toContain('hiddenleafnetworks.com');
    });

    it('includes typography guidelines', () => {
      const config = buildPromptConfig(servicePromoInput);
      const prompt = assemblePrompt(config);
      expect(prompt).toContain('Bold weight');
      expect(prompt).toContain('sans-serif');
    });

    it('includes visual motifs section', () => {
      const config = buildPromptConfig(milestoneInput);
      const prompt = assemblePrompt(config);
      expect(prompt).toContain('Visual Motifs');
      expect(prompt).toContain('Detroit skyline');
    });

    it('includes quality directives', () => {
      const config = buildPromptConfig(productLaunchInput);
      const prompt = assemblePrompt(config);
      expect(prompt).toContain('Quality Directives');
      expect(prompt).toContain('No watermarks');
    });
  });

  describe('buildPrompt (full pipeline)', () => {
    it('produces a non-empty prompt for product-launch', () => {
      const prompt = buildPrompt(productLaunchInput);
      expect(prompt.length).toBeGreaterThan(200);
      expect(prompt).toContain('Atlassian Skill');
      expect(prompt).toContain('Issue Management');
    });

    it('produces a non-empty prompt for case-study', () => {
      const prompt = buildPrompt(caseStudyInput);
      expect(prompt).toContain('KYC Doggz');
      expect(prompt).toContain('Street Vendor Goes Digital');
    });

    it('produces a non-empty prompt for service-promo', () => {
      const prompt = buildPrompt(servicePromoInput);
      expect(prompt).toContain('AI Operations Audit');
      expect(prompt).toContain('$300');
      expect(prompt).toContain('Book Your Audit Today');
    });

    it('produces a non-empty prompt for milestone', () => {
      const prompt = buildPrompt(milestoneInput);
      expect(prompt).toContain('Year 2: Scaling Operations');
      expect(prompt).toContain('April 2026');
    });
  });

  describe('validateInput', () => {
    it('returns empty array for valid product-launch input', () => {
      expect(validateInput(productLaunchInput)).toEqual([]);
    });

    it('returns empty array for valid case-study input', () => {
      expect(validateInput(caseStudyInput)).toEqual([]);
    });

    it('returns empty array for valid service-promo input', () => {
      expect(validateInput(servicePromoInput)).toEqual([]);
    });

    it('returns empty array for valid milestone input', () => {
      expect(validateInput(milestoneInput)).toEqual([]);
    });

    it('catches missing productName', () => {
      const bad = { ...productLaunchInput, productName: '' };
      const errors = validateInput(bad);
      expect(errors).toContain('productName is required for product-launch');
    });

    it('catches wrong features count', () => {
      const bad = { ...productLaunchInput, features: ['one', 'two'] } as unknown as ProductLaunchInput;
      const errors = validateInput(bad);
      expect(errors.some((e) => e.includes('features'))).toBe(true);
    });

    it('catches missing case-study fields', () => {
      const bad = { ...caseStudyInput, clientName: '', results: [] };
      const errors = validateInput(bad);
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });

    it('catches invalid format', () => {
      const bad = { ...productLaunchInput, format: 'twitter' as any };
      const errors = validateInput(bad);
      expect(errors.some((e) => e.includes('Invalid format'))).toBe(true);
    });
  });
});
