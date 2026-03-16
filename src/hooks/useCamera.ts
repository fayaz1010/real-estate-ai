import { useState, useCallback, useRef } from 'react';

interface UseCameraResult {
  videoStream: MediaStream | null;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export function useCamera(): UseCameraResult {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setVideoStream(null);
    }
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera API is not supported in this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      streamRef.current = stream;
      setVideoStream(stream);
    } catch (err) {
      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
            setError('Camera access was denied. Please grant camera permissions.');
            break;
          case 'NotFoundError':
            setError('No camera device found.');
            break;
          case 'NotReadableError':
            setError('Camera is already in use by another application.');
            break;
          default:
            setError(`Camera error: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred while accessing the camera.');
      }
    }
  }, [stopCamera]);

  return { videoStream, error, startCamera, stopCamera };
}
