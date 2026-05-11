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
};

export function getTemplateDefinition(type: TemplateType): TemplateDefinition {
  return TEMPLATE_DEFINITIONS[type];
}

export function getAllTemplateTypes(): TemplateType[] {
  return Object.keys(TEMPLATE_DEFINITIONS) as TemplateType[];
}
