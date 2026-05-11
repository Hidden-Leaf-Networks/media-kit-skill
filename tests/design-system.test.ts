import { BRAND, TYPOGRAPHY, MOTIFS, LAYOUT_RULES, DESIGN_SYSTEM } from '../src/config/design-system';

describe('Design System', () => {
  describe('BRAND', () => {
    it('has required brand properties', () => {
      expect(BRAND.name).toBe('Hidden Leaf Networks');
      expect(BRAND.primary).toBe('#00D4FF');
      expect(BRAND.secondary).toBe('#FFFFFF');
      expect(BRAND.background).toBe('#0A0A1A');
      expect(BRAND.cardBg).toBe('#1A3A4A');
      expect(BRAND.tagline).toBe('Applied AI & Advanced Digital Systems');
      expect(BRAND.url).toBe('hiddenleafnetworks.com');
    });

    it('uses valid hex color codes', () => {
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      expect(BRAND.primary).toMatch(hexRegex);
      expect(BRAND.secondary).toMatch(hexRegex);
      expect(BRAND.background).toMatch(hexRegex);
      expect(BRAND.cardBg).toMatch(hexRegex);
    });
  });

  describe('TYPOGRAPHY', () => {
    it('defines headline, subheadline, and body styles', () => {
      expect(TYPOGRAPHY.headline).toBeDefined();
      expect(TYPOGRAPHY.subheadline).toBeDefined();
      expect(TYPOGRAPHY.body).toBeDefined();
    });

    it('headline references bold weight', () => {
      expect(TYPOGRAPHY.headline.toLowerCase()).toContain('bold');
    });
  });

  describe('MOTIFS', () => {
    it('contains at least 3 visual motifs', () => {
      expect(MOTIFS.length).toBeGreaterThanOrEqual(3);
    });

    it('includes Detroit skyline motif', () => {
      const hasDetroit = MOTIFS.some((m) => m.toLowerCase().includes('detroit'));
      expect(hasDetroit).toBe(true);
    });

    it('includes network/tech motif', () => {
      const hasTech = MOTIFS.some((m) => m.toLowerCase().includes('network') || m.toLowerCase().includes('tech'));
      expect(hasTech).toBe(true);
    });
  });

  describe('LAYOUT_RULES', () => {
    it('defines logo position', () => {
      expect(LAYOUT_RULES.logoPosition).toBeDefined();
    });

    it('defines feature cards style', () => {
      expect(LAYOUT_RULES.featureCards).toContain('glass');
    });

    it('defines footer content', () => {
      expect(LAYOUT_RULES.footer).toContain('URL');
    });
  });

  describe('DESIGN_SYSTEM aggregate', () => {
    it('exports all subsystems', () => {
      expect(DESIGN_SYSTEM.brand).toBe(BRAND);
      expect(DESIGN_SYSTEM.typography).toBe(TYPOGRAPHY);
      expect(DESIGN_SYSTEM.motifs).toBe(MOTIFS);
      expect(DESIGN_SYSTEM.layoutRules).toBe(LAYOUT_RULES);
    });
  });
});
