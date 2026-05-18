/**
 * Proposal Template Engine — transforms agent research into closing copy
 *
 * Flow: Agent Research MD → Template Voice → LLM → Polished Proposal
 *
 * Three proposal types with distinct voices:
 * - ai-engineering: Technical, production-proof, governed systems differentiator
 * - web-studio: Outcomes-focused, Detroit local, small business friendly
 * - small-business: Warm, accessible, ROI-driven, care plan upsell
 */

/** Proposal template types */
export type ProposalType = 'ai-engineering' | 'web-studio' | 'small-business';

/** Proposal format — where the copy will be used */
export type ProposalFormat = 'upwork-message' | 'email-cold' | 'email-followup' | 'linkedin-dm' | 'pdf-formal';

/** Input for proposal generation */
export interface ProposalInput {
  /** Which template voice to use */
  type: ProposalType;
  /** Where this proposal will be sent */
  format: ProposalFormat;
  /** Agent-generated research markdown (Naekzio listing, Kairo dossier, etc.) */
  agentResearchMd: string;
  /** Client/company name */
  clientName: string;
  /** Brief description of what they need */
  clientNeed: string;
  /** Estimated budget range */
  budgetRange?: string;
  /** Specific service to pitch (from Orvex catalog) */
  servicePitch?: string;
  /** Pilot price to offer */
  pilotPrice?: string;
}

/** Result from proposal generation */
export interface ProposalResult {
  /** The polished proposal copy */
  text: string;
  /** Which voice was used */
  type: ProposalType;
  /** Target format */
  format: ProposalFormat;
  /** Model used */
  model: string;
  /** Timestamp */
  timestamp: string;
}

/** Format constraints */
const FORMAT_RULES: Record<ProposalFormat, { maxWords: number; style: string }> = {
  'upwork-message': {
    maxWords: 300,
    style: 'Conversational but professional. No headers or markdown. Write like a human message, not a document. Short paragraphs.',
  },
  'email-cold': {
    maxWords: 200,
    style: 'Brief, scannable, one clear ask. Subject line energy in the first sentence. 3-4 short paragraphs max.',
  },
  'email-followup': {
    maxWords: 150,
    style: 'Even shorter. Reference the first touch. Add one new piece of value. Clear next step.',
  },
  'linkedin-dm': {
    maxWords: 100,
    style: 'Ultra-brief. One hook, one proof point, one ask. No formality. Like texting a colleague.',
  },
  'pdf-formal': {
    maxWords: 800,
    style: 'Structured with sections. Executive summary, scope, timeline, investment, why us. Professional but not corporate.',
  },
};

