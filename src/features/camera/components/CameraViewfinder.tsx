import { Camera, CameraOff, Zap, ZapOff, RefreshCw, X } from "lucide-react";
import React, { useCallback, useState } from "react";

import { useCamera } from "../hooks/useCamera";
import type { CapturedPhoto, CameraConfig } from "../types";

interface CameraViewfinderProps {
  initialConfig?: Partial<CameraConfig>;
  onCapture?: (photo: CapturedPhoto) => void;
  onClose?: () => void;
  propertyId?: string;
  roomLabel?: string;
  showGrid?: boolean;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  initialConfig,
  onCapture,
  onClose,
  propertyId,
  roomLabel,
  showGrid = true,
}) => {
  const {
    videoRef,
    isActive,
    error,
    config,
    permissionState,
    startCamera,
    stopCamera,
    capturePhoto,
    toggleFlash,
    switchCamera,
  } = useCamera(initialConfig);

  const [isCapturing, setIsCapturing] = useState(false);
  const [flashAnimation, setFlashAnimation] = useState(false);

  const handleCapture = useCallback(async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setFlashAnimation(true);

    try {
      const photo = await capturePhoto(propertyId, roomLabel);
      onCapture?.(photo);
    } catch {
      // Error already handled in hook
    } finally {
      setIsCapturing(false);
      setTimeout(() => setFlashAnimation(false), 200);
    }
  }, [isCapturing, capturePhoto, propertyId, roomLabel, onCapture]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose?.();
  }, [stopCamera, onClose]);

  const FlashIcon =
    config.flash === "on" ? Zap : config.flash === "auto" ? Zap : ZapOff;

  if (!isActive && permissionState === "denied") {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-900 rounded-xl p-8 text-center">
        <CameraOff className="w-16 h-16 text-gray-400 mb-4" />
        <h3
          className="text-xl font-semibold text-white mb-2"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Camera Access Denied
        </h3>
        <p
          className="text-gray-400 mb-6"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Please enable camera permissions in your browser settings to use this
          feature.
        </p>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-900 rounded-xl p-8 text-center">
        <Camera className="w-16 h-16 text-gray-400 mb-4" />
        <h3
          className="text-xl font-semibold text-white mb-2"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Property Camera
        </h3>
        <p
          className="text-gray-400 mb-6"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Capture photos for property documentation
        </p>
        <button
          onClick={startCamera}
          className="px-6 py-3 rounded-lg text-white font-medium transition-colors"
          style={{
            backgroundColor: "#008080",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#003d4a")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#008080")
          }
        >
          Start Camera
        </button>
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] bg-black rounded-xl overflow-hidden">
      {/* Flash animation overlay */}
      {flashAnimation && (
        <div className="absolute inset-0 bg-white z-30 animate-pulse pointer-events-none" />
      )}

      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{
          transform: config.facingMode === "user" ? "scaleX(-1)" : "none",
        }}
      />

      {/* Composition grid overlay */}
      {showGrid && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Rule of thirds */}
          <div className="absolute top-1/3 left-0 right-0 border-t border-white/20" />
          <div className="absolute top-2/3 left-0 right-0 border-t border-white/20" />
          <div className="absolute top-0 bottom-0 left-1/3 border-l border-white/20" />
          <div className="absolute top-0 bottom-0 left-2/3 border-l border-white/20" />
          {/* Center crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-px bg-white/40" />
            <div className="w-px h-6 bg-white/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}

      {/* Room label badge */}
      {roomLabel && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full text-sm text-white/90"
          style={{
            backgroundColor: "rgba(9, 26, 43, 0.7)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {roomLabel}
        </div>
      )}

      {/* Top controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        <button
          onClick={handleClose}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close camera"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-3">
          <button
            onClick={toggleFlash}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label={`Flash: ${config.flash}`}
          >
            <FlashIcon className="w-5 h-5" />
            {config.flash === "auto" && (
              <span className="absolute -bottom-1 text-[8px] font-bold text-yellow-400">
                A
              </span>
            )}
          </button>

          <button
            onClick={switchCamera}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Switch camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom capture controls */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center">
        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className="relative w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-90 disabled:opacity-50"
          aria-label="Capture photo"
        >
          <div
            className="w-12 h-12 rounded-full transition-colors"
            style={{ backgroundColor: isCapturing ? "#ff4444" : "white" }}
          />
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="absolute bottom-24 left-4 right-4 z-20 bg-red-600/90 text-white text-sm p-3 rounded-lg text-center">
          {error}
        </div>
      )}
    </div>
  );
};
