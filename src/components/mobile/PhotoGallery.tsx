import { X } from "lucide-react";
import React, { useState } from "react";

interface PhotoGalleryProps {
  images: string[];
  onRemove?: (index: number) => void;
}

export function PhotoGallery({ images, onRemove }: PhotoGalleryProps) {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div
        className="grid grid-cols-3 gap-2 p-2 rounded-lg"
        style={{ backgroundColor: "#f1f3f4" }}
      >
        {images.map((src, index) => (
          <div key={index} className="relative aspect-square group">
            <button
              onClick={() => setFullscreenIndex(index)}
              className="w-full h-full"
            >
              <img
                src={src}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
            </button>
            {onRemove && (
              <button
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setFullscreenIndex(null)}
        >
          <button
            onClick={() => setFullscreenIndex(null)}
            className="absolute top-4 right-4 p-2 text-white"
          >
            <X size={24} />
          </button>
          <img
            src={images[fullscreenIndex]}
            alt={`Photo ${fullscreenIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}
