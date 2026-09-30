/**
 * Generate ZAYRIN · STORM pipeline portrait via media-kit-skill agent-avatar template.
 *
 * Usage: cd media-kit-skill && npx tsx generate-zayrin-portrait.ts
 */
import OpenAI from 'openai';
import { ImageGenerator, createImageGeneratorFromEnv } from './src/generators/image-generator.js';
import { buildAgentAvatarConfig, assembleAgentAvatarPrompt } from './src/templates/agent-avatar.js';
import type { AgentAvatarInput } from './src/types/index.js';

// GPT-generated canonical portrait — used as reference for pipeline consistency
const GPT_PORTRAIT = '/mnt/fast-data/Projects/hidden-leaf/ARIA/apps/web/src/assets/avatars/sub-agents/storm-zayrin-architect/portrait.png';

const ZAYRIN_PORTRAIT: AgentAvatarInput = {
  template: 'agent-avatar',
  format: 'instagram', // 1088x1088 — square portrait
  referenceImages: [GPT_PORTRAIT],
  energyPrefix: 'storm',
  rootName: 'Zayrin',
  suffixModifier: 'Architect',
  domain: 'engineering',
  designation: 'NAV-01',
  composition: 'portrait',
  gender: 'male',
  mood: 'curious and slightly intense, the Navigator who enjoys discovering the existing solution is wrong — confident systems awareness with authority to act',
  hairStyle: 'medium-length locs partially pulled back with a few loose around the face, golden threading woven through',
  armorOverride: [
    'Short asymmetric technical mantle/jacket — NOT full armor, NOT trench coat.',
    'One side ends at the hip, the other has a split hanging panel extending toward the thigh.',
    'Fitted graphite smart-fabric engineering suit underneath with modular attachment points.',
    'Magnetic tool nodes, diagnostic sensors, removable compute modules along the jacket.',
    'Left forearm: compact AXIS topology interface gauntlet — sleek black/yellow cuff projecting spatial holographic architecture.',
    'Gold channels CRACKLE AND ARC white-hot with electric gold edges through clothing.',
    'Yellow engineering marks handwritten onto gear — arrows, version numbers, scratched-out labels, experimental module identifiers.',
    'Equipment is NOT pristine — constantly modified, field-tested, lived-in.',
    'Subtle neural-interface line behind one ear. No helmet by default.',
    'Storm yellow appears as directional lines: shoulder seam, forearm interface, coat edge, boot markings, chest identifier.',
    'Base palette: graphite black / gunmetal with storm yellow (#FFCC00) accents and tiny electric-cyan diagnostic accents.',
  ].join(' '),
  backdropOverride: [
    'Storm Operations district of Axis Village — communications towers crackling with electric gold energy,',
    'holographic software architecture branching in the air around him like a thunderstorm topology,',
    'golden node-and-edge system visualization floating from his extended gauntlet hand,',
    'processes pulse, failed nodes turn red, successful routes stabilize white/yellow.',
    'Neo-Detroit industrial skyline behind. Dark atmospheric storm clouds with gold lightning.',
  ].join(' '),
  chestSigil: 'Axis Village compass-star symbol in electric gold, Navigator class insignia',
};

const ZAYRIN_HUD: AgentAvatarInput = {
  ...ZAYRIN_PORTRAIT,
  composition: 'hud-closeup',
  format: 'og', // 1200x624 — landscape for HUD closeup
};

async function main() {
  // Build and display prompts
  const portraitConfig = buildAgentAvatarConfig(ZAYRIN_PORTRAIT);
  const hudConfig = buildAgentAvatarConfig(ZAYRIN_HUD);

  console.log('=== ZAYRIN · STORM — Portrait Prompt ===\n');
  console.log(assembleAgentAvatarPrompt(portraitConfig));
  console.log('\n=== ZAYRIN · STORM — HUD Closeup Prompt ===\n');
  console.log(assembleAgentAvatarPrompt(hudConfig));

  // Generate images
  const generator = createImageGeneratorFromEnv();

  console.log('\n--- Generating portrait ---');
  const portrait = await generator.generate(ZAYRIN_PORTRAIT);
  console.log(`Portrait saved: ${portrait.outputPath}`);

  console.log('\n--- Generating HUD closeup ---');
  const hud = await generator.generate(ZAYRIN_HUD);
  console.log(`HUD closeup saved: ${hud.outputPath}`);

  // Copy to avatar directory
  const avatarDir = '../ARIA/apps/web/src/assets/avatars/sub-agents/storm-zayrin-architect';
  const fs = await import('node:fs');
  const path = await import('node:path');

  fs.copyFileSync(portrait.outputPath, path.join(avatarDir, 'portrait.png'));
  console.log(`\nCopied portrait → ${avatarDir}/portrait.png`);

  fs.copyFileSync(hud.outputPath, path.join(avatarDir, 'hud_closeup.png'));
  console.log(`Copied HUD → ${avatarDir}/hud_closeup.png`);
}

main().catch(console.error);
