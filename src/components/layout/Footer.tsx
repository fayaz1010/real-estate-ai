import { Building, Mail, Phone, MapPin } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { label: "Property Listings", href: "/properties" },
    { label: "Tenant Screening", href: "/landing/tenant-screening" },
    { label: "Rent Collection", href: "/landing/rent-collection" },
    { label: "Maintenance Management", href: "/dashboard" },
    { label: "Pricing", href: "/pricing" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/about" },
    { label: "Blog", href: "/about" },
  ],
  resources: [
    { label: "AI Property Management Guide", href: "/landing/ai-property-management" },
    { label: "Small Landlord Software", href: "/landing/small-landlords" },
    { label: "Pricing Comparison", href: "/landing/pricing-comparison" },
    { label: "AppFolio Alternative", href: "/landing/appfolio-alternative" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-realestate-primary text-white"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-realestate-accent rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-realestate-primary" />
              </div>
              <span className="text-xl font-space-grotesk font-bold">
                RealEstate <span className="text-realestate-accent">AI</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              Property Management, Powered by Intelligence. Automate tenant
              screening, rent collection, maintenance, and more with
              AI-driven tools built for modern landlords and property managers.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:hello@realestate-ai.com"
                className="flex items-center gap-2 text-gray-400 hover:text-realestate-accent text-sm transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                hello@realestate-ai.com
              </a>
              <a
                href="tel:+1-800-555-0199"
                className="flex items-center gap-2 text-gray-400 hover:text-realestate-accent text-sm transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                1-800-555-0199
              </a>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                San Francisco, CA 94105
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-space-grotesk font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Product
            </h3>
            <ul className="space-y-2.5" role="list">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-realestate-accent text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-space-grotesk font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Company
            </h3>
            <ul className="space-y-2.5" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-realestate-accent text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-space-grotesk font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Resources
            </h3>
            <ul className="space-y-2.5" role="list">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-realestate-accent text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} RealEstate AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
