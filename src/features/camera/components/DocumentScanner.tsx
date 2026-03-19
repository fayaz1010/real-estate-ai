import {
  RotateCcw,
  Download,
  Check,
  ZoomIn,
  X,
  Scan,
  Contrast,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { useCamera } from "../hooks/useCamera";
import {
  applyPerspectiveCorrection,
  captureVideoFrame,
  enhanceImage,
} from "../utils/imageProcessor";

interface DocumentScannerProps {
  onSave?: (dataUrl: string) => void;
  onClose?: () => void;
}

type ScanStep = "capture" | "adjust" | "enhance" | "preview";

interface Corner {
  x: number;
  y: number;
}

const DEFAULT_CORNERS: Corner[] = [
  { x: 0.1, y: 0.1 },
  { x: 0.9, y: 0.1 },
  { x: 0.9, y: 0.9 },
  { x: 0.1, y: 0.9 },
];

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onSave,
  onClose,
}) => {
  const { videoRef, isActive, error, startCamera, stopCamera } = useCamera({
    facingMode: "environment",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState<ScanStep>("capture");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [corners, setCorners] = useState<Corner[]>(DEFAULT_CORNERS);
  const [draggingCorner, setDraggingCorner] = useState<number | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhanceOptions, setEnhanceOptions] = useState({
    brightness: 10,
    contrast: 20,
    grayscale: false,
  });

  // Start camera on mount
  useEffect(() => {
    if (step === "capture") {
      startCamera();
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current) return;
    const dataUrl = captureVideoFrame(videoRef.current);
    setCapturedImage(dataUrl);
    setCorners(detectEdges(dataUrl));
    setStep("adjust");
    stopCamera();
  }, [videoRef, stopCamera]);

  // Simple edge detection heuristic — returns default corners
  // In production, use a vision library for actual edge detection
  const detectEdges = useCallback((_dataUrl: string): Corner[] => {
    // Placeholder: return slightly inset corners
    // A real implementation would analyze pixel gradients
    return [
      { x: 0.08, y: 0.06 },
      { x: 0.92, y: 0.06 },
      { x: 0.94, y: 0.94 },
      { x: 0.06, y: 0.94 },
    ];
  }, []);

  const handleCornerDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (draggingCorner === null || !canvasRef.current) return;
      e.preventDefault();

      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

      setCorners((prev) => {
        const updated = [...prev];
        updated[draggingCorner] = { x, y };
        return updated;
      });
    },
    [draggingCorner],
  );

  // Draw adjustment overlay
  useEffect(() => {
    if (step !== "adjust" || !capturedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Darken outside selection
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw selected area
      ctx.save();
      ctx.beginPath();
      const pts = corners.map((c) => ({
        x: c.x * canvas.width,
        y: c.y * canvas.height,
      }));
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      // Draw border
      ctx.strokeStyle = "#005163";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Draw corner handles
      for (const pt of pts) {
        ctx.fillStyle = "#005163";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    img.src = capturedImage;
  }, [step, capturedImage, corners]);

  const handleApplyCorrection = useCallback(async () => {
    if (!capturedImage) return;
    setIsProcessing(true);

    try {
      const corrected = await applyPerspectiveCorrection(
        capturedImage,
        corners,
      );
      const enhanced = await enhanceImage(corrected, enhanceOptions);
      setProcessedImage(enhanced);
      setStep("enhance");
    } catch {
      // Fallback to unprocessed image
      setProcessedImage(capturedImage);
      setStep("enhance");
    } finally {
      setIsProcessing(false);
    }
  }, [capturedImage, corners, enhanceOptions]);

  const handleUpdateEnhancement = useCallback(async () => {
    if (!capturedImage) return;
    setIsProcessing(true);

    try {
      const corrected = await applyPerspectiveCorrection(
        capturedImage,
        corners,
      );
      const enhanced = await enhanceImage(corrected, enhanceOptions);
      setProcessedImage(enhanced);
    } catch {
      // Keep current processed image
    } finally {
      setIsProcessing(false);
    }
  }, [capturedImage, corners, enhanceOptions]);

  const handleSave = useCallback(() => {
    if (processedImage) {
      onSave?.(processedImage);
    }
  }, [processedImage, onSave]);

  const handleDownload = useCallback(() => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `scanned-document-${Date.now()}.jpg`;
    link.click();
  }, [processedImage]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setProcessedImage(null);
    setCorners(DEFAULT_CORNERS);
    setStep("capture");
    startCamera();
  }, [startCamera]);

  const findNearestCorner = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!canvasRef.current) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      let minDist = 0.05; // Minimum distance threshold
      let nearest: number | null = null;

      corners.forEach((corner, idx) => {
        const dist = Math.sqrt((corner.x - x) ** 2 + (corner.y - y) ** 2);
        if (dist < minDist) {
          minDist = dist;
          nearest = idx;
        }
      });

      return nearest;
    },
    [corners],
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-700"
        style={{ backgroundColor: "#091a2b" }}
      >
        <h3
          className="text-white font-semibold"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <Scan className="w-5 h-5 inline-block mr-2 -mt-0.5" />
          Document Scanner
        </h3>
        <div className="flex items-center gap-2">
          {step !== "capture" && (
            <button
              onClick={handleRetake}
              className="p-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
              aria-label="Retake"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 px-4 py-2 bg-gray-800">
        {(["capture", "adjust", "enhance"] as const).map((s, i) => (
          <React.Fragment key={s}>
            <div
              className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
                step === s ||
                (["adjust", "enhance", "preview"].indexOf(step) > i - 1 &&
                  i < ["adjust", "enhance", "preview"].indexOf(step) + 1)
                  ? "text-white bg-white/15"
                  : "text-gray-500"
              }`}
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  backgroundColor: step === s ? "#005163" : "transparent",
                  border: step !== s ? "1px solid currentColor" : "none",
                  color: step === s ? "white" : undefined,
                }}
              >
                {i + 1}
              </span>
              {s === "capture"
                ? "Capture"
                : s === "adjust"
                  ? "Adjust"
                  : "Enhance"}
            </div>
            {i < 2 && <div className="flex-1 h-px bg-gray-600 mx-2" />}
          </React.Fragment>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col">
        {/* Step: Capture */}
        {step === "capture" && (
          <div className="flex-1 relative">
            {isActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Document frame guide */}
                <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-lg pointer-events-none" />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <button
                    onClick={handleCapture}
                    className="px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 shadow-lg"
                    style={{
                      backgroundColor: "#005163",
                      fontFamily: "Open Sans, sans-serif",
                    }}
                  >
                    <Scan className="w-5 h-5" />
                    Scan Document
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <Scan className="w-16 h-16 text-gray-500 mb-4" />
                <p
                  className="text-gray-400 mb-4"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Position the document within the frame
                </p>
                <button
                  onClick={startCamera}
                  className="px-6 py-3 rounded-lg text-white font-medium"
                  style={{
                    backgroundColor: "#005163",
                    fontFamily: "Open Sans, sans-serif",
                  }}
                >
                  Start Camera
                </button>
                {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
              </div>
            )}
          </div>
        )}

        {/* Step: Adjust corners */}
        {step === "adjust" && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-950">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full object-contain cursor-crosshair rounded"
                onMouseDown={(e) => {
                  const idx = findNearestCorner(e);
                  if (idx !== null) setDraggingCorner(idx);
                }}
                onMouseMove={handleCornerDrag}
                onMouseUp={() => setDraggingCorner(null)}
                onMouseLeave={() => setDraggingCorner(null)}
                onTouchStart={(e) => {
                  const idx = findNearestCorner(e);
                  if (idx !== null) setDraggingCorner(idx);
                }}
                onTouchMove={handleCornerDrag}
                onTouchEnd={() => setDraggingCorner(null)}
              />
            </div>
            <div className="p-4 flex justify-between items-center bg-gray-800">
              <p
                className="text-gray-400 text-sm"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Drag corners to adjust document edges
              </p>
              <button
                onClick={handleApplyCorrection}
                disabled={isProcessing}
                className="px-5 py-2 rounded-lg text-white font-medium flex items-center gap-2 disabled:opacity-50"
                style={{
                  backgroundColor: "#005163",
                  fontFamily: "Open Sans, sans-serif",
                }}
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Step: Enhance */}
        {(step === "enhance" || step === "preview") && processedImage && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-950">
              <img
                src={processedImage}
                alt="Scanned document"
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>

            {/* Enhancement controls */}
            <div className="p-4 bg-gray-800 space-y-3">
              <div className="flex items-center gap-3">
                <ZoomIn className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span
                  className="text-gray-400 text-xs w-16 flex-shrink-0"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Brightness
                </span>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={enhanceOptions.brightness}
                  onChange={(e) =>
                    setEnhanceOptions((o) => ({
                      ...o,
                      brightness: Number(e.target.value),
                    }))
                  }
                  className="flex-1 accent-[#005163]"
                />
              </div>
              <div className="flex items-center gap-3">
                <Contrast className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span
                  className="text-gray-400 text-xs w-16 flex-shrink-0"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Contrast
                </span>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={enhanceOptions.contrast}
                  onChange={(e) =>
                    setEnhanceOptions((o) => ({
                      ...o,
                      contrast: Number(e.target.value),
                    }))
                  }
                  className="flex-1 accent-[#005163]"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enhanceOptions.grayscale}
                    onChange={(e) =>
                      setEnhanceOptions((o) => ({
                        ...o,
                        grayscale: e.target.checked,
                      }))
                    }
                    className="accent-[#005163]"
                  />
                  <span
                    className="text-gray-400 text-xs"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Black & White
                  </span>
                </label>
                <div className="flex-1" />
                <button
                  onClick={handleUpdateEnhancement}
                  disabled={isProcessing}
                  className="text-xs px-3 py-1 rounded-lg text-white disabled:opacity-50"
                  style={{
                    backgroundColor: "#3b4876",
                    fontFamily: "Open Sans, sans-serif",
                  }}
                >
                  {isProcessing ? "Processing..." : "Apply"}
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#3b4876",
                    fontFamily: "Open Sans, sans-serif",
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#005163",
                    fontFamily: "Open Sans, sans-serif",
                  }}
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
