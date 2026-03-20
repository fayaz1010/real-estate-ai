import { Image, X, Upload } from "lucide-react";
import React, { useState, useRef } from "react";

interface PhotoFile {
  id: string;
  dataUrl: string;
  name: string;
}

interface PhotoUploadProps {
  onUpload?: (photos: PhotoFile[]) => void;
  maxFiles?: number;
}

const primaryButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "12px 20px",
  color: "#ffffff",
  backgroundColor: "#1A1A2E",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  fontWeight: 600,
  width: "100%",
  transition: "opacity 0.2s ease",
};

export function PhotoUpload({ onUpload, maxFiles = 10 }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError(null);
    const fileArray = Array.from(files);

    if (photos.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} photos allowed.`);
      return;
    }

    fileArray.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setPhotos((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              dataUrl: result,
              name: file.name,
            },
          ]);
        }
      };
      reader.onerror = () => {
        setError(`Failed to read file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemove = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpload = async () => {
    if (photos.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const total = photos.length;
      for (let i = 0; i < total; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setUploadProgress(Math.round(((i + 1) / total) * 100));
      }
      onUpload?.(photos);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {error && (
        <div
          style={{
            padding: 12,
            fontSize: 14,
            color: "#991b1b",
            backgroundColor: "#fef2f2",
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        style={primaryButton}
        disabled={uploading}
      >
        <Image size={20} />
        Select Photos
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {photos.length > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 8,
            }}
          >
            {photos.map((photo) => (
              <div
                key={photo.id}
                style={{
                  position: "relative",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <img
                  src={photo.dataUrl}
                  alt={photo.name}
                  style={{
                    width: "100%",
                    height: 100,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <button
                  onClick={() => handleRemove(photo.id)}
                  disabled={uploading}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                  aria-label={`Remove ${photo.name}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {uploading && (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  height: 8,
                  backgroundColor: "#e5e7eb",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${uploadProgress}%`,
                    backgroundColor: "#1A1A2E",
                    borderRadius: 4,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            style={primaryButton}
            disabled={uploading}
          >
            <Upload size={20} />
            {uploading
              ? "Uploading..."
              : `Upload ${photos.length} Photo${photos.length > 1 ? "s" : ""}`}
          </button>
        </>
      )}
    </div>
  );
}
