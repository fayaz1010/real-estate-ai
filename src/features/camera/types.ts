export interface PhotoAnnotation {
  id: string;
  type: 'TEXT' | 'ARROW' | 'CIRCLE' | 'RECTANGLE';
  position: { x: number; y: number };
  content?: string;
  color: string;
  size?: number;
  points?: { x: number; y: number }[];
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  propertyId?: string;
  roomLabel?: string;
  annotations: PhotoAnnotation[];
  thumbnail: string;
}

export interface CameraConfig {
  facingMode: 'user' | 'environment';
  resolution: { width: number; height: number };
  flash: 'auto' | 'on' | 'off';
}
