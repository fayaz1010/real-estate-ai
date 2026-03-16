import { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  DollarSign,
  Download,
  AlertTriangle,
  PawPrint,
  Shield,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { tenantPortalService } from '../../services/tenantPortalService';
import type { LeaseDetails } from '../../types/tenantPortal';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export const LeaseViewer: React.FC = () => {
  const [lease, setLease] = useState<LeaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tenantPortalService
      .getLeaseDetails()
      .then((data) => {
        setLease(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#091a2b]" aria-hidden="true" />
        <span className="sr-only">Loading lease details...</span>
      </div>
    );
  }

  if (error || !lease) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4" role="alert">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-montserrat text-xl font-bold text-[#091a2b] mb-2">Unable to load lease</h2>
          <p className="text-gray-500 text-sm">{error || 'An unexpected error occurred.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-[Open_Sans]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-[#091a2b]">
            Lease Details
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            View your current lease agreement
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-[#091a2b]" aria-hidden="true" />
            <h2 className="font-montserrat text-lg font-semibold text-[#091a2b]">
              Lease Agreement
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Lease Period */}
            <div className="bg-[#f8f9fa] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[#091a2b]" aria-hidden="true" />
                <h3 className="text-sm font-medium text-gray-700">Lease Period</h3>
              </div>
              <p className="text-sm text-gray-800">
                {formatDate(lease.startDate)} — {formatDate(lease.endDate)}
              </p>
            </div>

            {/* Monthly Rent */}
            <div className="bg-[#f8f9fa] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#091a2b]" aria-hidden="true" />
                <h3 className="text-sm font-medium text-gray-700">Monthly Rent</h3>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {formatCurrency(lease.rentAmount)}
              </p>
            </div>

            {/* Security Deposit */}
            <div className="bg-[#f8f9fa] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#091a2b]" aria-hidden="true" />
                <h3 className="text-sm font-medium text-gray-700">Security Deposit</h3>
              </div>
              <p className="text-sm text-gray-800">
                {formatCurrency(lease.securityDeposit)}
              </p>
            </div>

            {/* Pet Policy */}
            <div className="bg-[#f8f9fa] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <PawPrint className="w-4 h-4 text-[#091a2b]" aria-hidden="true" />
                <h3 className="text-sm font-medium text-gray-700">Pet Policy</h3>
              </div>
              <p className="text-sm text-gray-800">{lease.petPolicy}</p>
            </div>
          </div>

          {/* Other Terms */}
          {lease.otherTerms && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Other Terms</h3>
              <div className="bg-[#f8f9fa] rounded-xl p-4">
                <p className="text-sm text-gray-600 whitespace-pre-line">{lease.otherTerms}</p>
              </div>
            </div>
          )}

          {/* Download */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <a
              href={lease.documentUrl}
              download
              className="inline-flex items-center gap-2 bg-[#091a2b] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Download Lease Document
            </a>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-xs text-gray-400">Your AI Property Manager — Never Miss a Beat</p>
        </footer>
      </div>
    </div>
  );
};
