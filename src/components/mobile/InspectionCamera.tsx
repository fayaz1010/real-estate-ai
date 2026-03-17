import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { CameraCapture } from './CameraCapture';

interface InspectionPhoto {
  imageData: string;
  description: string;
  important: boolean;
}

interface InspectionCameraProps {
  onPhotoSaved?: (photo: InspectionPhoto) => void;
}

export function InspectionCamera({ onPhotoSaved }: InspectionCameraProps) {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [important, setImportant] = useState(false);
  const [savedPhotos, setSavedPhotos] = useState<InspectionPhoto[]>([]);

  const handleCapture = (imageData: string) => {
    setCurrentImage(imageData);
  };

  const handleSave = () => {
    if (!currentImage) return;

    const photo: InspectionPhoto = {
      imageData: currentImage,
      description,
      important,
    };

    setSavedPhotos((prev) => [...prev, photo]);
    onPhotoSaved?.(photo);
    setCurrentImage(null);
    setDescription('');
    setImportant(false);
  };

  const handleDiscard = () => {
    setCurrentImage(null);
    setDescription('');
    setImportant(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {!currentImage && <CameraCapture onCapture={handleCapture} />}

      {currentImage && (
        <div className="flex flex-col gap-3">
          <div className="rounded-lg overflow-hidden">
            <img src={currentImage} alt="Inspection" className="w-full" />
          </div>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for this photo..."
            className="w-full px-3 py-2 border rounded-lg text-sm"
            style={{ borderColor: '#091a2b', color: '#091a2b' }}
          />

          <button
            onClick={() => setImportant(!important)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors"
            style={{
              borderColor: important ? '#3b4876' : '#d1d5db',
              backgroundColor: important ? '#3b4876' : 'transparent',
              color: important ? '#ffffff' : '#091a2b',
            }}
          >
            {important ? <Star size={16} /> : <Star size={16} />}
            {important ? 'Marked as Important' : 'Mark as Important'}
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleDiscard}
              className="flex-1 px-4 py-2 border rounded-lg text-sm transition-colors"
              style={{ borderColor: '#091a2b', color: '#091a2b' }}
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 text-white rounded-lg text-sm transition-colors"
              style={{ backgroundColor: '#091a2b' }}
            >
              Save Photo
            </button>
          </div>
        </div>
      )}

      {savedPhotos.length > 0 && (
        <div className="flex flex-col gap-2 mt-4">
          <h3 className="text-sm font-semibold" style={{ color: '#091a2b' }}>
            Saved Photos ({savedPhotos.length})
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {savedPhotos.map((photo, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={photo.imageData}
                  alt={photo.description || `Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                {photo.important && (
                  <div
                    className="absolute top-1 right-1 p-1 rounded-full"
                    style={{ backgroundColor: '#3b4876' }}
                  >
                    <Star size={10} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
