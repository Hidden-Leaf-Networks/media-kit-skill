# @hidden-leaf/media-kit-skill — Claude Code Skill Reference

> **When to use this skill:** When the user wants to generate branded marketing graphics for Hidden Leaf Networks — product launches, case studies, service promos, or milestone announcements.

## Architecture

**Style-locked prompt generation:** Takes structured input (template type, content, format) and builds GPT image API prompts that enforce the HLN design system — colors, typography, motifs, and layout rules are baked into every prompt.

- **Design System** defines brand colors, typography, motifs, and layout rules
- **Templates** structure content for specific marketing use cases
- **Prompt Builder** assembles style-locked prompts from template configs
- **Image Generator** wraps OpenAI's GPT image API for generation + file saving

## Setup

### Required Environment Variables
```bash
OPENAI_API_KEY=your-key       # For GPT image generation
```

### Optional
```bash
MEDIA_KIT_OUTPUT_DIR=./output  # Default output directory
MEDIA_KIT_MODEL=gpt-image-1   # Image model (gpt-image-1 or dall-e-3)
LOG_LEVEL=info
```

## Templates (4 types)

| Template | Use Case | Key Fields |
|----------|----------|------------|
| `product-launch` | New tool/skill releases | productName, tagline, features[3] |
| `case-study` | Client portfolio pieces | clientName, businessType, headline, results[] |
| `service-promo` | Agency service offerings | serviceName, price, benefits[3], cta |
| `milestone` | Company news/announcements | announcement, details[], date? |

## Output Formats

| Format | Dimensions | Use |
|--------|-----------|-----|
| `linkedin` | 1200x627 | LinkedIn posts |
| `instagram` | 1080x1080 | Instagram/Facebook square |
| `og` | 1200x630 | Website meta tags |
| `facebook-cover` | 820x312 | Facebook page cover |

## API Reference

### ImageGenerator (main engine)

Factory: `createImageGeneratorFromEnv()`

```typescript
import { createImageGeneratorFromEnv } from '@hidden-leaf/media-kit-skill';
const generator = createImageGeneratorFromEnv();
```

**`generate(input)`** — Generate a branded marketing image
```typescript
const result = await generator.generate({
  template: 'product-launch',
  format: 'linkedin',
  productName: 'Atlassian Skill',
  tagline: 'Jira + Confluence in your terminal',
  features: ['Issue Management', 'Confluence Docs', 'Bitbucket PRs'],
  version: '1.0',
  outputDir: './output',
});
// result.outputPath — path to saved PNG
// result.prompt — the generated prompt text
// result.model — model used
// result.dimensions — { width, height }
```

### Prompt Builder (for inspection/customization)

```typescript
import { buildPrompt, validateInput } from '@hidden-leaf/media-kit-skill';

// Validate before generating
const errors = validateInput(input);
if (errors.length > 0) throw new Error(errors.join('; '));

// Build prompt without generating (useful for review)
const prompt = buildPrompt({
  template: 'case-study',
  format: 'instagram',
  clientName: 'KYC Doggz',
  businessType: 'Pet Business',
  headline: 'Street Vendor Goes Digital',
  results: ['Online ordering live', '3x customer reach'],
});
console.log(prompt); // Full style-locked prompt text
```

### Design System (for reference)

```typescript
import { DESIGN_SYSTEM, BRAND, TYPOGRAPHY, MOTIFS } from '@hidden-leaf/media-kit-skill';

// Access brand constants
console.log(BRAND.primary);  // '#00D4FF'
console.log(BRAND.url);      // 'hiddenleafnetworks.com'
```

## Examples

### Product Launch
```typescript
await generator.generate({
  template: 'product-launch',
  format: 'linkedin',
  productName: 'Media Kit Skill',
  tagline: 'Brand graphics on demand',
  features: ['Auto-branding', '4 output formats', 'Style-locked prompts'],
  version: '0.1',
});
```

### Case Study
```typescript
await generator.generate({
  template: 'case-study',
  format: 'instagram',
  clientName: 'KYC Doggz',
  businessType: 'Street Vendor / Pet Business',
  headline: 'Street Vendor Goes Digital',
  results: ['Online ordering live', '3x customer reach', 'Professional brand identity'],
});
```

### Service Promo
```typescript
await generator.generate({
  template: 'service-promo',
  format: 'og',
  serviceName: 'AI Operations Audit',
  price: '$300',
  benefits: ['Full workflow analysis', 'AI integration roadmap', 'ROI projections'],
  cta: 'Book Your Audit Today',
});
```

### Milestone
```typescript
await generator.generate({
  template: 'milestone',
  format: 'facebook-cover',
  announcement: 'Year 2: Scaling Operations',
  details: ['6 active ventures', 'Studio model launched', 'Detroit to global'],
  date: 'April 2026',
});
```

## HLN Design System (enforced in all prompts)

```yaml
brand:
  primary: "#00D4FF"       # teal/cyan accent
  secondary: "#FFFFFF"     # white text
  background: "#0A0A1A"   # deep dark
  card_bg: "#1A3A4A"      # dark teal glass cards

typography:
  headline: Bold clean sans-serif, white on dark
  subheadline: Medium weight, slightly smaller
  body: Light weight, high readability

motifs:
  - Detroit skyline (evening/night)
  - Network nodes / particle connections
  - Gradient mesh (teal to dark)
  - Glass-morphism cards
  - Laptop/device mockups
```

## Error Handling

| Error | When |
|-------|------|
| `Invalid input: ...` | Missing or invalid fields for template |
| `No image data returned from API` | API returned empty response |
| `OPENAI_API_KEY environment variable is required` | Missing API key |
