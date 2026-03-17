import React from "react";

import { useMediaQuery } from "../../hooks/useMediaQuery";

import { MobileBottomNav } from "./MobileBottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const { isMobile } = useMediaQuery();

  if (!isMobile) return null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#f1f3f4", color: "#091a2b" }}
    >
      <main className="flex-1 pb-16 overflow-y-auto">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
