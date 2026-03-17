import React, { useState, useEffect, useCallback } from 'react';
import {
  Building,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Grid,
  List,
} from 'lucide-react';
import apiClient from '@/api/client';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { UserRole } from '@/modules/auth/types/auth.types';
import { PropertyStatus, PropertyType } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminProperty {
  id: string;
  title: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  ownerId: string;
  featured: boolean;
  verified: boolean;
  createdAt: string;
}

interface PropertyFormData {
  title: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  featured: boolean;
  verified: boolean;
}

const EMPTY_FORM: PropertyFormData = {
  title: '',
  propertyType: PropertyType.APARTMENT,
  status: PropertyStatus.DRAFT,
  price: 0,
  bedrooms: 1,
  bathrooms: 1,
  sqft: null,
  street: '',
  city: '',
  state: '',
  zipCode: '',
  featured: false,
  verified: false,
};

const getStatusClasses = (status: PropertyStatus): string => {
  const map: Record<string, string> = {
    [PropertyStatus.ACTIVE]: 'bg-emerald-100 text-emerald-700',
    [PropertyStatus.DRAFT]: 'bg-gray-100 text-gray-600',
    [PropertyStatus.RENTED]: 'bg-blue-100 text-blue-700',
    [PropertyStatus.SOLD]: 'bg-purple-100 text-purple-700',
    [PropertyStatus.INACTIVE]: 'bg-yellow-100 text-yellow-700',
    [PropertyStatus.ARCHIVED]: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

type SortField = 'price' | 'createdAt' | 'title';
type SortDir = 'asc' | 'desc';

const PropertiesPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<AdminProperty | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: '12',
        sortBy: sortField,
        sortOrder: sortDir,
      };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.propertyType = typeFilter;

      const res = await apiClient.get('/admin/properties', { params });
      const data = res.data as {
        data: { properties: AdminProperty[]; pagination: { totalPages: number } };
      };
      setProperties(data.data.properties);
      setTotalPages(data.data.pagination.totalPages);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch properties';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter, typeFilter, sortField, sortDir]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  const openCreateModal = () => {
    setEditingProperty(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (p: AdminProperty) => {
    setEditingProperty(p);
    setFormData({
      title: p.title,
      propertyType: p.propertyType,
      status: p.status,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      sqft: p.sqft,
      street: p.address.street,
      city: p.address.city,
      state: p.address.state,
      zipCode: p.address.zipCode,
      featured: p.featured,
      verified: p.verified,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        title: formData.title,
        propertyType: formData.propertyType,
        status: formData.status,
        price: formData.price,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sqft: formData.sqft,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        featured: formData.featured,
        verified: formData.verified,
      };

      if (editingProperty) {
        await apiClient.put(`/admin/properties/${editingProperty.id}`, payload);
      } else {
        await apiClient.post('/admin/properties', payload);
      }
      setShowModal(false);
      fetchProperties();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save property';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/admin/properties/${id}`);
      setDeleteConfirm(null);
      fetchProperties();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete property';
      setError(message);
    }
  };

  const renderSkeletons = () =>
    viewMode === 'table'
      ? Array.from({ length: 5 }).map((_, i) => (
          <tr key={i}>
            <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
            <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
            <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
            <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
            <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
          </tr>
        ))
      : Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-primary/10 p-5">
            <Skeleton className="h-5 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ));

  if (!currentUser || (currentUser.role !== UserRole.ADMIN && currentUser.role !== ('super_admin' as UserRole))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold text-text_primary mb-2">Access Denied</h2>
          <p className="text-text_primary/60">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Building className="text-emerald-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text_primary font-display">Property Management</h1>
              <p className="text-sm text-text_primary/60 font-body">Manage listings, statuses, and details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-primary/10 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary text-white' : 'text-text_primary/50 hover:text-text_primary'}`}
                title="Table view"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text_primary/50 hover:text-text_primary'}`}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
            </div>
            <Button onClick={openCreateModal} className="gap-2">
              <Plus size={16} />
              Add Property
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-primary/10 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text_primary/40" size={16} />
              <Input
                placeholder="Search by title or address..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-10 rounded-md border border-primary/30 bg-background px-3 text-sm text-text_primary"
            >
              <option value="all">All Statuses</option>
              {Object.values(PropertyStatus).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="h-10 rounded-md border border-primary/30 bg-background px-3 text-sm text-text_primary"
            >
              <option value="all">All Types</option>
              {Object.values(PropertyType).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl border border-primary/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/10 bg-primary/[0.02]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">
                      <button onClick={() => toggleSort('title')} className="flex items-center gap-1 hover:text-text_primary">
                        Title <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">Address</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">
                      <button onClick={() => toggleSort('price')} className="flex items-center gap-1 hover:text-text_primary">
                        Price <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {loading ? (
                    renderSkeletons()
                  ) : properties.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-text_primary/50">
                        No properties found.
                      </td>
                    </tr>
                  ) : (
                    properties.map((p) => (
                      <tr key={p.id} className="hover:bg-primary/[0.02] transition-colors">
                        <td className="px-6 py-4 text-sm text-text_primary/70 font-mono">
                          {p.id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-text_primary">{p.title}</p>
                            <p className="text-xs text-text_primary/50">{p.propertyType} &middot; {p.bedrooms}bd / {p.bathrooms}ba</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text_primary/70">
                          {p.address.street}, {p.address.city}, {p.address.state}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-text_primary">
                          {formatCurrency(p.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusClasses(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                              title="Edit property"
                            >
                              <Edit2 size={16} />
                            </button>
                            {deleteConfirm === p.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(p.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                title="Delete property"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-primary/10">
                <p className="text-sm text-text_primary/60">Page {page} of {totalPages}</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                    <ChevronLeft size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Grid View */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                renderSkeletons()
              ) : properties.length === 0 ? (
                <div className="col-span-full py-12 text-center text-text_primary/50">
                  No properties found.
                </div>
              ) : (
                properties.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-primary/10 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-text_primary text-sm">{p.title}</h3>
                        <p className="text-xs text-text_primary/50 mt-0.5">
                          {p.address.street}, {p.address.city}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusClasses(p.status)}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text_primary/60 mb-3">
                      <span>{p.propertyType}</span>
                      <span>&middot;</span>
                      <span>{p.bedrooms}bd / {p.bathrooms}ba</span>
                      {p.sqft && (
                        <>
                          <span>&middot;</span>
                          <span>{p.sqft.toLocaleString()} sqft</span>
                        </>
                      )}
                    </div>
                    <p className="text-lg font-bold text-text_primary mb-4">{formatCurrency(p.price)}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {p.featured && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-medium">Featured</span>
                        )}
                        {p.verified && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 font-medium">Verified</span>
                        )}
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteConfirm === p.id ? handleDelete(p.id) : setDeleteConfirm(p.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-text_primary/60">Page {page} of {totalPages}</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                    <ChevronLeft size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-primary/10">
              <h2 className="text-lg font-bold text-text_primary font-display">
                {editingProperty ? 'Edit Property' : 'Create Property'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-text_primary/40 hover:text-text_primary">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="text-red-500 shrink-0" size={16} />
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-text_primary mb-1">Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text_primary mb-1">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData((f) => ({ ...f, propertyType: e.target.value as PropertyType }))}
                    className="w-full h-10 rounded-md border border-primary/30 bg-background px-3 text-sm text-text_primary"
                  >
                    {Object.values(PropertyType).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text_primary mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value as PropertyStatus }))}
                    className="w-full h-10 rounded-md border border-primary/30 bg-background px-3 text-sm text-text_primary"
                  >
                    {Object.values(PropertyStatus).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text_primary mb-1">Price ($)</label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData((f) => ({ ...f, price: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text_primary mb-1">Bedrooms</label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={formData.bedrooms}
                    onChange={(e) => setFormData((f) => ({ ...f, bedrooms: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text_primary mb-1">Bathrooms</label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={formData.bathrooms}
                    onChange={(e) => setFormData((f) => ({ ...f, bathrooms: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text_primary mb-1">Square Feet</label>
                <Input
                  type="number"
                  min={0}
                  value={formData.sqft ?? ''}
                  onChange={(e) => setFormData((f) => ({ ...f, sqft: e.target.value ? Number(e.target.value) : null }))}
                  placeholder="Optional"
                />
              </div>

              <div className="border-t border-primary/10 pt-4">
                <h3 className="text-sm font-semibold text-text_primary mb-3">Address</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-text_primary mb-1">Street</label>
                    <Input
                      required
                      value={formData.street}
                      onChange={(e) => setFormData((f) => ({ ...f, street: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text_primary mb-1">City</label>
                      <Input
                        required
                        value={formData.city}
                        onChange={(e) => setFormData((f) => ({ ...f, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_primary mb-1">State</label>
                      <Input
                        required
                        value={formData.state}
                        onChange={(e) => setFormData((f) => ({ ...f, state: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_primary mb-1">Zip Code</label>
                      <Input
                        required
                        value={formData.zipCode}
                        onChange={(e) => setFormData((f) => ({ ...f, zipCode: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-text_primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData((f) => ({ ...f, featured: e.target.checked }))}
                    className="rounded border-primary/30"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-text_primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData((f) => ({ ...f, verified: e.target.checked }))}
                    className="rounded border-primary/30"
                  />
                  Verified
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  {editingProperty ? 'Update Property' : 'Create Property'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
