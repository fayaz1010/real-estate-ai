import {
  Camera,
  RotateCcw,
  X,
  Building,
  Wrench,
  FileText,
  SwitchCamera,
} from "lucide-react";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

/* ── Types ─────────────────────────────────────────────── */

export type CaptureMode = "property" | "maintenance" | "document";

export interface CameraCaptureProps {
  /** Which capture context to use — affects labels and aspect hints */
  mode?: CaptureMode;
  /** Called with the data-URL of the captured image */
  onCapture?: (imageDataUrl: string) => void;
  /** Called when user dismisses the camera UI */
  onClose?: () => void;
}

/* ── Mode metadata ─────────────────────────────────────── */

const modeConfig: Record<
  CaptureMode,
  { label: string; icon: React.ElementType; hint: string }
> = {
  property: {
    label: "Property Photo",
    icon: Building,
    hint: "Hold your device in landscape for best results",
  },
  maintenance: {
    label: "Maintenance Issue",
    icon: Wrench,
    hint: "Focus on the area that needs attention",
  },
  document: {
    label: "Document Scan",
    icon: FileText,
    hint: "Align the document within the frame and hold steady",
  },
};

/* ── Component ─────────────────────────────────────────── */

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  mode = "property",
  onCapture,
  onClose,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment",
  );
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = modeConfig[mode];
  const ModeIcon = config.icon;

  // Reset state when mode changes
  useEffect(() => {
    setCapturedImage(null);
    setError(null);
  }, [mode]);

  /* ── Camera handlers ─────────────────────────────────── */

  const handleUserMedia = useCallback(() => {
    setCameraReady(true);
    setError(null);
  }, []);

  const handleUserMediaError = useCallback((err: string | DOMException) => {
    setCameraReady(false);
    if (err instanceof DOMException) {
      switch (err.name) {
        case "NotAllowedError":
          setError(
            "Camera access was denied. Please grant camera permissions in your browser settings.",
          );
          break;
        case "NotFoundError":
          setError("No camera device found on this device.");
          break;
        case "NotReadableError":
          setError("Camera is already in use by another application.");
          break;
        default:
          setError(`Camera error: ${err.message}`);
      }
    } else {
      setError("Unable to access the camera. Please check your permissions.");
    }
  }, []);

  const takePhoto = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      onCapture?.(imageSrc);
    }
  }, [onCapture]);

  const retryCapture = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const toggleFacingMode = useCallback(() => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  }, []);

  /* ── Styles (inline for portability) ─────────────────── */

  const buttonBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    fontWeight: 500,
    minHeight: 44,
    padding: "12px 20px",
    transition: "opacity 200ms ease",
  };

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ModeIcon size={20} style={{ color: "#008080" }} />
          <span
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 18,
              color: "#1A1A2E",
            }}
          >
            {config.label}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close camera"
            style={{
              ...buttonBase,
              backgroundColor: "transparent",
              color: "#1A1A2E",
              padding: 8,
              minWidth: 44,
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Hint */}
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#A0926B",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {config.hint}
      </p>

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            padding: 12,
            fontSize: 14,
            color: "#991b1b",
            backgroundColor: "#fef2f2",
            borderRadius: 8,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {error}
        </div>
      )}

      {/* Camera Feed */}
      {!capturedImage && !error && (
        <div
          style={{
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "#000",
            aspectRatio: mode === "document" ? "3/4" : "4/3",
          }}
        >
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.85}
            videoConstraints={{
              facingMode,
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            }}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Document scan guide overlay */}
          {mode === "document" && cameraReady && (
            <div
              style={{
                position: "absolute",
                inset: "10%",
                border: "2px dashed rgba(196, 168, 130, 0.7)",
                borderRadius: 8,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: "2px solid #C4A882",
          }}
        >
          <img
            src={capturedImage}
            alt={`Captured ${config.label.toLowerCase()}`}
            style={{
              width: "100%",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {!capturedImage && !error && (
          <>
            <button
              onClick={takePhoto}
              disabled={!cameraReady}
              style={{
                ...buttonBase,
                flex: 1,
                backgroundColor: cameraReady ? "#008080" : "#C4A882",
                color: "#fff",
                opacity: cameraReady ? 1 : 0.6,
              }}
            >
              <Camera size={20} />
              Capture
            </button>

            <button
              onClick={toggleFacingMode}
              aria-label="Switch camera"
              style={{
                ...buttonBase,
                backgroundColor: "#FFFFFF",
                color: "#008080",
                border: "1px solid #C4A882",
                padding: "12px 16px",
              }}
            >
              <SwitchCamera size={20} />
            </button>
          </>
        )}

        {capturedImage && (
          <button
            onClick={retryCapture}
            style={{
              ...buttonBase,
              flex: 1,
              backgroundColor: "#A0926B",
              color: "#fff",
            }}
          >
            <RotateCcw size={20} />
            Retry
          </button>
        )}

        {error && (
          <button
            onClick={() => setError(null)}
            style={{
              ...buttonBase,
              flex: 1,
              backgroundColor: "#008080",
              color: "#fff",
            }}
          >
            <Camera size={20} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
