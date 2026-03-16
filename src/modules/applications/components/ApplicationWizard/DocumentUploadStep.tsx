// PLACEHOLDER FILE: components\ApplicationWizard\DocumentUploadStep.tsx
// TODO: Add your implementation here

import { Upload, FileText, Check, X, Eye, Loader } from "lucide-react";
import React, { useState, useRef } from "react";

import { useApplication } from "../../hooks/useApplication";
import { applicationService } from "../../services/applicationService";
import { ApplicationDocument } from "../../types/application.types";

const DocumentUploadStep: React.FC = () => {
  const { application } = useApplication();
  const [documents, setDocuments] = useState<ApplicationDocument[]>(
    application?.documents || [],
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredDocs = [
    { type: "id", label: "Government-Issued ID", required: true },
    {
      type: "paystub",
      label: "Recent Paystubs (last 2 months)",
      required: true,
    },
    {
      type: "bank_statement",
      label: "Bank Statements (last 3 months)",
      required: false,
    },
    {
      type: "employment_letter",
      label: "Employment Verification Letter",
      required: false,
    },
    {
      type: "tax_return",
      label: "Tax Returns (if self-employed)",
      required: false,
    },
  ];

  const handleFileSelect = async (type: string) => {
    if (!application) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";
    input.multiple = type === "paystub" || type === "bank_statement";

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files || []) as File[];

      for (const file of files) {
        await uploadFile(file, type);
      }
    };

    input.click();
  };

  const uploadFile = async (file: File, type: string) => {
    if (!application) return;

    setUploading(true);
    const fileId = `${Date.now()}-${file.name}`;
    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[fileId] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [fileId]: current + 10 };
        });
      }, 200);

      const uploaded = await applicationService.uploadDocument(
        application.id,
        file,
        type,
      );

      clearInterval(progressInterval);
      setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

      // Add to documents list
      setDocuments((prev) => [...prev, uploaded]);

      // Parse document if applicable
      if (type === "paystub" || type === "id" || type === "bank_statement") {
        await applicationService.parseDocument(application.id, uploaded.id);
      }

      setTimeout(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload document. Please try again.");
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!application || !confirm("Delete this document?")) return;

    try {
      await applicationService.deleteDocument(application.id, docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete document.");
    }
  };

  const getDocumentsByType = (type: string) => {
    return documents.filter((d) => d.type === type);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Documents
        </h2>
        <p className="text-gray-600">
          Upload supporting documents to verify your application information.
        </p>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Loader className="w-5 h-5 text-blue-600 animate-spin mr-2" />
            <span className="font-medium text-blue-900">
              Uploading documents...
            </span>
          </div>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="mt-2">
              <div className="flex items-center justify-between text-sm text-blue-800 mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Categories */}
      <div className="space-y-4">
        {requiredDocs.map((docType) => {
          const uploadedDocs = getDocumentsByType(docType.type);
          const hasUploaded = uploadedDocs.length > 0;

          return (
            <div
              key={docType.type}
              className={`border rounded-lg p-6 transition-colors ${
                hasUploaded
                  ? "border-green-300 bg-green-50"
                  : docType.required
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {hasUploaded ? (
                    <Check className="w-6 h-6 text-green-600 mr-3" />
                  ) : (
                    <FileText className="w-6 h-6 text-gray-400 mr-3" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {docType.label}
                      {docType.required && (
                        <span className="text-red-600 ml-1">*</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {docType.required ? "Required" : "Optional"} •{" "}
                      {uploadedDocs.length} uploaded
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleFileSelect(docType.type)}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </button>
              </div>

              {/* Uploaded Documents */}
              {uploadedDocs.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                  {uploadedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between bg-white rounded p-3 border border-gray-200"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(doc.size)} •{" "}
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                            {doc.parsed && (
                              <span className="ml-2 text-green-600">
                                ✓ Verified
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Document Requirements */}
              {docType.type === "paystub" && (
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium mb-1">Requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Must be from the last 60 days</li>
                    <li>Should show gross income and employer name</li>
                    <li>Provide at least 2 consecutive paystubs</li>
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">
          Document Upload Tips
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Accepted formats: PDF, JPG, PNG (max 10MB per file)</li>
          <li>• Ensure documents are clear and legible</li>
          <li>• Remove sensitive information like full account numbers</li>
          <li>• Documents are securely encrypted and stored</li>
          <li>• You can upload multiple files for each category</li>
        </ul>
      </div>

      {/* Upload Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Total Documents Uploaded
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {documents.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              Required Documents
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {
                requiredDocs.filter(
                  (d) => d.required && getDocumentsByType(d.type).length > 0,
                ).length
              }{" "}
              / {requiredDocs.filter((d) => d.required).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
