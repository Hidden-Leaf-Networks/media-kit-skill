/**
 * Video Promo template — thumbnails and promotional graphics for video content
 */

import type { VideoPromoInput, PromptConfig, CopyConfig, CopyFormat, CopyTone } from '../types/index.js';
import { FORMAT_DIMENSIONS } from '../types/index.js';
import { buildBrandVoice } from '../config/tone-system.js';
import { BRAND } from '../config/design-system.js';

export function buildVideoPromoCopyConfig(
  input: VideoPromoInput,
  copyFormat: CopyFormat,
  tone: CopyTone = 'conversational',
): CopyConfig {
  const speakerStr = input.speakerName ? ` Mention the presenter: ${input.speakerName}.` : '';

  return {
    template: 'video-promo',
    format: copyFormat,
    sections: [
      {
        role: 'hook',
        instruction: `Open with a compelling reason to watch "${input.videoTitle}". Create urgency or curiosity.${speakerStr}`,
      },
      {
        role: 'description',
        instruction: `Briefly describe what viewers will learn or see. Duration: ${input.duration}. Platform: ${input.platform}.`,
      },
      {
        role: 'topics',
        instruction: `Tease these key topics: "${input.keyTopics[0]}", "${input.keyTopics[1]}", "${input.keyTopics[2]}". Make each sound valuable.`,
      },
      {
        role: 'watch-cta',
        instruction: `Close with a clear call to watch. Match the platform tone (${input.platform}).`,
      },
    ],
    brandVoice: buildBrandVoice(tone, copyFormat),
  };
}

export function buildVideoPromoConfig(input: VideoPromoInput): PromptConfig {
  const dimensions = FORMAT_DIMENSIONS[input.format];
  const moodStr = input.thumbnailMood ?? 'energetic';
  const speakerOverlay = input.speakerName
    ? `Speaker name "${input.speakerName}" in clean white text, lower third or corner placement.`
    : '';

  return {
    template: 'video-promo',
    format: input.format,
    dimensions,
    sections: [
      {
        role: 'title',
        content: `Video title "${input.videoTitle}" in bold white sans-serif text, large and prominent. ${moodStr} visual energy.`,
      },
      {
        role: 'play-button',
        content: `Subtle play button icon (triangle in circle) as a visual cue — translucent white, not too literal. Duration badge "${input.duration}" in a small teal (#00D4FF) pill.`,
      },
      {
        role: 'topics',
        content: `Three topic pills or tags: "${input.keyTopics[0]}", "${input.keyTopics[1]}", "${input.keyTopics[2]}". Glass-morphism style, arranged horizontally.`,
      },
      {
        role: 'footer',
        content: `${speakerOverlay} "${BRAND.url}" URL at bottom. Cinematic gradient background with ${moodStr} mood. Do NOT render a logo — the real logo is composited in post-processing.`,
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
