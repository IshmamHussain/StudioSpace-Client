import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-bold tracking-tight text-foreground group transition-opacity hover:opacity-90 ${className}`}
    >
      {/* Aperture / Studio Spotlight Shutter Icon */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 p-1.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-studio-950"
        >
          {/* Camera Aperture Blades & Spotlight */}
          <circle cx="12" cy="12" r="10" />
          <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
          <line x1="9.69" y1="8" x2="21.17" y2="8" />
          <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
          <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
          <line x1="14.31" y1="16" x2="2.83" y2="16" />
          <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
        </svg>
      </div>

      <div className="flex items-baseline">
        <span className={`font-display font-extrabold tracking-tight ${textSizes[size]}`}>
          Studio<span className="text-amber-500 dark:text-amber-400">Space</span>
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-cinema-red ml-0.5 animate-pulse" />
      </div>
    </Link>
  );
}

