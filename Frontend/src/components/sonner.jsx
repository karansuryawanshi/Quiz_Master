"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      position="top-right"
      theme="dark"
      className="toaster group"
      style={{
        "--normal-bg": "#000000", // Dark background
        "--normal-text": "#ffffff", // Light text
        "--normal-border": "#000000", // Border for contrast
        "--success-bg": "#10b981", // Success toast background
        "--error-bg": "#ef4444", // Error toast background
        "--warning-bg": "#f59e0b", // Warning toast background
        "--info-bg": "#3b82f6", // Info toast background
      }}
      {...props}
    />
  );
};

export { Toaster };
