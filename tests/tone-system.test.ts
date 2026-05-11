import { buildBrandVoice, VOICE, VOICE_DO, VOICE_DONT, TONE_SYSTEM } from '../src/config/tone-system';
import type { CopyTone, CopyFormat } from '../src/types/index';

describe('Tone System', () => {
  describe('VOICE constants', () => {
    it('has correct brand identity', () => {
      expect(VOICE.name).toBe('Hidden Leaf Web Studio');
      expect(VOICE.parentOrg).toBe('Hidden Leaf Networks');
      expect(VOICE.founder).toBe('Tre');
      expect(VOICE.location).toBe('Metro Detroit');
    });

    it('has do rules', () => {
      expect(VOICE_DO.length).toBeGreaterThan(0);
      expect(VOICE_DO).toContain('Sell outcomes: more customers, saved time, professional credibility');
    });

    it('has dont rules', () => {
      expect(VOICE_DONT.length).toBeGreaterThan(0);
      expect(VOICE_DONT).toContain('Never say "AI-powered", "cutting-edge", "revolutionary", or "leveraging"');
    });
  });

  describe('buildBrandVoice', () => {
    const tones: CopyTone[] = ['professional', 'conversational', 'community'];
    const formats: CopyFormat[] = ['facebook-post', 'instagram-caption', 'linkedin-post', 'group-outreach', 'ad-copy'];

    it('builds voice rules for all tone/format combinations', () => {
      for (const tone of tones) {
        for (const format of formats) {
          const voice = buildBrandVoice(tone, format);
          expect(voice.tone).toBe(tone);
          expect(voice.perspective).toContain('Tre');
          expect(voice.doRules.length).toBeGreaterThan(VOICE_DO.length); // base + tone-specific
          expect(voice.dontRules.length).toBe(VOICE_DONT.length);
          expect(voice.platformNotes).toBeTruthy();
        }
      }
    });

    it('includes tone-specific rules for professional', () => {
      const voice = buildBrandVoice('professional', 'linkedin-post');
      expect(voice.doRules).toContain('Lead with credibility and results');
    });

    it('includes tone-specific rules for conversational', () => {
      const voice = buildBrandVoice('conversational', 'facebook-post');
      expect(voice.doRules).toContain('Ask questions to engage the reader');
    });

    it('includes tone-specific rules for community', () => {
      const voice = buildBrandVoice('community', 'group-outreach');
      expect(voice.doRules).toContain('Lead with the mission, not the sale');
    });

    it('returns correct platform notes for each format', () => {
      expect(buildBrandVoice('conversational', 'group-outreach').platformNotes).toContain('community member');
      expect(buildBrandVoice('professional', 'linkedin-post').platformNotes).toContain('LinkedIn');
      expect(buildBrandVoice('conversational', 'ad-copy').platformNotes).toContain('Ultra-concise');
    });
  });

  describe('TONE_SYSTEM', () => {
    it('exports full system object', () => {
      expect(TONE_SYSTEM.voice).toBe(VOICE);
      expect(TONE_SYSTEM.doRules).toBe(VOICE_DO);
      expect(TONE_SYSTEM.dontRules).toBe(VOICE_DONT);
      expect(TONE_SYSTEM.buildBrandVoice).toBe(buildBrandVoice);
    });
  });
});
