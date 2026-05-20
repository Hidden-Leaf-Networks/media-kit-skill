/**
 * Software Release template — version announcements for open-source packages
 */

import type { SoftwareReleaseInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';

export function buildSoftwareReleaseCopyConfig(
  input: SoftwareReleaseInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'ai-engineering',
): CopyConfig {
  const breakingStr = input.breakingChanges?.length
    ? ` Note breaking changes: ${input.breakingChanges.map(c => `"${c}"`).join(', ')}.`
    : '';
  const installStr = input.installCommand ? ` Include install command: \`${input.installCommand}\`.` : '';

  return {
    template: 'software-release',
    format: copyFormat,
    sections: [
      {
        role: 'announcement',
        instruction: `Announce ${input.packageName} ${input.version} (${input.releaseType} release). Lead with what developers can now do, not internal changes.`,
      },
      {
        role: 'highlights',
        instruction: `Cover these three highlights: "${input.highlights[0]}", "${input.highlights[1]}", "${input.highlights[2]}". Be specific and technical.`,
      },
      {
        role: 'migration-notes',
        instruction: `${breakingStr || 'No breaking changes — drop-in upgrade.'}`,
      },
      {
        role: 'install-cta',
        instruction: `Close with how to get it.${installStr} Link to repo if appropriate.`,
      },
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildSoftwareReleaseConfig(input: SoftwareReleaseInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];
  const releaseColor = input.releaseType === 'major' ? '#FF4444' : input.releaseType === 'minor' ? '#00D4FF' : '#44CC44';
  const installBlock = input.installCommand
    ? `Install command block: "${input.installCommand}" in monospace font on dark (#111) card with subtle border.`
    : '';

  return {
    template: 'software-release',
    format: input.format,
    dimensions,
    sections: [
      {
        role: 'header',
        content: `Package name "${input.packageName}" in monospace or code-style font, white on dark. Version badge "${input.version}" in a colored pill (${releaseColor}) indicating ${input.releaseType} release.`,
      },
      {
        role: 'highlights',
        content: `Three highlight items in code-terminal aesthetic: "${input.highlights[0]}", "${input.highlights[1]}", "${input.highlights[2]}". Each in a glass-morphism card with subtle code bracket or chevron icons.`,
      },
      {
        role: 'install',
        content: `${installBlock} Dark terminal aesthetic — feels like a developer's screen.`,
      },
      {
        role: 'footer',
        content: `"hiddenleafnetworks.com" URL and optional GitHub icon. Tech mesh pattern background. Do NOT render a logo — the real logo is composited in post-processing.`,
      },
    ],
    brandElements: {
      logo: true,
      url: true,
      colorPalette: true,
      typography: true,
      background: true,
    },
  };
}
