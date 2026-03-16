import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileLayout } from './MobileLayout';

interface ResponsiveShellProps {
  children: React.ReactNode;
}

export function ResponsiveShell({ children }: ResponsiveShellProps) {
  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
