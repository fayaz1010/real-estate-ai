import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { fetchDashboardStats, type DashboardStats } from '../services/dashboardService';
import {
  Layout,
  Users,
  Building,
  BarChart,
  Settings,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Home,
  Key,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  LogOut,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
} from 'lucide-react';
import { useAuth } from '../modules/auth/hooks/useAuth';
import { UserRole, AccountStatus } from '../modules/auth/types/auth.types';

type AdminSection = 'overview' | 'users' | 'properties' | 'reports' | 'settings';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  joinedDate: string;
  avatar: string;
}

interface MockProperty {
  id: string;
  title: string;
  address: string;
  type: string;
  status: 'active' | 'pending' | 'inactive';
  price: number;
  owner: string;
  listedDate: string;
}

// Mock users/properties will be replaced with API data when available
const INITIAL_USERS: MockUser[] = [];
const INITIAL_PROPERTIES: MockProperty[] = [];

const INITIAL_PLATFORM_STATS = {
  totalUsers: 0,
  totalProperties: 0,
  activeLeases: 0,
  monthlyRevenue: 0,
  userGrowth: 0,
  propertyGrowth: 0,
  leaseGrowth: 0,
  revenueGrowth: 0,
};

const INITIAL_REVENUE_DATA = [
  { month: 'Oct', value: 0 },
  { month: 'Nov', value: 0 },
  { month: 'Dec', value: 0 },
  { month: 'Jan', value: 0 },
  { month: 'Feb', value: 0 },
  { month: 'Mar', value: 0 },
];

