/**
 * Brand Voice System — tone rules for text generation
 *
 * Mirrors design-system.ts but for copy instead of visuals.
 */

import type { CopyTone, CopyFormat, BrandVoiceRules } from '../types/index.js';

/** Core brand voice identity */
export const VOICE = {
  name: 'Hidden Leaf Web Studio',
  parentOrg: 'Hidden Leaf Networks',
  founder: 'Tre',
  experience: '20 years in web development',
  location: 'Metro Detroit',
  url: 'hiddenleafnetworks.com',
} as const;

/** What the brand voice always does */
export const VOICE_DO = [
  'Sell outcomes: more customers, saved time, professional credibility',
  'Speak to real pain: broken mobile sites, no online presence, losing customers to competitors',
  'Be direct and confident — 20 years of experience backs every claim',
  'Ground in Detroit — local business serving local businesses',
  'Use plain language a small business owner understands',
  'Include a clear next step (DM, link, audit offer)',
] as const;

/** What the brand voice never does */
export const VOICE_DONT = [
  'Never say "AI-powered", "cutting-edge", "revolutionary", or "leveraging"',
  'Never use tech jargon: React, Next.js, Vercel, API, framework, stack',
  'Never oversell — be honest about what a website does for a business',
  'Never sound corporate or like a marketing agency template',
  'Never use exclamation marks excessively',
  'Never promise specific ROI numbers unless backed by data',
] as const;

/** Tone-specific adjustments */
const TONE_PRESETS: Record<CopyTone, { description: string; extraRules: string[] }> = {
  professional: {
    description: 'Authoritative and polished. Speaks business owner to business owner.',
    extraRules: [
      'Use complete sentences and proper grammar',
      'Lead with credibility and results',
      'Appropriate for LinkedIn and formal introductions',
    ],
  },
  conversational: {
    description: 'Casual and approachable. Like talking to someone at a networking event.',
    extraRules: [
      'Write like you talk — contractions, natural rhythm',
      'Ask questions to engage the reader',
      'Keep paragraphs short (2-3 sentences max)',
    ],
  },
  community: {
    description: 'Warm and service-oriented. Emphasizes giving back and accessibility.',
    extraRules: [
      'Lead with the mission, not the sale',
      'Acknowledge the work the audience is already doing',
      'Keep pricing accessible and non-pushy',
      'Appropriate for nonprofits, community orgs, churches',
    ],
  },
  'ai-engineering': {
    description: 'Technical, direct, production-proof. Ships governed AI systems, not wrappers.',
    extraRules: [
      'Lead with production proof: 14 governed agents, 300+ tests, v3.4.0 deployed',
      'Differentiate from wrapper builders — governed state machines vs prompt chain wrappers',
      'Cite specific numbers: 14 agents, 300+ tests, 4 providers, 6 energy types',
      'Offer a fixed-price pilot ($3k-7k) to reduce client risk',
      'Close with "I can start today" or "Ready when you are"',
      'Reference ARIA (agent framework), Auralis (RAG), atlassian-skill (267 tests)',
      'Multi-model orchestration: Anthropic, OpenAI, xAI, Google with fallback chains',
      'Governance edge: risk scoring, approval workflows, audit trails, skill allowlists',
      'Rate floor: $125/hr — never race to the bottom',
      'Tech jargon is OK here — this audience is technical',
    ],
  },
  'web-studio': {
    description: 'Business owner to business owner. Outcomes over technology. Detroit-grounded.',
    extraRules: [
      'Sell outcomes: more customers, professional credibility, time saved',
      'Speak to pain: broken mobile sites, no online presence, losing customers',
      'Reference live work: KYC Doggz (kycdoggz.com), Generous Giving (generousgivingdetroit.com)',
      'Include pricing: Essential $950, Growth $1,850, Authority $3,100',
      'Upsell care plans: ongoing support $75-$300/mo',
      'Ground in Detroit — local business serving local businesses',
      'No tech jargon — say "modern website" not "Next.js 16 app"',
    ],
  },
  'small-business': {
    description: 'Warm, accessible, community-minded. Neighbor who builds great websites.',
    extraRules: [
      'Lead with understanding their situation, not your capabilities',
      'Mention installment plans and deposits ($250 gets started)',
      'Emphasize speed: design to deploy in days, not months',
      'Care plans as ongoing partnership, not upsell',
      'Offer free 15-min consultation or website audit',
      'Reference church and community org experience',
      'Never be pushy, never make them feel behind',
      'Zero technical jargon — absolute zero',
    ],
  },
  founder: {
    description: 'Direct, sharp, zero fluff. Tre talking to builders and developers. Say more with less.',
    extraRules: [
      'Lead with what shipped, not what it means — the reader can figure that out',
      'Numbers over adjectives: "10 repos" not "a comprehensive suite"',
      'Never say: unlock, elevate, seamlessly, leverage, cutting-edge, revolutionary, empower, robust',
      'Never say: "excited to announce", "proud to share", "I\'m thrilled"',
      'Short sentences. Fragments OK. Let the work speak.',
      'Technical detail is fine — the audience builds things too',
      'If it sounds like it came from a press release, rewrite it',
      'End with an action or a link, not a feeling',
      'Detroit energy: direct, no pretense, built not bought',
      'One emoji max per post. Zero is better.',
    ],
  },
};

