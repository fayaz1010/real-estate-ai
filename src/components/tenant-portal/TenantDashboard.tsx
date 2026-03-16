import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  DollarSign,
  Wrench,
  Users,
  Calendar,
  ChevronRight,
  Clock,
  AlertTriangle,
  Bed,
  Bath,
  Maximize,
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { tenantPortalService } from '../../services/tenantPortalService';
import type { TenantHome } from '../../types/tenantPortal';

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

export const TenantDashboard: React.FC = () => {
  const [data, setData] = useState<TenantHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tenantPortalService
      .getTenantHomeData()
      .then((result) => {
        setData(result);
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
        <span className="sr-only">Loading dashboard...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4" role="alert">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-montserrat text-xl font-bold text-[#091a2b] mb-2">Unable to load dashboard</h2>
          <p className="text-gray-500 text-sm">{error || 'An unexpected error occurred.'}</p>
        </div>
      </div>
    );
  }

  const { unitInfo, upcomingPayment, activeRequest, communityPosts } = data;
  const recentPosts = communityPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-[Open_Sans]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-[#091a2b]">
            Welcome Home
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Your AI Property Manager — Never Miss a Beat
          </p>
        </header>

        {/* Unit Information Card */}
        <section className="mb-6" aria-labelledby="unit-heading">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-[#091a2b]" aria-hidden="true" />
              <h2 id="unit-heading" className="font-montserrat text-lg font-semibold text-[#091a2b]">
                Your Unit
              </h2>
            </div>
            {unitInfo.images.length > 0 && (
              <img
                src={unitInfo.images[0]}
                alt="Unit exterior"
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}
            <p className="text-sm font-medium text-gray-800 mb-3">{unitInfo.address}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4 text-[#091a2b]" aria-hidden="true" />
                <span>{formatCurrency(unitInfo.rent)}/mo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bed className="w-4 h-4 text-[#091a2b]" aria-hidden="true" />
                <span>{unitInfo.bedrooms} bed{unitInfo.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bath className="w-4 h-4 text-[#091a2b]" aria-hidden="true" />
                <span>{unitInfo.bathrooms} bath{unitInfo.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Maximize className="w-4 h-4 text-[#091a2b]" aria-hidden="true" />
                <span>{unitInfo.squareFootage.toLocaleString()} sqft</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Lease ends {formatDate(unitInfo.leaseEndDate)}
            </p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Payment */}
          <section aria-labelledby="payment-heading">
            <div className="bg-white rounded-2xl shadow-sm p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#091a2b]" aria-hidden="true" />
                  <h2 id="payment-heading" className="font-montserrat text-lg font-semibold text-[#091a2b]">
                    Upcoming Payment
                  </h2>
                </div>
                <Link
                  to="/tenant/payments"
                  className="text-sm text-[#091a2b] hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="bg-[#f8f9fa] rounded-xl p-4">
                <p className="text-2xl font-bold text-[#091a2b]">
                  {formatCurrency(upcomingPayment.amount)}
                </p>
                <p className="text-sm text-gray-500 mt-1">{upcomingPayment.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Due {formatDate(upcomingPayment.dueDate)}</span>
                </div>
              </div>
              <Link
                to="/tenant/payments"
                className="mt-4 block w-full text-center bg-[#091a2b] text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Pay Now
              </Link>
            </div>
          </section>

          {/* Active Maintenance Request */}
          <section aria-labelledby="maintenance-heading">
            <div className="bg-white rounded-2xl shadow-sm p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#091a2b]" aria-hidden="true" />
                  <h2 id="maintenance-heading" className="font-montserrat text-lg font-semibold text-[#091a2b]">
                    Maintenance
                  </h2>
                </div>
                <Link
                  to="/tenant/maintenance"
                  className="text-sm text-[#091a2b] hover:underline flex items-center gap-1"
                >
                  New request <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
              {activeRequest ? (
                <div className="bg-[#f8f9fa] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-800">{activeRequest.title}</h3>
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full capitalize',
                        statusBadge(activeRequest.status),
                      )}
                    >
                      {activeRequest.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{activeRequest.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Submitted {formatDate(activeRequest.createdAt)}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f8f9fa] rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500">No active maintenance requests</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Community Board Snippet */}
        <section className="mt-6" aria-labelledby="community-heading">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#091a2b]" aria-hidden="true" />
                <h2 id="community-heading" className="font-montserrat text-lg font-semibold text-[#091a2b]">
                  Community Board
                </h2>
              </div>
            </div>
            {recentPosts.length > 0 ? (
              <ul className="space-y-3" role="list">
                {recentPosts.map((post) => (
                  <li key={post.id} className="bg-[#f8f9fa] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#091a2b]">{post.author}</span>
                      <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{post.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No community posts yet.</p>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-gray-400">Property Management, Powered by AI</p>
        </footer>
      </div>
    </div>
  );
};
