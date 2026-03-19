import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

import apiClient from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { UserRole, AccountStatus } from "@/modules/auth/types/auth.types";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  lastLoginAt?: string;
}

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: AccountStatus;
  password?: string;
}

const EMPTY_FORM: UserFormData = {
  email: "",
  firstName: "",
  lastName: "",
  role: UserRole.TENANT,
  status: AccountStatus.ACTIVE,
  password: "",
};

const getRoleBadgeClasses = (role: UserRole): string => {
  const map: Record<string, string> = {
    [UserRole.ADMIN]: "bg-purple-100 text-purple-700",
    [UserRole.LANDLORD]: "bg-blue-100 text-blue-700",
    [UserRole.TENANT]: "bg-green-100 text-green-700",
    [UserRole.AGENT]: "bg-amber-100 text-amber-700",
    [UserRole.PROPERTY_MANAGER]: "bg-cyan-100 text-cyan-700",
    [UserRole.BUSINESS]: "bg-indigo-100 text-indigo-700",
  };
  return map[role] || "bg-gray-100 text-gray-700";
};

const getStatusBadgeClasses = (status: AccountStatus): string => {
  const map: Record<string, string> = {
    [AccountStatus.ACTIVE]: "bg-emerald-100 text-emerald-700",
    [AccountStatus.INACTIVE]: "bg-gray-100 text-gray-600",
    [AccountStatus.SUSPENDED]: "bg-red-100 text-red-700",
    [AccountStatus.PENDING_VERIFICATION]: "bg-yellow-100 text-yellow-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
};

const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "10",
      };
      if (searchQuery) params.search = searchQuery;
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter !== "all") params.status = statusFilter;

      const res = await apiClient.get("/admin/users", { params });
      const data = res.data as {
        data: { users: AdminUser[]; pagination: { totalPages: number } };
      };
      setUsers(data.data.users);
      setTotalPages(data.data.pagination.totalPages);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (u: AdminUser) => {
    setEditingUser(u);
    setFormData({
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      status: u.status,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingUser) {
        const { password, ...updateData } = formData;
        const payload = password ? { ...updateData, password } : updateData;
        await apiClient.put(`/admin/users/${editingUser.id}`, payload);
      } else {
        await apiClient.post("/admin/users", formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save user";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/admin/users/${id}`);
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete user";
      setError(message);
    }
  };

  const renderSkeletonRows = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <tr key={i}>
        <td className="px-6 py-4">
          <Skeleton className="h-4 w-20" />
        </td>
        <td className="px-6 py-4">
          <Skeleton className="h-4 w-40" />
        </td>
        <td className="px-6 py-4">
          <Skeleton className="h-4 w-24" />
        </td>
        <td className="px-6 py-4">
          <Skeleton className="h-6 w-16 rounded-full" />
        </td>
        <td className="px-6 py-4">
          <Skeleton className="h-6 w-16 rounded-full" />
        </td>
        <td className="px-6 py-4">
          <Skeleton className="h-4 w-16" />
        </td>
      </tr>
    ));

  if (
    !currentUser ||
    (currentUser.role !== UserRole.ADMIN &&
      currentUser.role !== ("super_admin" as UserRole))
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold text-text_primary mb-2">
            Access Denied
          </h2>
          <p className="text-text_primary/60">
            You do not have permission to view this page.
          </p>
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
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text_primary font-display">
                User Management
              </h1>
              <p className="text-sm text-text_primary/60 font-body">
                Manage platform users and roles
              </p>
            </div>
          </div>
          <Button onClick={openCreateModal} className="gap-2">
            <Plus size={16} />
            Add User
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-primary/10 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text_primary/40"
                size={16}
              />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-md border border-primary/30 bg-background px-3 text-sm text-text_primary"
            >
              <option value="all">All Roles</option>
              {Object.values(UserRole).map((r) => (
                <option key={r} value={r}>
                  {r.replace("_", " ")}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-md border border-primary/30 bg-background px-3 text-sm text-text_primary"
            >
              <option value="all">All Statuses</option>
              {Object.values(AccountStatus).map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-primary/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/10 bg-primary/[0.02]">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text_primary/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {loading ? (
                  renderSkeletonRows()
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-text_primary/50"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-primary/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-text_primary/70 font-mono">
                        {u.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-text_primary">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-text_primary font-medium">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeClasses(u.role)}`}
                        >
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClasses(u.status)}`}
                        >
                          {u.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Edit user"
                          >
                            <Edit2 size={16} />
                          </button>
                          {deleteConfirm === u.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(u.id)}
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
                              onClick={() => setDeleteConfirm(u.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                              title="Delete user"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-primary/10">
              <p className="text-sm text-text_primary/60">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-primary/10">
              <h2 className="text-lg font-bold text-text_primary font-display">
                {editingUser ? "Edit User" : "Create User"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-text_primary/40 hover:text-text_primary"
              >
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text_primary mb-1">
                    First Name
                  </label>
                  <Input
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, firstName: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text_primary mb-1">
                    Last Name
                  </label>
                  <Input
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, lastName: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text_primary mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text_primary mb-1">
                  Password{" "}
                  {editingUser && (
                    <span className="text-text_primary/40">
                      (leave blank to keep current)
                    </span>
                  )}
                </label>
                <Input
                  type="password"
                  required={!editingUser}
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder={editingUser ? "••••••••" : ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text_primary mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        role: e.target.value as UserRole,
                      }))
                    }
                    className="w-full h-10 rounded-md border border-primary/30 bg-background px-3 text-sm text-text_primary"
                  >
                    {Object.values(UserRole).map((r) => (
                      <option key={r} value={r}>
                        {r.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text_primary mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        status: e.target.value as AccountStatus,
                      }))
                    }
                    className="w-full h-10 rounded-md border border-primary/30 bg-background px-3 text-sm text-text_primary"
                  >
                    {Object.values(AccountStatus).map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  {editingUser ? "Update User" : "Create User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