/** Platform-specific copy guidelines */
const PLATFORM_NOTES: Record<CopyFormat, string> = {
  'facebook-post': 'Facebook page post. Keep under 500 chars for full visibility without "See more". No hashtags. Hook in the first line — it shows in the preview.',
  'instagram-caption': 'Instagram caption. Can go longer. Use line breaks for readability. Add 3-5 relevant hashtags at the end. Light emoji usage OK.',
  'linkedin-post': 'LinkedIn post. Professional but not stiff. Lead with a bold statement or question. Use line breaks. 1-2 hashtags max at the end.',
  'group-outreach': 'Facebook group post. Must feel like a community member helping, NOT an ad. Ask a question or offer value first. Pricing mention OK but secondary. No links in the first sentence (Facebook deprioritizes them).',
  'ad-copy': 'Paid ad copy. Ultra-concise. One clear value prop, one CTA. Every word earns its place.',
};

/**
 * Build brand voice rules for a given tone and platform
 */
/** Perspective overrides for specialized tones */
const PERSPECTIVES: Partial<Record<CopyTone, string>> = {
  'ai-engineering': `You are Tre Snowchild, founder of Hidden Leaf Networks — an applied AI studio in Detroit. You build production multi-agent systems with governed execution, risk engines, and audit trails. 14 agents deployed, 300+ tests, v3.4.0 in production.`,
  'web-studio': `You are Tre, founder of Hidden Leaf Web Studio. ${VOICE.experience}. Based in ${VOICE.location}. You build professional websites for small businesses and nonprofits — live client work at kycdoggz.com and generousgivingdetroit.com.`,
  'small-business': `You are Tre from Hidden Leaf Web Studio in Metro Detroit. You help small businesses and nonprofits get online with professional websites. You've been building for the web for 20 years. You offer installment plans and ongoing care.`,
  founder: `You are Tre Snowchild, founder of Hidden Leaf Networks. You ship open-source AI tools, run a web studio, and build everything from agent frameworks to branded content engines. 10 public repos, 20 years building for the web, based in Detroit. You write like you talk — direct, technical when it matters, zero filler. If a sentence doesn't earn its place, cut it.`,
};

export function buildBrandVoice(tone: CopyTone, format: CopyFormat): BrandVoiceRules {
  const preset = TONE_PRESETS[tone];
  const defaultPerspective = `You are Tre, founder of Hidden Leaf Web Studio. ${VOICE.experience}. Based in ${VOICE.location}. You build professional, mobile-first websites for small businesses and nonprofits.`;

  // AI engineering and founder tones relax the "no jargon" rules
  const baseDontRules = (tone === 'ai-engineering' || tone === 'founder')
    ? VOICE_DONT.filter(r => !r.includes('tech jargon'))
    : [...VOICE_DONT];

  return {
    tone,
    perspective: PERSPECTIVES[tone] ?? defaultPerspective,
    doRules: [...VOICE_DO, ...preset.extraRules],
    dontRules: baseDontRules,
    platformNotes: PLATFORM_NOTES[format],
  };
}

/** Full tone system object for external consumption */
export const TONE_SYSTEM = {
  voice: VOICE,
  doRules: VOICE_DO,
  dontRules: VOICE_DONT,
  tonePresets: TONE_PRESETS,
  platformNotes: PLATFORM_NOTES,
  buildBrandVoice,
} as const;
