"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected client exceptions
    console.error("StudioSpace client boundary caught an error:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Cinema Clapper / Slate Error Graphic */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/20 to-amber-500/20 blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl border border-rose-500/30 bg-studio-card/85 dark:bg-studio-900/80 backdrop-blur-md flex flex-col items-center justify-center shadow-xl">
            <ShieldAlert className="w-10 h-10 text-rose-500" />
            <span className="text-[10px] font-mono font-bold text-rose-500 mt-1 uppercase tracking-wider">
              Take Failed
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground">
            Production Interrupted
          </h1>
          <p className="text-xs sm:text-sm text-studio-600 dark:text-studio-400 max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred while rendering this view. Our engineering crew has been alerted.
          </p>
          {error?.message && (
            <div className="p-3 mt-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono break-words text-left">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Take</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-studio-200 dark:border-studio-800 hover:border-amber-500/40 text-foreground font-semibold text-sm transition-colors active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Stage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

