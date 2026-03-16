import { useCallback, useEffect, useRef, useState } from 'react';
import type { CameraConfig, CapturedPhoto } from '../types';
import { captureVideoFrame, generateThumbnail } from '../utils/imageProcessor';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
  config: CameraConfig;
  permissionState: 'prompt' | 'granted' | 'denied' | 'unknown';
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: (
    propertyId?: string,
    roomLabel?: string
  ) => Promise<CapturedPhoto>;
  toggleFlash: () => void;
  switchCamera: () => void;
  setResolution: (width: number, height: number) => void;
}

const DEFAULT_CONFIG: CameraConfig = {
  facingMode: 'environment',
  resolution: { width: 1920, height: 1080 },
  flash: 'off',
};

export function useCamera(
  initialConfig?: Partial<CameraConfig>
): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<
    'prompt' | 'granted' | 'denied' | 'unknown'
  >('unknown');
  const [config, setConfig] = useState<CameraConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });

  // Check permission state on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'camera' as PermissionName })
        .then((status) => {
          setPermissionState(status.state as 'prompt' | 'granted' | 'denied');
          status.onchange = () => {
            setPermissionState(
              status.state as 'prompt' | 'granted' | 'denied'
            );
          };
        })
        .catch(() => setPermissionState('unknown'));
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsActive(false);
  }, [stream]);

  const startCamera = useCallback(async () => {
    setError(null);

    try {
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: config.facingMode,
          width: { ideal: config.resolution.width },
          height: { ideal: config.resolution.height },
        },
        audio: false,
      };

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsActive(true);
      setPermissionState('granted');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      const message =
        err instanceof DOMException
          ? err.name === 'NotAllowedError'
            ? 'Camera access denied. Please grant camera permissions.'
            : err.name === 'NotFoundError'
              ? 'No camera found on this device.'
              : `Camera error: ${err.message}`
          : 'Failed to access camera.';

      setError(message);
      setIsActive(false);

      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setPermissionState('denied');
      }
    }
  }, [config.facingMode, config.resolution.width, config.resolution.height, stream]);

  const capturePhoto = useCallback(
    async (
      propertyId?: string,
      roomLabel?: string
    ): Promise<CapturedPhoto> => {
      if (!videoRef.current || !isActive) {
        throw new Error('Camera is not active');
      }

      const dataUrl = captureVideoFrame(videoRef.current);
      const thumbnail = await generateThumbnail(dataUrl);

      return {
        id: crypto.randomUUID(),
        dataUrl,
        timestamp: Date.now(),
        propertyId,
        roomLabel,
        annotations: [],
        thumbnail,
      };
    },
    [isActive]
  );

  const toggleFlash = useCallback(() => {
    setConfig((prev) => {
      const nextFlash =
        prev.flash === 'off' ? 'on' : prev.flash === 'on' ? 'auto' : 'off';

      // Apply torch constraint if supported
      if (stream) {
        const track = stream.getVideoTracks()[0];
        if (track) {
          const capabilities = track.getCapabilities?.() as Record<string, unknown> | undefined;
          if (capabilities?.torch) {
            track
              .applyConstraints({
                advanced: [{ torch: nextFlash === 'on' } as MediaTrackConstraintSet],
              })
              .catch(() => {
                /* torch not supported */
              });
          }
        }
      }

      return { ...prev, flash: nextFlash };
    });
  }, [stream]);

  const switchCamera = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      facingMode: prev.facingMode === 'user' ? 'environment' : 'user',
    }));
  }, []);

  const setResolution = useCallback((width: number, height: number) => {
    setConfig((prev) => ({ ...prev, resolution: { width, height } }));
  }, []);

  // Restart camera when facingMode changes and camera is active
  useEffect(() => {
    if (isActive) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.facingMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    videoRef,
    stream,
    isActive,
    error,
    config,
    permissionState,
    startCamera,
    stopCamera,
    capturePhoto,
    toggleFlash,
    switchCamera,
    setResolution,
  };
}
