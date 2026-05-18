import { buildProductLaunchConfig } from '../src/templates/product-launch';
import { buildCaseStudyConfig } from '../src/templates/case-study';
import { buildServicePromoConfig } from '../src/templates/service-promo';
import { buildMilestoneConfig } from '../src/templates/milestone';
import { buildAgentAvatarConfig } from '../src/templates/agent-avatar';
import { TEMPLATE_DEFINITIONS, getTemplateDefinition, getAllTemplateTypes } from '../src/config/templates';
import type { ProductLaunchInput, CaseStudyInput, ServicePromoInput, MilestoneInput, AgentAvatarInput } from '../src/types/index';

describe('Template Definitions', () => {
  it('has all 5 template types registered', () => {
    const types = getAllTemplateTypes();
    expect(types).toContain('product-launch');
    expect(types).toContain('case-study');
    expect(types).toContain('service-promo');
    expect(types).toContain('milestone');
    expect(types).toContain('agent-avatar');
    expect(types).toHaveLength(5);
  });

  it('each definition has required fields', () => {
    for (const type of getAllTemplateTypes()) {
      const def = getTemplateDefinition(type);
      expect(def.type).toBe(type);
      expect(def.name).toBeTruthy();
      expect(def.description).toBeTruthy();
      expect(def.useCase).toBeTruthy();
      expect(def.layoutDescription).toBeTruthy();
    }
  });
});

describe('Product Launch Template', () => {
  const input: ProductLaunchInput = {
    template: 'product-launch',
    format: 'linkedin',
    productName: 'Media Kit Skill',
    tagline: 'Brand graphics on demand',
    features: ['Auto-branding', 'Multi-format', 'Template system'],
  };

  it('returns correct template type', () => {
    const config = buildProductLaunchConfig(input);
    expect(config.template).toBe('product-launch');
  });

  it('has header, tagline, features, and footer sections', () => {
    const config = buildProductLaunchConfig(input);
    const roles = config.sections.map((s) => s.role);
    expect(roles).toContain('header');
    expect(roles).toContain('tagline');
    expect(roles).toContain('features');
    expect(roles).toContain('footer');
  });

  it('includes product name in header section', () => {
    const config = buildProductLaunchConfig(input);
    const header = config.sections.find((s) => s.role === 'header')!;
    expect(header.content).toContain('Media Kit Skill');
  });

  it('includes all 3 features in features section', () => {
    const config = buildProductLaunchConfig(input);
    const features = config.sections.find((s) => s.role === 'features')!;
    expect(features.content).toContain('Auto-branding');
    expect(features.content).toContain('Multi-format');
    expect(features.content).toContain('Template system');
  });

  it('includes version when provided', () => {
    const withVersion = { ...input, version: '2.0' };
    const config = buildProductLaunchConfig(withVersion);
    const header = config.sections.find((s) => s.role === 'header')!;
    expect(header.content).toContain('v2.0');
  });

  it('enables all brand elements', () => {
    const config = buildProductLaunchConfig(input);
    expect(config.brandElements.logo).toBe(true);
    expect(config.brandElements.url).toBe(true);
    expect(config.brandElements.colorPalette).toBe(true);
  });
});

describe('Case Study Template', () => {
  const input: CaseStudyInput = {
    template: 'case-study',
    format: 'instagram',
    clientName: 'KYC Doggz',
    businessType: 'Pet Business',
    headline: 'Street Vendor Goes Digital',
    results: ['Online ordering', '3x reach'],
  };

  it('includes client name in header', () => {
    const config = buildCaseStudyConfig(input);
    const header = config.sections.find((s) => s.role === 'header')!;
    expect(header.content).toContain('KYC Doggz');
  });

  it('includes headline in dedicated section', () => {
    const config = buildCaseStudyConfig(input);
    const headline = config.sections.find((s) => s.role === 'headline')!;
    expect(headline.content).toContain('Street Vendor Goes Digital');
  });

  it('includes all results', () => {
    const config = buildCaseStudyConfig(input);
    const results = config.sections.find((s) => s.role === 'results')!;
    expect(results.content).toContain('Online ordering');
    expect(results.content).toContain('3x reach');
  });
});

