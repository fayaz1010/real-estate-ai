import React, { useEffect, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { ScreeningRequest } from '@/types/screening';
import { screeningService } from '@/services/screeningService';
import { BackgroundCheckStatus } from './BackgroundCheckStatus';
import { Skeleton } from '@/components/ui/skeleton';

type SortField = keyof Pick<
  ScreeningRequest,
  'tenantName' | 'email' | 'phone' | 'propertyId' | 'status' | 'createdAt'
>;
type SortDirection = 'asc' | 'desc';

interface ScreeningDashboardProps {
  onViewReport?: (id: string) => void;
}

export const ScreeningDashboard: React.FC<ScreeningDashboardProps> = ({
  onViewReport,
}) => {
  const [requests, setRequests] = useState<ScreeningRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await screeningService.getAllScreeningRequests();
        setRequests(data);
      } catch {
        setError('Failed to load screening requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredRequests = requests.filter((req) =>
    statusFilter === 'all' ? true : req.status === statusFilter,
  );

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (aVal instanceof Date && bVal instanceof Date) {
      return sortDirection === 'asc'
        ? aVal.getTime() - bVal.getTime()
        : bVal.getTime() - aVal.getTime();
    }

    const aStr = String(aVal ?? '');
    const bStr = String(bVal ?? '');
    return sortDirection === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
        role="alert"
      >
        <p
          className="text-red-700 font-medium"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          {error}
        </p>
      </div>
    );
  }

  const SortableHeader: React.FC<{ field: SortField; label: string }> = ({
    field,
    label,
  }) => (
    <th className="px-4 py-3 text-left">
      <button
        onClick={() => handleSort(field)}
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider hover:text-[#091a2b] transition-colors"
        style={{ fontFamily: "'Montserrat', sans-serif", color: '#091a2b' }}
      >
        {label}
        <ArrowUpDown
          className={`w-3 h-3 ${sortField === field ? 'opacity-100' : 'opacity-40'}`}
          aria-hidden="true"
        />
      </button>
    </th>
  );

  return (
    <div>
      {/* Filter */}
      <div className="mb-6">
        <label
          htmlFor="status-filter"
          className="text-sm font-semibold mr-3"
          style={{ fontFamily: "'Montserrat', sans-serif", color: '#091a2b' }}
        >
          Filter by Status:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#091a2b]"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortableHeader field="tenantName" label="Tenant Name" />
              <SortableHeader field="email" label="Email" />
              <SortableHeader field="phone" label="Phone" />
              <SortableHeader field="propertyId" label="Property" />
              <SortableHeader field="status" label="Status" />
              <SortableHeader field="createdAt" label="Date Created" />
              <th className="px-4 py-3 text-left">
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    color: '#091a2b',
                  }}
                >
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-gray-500"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  No screening requests found.
                </td>
              </tr>
            ) : (
              sortedRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td
                    className="px-4 py-3 text-sm font-medium"
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      color: '#091a2b',
                    }}
                  >
                    {request.tenantName}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-600"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {request.email}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-600"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {request.phone}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-600"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {request.propertyId}
                  </td>
                  <td className="px-4 py-3">
                    <BackgroundCheckStatus status={request.status} />
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-600"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewReport?.(request.id)}
                      className="text-sm font-medium hover:underline transition-colors"
                      style={{
                        fontFamily: "'Open Sans', sans-serif",
                        color: '#091a2b',
                      }}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
