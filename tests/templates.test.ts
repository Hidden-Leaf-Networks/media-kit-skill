import { buildProductLaunchConfig } from '../src/templates/product-launch';
import { buildCaseStudyConfig } from '../src/templates/case-study';
import { buildServicePromoConfig } from '../src/templates/service-promo';
import { buildMilestoneConfig } from '../src/templates/milestone';
import { buildAgentAvatarConfig } from '../src/templates/agent-avatar';
import { buildCommercialConfig } from '../src/templates/commercial';
import { buildSoftwareReleaseConfig } from '../src/templates/software-release';
import { buildVideoPromoConfig } from '../src/templates/video-promo';
import { buildAppShowcaseConfig } from '../src/templates/app-showcase';
import { buildBrandAvatarConfig } from '../src/templates/brand-avatar';
import { TEMPLATE_DEFINITIONS, getTemplateDefinition, getAllTemplateTypes } from '../src/config/templates';
import type { ProductLaunchInput, CaseStudyInput, ServicePromoInput, MilestoneInput, AgentAvatarInput, CommercialInput, SoftwareReleaseInput, VideoPromoInput, AppShowcaseInput, BrandAvatarInput } from '../src/types/index';

describe('Template Definitions', () => {
  it('has all 9 template types registered', () => {
    const types = getAllTemplateTypes();
    expect(types).toContain('product-launch');
    expect(types).toContain('case-study');
    expect(types).toContain('service-promo');
    expect(types).toContain('milestone');
    expect(types).toContain('agent-avatar');
    expect(types).toContain('commercial');
    expect(types).toContain('software-release');
    expect(types).toContain('video-promo');
    expect(types).toContain('app-showcase');
    expect(types).toContain('brand-avatar');
    expect(types).toHaveLength(10);
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

describe('Commercial Template', () => {
  const input: CommercialInput = {
    template: 'commercial',
    format: 'instagram',
    headline: 'AI-Powered Websites',
    subheadline: 'Launch in 2 weeks, not 2 months',
    cta: 'Book a Call',
    targetAudience: 'small-business',
    offerText: 'Starting at $950',
  };

  it('returns correct template type', () => {
    const config = buildCommercialConfig(input);
    expect(config.template).toBe('commercial');
  });

  it('has headline, subheadline, offer, and footer sections', () => {
    const config = buildCommercialConfig(input);
    const roles = config.sections.map((s) => s.role);
    expect(roles).toContain('headline');
    expect(roles).toContain('subheadline');
    expect(roles).toContain('offer');
    expect(roles).toContain('footer');
  });

  it('includes headline text', () => {
    const config = buildCommercialConfig(input);
    const headline = config.sections.find((s) => s.role === 'headline')!;
    expect(headline.content).toContain('AI-Powered Websites');
  });

  it('includes CTA in offer section', () => {
    const config = buildCommercialConfig(input);
    const offer = config.sections.find((s) => s.role === 'offer')!;
    expect(offer.content).toContain('Book a Call');
  });

  it('includes offer text when provided', () => {
    const config = buildCommercialConfig(input);
    const offer = config.sections.find((s) => s.role === 'offer')!;
    expect(offer.content).toContain('Starting at $950');
  });

  it('works without offer text', () => {
    const { offerText, ...noOffer } = input;
    const config = buildCommercialConfig(noOffer as CommercialInput);
    expect(config.template).toBe('commercial');
  });
});

describe('Software Release Template', () => {
  const input: SoftwareReleaseInput = {
    template: 'software-release',
    format: 'linkedin',
    packageName: '@hidden-leaf/x-skill',
    version: 'v1.1.0',
    releaseType: 'minor',
    highlights: ['Tweet posting', 'Media upload', 'Apache 2.0 license'],
    installCommand: 'npm install @hidden-leaf/x-skill',
  };

  it('returns correct template type', () => {
    const config = buildSoftwareReleaseConfig(input);
    expect(config.template).toBe('software-release');
  });

  it('has header, highlights, install, and footer sections', () => {
    const config = buildSoftwareReleaseConfig(input);
    const roles = config.sections.map((s) => s.role);
    expect(roles).toContain('header');
    expect(roles).toContain('highlights');
    expect(roles).toContain('install');
    expect(roles).toContain('footer');
  });

  it('includes package name and version in header', () => {
    const config = buildSoftwareReleaseConfig(input);
    const header = config.sections.find((s) => s.role === 'header')!;
    expect(header.content).toContain('@hidden-leaf/x-skill');
    expect(header.content).toContain('v1.1.0');
  });

  it('includes all 3 highlights', () => {
    const config = buildSoftwareReleaseConfig(input);
    const highlights = config.sections.find((s) => s.role === 'highlights')!;
    expect(highlights.content).toContain('Tweet posting');
    expect(highlights.content).toContain('Media upload');
    expect(highlights.content).toContain('Apache 2.0 license');
  });

  it('includes install command', () => {
    const config = buildSoftwareReleaseConfig(input);
    const install = config.sections.find((s) => s.role === 'install')!;
    expect(install.content).toContain('npm install @hidden-leaf/x-skill');
  });

  it('uses teal for minor release', () => {
    const config = buildSoftwareReleaseConfig(input);
    const header = config.sections.find((s) => s.role === 'header')!;
    expect(header.content).toContain('#00D4FF');
  });

  it('uses red for major release', () => {
    const majorInput = { ...input, releaseType: 'major' as const };
    const config = buildSoftwareReleaseConfig(majorInput);
    const header = config.sections.find((s) => s.role === 'header')!;
    expect(header.content).toContain('#FF4444');
  });
});

describe('Video Promo Template', () => {
  const input: VideoPromoInput = {
    template: 'video-promo',
    format: 'og',
    videoTitle: 'Building AI Agents with Claude Code',
    duration: '12:34',
    platform: 'youtube',
    keyTopics: ['Agent architecture', 'Tool use', 'Deployment'],
    speakerName: 'Tre Snowchild',
  };

  it('returns correct template type', () => {
    const config = buildVideoPromoConfig(input);
    expect(config.template).toBe('video-promo');
  });

  it('has title, play-button, topics, and footer sections', () => {
    const config = buildVideoPromoConfig(input);
    const roles = config.sections.map((s) => s.role);
    expect(roles).toContain('title');
    expect(roles).toContain('play-button');
    expect(roles).toContain('topics');
    expect(roles).toContain('footer');
  });

  it('includes video title', () => {
    const config = buildVideoPromoConfig(input);
    const title = config.sections.find((s) => s.role === 'title')!;
    expect(title.content).toContain('Building AI Agents with Claude Code');
  });

  it('includes duration badge', () => {
    const config = buildVideoPromoConfig(input);
    const play = config.sections.find((s) => s.role === 'play-button')!;
    expect(play.content).toContain('12:34');
  });

  it('includes all 3 topics', () => {
    const config = buildVideoPromoConfig(input);
    const topics = config.sections.find((s) => s.role === 'topics')!;
    expect(topics.content).toContain('Agent architecture');
    expect(topics.content).toContain('Tool use');
    expect(topics.content).toContain('Deployment');
  });

  it('includes speaker name when provided', () => {
    const config = buildVideoPromoConfig(input);
    const footer = config.sections.find((s) => s.role === 'footer')!;
    expect(footer.content).toContain('Tre Snowchild');
  });

  it('works without speaker name', () => {
    const { speakerName, ...noSpeaker } = input;
    const config = buildVideoPromoConfig(noSpeaker as VideoPromoInput);
    expect(config.template).toBe('video-promo');
  });
});

describe('App Showcase Template', () => {
  const input: AppShowcaseInput = {
    template: 'app-showcase',
    format: 'linkedin',
    appName: 'Generous Giving Detroit',
    appUrl: 'generousgivingdetroit.com',
    screenshotDescription: 'Magazine-style editorial layout with photo grid and donation forms',
    deviceFrame: 'laptop',
    valueProps: ['Editorial design', 'Donation forms', 'Mobile responsive'],
    clientName: 'Karen Cannady',
  };

  it('returns correct template type', () => {
    const config = buildAppShowcaseConfig(input);
    expect(config.template).toBe('app-showcase');
  });

  it('has header, device-mockup, value-props, and footer sections', () => {
    const config = buildAppShowcaseConfig(input);
    const roles = config.sections.map((s) => s.role);
    expect(roles).toContain('header');
    expect(roles).toContain('device-mockup');
    expect(roles).toContain('value-props');
    expect(roles).toContain('footer');
  });

  it('includes app name and URL in header', () => {
    const config = buildAppShowcaseConfig(input);
    const header = config.sections.find((s) => s.role === 'header')!;
    expect(header.content).toContain('Generous Giving Detroit');
    expect(header.content).toContain('generousgivingdetroit.com');
  });

  it('includes client name when provided', () => {
    const config = buildAppShowcaseConfig(input);
    const header = config.sections.find((s) => s.role === 'header')!;
    expect(header.content).toContain('Karen Cannady');
  });

  it('includes laptop mockup description', () => {
    const config = buildAppShowcaseConfig(input);
    const mockup = config.sections.find((s) => s.role === 'device-mockup')!;
    expect(mockup.content).toContain('laptop');
    expect(mockup.content).toContain('Magazine-style editorial layout');
  });

  it('includes all 3 value props', () => {
    const config = buildAppShowcaseConfig(input);
    const vp = config.sections.find((s) => s.role === 'value-props')!;
    expect(vp.content).toContain('Editorial design');
    expect(vp.content).toContain('Donation forms');
    expect(vp.content).toContain('Mobile responsive');
  });

  it('supports multi-device frame', () => {
    const multiInput = { ...input, deviceFrame: 'multi-device' as const };
    const config = buildAppShowcaseConfig(multiInput);
    const mockup = config.sections.find((s) => s.role === 'device-mockup')!;
    expect(mockup.content).toContain('Multiple device mockups');
  });

  it('works without client name', () => {
    const { clientName, ...noClient } = input;
    const config = buildAppShowcaseConfig(noClient as AppShowcaseInput);
    expect(config.template).toBe('app-showcase');
  });
});

describe('Brand Avatar Template', () => {
  const chibiInput: BrandAvatarInput = {
    template: 'brand-avatar',
    format: 'instagram',
    style: 'chibi',
    brandName: 'Hidden Leaf Networks',
    scenePreset: 'cyberpunk-konoha',
    characterDescription: 'Young Black male with locs, teal cyber-visor, dark tech armor',
  };

  it('returns correct template type', () => {
    const config = buildBrandAvatarConfig(chibiInput);
    expect(config.template).toBe('brand-avatar');
  });

  it('has scene section for chibi style', () => {
    const config = buildBrandAvatarConfig(chibiInput);
    const scene = config.sections.find((s) => s.role === 'scene')!;
    expect(scene.content).toContain('Chibi anime character');
    expect(scene.content).toContain('locs');
  });

  it('includes scene preset description', () => {
    const config = buildBrandAvatarConfig(chibiInput);
    const scene = config.sections.find((s) => s.role === 'scene')!;
    expect(scene.content).toContain('hidden village');
  });

  it('supports scenery style', () => {
    const sceneryInput: BrandAvatarInput = {
      ...chibiInput,
      style: 'scenery',
      scenePreset: 'neo-detroit',
    };
    const config = buildBrandAvatarConfig(sceneryInput);
    const scene = config.sections.find((s) => s.role === 'scene')!;
    expect(scene.content).toContain('Environmental cyberpunk cityscape');
    expect(scene.content).toContain('Detroit');
  });

  it('supports logo-treatment style', () => {
    const logoInput: BrandAvatarInput = {
      ...chibiInput,
      style: 'logo-treatment',
      scenePreset: 'holographic',
    };
    const config = buildBrandAvatarConfig(logoInput);
    const scene = config.sections.find((s) => s.role === 'scene')!;
    expect(scene.content).toContain('Logo mark treatment');
    expect(scene.content).toContain('Holographic');
  });

  it('supports custom scene description', () => {
    const customInput: BrandAvatarInput = {
      ...chibiInput,
      scenePreset: undefined,
      customScene: 'Underwater cyber-temple with bioluminescent coral',
    };
    const config = buildBrandAvatarConfig(customInput);
    const scene = config.sections.find((s) => s.role === 'scene')!;
    expect(scene.content).toContain('bioluminescent coral');
  });

  it('disables logo and url brand elements', () => {
    const config = buildBrandAvatarConfig(chibiInput);
    expect(config.brandElements.logo).toBe(false);
    expect(config.brandElements.url).toBe(false);
  });

  it('includes teal color palette directive', () => {
    const config = buildBrandAvatarConfig(chibiInput);
    const scene = config.sections.find((s) => s.role === 'scene')!;
    expect(scene.content).toContain('#00D4FF');
  });

  it('supports all 3 styles', () => {
    for (const style of ['chibi', 'scenery', 'logo-treatment'] as const) {
      const config = buildBrandAvatarConfig({ ...chibiInput, style });
      expect(config.template).toBe('brand-avatar');
    }
  });
});
