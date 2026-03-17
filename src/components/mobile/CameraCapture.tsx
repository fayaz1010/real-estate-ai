import { Camera, RotateCcw } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

import { useCamera } from "../../hooks/useCamera";

interface CameraCaptureProps {
  onCapture?: (imageData: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const { videoStream, error, startCamera, stopCamera } = useCamera();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);
    onCapture?.(imageData);
  };

  const retry = () => {
    setCapturedImage(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {!videoStream && !capturedImage && (
        <button
          onClick={startCamera}
          className="flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-colors"
          style={{ backgroundColor: "#091a2b" }}
        >
          <Camera size={20} />
          Open Camera
        </button>
      )}

      {videoStream && !capturedImage && (
        <>
          <div className="relative rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full"
            />
          </div>
          <button
            onClick={takePhoto}
            className="flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-colors"
            style={{ backgroundColor: "#3b4876" }}
          >
            <Camera size={20} />
            Take Photo
          </button>
        </>
      )}

      {capturedImage && (
        <>
          <div className="rounded-lg overflow-hidden">
            <img src={capturedImage} alt="Captured" className="w-full" />
          </div>
          <button
            onClick={retry}
            className="flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-colors"
            style={{ backgroundColor: "#3b4876" }}
          >
            <RotateCcw size={20} />
            Retry
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
