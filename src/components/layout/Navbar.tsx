import { Menu, X, Building, ChevronDown } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string; description: string }[];
}

const navLinks: NavLink[] = [
  {
    label: "Features",
    href: "/features",
    children: [
      {
        label: "Property Listings",
        href: "/properties",
        description: "Browse and manage your properties",
      },
      {
        label: "Virtual Tours",
        href: "/virtual-tours",
        description: "Immersive 3D property tours",
      },
      {
        label: "AI Chatbots",
        href: "/ai-chatbots",
        description: "24/7 automated tenant support",
      },
      {
        label: "Lead Generation",
        href: "/lead-generation",
        description: "Capture and nurture leads",
      },
      {
        label: "CRM",
        href: "/crm",
        description: "Manage tenant relationships",
      },
      {
        label: "Document Management",
        href: "/document-management",
        description: "Secure digital documents",
      },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      {
        label: "Market Analysis",
        href: "/market-analysis",
        description: "AI-powered market intelligence",
      },
      {
        label: "Property Valuation",
        href: "/property-valuation",
        description: "Instant AI valuations",
      },
      {
        label: "Predictive Analytics",
        href: "/predictive-analytics",
        description: "Forecast returns and risk",
      },
      {
        label: "Automated Marketing",
        href: "/automated-marketing",
        description: "Marketing that runs itself",
      },
      {
        label: "Scheduling & Booking",
        href: "/booking",
        description: "Online viewing bookings",
      },
      {
        label: "Google Maps",
        href: "/google-maps",
        description: "Interactive property maps",
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const DropdownMenu: React.FC<{
  link: NavLink;
  scrolled: boolean;
  isHomepage: boolean;
}> = ({ link, scrolled, isHomepage }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-1 ${
          scrolled || !isHomepage
            ? "text-realestate-secondary hover:text-realestate-primary hover:bg-gray-50"
            : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        {link.label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-realestate-lg border border-gray-100 py-2 z-50 animate-fade-in">
          {link.children?.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-realestate-primary">
                {child.label}
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {child.description}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href;
  const isHomepage = location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomepage
          ? "bg-white/95 backdrop-blur-md shadow-realestate-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="section-container">
        <div className="flex justify-between h-16 lg:h-18">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 group"
              aria-label="RealEstate AI home"
            >
              <div className="w-9 h-9 bg-realestate-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building className="w-5 h-5 text-realestate-primary" />
              </div>
              <span
                className={`text-xl font-space-grotesk font-bold tracking-tight transition-colors ${
                  scrolled || !isHomepage
                    ? "text-realestate-primary"
                    : "text-white"
                }`}
              >
                RealEstate
                <span className="text-realestate-accent"> AI</span>
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <DropdownMenu
                  key={link.label}
                  link={link}
                  scrolled={scrolled}
                  isHomepage={isHomepage}
                />
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? scrolled || !isHomepage
                        ? "text-realestate-primary bg-gray-100"
                        : "text-white bg-white/20"
                      : scrolled || !isHomepage
                        ? "text-realestate-secondary hover:text-realestate-primary hover:bg-gray-50"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/auth/login"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                scrolled || !isHomepage
                  ? "text-realestate-secondary hover:text-realestate-primary"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/auth/register"
              className="btn-accent text-sm px-5 py-2.5"
            >
              Start Free Trial
            </Link>
          </div>

          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                scrolled || !isHomepage
                  ? "text-realestate-primary hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="lg:hidden bg-white border-t border-gray-100 shadow-realestate-lg animate-fade-in"
          role="menu"
        >
          <div className="section-container py-4 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <span className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {link.label}
                  </span>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className="block px-6 py-2.5 rounded-lg text-sm font-medium text-realestate-secondary hover:text-realestate-primary hover:bg-gray-50 transition-colors"
                      role="menuitem"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-realestate-primary bg-gray-50"
                      : "text-realestate-secondary hover:text-realestate-primary hover:bg-gray-50"
                  }`}
                  role="menuitem"
                >
                  {link.label}
                </Link>
              ),
            )}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <Link
                to="/auth/login"
                className="block px-4 py-3 rounded-lg text-sm font-medium text-realestate-secondary hover:text-realestate-primary hover:bg-gray-50"
                role="menuitem"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="block btn-accent text-center text-sm"
                role="menuitem"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
