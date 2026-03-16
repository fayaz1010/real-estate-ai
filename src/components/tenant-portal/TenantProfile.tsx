import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  Save,
} from 'lucide-react';
import { tenantPortalService } from '../../services/tenantPortalService';
import type { TenantProfileDetails } from '../../types/tenantPortal';

export const TenantProfile: React.FC = () => {
  const [profile, setProfile] = useState<TenantProfileDetails>({
    name: '',
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    tenantPortalService
      .getTenantHomeData()
      .then(() => {
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (field: keyof TenantProfileDetails, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updated = await tenantPortalService.updateTenantProfile(profile);
      setProfile(updated);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#091a2b]" aria-hidden="true" />
        <span className="sr-only">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-[Open_Sans]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-[#091a2b]">
            My Profile
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your personal information
          </p>
        </header>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3" role="alert">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-emerald-700">Profile updated successfully.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3" role="alert">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-[#091a2b]" aria-hidden="true" />
            <h2 className="font-montserrat text-lg font-semibold text-[#091a2b]">
              Personal Information
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="profile-name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#091a2b]/20 focus:border-[#091a2b] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#091a2b]/20 focus:border-[#091a2b] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="profile-phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#091a2b]/20 focus:border-[#091a2b] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-8">
            <h3 className="font-montserrat text-base font-semibold text-[#091a2b] mb-4">
              Emergency Contact
            </h3>
            <div className="space-y-5">
              <div>
                <label htmlFor="emergency-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact Name
                </label>
                <input
                  id="emergency-name"
                  type="text"
                  value={profile.emergencyContactName}
                  onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#091a2b]/20 focus:border-[#091a2b] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="emergency-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <input
                    id="emergency-phone"
                    type="tel"
                    value={profile.emergencyContactPhone}
                    onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#091a2b]/20 focus:border-[#091a2b] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full bg-[#091a2b] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <footer className="mt-12 text-center">
          <p className="text-xs text-gray-400">Your AI Property Manager — Never Miss a Beat</p>
        </footer>
      </div>
    </div>
  );
};