describe('Service Promo Template', () => {
  const input: ServicePromoInput = {
    template: 'service-promo',
    format: 'og',
    serviceName: 'AI Operations Audit',
    price: '$300',
    benefits: ['Workflow analysis', 'AI roadmap', 'ROI projections'],
    cta: 'Book Now',
  };

  it('includes service name and price in header', () => {
    const config = buildServicePromoConfig(input);
    const header = config.sections.find((s) => s.role === 'header')!;
    expect(header.content).toContain('AI Operations Audit');
    expect(header.content).toContain('$300');
  });

  it('includes all benefits', () => {
    const config = buildServicePromoConfig(input);
    const benefits = config.sections.find((s) => s.role === 'benefits')!;
    expect(benefits.content).toContain('Workflow analysis');
    expect(benefits.content).toContain('AI roadmap');
    expect(benefits.content).toContain('ROI projections');
  });

  it('includes CTA', () => {
    const config = buildServicePromoConfig(input);
    const cta = config.sections.find((s) => s.role === 'cta')!;
    expect(cta.content).toContain('Book Now');
  });
});

describe('Milestone Template', () => {
  const input: MilestoneInput = {
    template: 'milestone',
    format: 'linkedin',
    announcement: 'Year 2: Scaling',
    details: ['6 ventures', 'Studio model'],
    date: 'April 2026',
  };

  it('includes announcement as hero text', () => {
    const config = buildMilestoneConfig(input);
    const announcement = config.sections.find((s) => s.role === 'announcement')!;
    expect(announcement.content).toContain('Year 2: Scaling');
  });

  it('includes date when provided', () => {
    const config = buildMilestoneConfig(input);
    const announcement = config.sections.find((s) => s.role === 'announcement')!;
    expect(announcement.content).toContain('April 2026');
  });

  it('includes details', () => {
    const config = buildMilestoneConfig(input);
    const details = config.sections.find((s) => s.role === 'details')!;
    expect(details.content).toContain('6 ventures');
    expect(details.content).toContain('Studio model');
  });

  it('includes Detroit skyline in background section', () => {
    const config = buildMilestoneConfig(input);
    const bg = config.sections.find((s) => s.role === 'background')!;
    expect(bg.content).toContain('Detroit');
  });
});

