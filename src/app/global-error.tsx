"use client";

import React from "react";
import { RefreshCw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-2xl font-bold">
            !
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Application Critical State
            </h1>
            <p className="text-sm text-slate-400">
              A critical error prevented the application layout from mounting.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload StudioSpace</span>
          </button>
        </div>
      </body>
    </html>
  );
}
