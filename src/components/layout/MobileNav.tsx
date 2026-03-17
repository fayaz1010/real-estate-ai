import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Building, ClipboardCheck, User } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Properties', path: '/properties', icon: Building },
  { label: 'Inspections', path: '/inspections', icon: ClipboardCheck },
  { label: 'Profile', path: '/profile', icon: User },
];

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: '#091a2b',
    fontFamily: "'Open Sans', sans-serif",
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
  },
  button: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    gap: 4,
    border: 'none',
    cursor: 'pointer',
    background: 'transparent',
    transition: 'color 0.2s ease',
    fontFamily: "'Open Sans', sans-serif",
  },
  label: {
    fontSize: 11,
    fontFamily: "'Open Sans', sans-serif",
  },
};

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const color = isActive ? '#ffffff' : '#f1f3f4';
          const opacity = isActive ? 1 : 0.6;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.button,
                color,
                opacity,
              }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span
                style={{
                  ...styles.label,
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