describe('Agent Avatar Template', () => {
  const input: AgentAvatarInput = {
    template: 'agent-avatar',
    format: 'instagram',
    energyPrefix: 'frost',
    rootName: "Zy'Reth",
    suffixModifier: 'Prime',
    domain: 'finance',
    designation: 'CMD-01',
  };

  it('returns correct template type', () => {
    const config = buildAgentAvatarConfig(input);
    expect(config.template).toBe('agent-avatar');
  });

  it('has subject, armor, sigil, environment, composition, quality sections', () => {
    const config = buildAgentAvatarConfig(input);
    const roles = config.sections.map((s) => s.role);
    expect(roles).toContain('subject');
    expect(roles).toContain('armor');
    expect(roles).toContain('sigil');
    expect(roles).toContain('environment');
    expect(roles).toContain('composition');
    expect(roles).toContain('quality');
    expect(roles).toHaveLength(6);
  });

  it('includes agent root name in subject section', () => {
    const config = buildAgentAvatarConfig(input);
    const subject = config.sections.find((s) => s.role === 'subject')!;
    expect(subject.content).toContain("Zy'Reth");
  });

  it('includes Afro-futurist in subject section', () => {
    const config = buildAgentAvatarConfig(input);
    const subject = config.sections.find((s) => s.role === 'subject')!;
    expect(subject.content).toContain('Afro-futurist');
  });

  it('uses frost element motifs for frost prefix', () => {
    const config = buildAgentAvatarConfig(input);
    const armor = config.sections.find((s) => s.role === 'armor')!;
    expect(armor.content).toContain('crystalline');
    expect(armor.content).toContain('ice');
  });

  it('uses frost backdrop for frost prefix', () => {
    const config = buildAgentAvatarConfig(input);
    const env = config.sections.find((s) => s.role === 'environment')!;
    expect(env.content).toContain('arctic');
  });

  it('disables logo and url brand elements', () => {
    const config = buildAgentAvatarConfig(input);
    expect(config.brandElements.logo).toBe(false);
    expect(config.brandElements.url).toBe(false);
  });

  it('applies element-specific eye color', () => {
    const config = buildAgentAvatarConfig(input);
    const subject = config.sections.find((s) => s.role === 'subject')!;
    expect(subject.content).toContain('icy blue');
  });

  it('uses ember motifs for ember prefix', () => {
    const emberInput: AgentAvatarInput = {
      ...input,
      energyPrefix: 'ember',
      rootName: 'Kaelor',
      suffixModifier: 'Sentinel',
    };
    const config = buildAgentAvatarConfig(emberInput);
    const armor = config.sections.find((s) => s.role === 'armor')!;
    expect(armor.content).toContain('samurai');
    const subject = config.sections.find((s) => s.role === 'subject')!;
    expect(subject.content).toContain('amber');
  });

  it('uses void motifs for void prefix', () => {
    const voidInput: AgentAvatarInput = {
      ...input,
      energyPrefix: 'void',
      rootName: 'Nyx',
      suffixModifier: 'Vault',
    };
    const config = buildAgentAvatarConfig(voidInput);
    const armor = config.sections.find((s) => s.role === 'armor')!;
    expect(armor.content).toContain('obsidian');
    const sigil = config.sections.find((s) => s.role === 'sigil')!;
    expect(sigil.content).toContain('crescent');
  });

  it('uses storm motifs for storm prefix', () => {
    const stormInput: AgentAvatarInput = {
      ...input,
      energyPrefix: 'storm',
      rootName: 'Sol',
      suffixModifier: 'Vanguard',
    };
    const config = buildAgentAvatarConfig(stormInput);
    const env = config.sections.find((s) => s.role === 'environment')!;
    expect(env.content).toContain('lightning');
    const subject = config.sections.find((s) => s.role === 'subject')!;
    expect(subject.content).toContain('golden');
  });

  it('supports female gender presentation', () => {
    const femaleInput: AgentAvatarInput = {
      ...input,
      gender: 'female',
    };
    const config = buildAgentAvatarConfig(femaleInput);
    const subject = config.sections.find((s) => s.role === 'subject')!;
    expect(subject.content).toContain('female');
  });

  it('supports custom mood override', () => {
    const moodInput: AgentAvatarInput = {
      ...input,
      mood: 'fierce battle-ready aggression',
    };
    const config = buildAgentAvatarConfig(moodInput);
    const subject = config.sections.find((s) => s.role === 'subject')!;
    expect(subject.content).toContain('fierce battle-ready aggression');
  });

  it('supports custom armor override', () => {
    const armorInput: AgentAvatarInput = {
      ...input,
      armorOverride: 'sleek matte black stealth suit with minimal frost accents',
    };
    const config = buildAgentAvatarConfig(armorInput);
    const armor = config.sections.find((s) => s.role === 'armor')!;
    expect(armor.content).toContain('sleek matte black stealth suit');
  });

  it('supports custom chest sigil', () => {
    const sigilInput: AgentAvatarInput = {
      ...input,
      chestSigil: 'binary star system orbiting a frost core',
    };
    const config = buildAgentAvatarConfig(sigilInput);
    const sigil = config.sections.find((s) => s.role === 'sigil')!;
    expect(sigil.content).toContain('binary star system');
  });

  it('includes quality directives with 8k and Afro-futurist', () => {
    const config = buildAgentAvatarConfig(input);
    const quality = config.sections.find((s) => s.role === 'quality')!;
    expect(quality.content).toContain('8k');
    expect(quality.content).toContain('Afro-futurist');
  });

  it('supports all 4 composition styles', () => {
    for (const comp of ['portrait', 'bust', 'full-body', 'hud-closeup'] as const) {
      const config = buildAgentAvatarConfig({ ...input, composition: comp });
      const section = config.sections.find((s) => s.role === 'composition')!;
      expect(section.content.length).toBeGreaterThan(0);
    }
  });

  it('supports all 6 energy prefixes', () => {
    for (const prefix of ['frost', 'ember', 'storm', 'void', 'verdance', 'axis'] as const) {
      const config = buildAgentAvatarConfig({ ...input, energyPrefix: prefix });
      expect(config.template).toBe('agent-avatar');
      expect(config.sections.length).toBe(6);
    }
  });
});
