// PLACEHOLDER FILE: components\Shared\DocumentViewer.tsx
// TODO: Add your implementation here
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import React, { useState } from "react";

import { ApplicationDocument } from "../../types/application.types";

interface DocumentViewerProps {
  document: ApplicationDocument;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
}) => {
  const [zoom, setZoom] = useState(100);

  const isImage = document.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPDF = document.filename.match(/\.pdf$/i);

  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = document.url;
    link.download = document.filename;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {document.filename}
            </h3>
            <p className="text-sm text-gray-600">
              {(document.size / 1024).toFixed(2)} KB • Uploaded{" "}
              {new Date(document.uploadedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {isImage && (
              <>
                <button
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-700" />
                </button>
                <span className="text-sm text-gray-600 min-w-[4rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}

            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          {isImage ? (
            <div className="flex items-center justify-center min-h-full">
              <img
                src={document.url}
                alt={document.filename}
                style={{ width: `${zoom}%` }}
                className="max-w-none shadow-lg"
              />
            </div>
          ) : isPDF ? (
            <iframe
              src={document.url}
              className="w-full h-full min-h-[600px] bg-white"
              title={document.filename}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Preview not available for this file type
                </p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
