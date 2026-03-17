import React from "react";

import { MobileNav } from "../MobileNav";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  hideNavbar = false,
  hideFooter = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <MobileNav />
      {/* Top bar offset for mobile (56px header) + bottom tab offset (64px) */}
      <main className="flex-1" role="main" style={{ paddingTop: 0 }}>
        <div className="lg:pt-0" style={{ paddingTop: 56 }}>
          {children}
        </div>
      </main>
      {!hideFooter && <Footer />}
      {/* Bottom spacer for mobile tab bar */}
      <div className="lg:hidden" style={{ height: 64 }} />
    </div>
  );
};
