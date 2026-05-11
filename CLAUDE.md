# @hidden-leaf/media-kit-skill

## Project Overview
Branded marketing image generation skill for Claude Code. Produces HLN-style graphics (product launches, case studies, service promos, milestones) via GPT image API with style-locked prompts that enforce the full HLN design system.

## Architecture
- `src/config/design-system.ts` — HLN brand colors, typography, motifs, layout rules
- `src/config/templates.ts` — Template registry and metadata
- `src/templates/` — Per-template prompt config builders (product-launch, case-study, service-promo, milestone)
- `src/generators/prompt-builder.ts` — Assembles style-locked prompts from template configs
- `src/generators/image-generator.ts` — OpenAI GPT image API wrapper, file saving
- `src/types/index.ts` — All type definitions
- `src/index.ts` — Public exports

## Development
- **Build:** `npm run build`
- **Test:** `npm test` (jest + ts-jest)
- **Lint:** `npm run lint`
- **Run scripts:** `npx tsx <script>.ts`
- **Publish:** `npm publish` (restricted access — private package)

## Conventions
- TypeScript strict mode, ES2022 target, NodeNext modules
- Factory pattern: `createImageGeneratorFromEnv()` reads from env vars
- OpenAI client is injectable for testing (mock the API, not the network)
- All prompts enforce HLN design system (colors, typography, motifs)
- Templates return PromptConfig objects; prompt-builder assembles final text
- Tests in `tests/` directory (not `__tests__`)

## Skill Reference
See [SKILL.md](./SKILL.md) for the full API reference.
