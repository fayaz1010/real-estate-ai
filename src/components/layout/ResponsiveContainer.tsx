import React from "react";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  backgroundColor: "#FFFFFF",
  fontFamily: "'Inter', sans-serif",
  minHeight: "100vh",
  boxSizing: "border-box",
};

export function ResponsiveContainer({
  children,
  className,
}: ResponsiveContainerProps) {
  return (
    <>
      <style>{`
        .responsive-container {
          padding: 16px;
          max-width: 100%;
        }
        @media (min-width: 769px) {
          .responsive-container {
            max-width: 1200px;
            padding: 24px 32px;
          }
        }
      `}</style>
      <div
        className={`responsive-container ${className ?? ""}`}
        style={containerStyle}
      >
        {children}
      </div>
    </>
  );
}
