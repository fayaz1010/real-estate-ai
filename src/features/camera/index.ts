// Types
export type { CapturedPhoto, CameraConfig, PhotoAnnotation } from './types';

// Components
export { CameraViewfinder } from './components/CameraViewfinder';
export { PhotoAnnotator } from './components/PhotoAnnotator';
export { PhotoGallery } from './components/PhotoGallery';
export { DocumentScanner } from './components/DocumentScanner';

// Hooks
export { useCamera } from './hooks/useCamera';

// Utils
export {
  generateThumbnail,
  blobToDataUrl,
  applyPerspectiveCorrection,
  enhanceImage,
  captureVideoFrame,
} from './utils/imageProcessor';
