/**
 * Generate a thumbnail from an image data URL.
 * Returns a base64 data URL of the resized image.
 */
export function generateThumbnail(
  dataUrl: string,
  maxWidth = 200,
  maxHeight = 200
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Convert a Blob or File to a base64 data URL.
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Apply perspective correction to a scanned document.
 * Takes four corner points (top-left, top-right, bottom-right, bottom-left)
 * and maps them to a rectangular output.
 */
export function applyPerspectiveCorrection(
  dataUrl: string,
  corners: { x: number; y: number }[],
  outputWidth = 800,
  outputHeight = 1100
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (corners.length !== 4) {
      reject(new Error('Exactly 4 corner points are required'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Denormalize corner coordinates
      const srcPoints = corners.map((c) => ({
        x: c.x * img.width,
        y: c.y * img.height,
      }));

      // Simple bilinear interpolation-based perspective warp
      const [tl, tr, br, bl] = srcPoints;

      for (let dy = 0; dy < outputHeight; dy++) {
        for (let dx = 0; dx < outputWidth; dx++) {
          const u = dx / outputWidth;
          const v = dy / outputHeight;

          const srcX =
            (1 - u) * (1 - v) * tl.x +
            u * (1 - v) * tr.x +
            u * v * br.x +
            (1 - u) * v * bl.x;
          const srcY =
            (1 - u) * (1 - v) * tl.y +
            u * (1 - v) * tr.y +
            u * v * br.y +
            (1 - u) * v * bl.y;

          ctx.drawImage(img, srcX, srcY, 1, 1, dx, dy, 1, 1);
        }
      }

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Enhance image quality by adjusting brightness and contrast.
 */
export function enhanceImage(
  dataUrl: string,
  options: { brightness?: number; contrast?: number; grayscale?: boolean } = {}
): Promise<string> {
  const { brightness = 0, contrast = 0, grayscale = false } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Apply CSS filters via canvas
      const filters: string[] = [];
      if (brightness !== 0) filters.push(`brightness(${1 + brightness / 100})`);
      if (contrast !== 0) filters.push(`contrast(${1 + contrast / 100})`);
      if (grayscale) filters.push('grayscale(1)');

      ctx.filter = filters.length > 0 ? filters.join(' ') : 'none';
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Convert a canvas video frame capture to a data URL.
 */
export function captureVideoFrame(video: HTMLVideoElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  ctx.drawImage(video, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.92);
}
