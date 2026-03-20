import { Camera, Image } from "lucide-react";
import React, { useState, useRef } from "react";

import { CameraCapture } from "./CameraCapture";
import { PhotoGallery } from "./PhotoGallery";

export function PropertyPhotoUpload() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (imageData: string) => {
    setPhotos((prev) => [...prev, imageData]);
    setShowCamera(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <button
          onClick={() => setShowCamera(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-colors"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <Camera size={20} />
          Camera
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-colors"
          style={{ backgroundColor: "#008080" }}
        >
          <Image size={20} />
          Gallery
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {showCamera && (
        <div
          className="border rounded-lg p-3"
          style={{ borderColor: "#1A1A2E" }}
        >
          <CameraCapture onCapture={handleCapture} />
        </div>
      )}

      <PhotoGallery images={photos} onRemove={handleRemove} />
    </div>
  );
}
