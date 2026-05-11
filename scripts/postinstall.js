#!/usr/bin/env node

/**
 * Post-install script for @hidden-leaf/media-kit-skill
 * Displays setup instructions when installed as a dependency.
 */

const isNested = __dirname.includes('node_modules');

if (isNested) {
  console.log('');
  console.log('  ┌──────────────────────────────────────────────────────┐');
  console.log('  │  @hidden-leaf/media-kit-skill installed               │');
  console.log('  │                                                       │');
  console.log('  │  Required env vars:                                   │');
  console.log('  │    OPENAI_API_KEY=your-openai-key                     │');
  console.log('  │                                                       │');
  console.log('  │  Optional:                                            │');
  console.log('  │    MEDIA_KIT_OUTPUT_DIR=./output                      │');
  console.log('  │    MEDIA_KIT_MODEL=gpt-image-1                        │');
  console.log('  │                                                       │');
  console.log('  │  See SKILL.md for full API reference.                 │');
  console.log('  └──────────────────────────────────────────────────────┘');
  console.log('');
}
