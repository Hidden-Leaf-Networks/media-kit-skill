/**
 * Template registry — metadata and descriptions for each template type
 */

import type { TemplateType } from '../types/index.js';

export interface TemplateDefinition {
  type: TemplateType;
  name: string;
  description: string;
  useCase: string;
  layoutDescription: string;
}

export const TEMPLATE_DEFINITIONS: Record<TemplateType, TemplateDefinition> = {
  'product-launch': {
    type: 'product-launch',
    name: 'Product Launch',
    description: 'New tool or skill release announcement graphic',
    useCase: 'Announcing new tools, skills, or software releases',
    layoutDescription: 'Logo + product name top, tagline, 3 feature cards in a row, footer with URL',
  },
  'case-study': {
    type: 'case-study',
    name: 'Case Study',
    description: 'Client portfolio piece showing transformation',
    useCase: 'Showcasing client work with before/after results',
    layoutDescription: 'Client name/business header, transformation headline, key results list, HLN branding footer',
  },
  'service-promo': {
    type: 'service-promo',
    name: 'Service Promo',
    description: 'Agency service offering promotional graphic',
    useCase: 'Promoting agency packages, audits, or service tiers',
    layoutDescription: 'Service name prominent, price point, 3 key benefits in glass cards, CTA button',
  },
  milestone: {
    type: 'milestone',
    name: 'Milestone',
    description: 'Company news or achievement announcement',
    useCase: 'Announcing company milestones, pivots, or major updates',
    layoutDescription: 'Bold announcement text centered, supporting details below, HLN branding throughout',
  },
  'agent-avatar': {
    type: 'agent-avatar',
    name: 'Agent Avatar',
    description: 'Afro-futurist warrior portrait for Axis Village agents',
    useCase: 'Generating consistent visual identity for ARIA sub-agents from manifest data',
    layoutDescription: 'Character portrait with element-coded armor, chest sigil, environmental backdrop, cinematic lighting',
  },
  commercial: {
    type: 'commercial',
    name: 'Commercial',
    description: 'Paid ad creative for social media campaigns',
    useCase: 'Facebook/Instagram/LinkedIn ad creatives with headline, offer, and CTA',
    layoutDescription: 'Bold headline centered, offer badge in accent, CTA button, minimal copy, brand footer',
  },
  'software-release': {
    type: 'software-release',
    name: 'Software Release',
    description: 'Version release announcement for open-source packages',
    useCase: 'Announcing new versions with changelogs, install commands, and GitHub links',
    layoutDescription: 'Package name + version pill, release type badge, 3 highlights in code-style font, install command block',
  },
  'video-promo': {
    type: 'video-promo',
    name: 'Video Promo',
    description: 'Thumbnail and promotional graphic for video content',
    useCase: 'YouTube thumbnails, demo reel promos, walkthrough teasers',
    layoutDescription: 'Title large, play button motif, duration badge, topic pills, cinematic gradient',
  },
  'app-showcase': {
    type: 'app-showcase',
    name: 'App Showcase',
    description: 'Portfolio piece showcasing web apps and client sites',
    useCase: 'Showcasing live applications with device mockups and value propositions',
    layoutDescription: 'Device mockup centered, app name + URL above, 3 value prop badges below, premium feel',
  },
};

export function getTemplateDefinition(type: TemplateType): TemplateDefinition {
  return TEMPLATE_DEFINITIONS[type];
}

export function getAllTemplateTypes(): TemplateType[] {
  return Object.keys(TEMPLATE_DEFINITIONS) as TemplateType[];
}
