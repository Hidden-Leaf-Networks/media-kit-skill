/**
 * Compositor — overlays brand assets (logo, footer) onto generated images using sharp
 */

import * as path from 'node:path';
import sharp from 'sharp';

/** Logo variant to use */
export type LogoVariant = 'dark' | 'light' | 'tagline';

/** Position for logo placement */
export type LogoPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/** Compositing options */
export interface CompositeOptions {
  /** Logo variant (default: 'dark' — white logo on dark bg) */
  logo?: LogoVariant;
  /** Logo position (default: 'top-left') */
  logoPosition?: LogoPosition;
  /** Logo scale relative to image width (default: 0.12 = 12% of image width) */
  logoScale?: number;
  /** Padding from edges in pixels (default: 24) */
  padding?: number;
  /** Path to assets directory (default: skill's assets/) */
  assetsDir?: string;
}

/** Resolved asset paths */
const LOGO_FILES: Record<LogoVariant, string> = {
  dark: 'logo-dark.png',
  light: 'logo-light.png',
  tagline: 'logo-tagline.png',
};

const DEFAULT_ASSETS_DIR = path.resolve(__dirname, '../../assets');

/**
 * Calculate logo position coordinates
 */
function getLogoCoordinates(
  position: LogoPosition,
  imageWidth: number,
  imageHeight: number,
  logoWidth: number,
  logoHeight: number,
  padding: number,
): { left: number; top: number } {
  switch (position) {
    case 'top-left':
      return { left: padding, top: padding };
    case 'top-center':
      return { left: Math.round((imageWidth - logoWidth) / 2), top: padding };
    case 'top-right':
      return { left: imageWidth - logoWidth - padding, top: padding };
    case 'bottom-left':
      return { left: padding, top: imageHeight - logoHeight - padding };
    case 'bottom-center':
      return { left: Math.round((imageWidth - logoWidth) / 2), top: imageHeight - logoHeight - padding };
    case 'bottom-right':
      return { left: imageWidth - logoWidth - padding, top: imageHeight - logoHeight - padding };
  }
}

/**
 * Overlay the HLN logo onto a generated image.
 * Modifies the image file in-place.
 */
export async function compositeLogoOnImage(
  imagePath: string,
  options: CompositeOptions = {},
): Promise<string> {
  const {
    logo = 'dark',
    logoPosition = 'top-left',
    logoScale = 0.12,
    padding = 24,
    assetsDir = DEFAULT_ASSETS_DIR,
  } = options;

  const logoPath = path.join(assetsDir, LOGO_FILES[logo]);

  // Read the generated image to get dimensions
  const image = sharp(imagePath);
  const metadata = await image.metadata();
  const imageWidth = metadata.width!;
  const imageHeight = metadata.height!;

  // Calculate target logo size (scale relative to image width)
  const targetLogoWidth = Math.round(imageWidth * logoScale);

  // Resize logo to target width, maintaining aspect ratio
  const resizedLogo = await sharp(logoPath)
    .resize({ width: targetLogoWidth })
    .png()
    .toBuffer();

  // Get resized logo dimensions
  const logoMeta = await sharp(resizedLogo).metadata();
  const logoWidth = logoMeta.width!;
  const logoHeight = logoMeta.height!;

  // Calculate position
  const { left, top } = getLogoCoordinates(
    logoPosition,
    imageWidth,
    imageHeight,
    logoWidth,
    logoHeight,
    padding,
  );

  // Composite logo onto image
  const result = await sharp(imagePath)
    .composite([
      {
        input: resizedLogo,
        left,
        top,
      },
    ])
    .png()
    .toBuffer();

  // Write back to same path
  const fs = await import('node:fs');
  fs.writeFileSync(imagePath, result);

  return imagePath;
}

/**
 * Composite multiple assets onto an image.
 * Useful for logo + footer URL bar, etc.
 */
export async function compositeAssets(
  imagePath: string,
  overlays: Array<{
    input: string | Buffer;
    position: LogoPosition;
    scale?: number;
    padding?: number;
  }>,
): Promise<string> {
  const image = sharp(imagePath);
  const metadata = await image.metadata();
  const imageWidth = metadata.width!;
  const imageHeight = metadata.height!;

  const composites: sharp.OverlayOptions[] = [];

  for (const overlay of overlays) {
    const scale = overlay.scale ?? 0.12;
    const pad = overlay.padding ?? 24;
    const targetWidth = Math.round(imageWidth * scale);

    const inputBuffer = typeof overlay.input === 'string'
      ? await sharp(overlay.input).resize({ width: targetWidth }).png().toBuffer()
      : await sharp(overlay.input).resize({ width: targetWidth }).png().toBuffer();

    const overlayMeta = await sharp(inputBuffer).metadata();

    const { left, top } = getLogoCoordinates(
      overlay.position,
      imageWidth,
      imageHeight,
      overlayMeta.width!,
      overlayMeta.height!,
      pad,
    );

    composites.push({ input: inputBuffer, left, top });
  }

  const result = await sharp(imagePath)
    .composite(composites)
    .png()
    .toBuffer();

  const fs = await import('node:fs');
  fs.writeFileSync(imagePath, result);

  return imagePath;
}
