import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import sharp from 'sharp';
import { compositeLogoOnImage, compositeAssets } from '../src/generators/compositor';

const ASSETS_DIR = path.resolve(__dirname, '../assets');

describe('Compositor', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'compositor-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  /** Create a test image (solid dark background) */
  async function createTestImage(width = 1200, height = 624): Promise<string> {
    const imagePath = path.join(tmpDir, `test-${Date.now()}.png`);
    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 10, g: 10, b: 26, alpha: 1 },
      },
    })
      .png()
      .toFile(imagePath);
    return imagePath;
  }

  it('composites logo onto image without error', async () => {
    const imagePath = await createTestImage();
    const result = await compositeLogoOnImage(imagePath, { assetsDir: ASSETS_DIR });
    expect(result).toBe(imagePath);
    expect(fs.existsSync(imagePath)).toBe(true);
  });

  it('output file is valid PNG after compositing', async () => {
    const imagePath = await createTestImage();
    await compositeLogoOnImage(imagePath, { assetsDir: ASSETS_DIR });
    const meta = await sharp(imagePath).metadata();
    expect(meta.format).toBe('png');
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(624);
  });

  it('uses dark logo variant by default', async () => {
    const imagePath = await createTestImage();
    // Should not throw — dark logo exists
    await expect(
      compositeLogoOnImage(imagePath, { assetsDir: ASSETS_DIR }),
    ).resolves.toBe(imagePath);
  });

  it('supports light logo variant', async () => {
    const imagePath = await createTestImage();
    await expect(
      compositeLogoOnImage(imagePath, { logo: 'light', assetsDir: ASSETS_DIR }),
    ).resolves.toBe(imagePath);
  });

  it('supports tagline logo variant', async () => {
    const imagePath = await createTestImage();
    await expect(
      compositeLogoOnImage(imagePath, { logo: 'tagline', assetsDir: ASSETS_DIR }),
    ).resolves.toBe(imagePath);
  });

  it('respects logo position top-right', async () => {
    const imagePath = await createTestImage();
    await compositeLogoOnImage(imagePath, {
      logoPosition: 'top-right',
      assetsDir: ASSETS_DIR,
    });
    // Image should still be valid
    const meta = await sharp(imagePath).metadata();
    expect(meta.width).toBe(1200);
  });

  it('respects logo position bottom-center', async () => {
    const imagePath = await createTestImage();
    await compositeLogoOnImage(imagePath, {
      logoPosition: 'bottom-center',
      assetsDir: ASSETS_DIR,
    });
    const meta = await sharp(imagePath).metadata();
    expect(meta.width).toBe(1200);
  });

  it('respects custom scale', async () => {
    const imagePath = await createTestImage();
    // Very small logo
    await compositeLogoOnImage(imagePath, {
      logoScale: 0.05,
      assetsDir: ASSETS_DIR,
    });
    const meta = await sharp(imagePath).metadata();
    expect(meta.width).toBe(1200);
  });

  it('works with square images', async () => {
    const imagePath = await createTestImage(1088, 1088);
    await compositeLogoOnImage(imagePath, { assetsDir: ASSETS_DIR });
    const meta = await sharp(imagePath).metadata();
    expect(meta.width).toBe(1088);
    expect(meta.height).toBe(1088);
  });

  it('works with wide images (facebook cover)', async () => {
    const imagePath = await createTestImage(820, 312);
    await compositeLogoOnImage(imagePath, { assetsDir: ASSETS_DIR });
    const meta = await sharp(imagePath).metadata();
    expect(meta.width).toBe(820);
    expect(meta.height).toBe(312);
  });

  describe('compositeAssets', () => {
    it('composites multiple overlays', async () => {
      const imagePath = await createTestImage();
      const logoPath = path.join(ASSETS_DIR, 'logo-dark.png');

      await compositeAssets(imagePath, [
        { input: logoPath, position: 'top-left', scale: 0.10 },
        { input: logoPath, position: 'bottom-right', scale: 0.08 },
      ]);

      const meta = await sharp(imagePath).metadata();
      expect(meta.format).toBe('png');
      expect(meta.width).toBe(1200);
    });
  });
});
