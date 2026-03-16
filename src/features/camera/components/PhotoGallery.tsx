import React, { useCallback, useMemo, useState } from 'react';
import {
  Trash2,
  Share2,
  Maximize2,
  X,
  Filter,
  MapPin,
  Clock,
  Edit3,
} from 'lucide-react';
import type { CapturedPhoto } from '../types';

interface PhotoGalleryProps {
  photos: CapturedPhoto[];
  onDelete?: (photoId: string) => void;
  onSelect?: (photo: CapturedPhoto) => void;
  onAnnotate?: (photo: CapturedPhoto) => void;
}

type SortOrder = 'newest' | 'oldest';

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onDelete,
  onSelect,
  onAnnotate,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const sortedPhotos = useMemo(() => {
    return [...photos].sort((a, b) =>
      sortOrder === 'newest'
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp
    );
  }, [photos, sortOrder]);

  const handleShare = useCallback(async (photo: CapturedPhoto) => {
    if (navigator.share) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(photo.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `property-photo-${photo.id}.jpg`, {
          type: 'image/jpeg',
        });

        await navigator.share({
          title: photo.roomLabel || 'Property Photo',
          files: [file],
        });
      } catch {
        // User cancelled or sharing failed
      }
    } else {
      // Fallback: download
      const link = document.createElement('a');
      link.href = photo.dataUrl;
      link.download = `property-photo-${photo.id}.jpg`;
      link.click();
    }
  }, []);

  const handleDelete = useCallback(
    (photoId: string) => {
      onDelete?.(photoId);
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto(null);
      }
    },
    [onDelete, selectedPhoto]
  );

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (photos.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Maximize2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3
          className="text-lg font-semibold mb-1"
          style={{ color: '#091a2b', fontFamily: 'Montserrat, sans-serif' }}
        >
          No Photos Yet
        </h3>
        <p className="text-gray-500 text-sm">
          Captured photos will appear here
        </p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Open Sans, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold"
          style={{ color: '#091a2b', fontFamily: 'Montserrat, sans-serif' }}
        >
          Photos ({photos.length})
        </h3>
        <button
          onClick={() =>
            setSortOrder((o) => (o === 'newest' ? 'oldest' : 'newest'))
          }
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
        >
          <Filter className="w-4 h-4" />
          {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {sortedPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-square cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedPhoto(photo);
              onSelect?.(photo);
            }}
          >
            <img
              src={photo.thumbnail}
              alt={photo.roomLabel || 'Property photo'}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
              <div className="w-full p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                {photo.roomLabel && (
                  <div className="flex items-center gap-1 text-white text-xs mb-1">
                    <MapPin className="w-3 h-3" />
                    {photo.roomLabel}
                  </div>
                )}
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(photo.timestamp)}
                </div>
              </div>
            </div>

            {/* Annotation badge */}
            {photo.annotations.length > 0 && (
              <div
                className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: '#3b4876' }}
              >
                {photo.annotations.length}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full-size viewer modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white">
              {selectedPhoto.roomLabel && (
                <div className="flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4" />
                  {selectedPhoto.roomLabel}
                </div>
              )}
              <div className="text-white/60 text-xs mt-0.5">
                {formatTimestamp(selectedPhoto.timestamp)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onAnnotate && (
                <button
                  onClick={() => {
                    onAnnotate(selectedPhoto);
                    setSelectedPhoto(null);
                  }}
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Annotate"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleShare(selectedPhoto)}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {onDelete && (
                <button
                  onClick={() => handleDelete(selectedPhoto.id)}
                  className="p-2 rounded-full bg-white/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full image */}
          <div
            className="flex-1 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.dataUrl}
              alt={selectedPhoto.roomLabel || 'Property photo'}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
