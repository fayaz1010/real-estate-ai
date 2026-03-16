import React from "react";

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
      <main className="flex-1" role="main">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};
