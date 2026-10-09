import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

interface OptimizeOptions {
  width: number;
  height: number;
  quality?: number;
}

const SIZES: Record<'lead' | 'thumb', OptimizeOptions> = {
  lead: { width: 1000, height: 625, quality: 86 }, // 16:10 ratio, 2x for ~500px column
  thumb: { width: 440, height: 275, quality: 86 }, // 16:10 ratio, 2x for ~200px thumbnail
};

/**
 * Optimizes an image from public/content/images/ into a crisp, properly scaled WebP thumbnail.
 * Writes to both public/ (for caching / dev) and dist/ (for static build output).
 */
export async function getOptimizedImage(
  srcPath: string | undefined,
  type: 'lead' | 'thumb'
): Promise<string | undefined> {
  if (!srcPath) return undefined;

  // Only handle local public images (e.g. /content/images/...)
  if (srcPath.startsWith('http://') || srcPath.startsWith('https://') || !srcPath.startsWith('/content/images/')) {
    return srcPath;
  }

  const cleanSrc = srcPath.replace(/^\//, '');
  const publicSrcPath = path.resolve(process.cwd(), 'public', cleanSrc);

  if (!fs.existsSync(publicSrcPath)) {
    return srcPath;
  }

  const { width, height, quality = 86 } = SIZES[type];
  const parsed = path.parse(cleanSrc);
  const relDir = path.relative('content/images', parsed.dir);

  const outFileName = `${parsed.name}-${type}.webp`;
  const optimizedRelPath = path.join('content/images/_optimized', relDir, outFileName);

  const publicOutPath = path.resolve(process.cwd(), 'public', optimizedRelPath);
  const distOutPath = path.resolve(process.cwd(), 'dist', optimizedRelPath);
  const publicUrl = `/${optimizedRelPath.replace(/\\/g, '/')}`;

  // Check if cached version exists and is fresh
  try {
    const srcStat = fs.statSync(publicSrcPath);
    let publicFresh = false;

    if (fs.existsSync(publicOutPath)) {
      const outStat = fs.statSync(publicOutPath);
      if (outStat.mtimeMs >= srcStat.mtimeMs && outStat.size > 0) {
        publicFresh = true;
      }
    }

    if (!publicFresh) {
      fs.mkdirSync(path.dirname(publicOutPath), { recursive: true });

      await sharp(publicSrcPath)
        .rotate() // auto-orient based on EXIF
        .resize(width, height, {
          fit: 'cover',
          position: 'center',
          kernel: 'lanczos3',
        })
        .webp({ quality, effort: 4 })
        .toFile(publicOutPath);
    }

    // If dist/ directory exists during build, ensure the optimized file is also in dist/
    const distDir = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      fs.mkdirSync(path.dirname(distOutPath), { recursive: true });
      if (!fs.existsSync(distOutPath) || fs.statSync(distOutPath).mtimeMs < srcStat.mtimeMs) {
        fs.copyFileSync(publicOutPath, distOutPath);
      }
    }

    return publicUrl;
  } catch (err) {
    console.warn(`[imageOptimizer] Failed to optimize ${srcPath}:`, err);
    return srcPath;
  }
}
