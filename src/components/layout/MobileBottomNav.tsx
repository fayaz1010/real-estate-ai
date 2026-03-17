import { Home, Building, Calendar, User } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Home", path: "/", icon: Home },
  { label: "Properties", path: "/properties", icon: Building },
  { label: "Inspections", path: "/inspections", icon: Calendar },
  { label: "Profile", path: "/profile", icon: User },
];

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors"
              style={{
                color: isActive ? "#005163" : "#6B7280",
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span
                className="text-xs"
                style={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#091a2b" : "#6B7280",
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
