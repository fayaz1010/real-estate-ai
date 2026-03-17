import { useState, useRef } from 'react';
import {
  Wrench,
  Upload,
  CheckCircle,
  AlertTriangle,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { tenantPortalModuleService } from '../api/tenantPortalService';

type Urgency = 'Low' | 'Medium' | 'High';

export const MaintenanceRequestForm: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('Low');
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSubject('');
    setDescription('');
    setUrgency('Low');
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPhotos([]);
    setPreviews([]);
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', subject.trim());
      formData.append('description', description.trim());
      formData.append('urgency', urgency);
      photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      await tenantPortalModuleService.submitMaintenanceRequest(formData);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit request',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-tenant-primary">
          Maintenance Request
        </h1>
        <p className="text-gray-500 mt-1 text-sm font-open-sans">
          Submit a request and we&apos;ll get it handled
        </p>
      </header>

      {/* Success Message */}
      {success && (
        <div
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6 animate-slide-up"
          role="alert"
        >
          <div className="flex items-center gap-4">
            <CheckCircle
              className="w-8 h-8 text-emerald-600 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-montserrat font-semibold text-emerald-800">
                Request Submitted
              </h3>
              <p className="text-sm text-emerald-600 font-open-sans">
                Your maintenance request has been submitted successfully.
                You&apos;ll receive a notification when it&apos;s assigned.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="mt-4 text-sm text-emerald-700 hover:text-emerald-900 font-medium font-open-sans"
          >
            Submit another request
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3"
          role="alert"
        >
          <AlertTriangle
            className="w-5 h-5 text-red-600 flex-shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm text-red-700 font-open-sans">{error}</p>
        </div>
      )}

      {/* Form */}
      {!success && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-6 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="w-5 h-5 text-tenant-primary" aria-hidden="true" />
            <h2 className="font-montserrat text-lg font-semibold text-tenant-primary">
              Describe the Issue
            </h2>
          </div>

          <div className="space-y-5">
            {/* Subject */}
            <div>
              <label
                htmlFor="maint-subject"
                className="block text-sm font-medium text-gray-700 mb-1.5 font-open-sans"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                id="maint-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Leaking kitchen faucet"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-open-sans focus:outline-none focus:ring-2 focus:ring-tenant-primary/20 focus:border-tenant-primary transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="maint-description"
                className="block text-sm font-medium text-gray-700 mb-1.5 font-open-sans"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="maint-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                required
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-open-sans focus:outline-none focus:ring-2 focus:ring-tenant-primary/20 focus:border-tenant-primary transition-colors resize-none"
              />
            </div>

            {/* Urgency */}
            <div>
              <label
                htmlFor="maint-urgency"
                className="block text-sm font-medium text-gray-700 mb-1.5 font-open-sans"
              >
                Urgency <span className="text-red-500">*</span>
              </label>
              <select
                id="maint-urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-open-sans focus:outline-none focus:ring-2 focus:ring-tenant-primary/20 focus:border-tenant-primary transition-colors bg-white"
              >
                <option value="Low">Low — Not urgent</option>
                <option value="Medium">Medium — Needs attention soon</option>
                <option value="High">High — Urgent / Safety concern</option>
              </select>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 font-open-sans">
                Photo Upload (optional)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
                aria-label="Upload photos"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-tenant-accent/50 hover:text-gray-700 cursor-pointer transition-colors font-open-sans"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                Click to upload images
              </button>

              {/* Photo Previews */}
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {previews.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={url}
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove photo ${idx + 1}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-tenant-accent/50 hover:text-gray-600 transition-colors"
                    aria-label="Add more photos"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !subject.trim() || !description.trim()}
            className="mt-6 w-full bg-tenant-accent text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-open-sans"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
                Submitting...
              </span>
            ) : (
              'Submit Request'
            )}
          </button>
        </form>
      )}
    </div>
  );
};
