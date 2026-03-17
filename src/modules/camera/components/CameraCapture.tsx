import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCcw, Upload } from 'lucide-react';

interface CameraCaptureProps {
  onCapture?: (imageData: string) => void;
  onUpload?: (imageData: string) => void;
}

const buttonBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '12px 20px',
  color: '#ffffff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontFamily: "'Open Sans', sans-serif",
  fontSize: 14,
  fontWeight: 600,
  transition: 'opacity 0.2s ease',
  width: '100%',
};

const primaryButton: React.CSSProperties = {
  ...buttonBase,
  backgroundColor: '#091a2b',
};

const secondaryButton: React.CSSProperties = {
  ...buttonBase,
  backgroundColor: '#005163',
};

export function CameraCapture({ onCapture, onUpload }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const videoConstraints: MediaTrackConstraints = {
    facingMode: 'environment',
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  const handleStartCamera = () => {
    setCameraActive(true);
    setCameraError(null);
    setCapturedImage(null);
  };

  const handleCapture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      onCapture?.(imageSrc);
    }
  }, [onCapture]);

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleUpload = () => {
    if (capturedImage) {
      onUpload?.(capturedImage);
    }
  };

  const handleCameraError = () => {
    setCameraError('Unable to access camera. Please check permissions and try again.');
    setCameraActive(false);
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", display: 'flex', flexDirection: 'column', gap: 16 }}>
      {cameraError && (
        <div
          style={{
            padding: 12,
            fontSize: 14,
            color: '#991b1b',
            backgroundColor: '#fef2f2',
            borderRadius: 8,
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          {cameraError}
        </div>
      )}

      {!cameraActive && !capturedImage && (
        <button onClick={handleStartCamera} style={primaryButton}>
          <Camera size={20} />
          Open Camera
        </button>
      )}

      {cameraActive && !capturedImage && (
        <>
          <div style={{ borderRadius: 8, overflow: 'hidden', backgroundColor: '#000' }}>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={handleCameraError}
              style={{ width: '100%', display: 'block' }}
            />
          </div>
          <button onClick={handleCapture} style={primaryButton}>
            <Camera size={20} />
            Take Picture
          </button>
        </>
      )}

      {capturedImage && (
        <>
          <div style={{ borderRadius: 8, overflow: 'hidden' }}>
            <img src={capturedImage} alt="Captured" style={{ width: '100%', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleRetake} style={{ ...secondaryButton, flex: 1 }}>
              <RotateCcw size={20} />
              Retake
            </button>
            <button onClick={handleUpload} style={{ ...primaryButton, flex: 1 }}>
              <Upload size={20} />
              Upload
            </button>
          </div>
        </>
      )}
    </div>
  );
}
