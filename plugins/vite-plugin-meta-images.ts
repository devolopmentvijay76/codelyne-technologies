import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin that updates og:image and twitter:image meta tags
 * to point to the app's opengraph image with the correct deployment domain.
 */
export function metaImagesPlugin(): Plugin {
  return {
    name: 'vite-plugin-meta-images',
    transformIndexHtml(html) {
      const baseUrl = getDeploymentUrl();
      if (!baseUrl) {
        log('[meta-images] no deployment domain found, skipping meta tag updates');
        return html;
      }

      // Check if opengraph image exists in public directory
      const publicDir = path.resolve(process.cwd(), 'frontend', 'public');
      const opengraphPngPath = path.join(publicDir, 'opengraph.png');
      const opengraphJpgPath = path.join(publicDir, 'opengraph.jpg');
      const opengraphJpegPath = path.join(publicDir, 'opengraph.jpeg');

      let imageExt: string | null = null;
      if (fs.existsSync(opengraphPngPath)) {
        imageExt = 'png';
      } else if (fs.existsSync(opengraphJpgPath)) {
        imageExt = 'jpg';
      } else if (fs.existsSync(opengraphJpegPath)) {
        imageExt = 'jpeg';
      }

      if (!imageExt) {
        log('[meta-images] OpenGraph image not found, skipping meta tag updates');
        return html;
      }

      const imageUrl = `${baseUrl}/opengraph.${imageExt}`;

      log('[meta-images] updating meta image tags to:', imageUrl);

      html = html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/g,
        `<meta property="og:image" content="${imageUrl}" />`
      );

      html = html.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/g,
        `<meta name="twitter:image" content="${imageUrl}" />`
      );

      return html;
    },
  };
}

/** Prefer explicit deployment env vars; also match common hosted keys by suffix (no hard-coded vendor names). */
function findEnvValueBySuffix(suffix: string): string | undefined {
  for (const [key, value] of Object.entries(process.env)) {
    if (value && key.endsWith(suffix)) {
      return value;
    }
  }
  return undefined;
}

function getDeploymentUrl(): string | null {
  const explicitInternal = process.env.DEPLOYMENT_INTERNAL_DOMAIN?.trim();
  if (explicitInternal) {
    const url = explicitInternal.startsWith('http')
      ? explicitInternal
      : `https://${explicitInternal}`;
    log('[meta-images] using DEPLOYMENT_INTERNAL_DOMAIN:', url);
    return url;
  }

  const legacyInternal = findEnvValueBySuffix('INTERNAL_APP_DOMAIN')?.trim();
  if (legacyInternal) {
    const url = legacyInternal.startsWith('http')
      ? legacyInternal
      : `https://${legacyInternal}`;
    log('[meta-images] using internal app domain:', url);
    return url;
  }

  const explicitPreview = process.env.DEPLOYMENT_PREVIEW_DOMAIN?.trim();
  if (explicitPreview) {
    const url = explicitPreview.startsWith('http')
      ? explicitPreview
      : `https://${explicitPreview}`;
    log('[meta-images] using DEPLOYMENT_PREVIEW_DOMAIN:', url);
    return url;
  }

  const legacyPreview = findEnvValueBySuffix('DEV_DOMAIN')?.trim();
  if (legacyPreview) {
    const url = legacyPreview.startsWith('http')
      ? legacyPreview
      : `https://${legacyPreview}`;
    log('[meta-images] using preview domain:', url);
    return url;
  }

  return null;
}

function log(...args: any[]): void {
  if (process.env.NODE_ENV === 'production') {
    console.log(...args);
  }
}
