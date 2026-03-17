import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  Building,
  Wrench,
  MessageSquare,
  UserCheck,
  FileText,
  DollarSign,
  Calculator,
  ClipboardList,
  BarChart3,
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────── */

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

/* ── Navigation Data ───────────────────────────────────── */

const sidebarItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Property Listings', path: '/properties', icon: Building },
  { label: 'Tenant Screening', path: '/applications', icon: UserCheck },
  { label: 'Lease Management', path: '/leases', icon: FileText },
  { label: 'Rent Collection', path: '/payments', icon: DollarSign },
  { label: 'Accounting', path: '/accounting', icon: Calculator },
  { label: 'Maintenance Requests', path: '/maintenance', icon: Wrench },
  { label: 'Tenant Communication', path: '/communication', icon: MessageSquare },
  { label: 'Document Management', path: '/leases', icon: ClipboardList },
  { label: 'Reporting & Analytics', path: '/reporting', icon: BarChart3 },
];

const bottomTabItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Properties', path: '/properties', icon: Building },
  { label: 'Maintenance', path: '/maintenance', icon: Wrench },
  { label: 'Messages', path: '/communication', icon: MessageSquare },
];

/* ── Component ─────────────────────────────────────────── */

export const MobileNav: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
      closeSidebar();
    },
    [navigate, closeSidebar],
  );

  // Close sidebar on route change
  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* ── Hamburger Top Bar ──────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between lg:hidden"
        style={{
          height: 56,
          backgroundColor: '#FAF6F1',
          borderBottom: '1px solid #C4A882',
          padding: '0 16px',
        }}
      >
        <button
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={sidebarOpen}
          className="flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            color: '#2D2A26',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <span
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 18,
            color: '#2D2A26',
          }}
        >
          RealEstate AI
        </span>

        {/* Spacer to balance the layout */}
        <div style={{ width: 44 }} />
      </header>

      {/* ── Sidebar Overlay ────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(45, 42, 38, 0.5)' }}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Drawer ─────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 bottom-0 z-50 lg:hidden"
        style={{
          width: 280,
          backgroundColor: '#FAF6F1',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease-in-out',
          overflowY: 'auto',
          paddingTop: 56,
          borderRight: '1px solid #C4A882',
        }}
        aria-label="Main navigation"
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.label}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 15,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#8B7355' : '#2D2A26',
                    backgroundColor: active ? 'rgba(139, 115, 85, 0.1)' : 'transparent',
                    borderLeft: active ? '3px solid #8B7355' : '3px solid transparent',
                    transition: 'background-color 200ms ease, color 200ms ease',
                    minHeight: 44,
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Bottom Tab Bar ─────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{
          backgroundColor: '#FAF6F1',
          borderTop: '1px solid #C4A882',
        }}
        aria-label="Quick navigation"
      >
        <div
          className="flex items-center justify-around"
          style={{ height: 64 }}
        >
          {bottomTabItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  height: '100%',
                  gap: 4,
                  border: 'none',
                  cursor: 'pointer',
                  background: 'transparent',
                  transition: 'color 200ms ease',
                  fontFamily: "'Inter', sans-serif",
                  color: active ? '#8B7355' : '#A0926B',
                  minWidth: 44,
                  minHeight: 44,
                }}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Safe area for devices with home indicator */}
        <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </nav>
    </>
  );
};

export default MobileNav;