const NAV_ITEMS: { key: AdminSection; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <Layout size={20} /> },
  { key: 'users', label: 'Users', icon: <Users size={20} /> },
  { key: 'properties', label: 'Properties', icon: <Building size={20} /> },
  { key: 'reports', label: 'Reports', icon: <BarChart size={20} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

const getRoleBadgeClasses = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'bg-purple-100 text-purple-700';
    case UserRole.LANDLORD:
      return 'bg-blue-100 text-blue-700';
    case UserRole.TENANT:
      return 'bg-green-100 text-green-700';
    case UserRole.AGENT:
      return 'bg-amber-100 text-amber-700';
    case UserRole.PROPERTY_MANAGER:
      return 'bg-cyan-100 text-cyan-700';
    case UserRole.BUSINESS:
      return 'bg-indigo-100 text-indigo-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusBadgeClasses = (status: AccountStatus): string => {
  switch (status) {
    case AccountStatus.ACTIVE:
      return 'bg-emerald-100 text-emerald-700';
    case AccountStatus.INACTIVE:
      return 'bg-gray-100 text-gray-600';
    case AccountStatus.SUSPENDED:
      return 'bg-red-100 text-red-700';
    case AccountStatus.PENDING_VERIFICATION:
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getPropertyStatusClasses = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'inactive':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState(INITIAL_PLATFORM_STATS);
  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS);
  const [properties, setProperties] = useState<MockProperty[]>(INITIAL_PROPERTIES);
  const [revenueData, setRevenueData] = useState(INITIAL_REVENUE_DATA);

  // Fetch real data from backend
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchDashboardStats();
        if (cancelled) return;

        // Map API data to admin panel format
        setPlatformStats({
          totalUsers: 0, // Would need admin endpoint
          totalProperties: data.stats.properties,
          activeLeases: 0,
          monthlyRevenue: 0,
          userGrowth: 0,
          propertyGrowth: 0,
          leaseGrowth: 0,
          revenueGrowth: 0,
        });

        // Map recent properties to admin property format
        if (data.recentProperties) {
          setProperties(data.recentProperties.map((p) => ({
            id: p.id,
            title: p.title,
            address: '',
            type: 'Property',
            status: p.status?.toLowerCase() === 'published' ? 'active' as const : 'pending' as const,
            price: p.price,
            owner: '',
            listedDate: p.createdAt?.split('T')[0] ?? '',
          })));
        }
      } catch {
        // Keep initial state
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const MOCK_USERS = users;
  const MOCK_PROPERTIES = properties;
  const PLATFORM_STATS = platformStats;
  const MONTHLY_REVENUE_DATA = revenueData;

  const filteredUsers = MOCK_USERS.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      userSearchQuery === '' ||
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const maxRevenue = Math.max(...MONTHLY_REVENUE_DATA.map((d) => d.value), 1);

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Platform Stats */}
      <div>
        <h2 className="text-xl font-semibold font-space-grotesk text-realestate-primary mb-4">
          Platform Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                <ArrowUpRight size={14} />
                {PLATFORM_STATS.userGrowth}%
              </span>
            </div>
            <p className="text-sm text-realestate-secondary font-inter">Total Users</p>
            <p className="text-2xl font-bold font-space-grotesk text-realestate-primary mt-1">
              {formatNumber(PLATFORM_STATS.totalUsers)}
            </p>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Building className="text-emerald-600" size={24} />
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                <ArrowUpRight size={14} />
                {PLATFORM_STATS.propertyGrowth}%
              </span>
            </div>
            <p className="text-sm text-realestate-secondary font-inter">Total Properties</p>
            <p className="text-2xl font-bold font-space-grotesk text-realestate-primary mt-1">
              {formatNumber(PLATFORM_STATS.totalProperties)}
            </p>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Key className="text-amber-600" size={24} />
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                <ArrowUpRight size={14} />
                {PLATFORM_STATS.leaseGrowth}%
              </span>
            </div>
            <p className="text-sm text-realestate-secondary font-inter">Active Leases</p>
            <p className="text-2xl font-bold font-space-grotesk text-realestate-primary mt-1">
              {formatNumber(PLATFORM_STATS.activeLeases)}
            </p>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <DollarSign className="text-purple-600" size={24} />
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                <ArrowUpRight size={14} />
                {PLATFORM_STATS.revenueGrowth}%
              </span>
            </div>
            <p className="text-sm text-realestate-secondary font-inter">Monthly Revenue</p>
            <p className="text-2xl font-bold font-space-grotesk text-realestate-primary mt-1">
              {formatCurrency(PLATFORM_STATS.monthlyRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Reporting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold font-space-grotesk text-realestate-primary">
                Revenue Trend
              </h3>
              <p className="text-sm text-realestate-secondary font-inter">Last 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <BarChart size={18} className="text-realestate-secondary" />
            </div>
          </div>
          <div className="flex items-end gap-3 h-48">
            {MONTHLY_REVENUE_DATA.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-realestate-secondary">
                  {formatCurrency(data.value)}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-realestate-accent to-amber-300 rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(data.value / maxRevenue) * 100}%` }}
                  role="img"
                  aria-label={`${data.month}: ${formatCurrency(data.value)}`}
                />
                <span className="text-xs font-medium text-realestate-primary">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="space-y-4">
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-4">
              <PieChart size={20} className="text-realestate-accent" />
              <h3 className="text-lg font-semibold font-space-grotesk text-realestate-primary">
                Occupancy Rate
              </h3>
            </div>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E5B80B"
                  strokeWidth="10"
                  strokeDasharray={`${87.3 * 2.51} ${100 * 2.51}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold font-space-grotesk text-realestate-primary">
                  87.3%
                </span>
              </div>
            </div>
            <p className="text-center text-sm text-realestate-secondary font-inter">
              Across all properties
            </p>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-3">
              <Activity size={20} className="text-emerald-500" />
              <h3 className="font-semibold font-space-grotesk text-realestate-primary">
                User Growth
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-realestate-secondary font-inter">New this month</span>
                <span className="font-semibold text-realestate-primary">+342</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-realestate-secondary font-inter">Active today</span>
                <span className="font-semibold text-realestate-primary">1,248</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-realestate-secondary font-inter">Churn rate</span>
                <span className="flex items-center gap-1 font-semibold text-red-500">
                  <ArrowDownRight size={14} />
                  2.1%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="card-elevated p-6">
        <h3 className="text-lg font-semibold font-space-grotesk text-realestate-primary mb-4">
          Recent Properties
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-sm font-semibold text-realestate-secondary font-inter">Property</th>
                <th className="pb-3 text-sm font-semibold text-realestate-secondary font-inter hidden md:table-cell">Type</th>
                <th className="pb-3 text-sm font-semibold text-realestate-secondary font-inter">Price</th>
                <th className="pb-3 text-sm font-semibold text-realestate-secondary font-inter hidden sm:table-cell">Owner</th>
                <th className="pb-3 text-sm font-semibold text-realestate-secondary font-inter">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PROPERTIES.slice(0, 3).map((property) => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <p className="font-medium text-realestate-primary text-sm">{property.title}</p>
                    <p className="text-xs text-realestate-secondary mt-0.5 hidden lg:block">{property.address}</p>
                  </td>
                  <td className="py-3 hidden md:table-cell">
                    <span className="text-sm text-realestate-secondary">{property.type}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm font-medium text-realestate-primary">
                      {formatCurrency(property.price)}/mo
                    </span>
                  </td>
                  <td className="py-3 hidden sm:table-cell">
                    <span className="text-sm text-realestate-secondary">{property.owner}</span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPropertyStatusClasses(property.status)}`}>
                      {property.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold font-space-grotesk text-realestate-primary">
            User Management
          </h2>
          <p className="text-sm text-realestate-secondary font-inter mt-1">
            {formatNumber(PLATFORM_STATS.totalUsers)} total users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-realestate-secondary" />
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-realestate-accent/50 focus:border-realestate-accent font-inter w-full sm:w-64"
              aria-label="Search users"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-realestate-secondary pointer-events-none" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-realestate-accent/50 focus:border-realestate-accent font-inter appearance-none bg-white cursor-pointer"
              aria-label="Filter by role"
            >
              <option value="all">All Roles</option>
              <option value={UserRole.TENANT}>Tenant</option>
              <option value={UserRole.LANDLORD}>Landlord</option>
              <option value={UserRole.AGENT}>Agent</option>
              <option value={UserRole.PROPERTY_MANAGER}>Property Manager</option>
              <option value={UserRole.BUSINESS}>Business</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter">User</th>
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter hidden md:table-cell">Email</th>
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter">Role</th>
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter hidden sm:table-cell">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter hidden lg:table-cell">Joined</th>
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-realestate-primary text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {u.avatar}
                      </div>
                      <span className="font-medium text-sm text-realestate-primary">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-realestate-secondary">{u.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeClasses(u.role)}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeClasses(u.status)}`}>
                      {u.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-realestate-secondary">
                      {new Date(u.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-realestate-secondary transition-colors"
                      aria-label={`Actions for ${u.name}`}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-realestate-secondary font-inter">No users match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold font-space-grotesk text-realestate-primary">
          Property Management
        </h2>
        <p className="text-sm text-realestate-secondary font-inter mt-1">
          {formatNumber(PLATFORM_STATS.totalProperties)} total properties
        </p>
      </div>

      {/* Property Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-realestate-secondary font-inter">Active Listings</p>
          <p className="text-2xl font-bold font-space-grotesk text-realestate-primary mt-1">2,841</p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <ArrowUpRight size={12} /> +124 this month
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-realestate-secondary font-inter">Pending Review</p>
          <p className="text-2xl font-bold font-space-grotesk text-realestate-primary mt-1">187</p>
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> Needs attention
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-realestate-secondary font-inter">Avg. Listing Price</p>
          <p className="text-2xl font-bold font-space-grotesk text-realestate-primary mt-1">$2,950</p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <ArrowUpRight size={12} /> +3.2% vs last month
          </p>
        </div>
      </div>

      {/* Properties Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter">Property</th>
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter hidden md:table-cell">Type</th>
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter">Price</th>
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter hidden sm:table-cell">Owner</th>
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter hidden lg:table-cell">Listed</th>
                <th className="px-6 py-3 text-sm font-semibold text-realestate-secondary font-inter">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PROPERTIES.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm text-realestate-primary">{property.title}</p>
                    <p className="text-xs text-realestate-secondary mt-0.5 hidden lg:block">{property.address}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-realestate-secondary">{property.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-realestate-primary">
                      {formatCurrency(property.price)}/mo
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-sm text-realestate-secondary">{property.owner}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-realestate-secondary">
                      {new Date(property.listedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPropertyStatusClasses(property.status)}`}>
                      {property.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold font-space-grotesk text-realestate-primary">
          Reports & Analytics
        </h2>
        <p className="text-sm text-realestate-secondary font-inter mt-1">
          Platform performance overview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart size={20} className="text-realestate-accent" />
            <h3 className="font-semibold font-space-grotesk text-realestate-primary">
              Monthly Revenue
            </h3>
          </div>
          <div className="flex items-end gap-3 h-48">
            {MONTHLY_REVENUE_DATA.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-realestate-secondary">
                  {(data.value / 1000).toFixed(0)}k
                </span>
                <div
                  className="w-full bg-gradient-to-t from-realestate-accent to-amber-300 rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(data.value / maxRevenue) * 100}%` }}
                  role="img"
                  aria-label={`${data.month}: ${formatCurrency(data.value)}`}
                />
                <span className="text-xs font-medium text-realestate-primary">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart size={20} className="text-realestate-accent" />
            <h3 className="font-semibold font-space-grotesk text-realestate-primary">
              Occupancy Breakdown
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-realestate-secondary font-inter">Occupied Units</span>
                <span className="text-sm font-semibold text-realestate-primary">87.3%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-realestate-accent rounded-full" style={{ width: '87.3%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-realestate-secondary font-inter">Vacant Units</span>
                <span className="text-sm font-semibold text-realestate-primary">8.2%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-realestate-secondary rounded-full" style={{ width: '8.2%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-realestate-secondary font-inter">Under Maintenance</span>
                <span className="text-sm font-semibold text-realestate-primary">4.5%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: '4.5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={20} className="text-emerald-500" />
            <h3 className="font-semibold font-space-grotesk text-realestate-primary">
              User Growth
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-realestate-primary">New Registrations</p>
                <p className="text-xs text-realestate-secondary">This month</p>
              </div>
              <span className="text-lg font-bold text-realestate-primary">342</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-realestate-primary">Verified Users</p>
                <p className="text-xs text-realestate-secondary">Completed verification</p>
              </div>
              <span className="text-lg font-bold text-realestate-primary">11,204</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-realestate-primary">DAU / MAU</p>
                <p className="text-xs text-realestate-secondary">Daily active ratio</p>
              </div>
              <span className="text-lg font-bold text-realestate-primary">34.2%</span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign size={20} className="text-purple-500" />
            <h3 className="font-semibold font-space-grotesk text-realestate-primary">
              Revenue Sources
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-realestate-accent" />
                <span className="text-sm font-medium text-realestate-primary">Subscription Fees</span>
              </div>
              <span className="text-sm font-semibold text-realestate-primary">{formatCurrency(156000)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-realestate-primary">Transaction Fees</span>
              </div>
              <span className="text-sm font-semibold text-realestate-primary">{formatCurrency(89500)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-realestate-primary">Premium Listings</span>
              </div>
              <span className="text-sm font-semibold text-realestate-primary">{formatCurrency(39000)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold font-space-grotesk text-realestate-primary">
          Platform Settings
        </h2>
        <p className="text-sm text-realestate-secondary font-inter mt-1">
          Configure platform-wide settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <h3 className="font-semibold font-space-grotesk text-realestate-primary mb-4">
            General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="platform-name" className="block text-sm font-medium text-realestate-secondary mb-1 font-inter">
                Platform Name
              </label>
              <input
                id="platform-name"
                type="text"
                defaultValue="RealEstate AI"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-realestate-accent/50 focus:border-realestate-accent font-inter"
              />
            </div>
            <div>
              <label htmlFor="support-email" className="block text-sm font-medium text-realestate-secondary mb-1 font-inter">
                Support Email
              </label>
              <input
                id="support-email"
                type="email"
                defaultValue="support@realestate-ai.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-realestate-accent/50 focus:border-realestate-accent font-inter"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realestate-primary font-inter">Maintenance Mode</p>
                <p className="text-xs text-realestate-secondary font-inter">Temporarily disable public access</p>
              </div>
              <button
                type="button"
                className="w-11 h-6 bg-gray-200 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-realestate-accent/50"
                role="switch"
                aria-checked="false"
                aria-label="Toggle maintenance mode"
              >
                <span className="block w-5 h-5 bg-white rounded-full shadow-sm transform translate-x-0.5 transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realestate-primary font-inter">User Registration</p>
                <p className="text-xs text-realestate-secondary font-inter">Allow new user sign-ups</p>
              </div>
              <button
                type="button"
                className="w-11 h-6 bg-realestate-accent rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-realestate-accent/50"
                role="switch"
                aria-checked="true"
                aria-label="Toggle user registration"
              >
                <span className="block w-5 h-5 bg-white rounded-full shadow-sm transform translate-x-[1.375rem] transition-transform" />
              </button>
            </div>
          </div>
          <div className="mt-6">
            <button type="button" className="btn-primary text-sm px-6 py-2.5">
              Save Changes
            </button>
          </div>
        </div>

        <div className="card-elevated p-6">
          <h3 className="font-semibold font-space-grotesk text-realestate-primary mb-4">
            Notification Preferences
          </h3>
          <div className="space-y-4">
            {[
              { label: 'New User Registrations', desc: 'Get notified when a new user signs up', enabled: true },
              { label: 'Property Submissions', desc: 'Notifications for new property listings', enabled: true },
              { label: 'Payment Alerts', desc: 'Alerts for payment issues or failures', enabled: true },
              { label: 'System Alerts', desc: 'Critical system performance notifications', enabled: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-realestate-primary font-inter">{pref.label}</p>
                  <p className="text-xs text-realestate-secondary font-inter">{pref.desc}</p>
                </div>
                <button
                  type="button"
                  className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-realestate-accent/50 ${pref.enabled ? 'bg-realestate-accent' : 'bg-gray-200'}`}
                  role="switch"
                  aria-checked={pref.enabled}
                  aria-label={`Toggle ${pref.label}`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${pref.enabled ? 'translate-x-[1.375rem]' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'properties':
        return renderProperties();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-realestate-primary transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Admin navigation"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-realestate-accent rounded-lg flex items-center justify-center">
              <Home size={20} className="text-realestate-primary" />
            </div>
            <div>
              <h1 className="text-white font-bold font-space-grotesk text-lg leading-tight">
                RealEstate AI
              </h1>
              <p className="text-white/50 text-xs font-inter">Admin Panel</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto" aria-label="Admin sections">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveSection(item.key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium font-inter transition-colors ${
                activeSection === item.key
                  ? 'bg-realestate-accent text-realestate-primary'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              aria-current={activeSection === item.key ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-realestate-accent text-realestate-primary flex items-center justify-center text-xs font-bold">
              {user?.firstName?.[0] ?? 'A'}{user?.lastName?.[0] ?? 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
              </p>
              <p className="text-xs text-white/50 truncate">
                {user?.email ?? 'admin@realestate-ai.com'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:text-red-200 hover:bg-white/5 transition-colors font-inter mt-1"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-realestate-secondary hover:bg-gray-100 transition-colors"
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </button>
              <div>
                <h2 className="text-lg font-semibold font-space-grotesk text-realestate-primary capitalize">
                  {activeSection}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative p-2 rounded-lg text-realestate-secondary hover:bg-gray-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link
                to="/"
                className="hidden sm:flex items-center gap-2 text-sm text-realestate-secondary hover:text-realestate-primary font-inter transition-colors"
              >
                <Home size={16} />
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
