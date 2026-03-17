import { useState } from 'react';
import { Wrench, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { tenantPortalService } from '../../services/tenantPortalService';

export const MaintenanceRequestForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      await tenantPortalService.submitMaintenanceRequest({
        title: title.trim(),
        description: description.trim(),
        urgency: 'Medium',
      });
      setSuccess(true);
      setTitle('');
      setDescription('');
      setImages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-[Open_Sans]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-[#091a2b]">
            Maintenance Request
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Submit a request and we&apos;ll get it handled
          </p>
        </header>

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6 flex items-center gap-4" role="alert">
            <CheckCircle className="w-8 h-8 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-montserrat font-semibold text-emerald-800">Request Submitted</h3>
              <p className="text-sm text-emerald-600">
                Your maintenance request has been submitted successfully. You&apos;ll receive a notification when it&apos;s assigned.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="ml-auto text-emerald-600 hover:text-emerald-800 text-sm font-medium"
            >
              Submit another
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-center gap-4" role="alert">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Wrench className="w-5 h-5 text-[#091a2b]" aria-hidden="true" />
              <h2 className="font-montserrat text-lg font-semibold text-[#091a2b]">
                Describe the Issue
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="request-title" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title
                </label>
                <input
                  id="request-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Leaking kitchen faucet"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#091a2b]/20 focus:border-[#091a2b] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="request-description" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  id="request-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#091a2b]/20 focus:border-[#091a2b] transition-colors resize-none"
                />
              </div>

              <div>
                <label htmlFor="request-images" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Upload Images (optional)
                </label>
                <div className="relative">
                  <input
                    id="request-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="request-images"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[#091a2b]/30 hover:text-gray-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" aria-hidden="true" />
                    {images.length > 0
                      ? `${images.length} file${images.length !== 1 ? 's' : ''} selected`
                      : 'Click to upload images'}
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {images.map((file, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg"
                      >
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !title.trim() || !description.trim()}
              className="mt-6 w-full bg-[#091a2b] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}

        <footer className="mt-12 text-center">
          <p className="text-xs text-gray-400">Your AI Property Manager — Never Miss a Beat</p>
        </footer>
      </div>
    </div>
  );
};