/** Voice profiles per proposal type */
const VOICE_PROFILES: Record<ProposalType, {
  identity: string;
  tone: string;
  doRules: string[];
  dontRules: string[];
  proofPoints: string[];
}> = {
  'ai-engineering': {
    identity: 'Tre Snowchild, founder of Hidden Leaf Networks — an applied AI studio in Detroit. You build production multi-agent systems.',
    tone: 'Technical, direct, confident. You ship production systems, not demos.',
    doRules: [
      'Lead with production proof: 14 governed agents, 300+ tests, v3.4.0 deployed',
      'Differentiate from wrapper builders (LangChain/CrewAI wrappers vs governed state machines)',
      'Cite specific numbers: agents, tests, providers, model count',
      'Offer a fixed-price pilot ($3k-7k) to reduce client risk',
      'Close with availability: "I can start today" or "Ready when you are"',
      'Reference real shipped work by name: ARIA (agent framework), Auralis (RAG system)',
      'Mention multi-model orchestration across Anthropic, OpenAI, xAI, Google',
      'Emphasize governance: risk scoring, approval workflows, audit trails',
    ],
    dontRules: [
      'Never say "leverage", "cutting-edge", "revolutionary", "synergy", "game-changer"',
      'Never claim to know their specific codebase before seeing it',
      'Never undersell — $125/hr minimum, no race to the bottom',
      'Never sound like a template — each proposal must reference THEIR specific listing',
      'Never mention competitors by name',
    ],
    proofPoints: [
      '14 production agents with governed skill trees and deterministic state machines',
      '300+ tests across the framework, CI/CD, Docker deployment',
      'Multi-model routing: Anthropic Claude, OpenAI, xAI Grok, Google Gemini',
      'Risk engines with per-agent scoring, approval gates, and audit trails',
      'Auralis: production RAG with 59 topics, knowledge graphs, citation tracking',
      'Revenue workforce: 4 agents automating outreach, bidding, gov contracts, client success',
      'Avatar generator pipeline: GPT Image 2 with element-coded visual system',
      'Open-source: aria-core, atlassian-skill (267 tests), media-kit-skill (134 tests), x-skill',
    ],
  },
  'web-studio': {
    identity: 'Tre, founder of Hidden Leaf Web Studio — the agency arm of Hidden Leaf Networks. 20 years building for the web. Based in Metro Detroit.',
    tone: 'Professional but approachable. Business owner to business owner. Outcomes over technology.',
    doRules: [
      'Sell outcomes: more customers, professional credibility, time saved',
      'Speak to pain: broken mobile sites, no online presence, losing customers',
      'Reference live client work: KYC Doggz (kycdoggz.com), Generous Giving (generousgivingdetroit.com)',
      'Mention the LeafCore stack without jargon — "built on modern tech, deployed fast"',
      'Include pricing transparently: Essential $950, Growth $1,850, Authority $3,100',
      'Upsell care plans: ongoing support after launch ($75-$300/mo)',
      'Ground in Detroit — local business serving local businesses',
    ],
    dontRules: [
      'Never use tech jargon: React, Next.js, Vercel, API, framework, stack',
      'Never oversell what a website does — be honest',
      'Never sound like a marketing agency template',
      'Never promise specific ROI numbers without data',
    ],
    proofPoints: [
      'KYC Doggz: Detroit hot dog food cart — full website, menu, contact form, custom domain',
      'Generous Giving: church food pantry — editorial magazine-style, online registration, donor storytelling',
      '20 years of web development experience',
      'LeafCore Web Development Stack: design spec to production deploy in days',
      'Care Plans: Essential $75/mo, Growth $150/mo, Authority $300/mo',
      'All sites mobile-first, SEO-optimized, professionally branded',
    ],
  },
  'small-business': {
    identity: 'Tre from Hidden Leaf Web Studio. You help small businesses and nonprofits get online with professional websites that actually work.',
    tone: 'Warm, accessible, community-minded. Like talking to a neighbor who happens to be great at building websites.',
    doRules: [
      'Lead with understanding their situation, not your capabilities',
      'Keep pricing accessible: mention installment plans, deposits',
      'Emphasize speed: "design to deploy in days, not months"',
      'Mention care plans as ongoing partnership, not upsell',
      'Reference church/community org experience',
      'Offer free 15-min consultation or website audit',
    ],
    dontRules: [
      'Never be pushy or salesy',
      'Never assume their budget — ask',
      'Never use any technical jargon at all',
      'Never make them feel behind for not having a website yet',
    ],
    proofPoints: [
      'Built websites for local food vendors and church food pantries',
      'Installment plans available — $250 deposit gets started',
      'Sites include contact forms, menus, booking, and email delivery',
      'Ongoing support plans from $75/month',
      'Based in Metro Detroit — local business, local trust',
    ],
  },
};

/**
 * Build the system prompt for proposal generation
 */
export function buildProposalSystemPrompt(type: ProposalType, format: ProposalFormat): string {
  const voice = VOICE_PROFILES[type];
  const rules = FORMAT_RULES[format];

  const parts = [
    `You are ${voice.identity}`,
    ``,
    `TONE: ${voice.tone}`,
    ``,
    `FORMAT: ${rules.style}`,
    `Maximum ${rules.maxWords} words.`,
    ``,
    `RULES — ALWAYS:`,
    ...voice.doRules.map(r => `- ${r}`),
    ``,
    `RULES — NEVER:`,
    ...voice.dontRules.map(r => `- ${r}`),
    ``,
    `PROOF POINTS (use 2-4 that are most relevant):`,
    ...voice.proofPoints.map(r => `- ${r}`),
  ];

  return parts.join('\n');
}

/**
 * Build the user prompt with agent research context
 */
export function buildProposalUserPrompt(input: ProposalInput): string {
  const parts = [
    `Write a ${input.format} proposal for:`,
    ``,
    `CLIENT: ${input.clientName}`,
    `NEED: ${input.clientNeed}`,
  ];

  if (input.budgetRange) parts.push(`BUDGET SIGNAL: ${input.budgetRange}`);
  if (input.servicePitch) parts.push(`SERVICE TO PITCH: ${input.servicePitch}`);
  if (input.pilotPrice) parts.push(`PILOT OFFER: ${input.pilotPrice}`);

  parts.push(
    ``,
    `--- AGENT RESEARCH (use as evidence, don't copy verbatim) ---`,
    ``,
    input.agentResearchMd.substring(0, 4000),
  );

  return parts.join('\n');
}

/**
 * Get all available proposal types
 */
export function getProposalTypes(): ProposalType[] {
  return ['ai-engineering', 'web-studio', 'small-business'];
}

/**
 * Get all available proposal formats
 */
export function getProposalFormats(): ProposalFormat[] {
  return ['upwork-message', 'email-cold', 'email-followup', 'linkedin-dm', 'pdf-formal'];
}

/**
 * Get voice profile for a proposal type (for inspection/debugging)
 */
export function getVoiceProfile(type: ProposalType) {
  return VOICE_PROFILES[type];
}
