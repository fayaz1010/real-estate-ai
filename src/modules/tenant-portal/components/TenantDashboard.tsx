import { useState, useEffect } from 'react';
import {
  Home,
  DollarSign,
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { tenantPortalModuleService } from '../api/tenantPortalService';
import type {
  LeaseDetails,
  MaintenanceRequest,
  PaymentHistoryItem,
} from '@/types/tenantPortal';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const statusBadge = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-red-100 text-red-700';
    case 'in progress':
      return 'bg-amber-100 text-amber-700';
    case 'completed':
      return 'bg-emerald-100 text-emerald-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

interface TenantDashboardProps {
  onNavigate?: (tab: string) => void;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({ onNavigate }) => {
  const [lease, setLease] = useState<LeaseDetails | null>(null);
  const [recentRequests, setRecentRequests] = useState<MaintenanceRequest[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      tenantPortalModuleService.getLeaseDetails(),
      tenantPortalModuleService.getMaintenanceRequests(),
      tenantPortalModuleService.getPaymentHistory(),
    ])
      .then(([leaseData, requests, payments]) => {
        setLease(leaseData);
        setRecentRequests(requests.slice(0, 3));
        setRecentPayments(payments.slice(0, 1));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" role="status">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-tenant-primary mx-auto mb-3"
            aria-hidden="true"
          />
          <p className="text-sm text-gray-500 font-open-sans">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !lease) {
    return (
      <div className="flex items-center justify-center py-20" role="alert">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-montserrat text-xl font-bold text-tenant-primary mb-2">
            Unable to load dashboard
          </h2>
          <p className="text-gray-500 text-sm font-open-sans">
            {error || 'An unexpected error occurred.'}
          </p>
        </div>
      </div>
    );
  }

  const upcomingPayment = recentPayments.length > 0 ? recentPayments[0] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <header>
        <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-tenant-primary">
          Welcome Home
        </h1>
        <p className="text-gray-500 mt-1 text-sm font-open-sans">
          Your AI Property Manager — Never Miss a Beat
        </p>
      </header>

      {/* Lease Details Card */}
      <section aria-labelledby="lease-heading">
        <div className="bg-white rounded-2xl shadow-sm p-6 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-tenant-primary" aria-hidden="true" />
            <h2
              id="lease-heading"
              className="font-montserrat text-lg font-semibold text-tenant-primary"
            >
              Lease Details
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Address */}
            <div className="bg-tenant-bg rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <MapPin className="w-4 h-4 text-tenant-secondary" aria-hidden="true" />
                <span className="text-xs text-gray-400 uppercase tracking-wider font-open-sans">
                  Address
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800 font-open-sans">
                {lease.address}
              </p>
            </div>

            {/* Lease Period */}
            <div className="bg-tenant-bg rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-4 h-4 text-tenant-secondary" aria-hidden="true" />
                <span className="text-xs text-gray-400 uppercase tracking-wider font-open-sans">
                  Lease Period
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800 font-open-sans">
                {formatDate(lease.startDate)} — {formatDate(lease.endDate)}
              </p>
            </div>

            {/* Monthly Rent */}
            <div className="bg-tenant-bg rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <DollarSign className="w-4 h-4 text-tenant-secondary" aria-hidden="true" />
                <span className="text-xs text-gray-400 uppercase tracking-wider font-open-sans">
                  Monthly Rent
                </span>
              </div>
              <p className="text-sm font-bold text-gray-800 font-open-sans">
                {formatCurrency(lease.rentAmount)}
              </p>
            </div>

            {/* Landlord Contact */}
            {lease.landlordName && (
              <div className="bg-tenant-bg rounded-xl p-4 sm:col-span-2 lg:col-span-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <User className="w-4 h-4 text-tenant-secondary" aria-hidden="true" />
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-open-sans">
                    Landlord Contact
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm font-open-sans">
                  <span className="font-medium text-gray-800">{lease.landlordName}</span>
                  {lease.landlordEmail && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      {lease.landlordEmail}
                    </span>
                  )}
                  {lease.landlordPhone && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                      {lease.landlordPhone}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Payment */}
        <section aria-labelledby="payment-heading">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-full transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-tenant-primary" aria-hidden="true" />
                <h2
                  id="payment-heading"
                  className="font-montserrat text-lg font-semibold text-tenant-primary"
                >
                  Upcoming Payment
                </h2>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('payments')}
                  className="text-sm text-tenant-secondary hover:underline flex items-center gap-1 font-open-sans"
                >
                  View all <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
            {upcomingPayment ? (
              <div className="bg-tenant-bg rounded-xl p-4">
                <p className="text-2xl font-bold text-tenant-primary font-montserrat">
                  {formatCurrency(upcomingPayment.amount)}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-2 font-open-sans">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Due {formatDate(upcomingPayment.date)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 font-open-sans">
                  {upcomingPayment.paymentMethod}
                </p>
              </div>
            ) : (
              <div className="bg-tenant-bg rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 font-open-sans">No upcoming payments</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => onNavigate?.('payments')}
              className="mt-4 block w-full text-center bg-tenant-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity font-open-sans"
            >
              Pay Rent Now
            </button>
          </div>
        </section>

        {/* Maintenance Status */}
        <section aria-labelledby="maintenance-heading">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-full transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-tenant-primary" aria-hidden="true" />
                <h2
                  id="maintenance-heading"
                  className="font-montserrat text-lg font-semibold text-tenant-primary"
                >
                  Maintenance
                </h2>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('maintenance')}
                  className="text-sm text-tenant-secondary hover:underline flex items-center gap-1 font-open-sans"
                >
                  New request <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
            {recentRequests.length > 0 ? (
              <ul className="space-y-3" role="list">
                {recentRequests.map((req) => (
                  <li key={req.id} className="bg-tenant-bg rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-800 font-open-sans">
                        {req.title}
                      </h3>
                      <span
                        className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded-full capitalize',
                          statusBadge(req.status),
                        )}
                      >
                        {req.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-open-sans">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Submitted {formatDate(req.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-tenant-bg rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 font-open-sans">
                  No active maintenance requests
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-xs text-gray-400 font-open-sans">
          Property Management, Powered by AI
        </p>
      </footer>
    </div>
  );
};
