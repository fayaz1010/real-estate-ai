// PLACEHOLDER FILE: components\Verification\IdentityVerification.tsx
// TODO: Add your implementation here

import { Camera, Upload, CheckCircle, XCircle, Loader } from "lucide-react";
import React, { useState, useRef } from "react";

import { useApplicationForm } from "../../hooks/useApplicationForm";
import { useVerification } from "../../hooks/useVerification";

interface IdentityVerificationProps {
  applicationId: string;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  applicationId,
}) => {
  const { identityStatus, startIdentityVerification, loading } =
    useVerification(applicationId);
  const { formData } = useApplicationForm();

  const [step, setStep] = useState<
    "upload" | "selfie" | "processing" | "complete"
  >("upload");
  const [idFrontImage, setIdFrontImage] = useState<string | null>(null);
  const [idBackImage, setIdBackImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const personalInfo = formData.personalInfo;

  const handleFileUpload = async (file: File, type: "front" | "back") => {
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "front") {
          setIdFrontImage(reader.result as string);
        } else {
          setIdBackImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("Please allow camera access to take a selfie");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setSelfieImage(canvas.toDataURL("image/jpeg"));
        stopCamera();
      }
    }
  };

  const handleSubmit = async () => {
    if (!idFrontImage || !selfieImage || !personalInfo) {
      alert("Please complete all verification steps");
      return;
    }

    setStep("processing");

    try {
      await startIdentityVerification({
        firstName: personalInfo.firstName || "",
        lastName: personalInfo.lastName || "",
        dateOfBirth: personalInfo.dateOfBirth || "",
        ssn: personalInfo.ssn || "",
        idType: personalInfo.idType || "drivers_license",
        idNumber: personalInfo.idNumber || "",
        idFrontImage,
        idBackImage: idBackImage || undefined,
        selfieImage,
      });

      setStep("complete");
    } catch (error) {
      alert("Verification failed. Please try again.");
      setStep("upload");
    }
  };

  if (identityStatus === "verified") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">
              Identity Verified
            </h3>
            <p className="text-sm text-green-700">
              Your identity has been successfully verified
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Identity Verification
        </h2>
        <p className="text-gray-600">
          We need to verify your identity to process your application
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step === "upload"
                ? "bg-blue-600 text-white"
                : ["selfie", "processing", "complete"].includes(step)
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <span className="ml-3 font-medium text-gray-900">Upload ID</span>
        </div>
        <div className="flex-1 h-1 bg-gray-200 mx-4">
          <div
            className={`h-1 transition-all ${
              ["selfie", "processing", "complete"].includes(step)
                ? "bg-blue-600 w-full"
                : "w-0"
            }`}
          />
        </div>
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step === "selfie"
                ? "bg-blue-600 text-white"
                : ["processing", "complete"].includes(step)
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <span className="ml-3 font-medium text-gray-900">Take Selfie</span>
        </div>
        <div className="flex-1 h-1 bg-gray-200 mx-4">
          <div
            className={`h-1 transition-all ${
              ["processing", "complete"].includes(step)
                ? "bg-blue-600 w-full"
                : "w-0"
            }`}
          />
        </div>
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step === "complete"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
          <span className="ml-3 font-medium text-gray-900">Complete</span>
        </div>
      </div>

      {/* Step 1: ID Upload */}
      {step === "upload" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Front of ID */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              {idFrontImage ? (
                <div className="relative">
                  <img
                    src={idFrontImage}
                    alt="ID Front"
                    className="w-full rounded"
                  />
                  <button
                    onClick={() => setIdFrontImage(null)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleFileUpload(e.target.files[0], "front")
                    }
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium text-gray-900 mb-1">Front of ID</p>
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                </label>
              )}
            </div>

            {/* Back of ID */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              {idBackImage ? (
                <div className="relative">
                  <img
                    src={idBackImage}
                    alt="ID Back"
                    className="w-full rounded"
                  />
                  <button
                    onClick={() => setIdBackImage(null)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleFileUpload(e.target.files[0], "back")
                    }
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium text-gray-900 mb-1">Back of ID</p>
                  <p className="text-sm text-gray-600">Optional</p>
                </label>
              )}
            </div>
          </div>

          <button
            onClick={() => setStep("selfie")}
            disabled={!idFrontImage || uploading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Selfie
          </button>
        </div>
      )}

      {/* Step 2: Selfie */}
      {step === "selfie" && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Take a clear selfie facing the camera. Make sure your face is
              well-lit and clearly visible.
            </p>
          </div>

          {selfieImage ? (
            <div className="relative max-w-md mx-auto">
              <img
                src={selfieImage}
                alt="Selfie"
                className="w-full rounded-lg"
              />
              <button
                onClick={() => {
                  setSelfieImage(null);
                  startCamera();
                }}
                className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {cameraActive ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={takeSelfie}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={startCamera}
                  className="w-full py-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium text-gray-900">Start Camera</p>
                </button>
              )}
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />

          {selfieImage && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Submit for Verification"}
            </button>
          )}
        </div>
      )}

      {/* Step 3: Processing */}
      {step === "processing" && (
        <div className="text-center py-12">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Your Identity
          </h3>
          <p className="text-gray-600">This usually takes 10-30 seconds...</p>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === "complete" && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Identity Verified!
          </h3>
          <p className="text-gray-600">
            Your identity has been successfully verified
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Verification Tips</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Ensure your ID is current and not expired</li>
          <li>• Take photos in good lighting</li>
          <li>• Make sure all text is clearly readable</li>
          <li>• Remove any glare or shadows</li>
          <li>• Your selfie should match your ID photo</li>
        </ul>
      </div>
    </div>
  );
};

export default IdentityVerification;
